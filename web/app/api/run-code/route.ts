import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code) {
      return NextResponse.json({ output: ["Error: No code provided"] }, { status: 400 });
    }

    // In production, send to Piston API or run Python subprocess
    // For development, simulate Python execution
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language || "python",
        version: "3.10.0",
        files: [{ content: code }],
      }),
    });

    if (!response.ok) {
      // Fallback: try local mock execution for development
      return NextResponse.json({ output: simulatePython(code) });
    }

    const data = await response.json();
    const output = data.run?.output?.split("\n") || ["No output"];

    return NextResponse.json({ output });
  } catch {
    return NextResponse.json({ output: ["Error: Failed to execute code"] }, { status: 500 });
  }
}

function simulatePython(code: string): string[] {
  const lines = code.split("\n");
  const output: string[] = [];

  try {
    // Simple mock Python interpreter for basic print statements
    for (const line of lines) {
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (trimmed.startsWith("#") || trimmed === "") continue;

      // Match print("...") or print('...')
      const printMatch = trimmed.match(/^print\(["'](.+?)["']\)$/);
      if (printMatch) {
        output.push(printMatch[1]);
        continue;
      }

      // Match print(variable)
      const printVarMatch = trimmed.match(/^print\((\w+)\)$/);
      if (printVarMatch) {
        const varName = printVarMatch[1];
        // Look for variable assignment
        const varLine = lines.find((l) => l.trim().startsWith(varName + " ="));
        if (varLine) {
          const val = varLine.split("=")[1]?.trim();
          output.push(val || "");
        }
        continue;
      }

      // Match print(f"...") basic
      const printFMatch = trimmed.match(/^print\(f["'](.+?)["']\)$/);
      if (printFMatch) {
        output.push(printFMatch[1]);
        continue;
      }

      // Match print with concatenation
      const printConcat = trimmed.match(/^print\((.+?)\)$/);
      if (printConcat) {
        output.push(evalSimple(printConcat[1], lines));
        continue;
      }
    }

    if (output.length === 0) output.push("(Kode berjalan tanpa output cetakan)");
    return output;
  } catch {
    return ["Error: Syntax error dalam kode"];
  }
}

function evalSimple(expr: string, lines: string[]): string {
  // Simple variable lookup from assignments
  const vars: Record<string, string> = {};
  for (const line of lines) {
    const assign = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (assign) {
      vars[assign[1]] = assign[2].trim();
    }
  }

  const clean = expr.replace(/["']/g, "");
  if (vars[clean]) return vars[clean];

  // Handle f-string interpolation basics
  if (expr.includes("{") && expr.includes("}")) {
    let result = expr;
    for (const [key, val] of Object.entries(vars)) {
      result = result.replace(`{${key}}`, val);
    }
    return result;
  }

  return expr;
}
