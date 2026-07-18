import React, { useEffect, useRef } from 'react';
import { WifiOff, ShieldAlert, Clock, LogOut, Check } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTokenMonitor } from '@/hooks/useTokenMonitor';

export const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('feedagent-theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const overlayRef = useRef<HTMLDivElement>(null);

  const isOnline = useOnlineStatus();
  const { secondsRemaining, showWarningModal, extendSession, logoutSession } = useTokenMonitor(60);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('feedagent-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', mobileMenuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      {!isOnline && (
        <div className="offline-banner" role="alert">
          <WifiOff size={16} aria-hidden />
          <span>Sem conexão. Operando em modo somente leitura.</span>
        </div>
      )}

      {showWarningModal && (
        <div className="ui-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="session-alert-title">
          <div className="ui-modal glass-panel">
            <div className="ui-modal__body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: 'color-mix(in srgb, var(--error) 12%, transparent)',
                  color: 'var(--error)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldAlert size={28} aria-hidden />
              </div>
              <div>
                <h3 id="session-alert-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Sessão prestes a expirar
                </h3>
                <p style={{ marginTop: 8 }}>Estenda para continuar trabalhando ou saia agora.</p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 18px',
                  borderRadius: 10,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <Clock size={18} style={{ color: 'var(--error)' }} aria-hidden />
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Expira em {secondsRemaining}s</span>
              </div>
              <div className="stack-actions" style={{ width: '100%' }}>
                <ButtonLike onClick={logoutSession} variant="ghost">
                  <LogOut size={16} aria-hidden />
                  Sair
                </ButtonLike>
                <ButtonLike onClick={extendSession} variant="primary">
                  <Check size={16} aria-hidden />
                  Estender
                </ButtonLike>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`app-shell ${sidebarCollapsed ? 'shell-sidebar-collapsed' : ''}`}
        style={{ paddingTop: isOnline ? 0 : 36 }}
      >
        <div className="desktop-sidebar-wrapper">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        </div>

        {mobileMenuOpen && (
          <div
            ref={overlayRef}
            className="mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
            role="presentation"
          >
            <div
              className="mobile-drawer-content"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
            >
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileMenuOpen(false)}
                onItemClick={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        <div className="main-viewport-wrapper">
          <Header
            onMenuClick={() => setMobileMenuOpen(true)}
            theme={theme}
            onThemeToggle={toggleTheme}
          />
          <main className="main-container-viewport" id="main-content">
            <div className="page-content-wrapper-box animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

/** Local compact button for session modal without importing cycles */
const ButtonLike: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  variant: 'primary' | 'ghost';
}> = ({ children, onClick, variant }) => (
  <button
    type="button"
    onClick={onClick}
    className={`btn btn-${variant === 'ghost' ? 'ghost' : 'primary'}`}
    style={{ flex: 1, minHeight: 44 }}
  >
    {children}
  </button>
);

export default MainLayout;
