// Client-side Pyodide runner using dynamic script loading & WASM sandbox

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL?: string }) => Promise<any>;
    pyodideInstance?: any;
  }
}

export interface ExecutionResult {
  output: string[];
  error?: string;
  executionTimeMs: number;
}

let pyodidePromise: Promise<any> | null = null;

export async function getPyodide(): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("Pyodide hanya dapat berjalan di browser.");
  }

  if (window.pyodideInstance) {
    return window.pyodideInstance;
  }

  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      if (!window.loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
        script.async = true;
        script.onload = async () => {
          try {
            if (window.loadPyodide) {
              const pyodide = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
              });
              window.pyodideInstance = pyodide;
              resolve(pyodide);
            } else {
              reject(new Error("Gagal memuat fungsi loadPyodide"));
            }
          } catch (err) {
            reject(err);
          }
        };
        script.onerror = () => reject(new Error("Gagal mengunduh script Pyodide dari CDN."));
        document.body.appendChild(script);
      } else {
        window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        }).then((pyodide) => {
          window.pyodideInstance = pyodide;
          resolve(pyodide);
        }).catch(reject);
      }
    });
  }

  return pyodidePromise;
}

export async function runPythonCodeClient(
  code: string,
  inputs: string[] = []
): Promise<ExecutionResult> {
  const startTime = performance.now();
  try {
    const pyodide = await getPyodide();

    // Default mock inputs if non provided (e.g. 5, 10 for interactive calculation)
    const effectiveInputs = inputs.length > 0 ? inputs : ["5", "10", "15", "20"];

    // Setup stdout and stderr capture
    const setupPyCode = `
import sys
import io

_captured_stdout = io.StringIO()
_captured_stderr = io.StringIO()
sys.stdout = _captured_stdout
sys.stderr = _captured_stderr

_mock_inputs = ${JSON.stringify(effectiveInputs)};
_input_idx = 0

def input(prompt=""):
    global _input_idx
    if prompt:
        print(prompt, end="")
    if _input_idx < len(_mock_inputs):
        val = str(_mock_inputs[_input_idx])
        _input_idx += 1
        print(val)
        return val
    return "5"
`;

    await pyodide.runPythonAsync(setupPyCode);

    // Execute student code
    try {
      await pyodide.runPythonAsync(code);
    } catch (pythonErr: any) {
      const capturedErr = pyodide.runPython("sys.stderr.getvalue()");
      const executionTimeMs = Math.round(performance.now() - startTime);
      return {
        output: capturedErr ? capturedErr.trim().split("\n") : [String(pythonErr)],
        error: String(pythonErr),
        executionTimeMs,
      };
    }

    const capturedOut: string = pyodide.runPython("sys.stdout.getvalue()");
    const executionTimeMs = Math.round(performance.now() - startTime);
    const lines = capturedOut ? capturedOut.split("\n").filter((l, i, arr) => i < arr.length - 1 || l !== "") : [];

    return {
      output: lines.length > 0 ? lines : ["(Kode berjalan tanpa output cetakan)"],
      executionTimeMs,
    };
  } catch (err: any) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    return {
      output: [`Error: Gagal memuat/menjalankan Python WebAssembly (${err.message})`],
      error: err.message,
      executionTimeMs,
    };
  }
}
