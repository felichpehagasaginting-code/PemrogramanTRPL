import { useState, useCallback } from "react";
import { runPythonCodeClient, ExecutionResult, getPyodide } from "./pyodideRunner";

export function usePyodide() {
  const [isLoadingPyodide, setIsLoadingPyodide] = useState(false);
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [pyodideError, setPyodideError] = useState<string | null>(null);

  const initPyodide = useCallback(async () => {
    if (isPyodideReady || isLoadingPyodide) return;
    setIsLoadingPyodide(true);
    setPyodideError(null);
    try {
      await getPyodide();
      setIsPyodideReady(true);
    } catch (err: any) {
      setPyodideError(err.message || "Gagal menginisialisasi Pyodide");
    } finally {
      setIsLoadingPyodide(false);
    }
  }, [isPyodideReady, isLoadingPyodide]);

  const executeCode = useCallback(
    async (code: string, inputs: string[] = []): Promise<ExecutionResult> => {
      try {
        const result = await runPythonCodeClient(code, inputs);
        return result;
      } catch (err: any) {
        // Fallback to server API if Pyodide fails
        try {
          const res = await fetch("/api/run-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, language: "python" }),
          });
          const data = await res.json();
          return {
            output: data.output || ["(Tidak ada output)"],
            error: data.error,
            executionTimeMs: 0,
          };
        } catch {
          return {
            output: [`Error: ${err.message}`],
            error: err.message,
            executionTimeMs: 0,
          };
        }
      }
    },
    []
  );

  return {
    initPyodide,
    executeCode,
    isLoadingPyodide,
    isPyodideReady,
    pyodideError,
  };
}
