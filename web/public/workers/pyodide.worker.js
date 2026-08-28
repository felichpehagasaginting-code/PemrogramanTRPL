// Pyodide Web Worker for isolated background execution & anti-infinite loop protection
/* eslint-disable no-restricted-globals */

let pyodideInstance = null;
let isInitializing = false;
let initPromise = null;

async function initPyodideWorker() {
  if (pyodideInstance) return pyodideInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    isInitializing = true;
    try {
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
      pyodideInstance = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
      });
      isInitializing = false;
      return pyodideInstance;
    } catch (err) {
      isInitializing = false;
      throw err;
    }
  })();

  return initPromise;
}

self.onmessage = async (event) => {
  const { id, type, code, inputs = [], files = {} } = event.data;

  if (type === "INIT") {
    try {
      await initPyodideWorker();
      self.postMessage({ id, type: "INIT_SUCCESS" });
    } catch (err) {
      self.postMessage({ id, type: "INIT_ERROR", error: err.message });
    }
    return;
  }

  if (type === "RUN") {
    const startTime = performance.now();
    try {
      const pyodide = await initPyodideWorker();

      // Mount Virtual Filesystem (VFS) into Pyodide
      if (files && typeof files === "object") {
        for (const [filename, content] of Object.entries(files)) {
          try {
            pyodide.FS.writeFile(filename, String(content));
          } catch (fsErr) {
            console.warn("Pyodide VFS write error:", fsErr);
          }
        }
      }

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
      } catch (pythonErr) {
        const capturedErr = pyodide.runPython("sys.stderr.getvalue()");
        const executionTimeMs = Math.round(performance.now() - startTime);
        self.postMessage({
          id,
          type: "RUN_ERROR",
          output: capturedErr ? capturedErr.trim().split("\n") : [String(pythonErr)],
          error: String(pythonErr),
          executionTimeMs,
        });
        return;
      }

      const capturedOut = pyodide.runPython("sys.stdout.getvalue()");
      const executionTimeMs = Math.round(performance.now() - startTime);
      const lines = capturedOut
        ? capturedOut.split("\n").filter((l, i, arr) => i < arr.length - 1 || l !== "")
        : [];

      self.postMessage({
        id,
        type: "RUN_SUCCESS",
        output: lines.length > 0 ? lines : ["(Kode berjalan lancar tanpa output cetakan)"],
        executionTimeMs,
      });
    } catch (err) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      self.postMessage({
        id,
        type: "RUN_ERROR",
        output: [`Error WebAssembly: ${err.message}`],
        error: err.message,
        executionTimeMs,
      });
    }
  }
};
