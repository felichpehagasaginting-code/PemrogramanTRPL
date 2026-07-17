import { NextRequest, NextResponse } from "next/server";

interface VarStore {
  [key: string]: string | number | boolean;
}

const PISTON_API = "https://emkc.org/api/v2/piston/execute";
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function safeEval(expr: string, vars: VarStore): string {
  let resolved = expr;
  for (const [key, val] of Object.entries(vars)) {
    const strVal = typeof val === "string" ? `"${val}"` : String(val);
    resolved = resolved.replace(new RegExp(`\\b${key}\\b`, "g"), strVal);
  }
  try {
    const result = new Function(`"use strict"; return (${resolved})`)();
    return String(result);
  } catch {
    return expr;
  }
}

function simulatePython(code: string): string[] {
  const lines = code.split("\n");
  const output: string[] = [];
  const vars: VarStore = {};

  const getVarValue = (name: string): string | number | boolean | undefined => vars[name];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    try {
      if (/^print\s*\(/.test(line)) {
        const inner = line.slice(line.indexOf("(") + 1, line.lastIndexOf(")")).trim();
        if (!inner) { output.push(""); continue; }

        const parts = inner.split(/,(?=(?:[^'"]*["'][^'"]*["'])*[^'"]*$)/).map((s) => s.trim());
        const resolved = parts.map((p) => {
          if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
            return p.slice(1, -1);
          }
          if (/^\d+(\.\d+)?$/.test(p)) return p;
          const v = getVarValue(p);
          if (v !== undefined) return String(v);
          return safeEval(p, vars);
        });
        output.push(resolved.join(" "));
        continue;
      }

      if (/^input\s*\(/.test(line)) {
        const prompt = line.match(/input\s*\(\s*["'](.+?)["']\s*\)/);
        const varName = lines[lines.indexOf(raw) - 1]?.match(/^(\w+)\s*=\s*/)?.[1];
        if (varName) vars[varName] = 0;
        output.push(`[INPUT REQUIRED: ${prompt ? prompt[1] : ""}]`);
        continue;
      }

      const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignMatch) {
        const [, name, valExpr] = assignMatch;
        const trimmed = valExpr.trim();

        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
          vars[name] = trimmed.slice(1, -1);
        } else if (trimmed === "True") vars[name] = true;
        else if (trimmed === "False") vars[name] = false;
        else if (trimmed === "None") vars[name] = "None";
        else if (/^\d+$/.test(trimmed)) vars[name] = parseInt(trimmed, 10);
        else if (/^\d+\.\d+$/.test(trimmed)) vars[name] = parseFloat(trimmed);
        else {
          const evaled = safeEval(trimmed, vars);
          vars[name] = /^\d+$/.test(evaled) ? parseInt(evaled, 10) : evaled;
        }
        continue;
      }

      if (/^(if|elif|else|for|while|try|except|def|class|with|import|from|return|break|continue)\b/.test(line)) {
        continue;
      }
    } catch {
      output.push(`SyntaxError: unexpected token in "${line}"`);
    }
  }

  if (output.length === 0 && lines.some((l) => l.trim() && !l.trim().startsWith("#"))) {
    output.push("(Kode berjalan tanpa output cetakan)");
  }
  return output;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ output: ["Error: Terlalu banyak permintaan. Tunggu beberapa saat."] }, { status: 429 });
    }

    const { code, language = "python" } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ output: ["Error: No code provided"] }, { status: 400 });
    }
    if (code.length > 10000) {
      return NextResponse.json({ output: ["Error: Kode terlalu panjang (maks 10.000 karakter)"] }, { status: 400 });
    }

    const pistonResponse = await fetch(PISTON_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version: "*",
        files: [{ content: code }],
        stdin: "",
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
        compile_memory_limit: -1,
        run_memory_limit: 128,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (pistonResponse.ok) {
      const data = await pistonResponse.json();
      const runOutput = data.run?.output || "";
      const splitOutput = runOutput.split("\n").filter(Boolean);
      return NextResponse.json({ output: splitOutput.length > 0 ? splitOutput : ["(Tidak ada output)"] });
    }

    const simulated = simulatePython(code);
    return NextResponse.json({ output: simulated.length > 0 ? simulated : ["(Tidak ada output)"] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ output: [`Error: Gagal menjalankan kode (${message})`] }, { status: 500 });
  }
}
