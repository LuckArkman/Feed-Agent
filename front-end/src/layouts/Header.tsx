import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Wifi, Menu, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/services/apiClient';

interface HeaderProps {
  onMenuClick: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const titles: Record<string, string> = {
  '/dashboard': 'Painel',
  '/whatsapp': 'WhatsApp',
  '/contacts': 'Contatos',
  '/ocr': 'Leitor OCR',
  '/drafts': 'Minutas',
  '/broadcast': 'Disparos',
  '/profile': 'Perfil',
  '/settings': 'Preferências',
  '/help': 'Ajuda',
};

export const Header: React.FC<HeaderProps> = ({ onMenuClick, theme, onThemeToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [connectedCount, setConnectedCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchStatus = () => {
      apiClient
        .get('/whatsapp/instances')
        .then((res) => {
          if (res.data?.success) {
            const instances = res.data.data;
            const openCount = instances.filter((inst: { liveStatus?: { state?: string } }) => inst.liveStatus?.state === 'OPEN').length;
            setConnectedCount(openCount);
          }
        })
        .catch(() => {});
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button type="button" className="mobile-menu-btn" onClick={onMenuClick} aria-label="Abrir menu">
          <Menu size={20} />
        </button>
        <h2 className="header-page-title">{titles[location.pathname] || 'Feed-Agent'}</h2>
      </div>

      <div className="header-right">
        <div
          className="header-status-badge"
          style={{
            backgroundColor:
              connectedCount > 0
                ? 'color-mix(in srgb, var(--success) 12%, transparent)'
                : 'color-mix(in srgb, var(--warning) 14%, transparent)',
            borderColor:
              connectedCount > 0
                ? 'color-mix(in srgb, var(--success) 28%, transparent)'
                : 'color-mix(in srgb, var(--warning) 30%, transparent)',
            color: connectedCount > 0 ? 'var(--success)' : 'var(--warning)',
          }}
        >
          <Wifi size={14} className="status-icon-glow" />
          <span className="status-text">
            {connectedCount > 0 ? `${connectedCount} conectado(s)` : 'Sem WhatsApp'}
          </span>
        </div>

        <button
          type="button"
          onClick={onThemeToggle}
          className="theme-switcher-btn"
          title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
        >
          {theme === 'light' ? (
            <Moon size={18} className="theme-icon theme-icon-rotate" />
          ) : (
            <Sun size={18} className="theme-icon theme-icon-rotate" />
          )}
        </button>

        <div className="profile-dropdown-container">
          <button
            type="button"
            className="profile-trigger-btn"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <div className="profile-avatar">{getInitials(user?.name)}</div>
            <span className="profile-name">{user?.name || 'Visitante'}</span>
            <ChevronDown size={14} className={`dropdown-arrow ${profileDropdownOpen ? 'arrow-rotated' : ''}`} />
          </button>

          {profileDropdownOpen && (
            <div className="profile-dropdown-menu glass-panel">
              <div className="dropdown-user-header">
                <span className="user-header-name">{user?.name || 'Usuário'}</span>
                <span className="user-header-email">{user?.email || ''}</span>
              </div>
              <hr className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/profile');
                }}
              >
                <User size={16} />
                <span>Meu perfil</span>
              </button>
              <button type="button" className="dropdown-item dropdown-item-danger" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
