// Client-side Pyodide runner using Dedicated Web Worker Sandbox & Anti-Infinite-Loop protection

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

let activeWorker: Worker | null = null;
let workerInitPromise: Promise<boolean> | null = null;
let reqIdCounter = 0;

function getWorker(): Worker | null {
  if (typeof window === "undefined" || typeof Worker === "undefined") {
    return null;
  }
  if (!activeWorker) {
    try {
      activeWorker = new Worker("/workers/pyodide.worker.js");
      activeWorker.onerror = (e) => {
        console.warn("Pyodide worker error:", e);
      };
    } catch (e) {
      console.warn("Could not instantiate Web Worker, falling back to main thread:", e);
      activeWorker = null;
    }
  }
  return activeWorker;
}

function terminateAndRespawnWorker() {
  if (activeWorker) {
    try {
      activeWorker.terminate();
    } catch {
      // ignore
    }
    activeWorker = null;
    workerInitPromise = null;
  }
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

// Fallback execution on main thread if Web Worker is disabled/unsupported
async function runPythonMainThread(
  code: string,
  inputs: string[] = []
): Promise<ExecutionResult> {
  const startTime = performance.now();
  try {
    const pyodide = await getPyodide();

    const setupPyCode = `
import sys
import io

_captured_stdout = io.StringIO()
_captured_stderr = io.StringIO()
sys.stdout = _captured_stdout
sys.stderr = _captured_stderr

_mock_inputs = ${JSON.stringify(inputs)};
_input_idx = 0

def input(prompt_text=""):
    global _input_idx
    prompt_str = str(prompt_text)
    if prompt_str:
        print(prompt_str, end="")
    
    if _input_idx < len(_mock_inputs):
        val = str(_mock_inputs[_input_idx])
        _input_idx += 1
        print(val)
        return val
    return "0"
`;

    await pyodide.runPythonAsync(setupPyCode);

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
      output: lines.length > 0 ? lines : ["(Kode berjalan lancar tanpa output cetakan)"],
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

export async function runPythonCodeClient(
  code: string,
  inputs: string[] = [],
  timeoutMs: number = 7000
): Promise<ExecutionResult> {
  const worker = getWorker();

  if (!worker) {
    return runPythonMainThread(code, inputs);
  }

  const reqId = ++reqIdCounter;
  const startTime = performance.now();

  return new Promise((resolve) => {
    let hasResolved = false;

    const timer = setTimeout(() => {
      if (hasResolved) return;
      hasResolved = true;
      // Terminate worker to kill infinite loop
      terminateAndRespawnWorker();
      const executionTimeMs = Math.round(performance.now() - startTime);
      resolve({
        output: [
          "⏱️ [Waktu Eksekusi Habis - Timeout 7s]",
          "💡 Tips Mentor: Kemungkinan kodinganmu mengalami loop tak terhingga (misal: 'while True:' tanpa 'break' atau lupa update variabel counter).",
          "Silakan periksa kondisi perulangan kamu lalu jalankan ulang ya!"
        ],
        error: "ExecutionTimeout: Loop tanpa henti terdeteksi.",
        executionTimeMs,
      });
    }, timeoutMs);

    const messageHandler = (event: MessageEvent) => {
      if (event.data && event.data.id === reqId) {
        if (hasResolved) return;
        hasResolved = true;
        clearTimeout(timer);
        worker.removeEventListener("message", messageHandler);

        if (event.data.type === "RUN_SUCCESS") {
          resolve({
            output: event.data.output || [],
            executionTimeMs: event.data.executionTimeMs || Math.round(performance.now() - startTime),
          });
        } else {
          resolve({
            output: event.data.output || [event.data.error || "Terjadi error."],
            error: event.data.error,
            executionTimeMs: event.data.executionTimeMs || Math.round(performance.now() - startTime),
          });
        }
      }
    };

    worker.addEventListener("message", messageHandler);
    worker.postMessage({
      id: reqId,
      type: "RUN",
      code,
      inputs,
    });
  });
}

