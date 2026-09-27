"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  sectionName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[SectionErrorBoundary:${this.props.sectionName || "Section"}]`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="my-8 mx-auto max-w-4xl p-6 rounded-2xl bg-[#fbeae8] border border-[#e8b5af] text-[#7a271a] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#7a271a]" />
            <div>
              <h4 className="text-sm font-bold">
                Unable to display {this.props.sectionName || "this section"}
              </h4>
              <p className="text-xs text-[#7a271a]/80 mt-0.5">
                A temporary rendering issue occurred. The rest of the page remains operational.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f0e6] hover:bg-[#ebe5da] text-[#4a3b32] text-xs font-semibold rounded-xl border border-[#d4ccc0] transition shadow-2xs cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
