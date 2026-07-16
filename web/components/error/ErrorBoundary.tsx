"use client";

import { Component, ReactNode } from "react";
import { WarningCircle } from "@phosphor-icons/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: "var(--space-8)",
              textAlign: "center",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              margin: "var(--space-6)",
            }}
          >
            <WarningCircle size={48} color="#EF4444" weight="fill" />
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", margin: "12px 0 4px" }}>
              Terjadi Kesalahan
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              {this.state.error?.message || "Terjadi error yang tidak terduga"}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              className="btn btn-primary btn-sm"
              style={{ marginTop: "var(--space-4)" }}
            >
              Muat Ulang
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
