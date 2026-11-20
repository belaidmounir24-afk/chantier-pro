import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MarchéDZ ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b1c30] text-white flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#213145] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-[32px]">balance</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                MarchéDZ — Récupération Système
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Une interruption a été interceptée. Vos requêtes juridiques et formulaires sont sauvegardés.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#0b1c30] p-3 rounded-xl border border-slate-800 text-left overflow-x-auto max-h-32 text-xs font-mono text-rose-300">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Recharger MarchéDZ
              </button>
              <button
                type="button"
                onClick={this.handleClearStorage}
                className="py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
