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

function safeEval(expr: string, vars: VarStore): string | number {
  let resolved = expr.trim();
  // Replace variables with numeric or boolean values
  for (const [key, val] of Object.entries(vars)) {
    const strVal = typeof val === "string" ? `"${val}"` : String(val);
    resolved = resolved.replace(new RegExp(`\\b${key}\\b`, "g"), strVal);
  }

  // Handle string literals or string concatenation e.g. "Halo " + "Dunia"
  if (resolved.includes('"') || resolved.includes("'")) {
    const stringParts = resolved.split(/\s*\+\s*/);
    let allStrings = true;
    let combined = "";
    for (const part of stringParts) {
      const trimmed = part.trim();
      if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        combined += trimmed.slice(1, -1);
      } else if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        combined += trimmed;
      } else {
        allStrings = false;
        break;
      }
    }
    if (allStrings) return combined;
  }

  // Strict whitelist for arithmetic expressions: only digits, dots, whitespace, +, -, *, /, %, (, )
  if (!/^[\d\s+\-*/%().]+$/.test(resolved)) {
    return expr;
  }

  // Safe arithmetic evaluator (Shunting-yard algorithm) without eval or new Function
  try {
    const tokens = resolved.match(/(\d+(\.\d+)?|[+\-*/%()])/g);
    if (!tokens) return expr;

    const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2 };
    const values: number[] = [];
    const ops: string[] = [];

    const applyOp = () => {
      const op = ops.pop();
      const b = values.pop();
      const a = values.pop();
      if (op === undefined || a === undefined || b === undefined) return;
      switch (op) {
        case "+": values.push(a + b); break;
        case "-": values.push(a - b); break;
        case "*": values.push(a * b); break;
        case "/": values.push(b !== 0 ? a / b : 0); break;
        case "%": values.push(b !== 0 ? a % b : 0); break;
      }
    };

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (/^\d+(\.\d+)?$/.test(token)) {
        values.push(parseFloat(token));
      } else if (token === "(") {
        ops.push(token);
      } else if (token === ")") {
        while (ops.length > 0 && ops[ops.length - 1] !== "(") {
          applyOp();
        }
        ops.pop();
      } else if (["+", "-", "*", "/", "%"].includes(token)) {
        if (token === "-" && (i === 0 || tokens[i - 1] === "(" || ["+", "-", "*", "/", "%"].includes(tokens[i - 1]))) {
          values.push(0);
        }
        while (ops.length > 0 && ops[ops.length - 1] !== "(" && precedence[ops[ops.length - 1]] >= precedence[token]) {
          applyOp();
        }
        ops.push(token);
      }
    }

    while (ops.length > 0) {
      applyOp();
    }

    if (values.length === 1 && !isNaN(values[0])) {
      return values[0];
    }
    return expr;
  } catch {
    return expr;
  }
}

function simulatePython(code: string): string[] {
  const lines = code.split("\n");
  const output: string[] = [];
  const vars: VarStore = {};
  const mockInputs = [5, 10, 15, 20, 25];
  let inputIdx = 0;

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
          const evalRes = safeEval(p, vars);
          return String(evalRes);
        });
        output.push(resolved.join(" "));
        continue;
      }

      if (/^input\s*\(/.test(line)) {
        const prompt = line.match(/input\s*\(\s*["'](.+?)["']\s*\)/);
        if (prompt && prompt[1]) {
          output.push(prompt[1]);
        }
        continue;
      }

      const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignMatch) {
        const [, name, valExpr] = assignMatch;
        const trimmed = valExpr.trim();

        // Check if value expression includes input(...)
        if (/input\s*\(/.test(trimmed)) {
          const val = mockInputs[inputIdx] ?? 5;
          inputIdx++;
          vars[name] = val;
          continue;
        }

        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
          vars[name] = trimmed.slice(1, -1);
        } else if (trimmed === "True") vars[name] = true;
        else if (trimmed === "False") vars[name] = false;
        else if (trimmed === "None") vars[name] = "None";
        else if (/^\d+$/.test(trimmed)) vars[name] = parseInt(trimmed, 10);
        else if (/^\d+\.\d+$/.test(trimmed)) vars[name] = parseFloat(trimmed);
        else {
          const evaled = safeEval(trimmed, vars);
          vars[name] = typeof evaled === "number" ? evaled : (/^\d+$/.test(String(evaled)) ? parseInt(String(evaled), 10) : evaled);
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
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ output: ["Error: Terlalu banyak permintaan. Tunggu beberapa saat."] }, { status: 429 });
  }

  let code = "";
  let language = "python";

  try {
    const body = await req.json();
    code = body.code || "";
    language = body.language || "python";
  } catch {
    return NextResponse.json({ output: ["Error: Invalid JSON body"] }, { status: 400 });
  }

  if (!code || typeof code !== "string") {
    return NextResponse.json({ output: ["Error: No code provided"] }, { status: 400 });
  }
  if (code.length > 10000) {
    return NextResponse.json({ output: ["Error: Kode terlalu panjang (maks 10.000 karakter)"] }, { status: 400 });
  }

  try {
    const pistonResponse = await fetch(PISTON_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version: "*",
        files: [{ content: code }],
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (pistonResponse.ok) {
      const data = await pistonResponse.json();
      const runRes = data.run;
      if (runRes) {
        const stdout = runRes.stdout || "";
        const stderr = runRes.stderr || "";
        const outputLines = (stdout + stderr)
          .split("\n")
          .filter((l: string, i: number, arr: string[]) => i < arr.length - 1 || l !== "");
        return NextResponse.json({
          output: outputLines.length > 0 ? outputLines : ["(Kode berjalan tanpa output cetakan)"],
        });
      }
    }
  } catch {
    // Fallback to internal simulation engine if Piston is unreachable/offline
  }

  const simulatedOutput = simulatePython(code);
  return NextResponse.json({ output: simulatedOutput });
}
