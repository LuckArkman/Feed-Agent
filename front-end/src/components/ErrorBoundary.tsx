import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon } from 'lucide-react';
import { Button } from '@/components/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100vw',
          padding: '24px',
          backgroundColor: 'var(--background)',
          fontFamily: 'var(--font-sans)',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)',
            }}>
              <AlertOctagon size={32} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>Ops! Algo deu errado.</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Um erro crítico de runtime ocorreu na renderização visual do React. O ocorrido foi capturado pelo nosso ErrorBoundary.
            </p>

            {this.state.error && (
              <pre style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(0,0,0,0.05)',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                textAlign: 'left',
                overflowX: 'auto',
                fontFamily: 'var(--mono)',
              }}>
                {this.state.error.toString()}
              </pre>
            )}

            <Button onClick={this.handleReset} variant="primary">
              Recarregar Aplicação
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
