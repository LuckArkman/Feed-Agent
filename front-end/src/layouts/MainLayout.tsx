import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { WifiOff, ShieldAlert, Clock, LogOut, Check } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTokenMonitor } from '@/hooks/useTokenMonitor';

export const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('feedagent-theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const isOnline = useOnlineStatus();

  // Instantiate security token expiration monitor
  const { secondsRemaining, showWarningModal, extendSession, logoutSession } = useTokenMonitor(60);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('feedagent-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      {/* Resilient Offline Status Alert Bar */}
      {!isOnline && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '36px',
          backgroundColor: 'rgba(239, 68, 68, 0.95)',
          color: 'white',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 2px 12px rgba(239, 68, 68, 0.3)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-sans)',
          transition: 'all 0.3s ease',
        }}>
          <WifiOff size={16} style={{ animation: 'pulse 2s infinite' }} />
          <span>Sem conexão com a internet. Operando em modo somente leitura.</span>
        </div>
      )}

      {/* Session Expiration Security Alert Modal */}
      {showWarningModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'var(--font-sans)',
          animation: 'fade-in 0.3s ease',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '460px',
            width: '100%',
            padding: '40px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
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
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)',
              position: 'relative',
            }}>
              <ShieldAlert size={32} style={{ animation: 'pulse 1.5s infinite' }} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Alerta de sessão
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px', lineHeight: 1.5 }}>
                Sua sessão vai expirar em breve. Estenda para continuar ou saia agora.
              </p>
            </div>

            {/* Countdown Circular indicator block */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              borderRadius: '12px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}>
              <Clock size={18} style={{ color: 'var(--error)' }} />
              <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                Expira em {secondsRemaining}s
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
              <button
                type="button"
                onClick={logoutSession}
                style={{
                  flex: 1,
                  height: '46px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>

              <button
                type="button"
                onClick={extendSession}
                style={{
                  flex: 1,
                  height: '46px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-ink)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Check size={16} />
                <span>Estender</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div 
        className={`app-shell ${sidebarCollapsed ? 'shell-sidebar-collapsed' : ''}`}
        style={{ 
          paddingTop: isOnline ? 0 : '36px',
          transition: 'padding-top 0.3s ease',
        }}
      >
        {/* Sidebar for Desktop */}
        <div className="desktop-sidebar-wrapper">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Sidebar Mobile Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileMenuOpen(false)}
                onItemClick={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Viewport Content Wrapper */}
        <div className="main-viewport-wrapper">
          <Header
            onMenuClick={() => setMobileMenuOpen(true)}
            theme={theme}
            onThemeToggle={toggleTheme}
          />
          <main className="main-container-viewport">
            <div className="page-content-wrapper-box animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
export default MainLayout;
