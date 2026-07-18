import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Wifi, Menu, ChevronDown, User, LogOut, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

import apiClient from '@/services/apiClient';

interface HeaderProps {
  onMenuClick: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  theme,
  onThemeToggle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Read Zustand store parameters
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [connectedCount, setConnectedCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchStatus = () => {
        apiClient.get('/whatsapp/instances').then(res => {
          if (res.data?.success) {
            const instances = res.data.data;
            const openCount = instances.filter((inst: any) => inst.liveStatus?.state === 'OPEN').length;
            setConnectedCount(openCount);
          }
        }).catch(() => {});
      };
      
      fetchStatus();
      const interval = setInterval(fetchStatus, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const getFriendlyTitle = (path: string) => {
    switch (path) {
      case '/dashboard': return 'Painel Central';
      case '/whatsapp': return 'Conexão WhatsApp';
      case '/contacts': return 'Contatos Integrados';
      case '/ocr': return 'Leitor de Imagens OCR';
      case '/drafts': return 'Minutas de Disparos';
      case '/broadcast': return 'Fila de Disparos';
      case '/profile': return 'Minha Conta';
      case '/settings': return 'Configurações de Integração';
      default: return 'Painel Administrativo';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Compute initials for avatar (e.g. "Mário Lopes" -> "ML")
  const getInitials = (name?: string) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="app-header glass-panel">
      {/* Mobile Toggle & Title */}
      <div className="header-left">
        <button type="button" className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle mobile menu">
          <Menu size={20} />
        </button>
        <h2 className="header-page-title">{getFriendlyTitle(location.pathname)}</h2>
      </div>

      {/* Header Controls */}
      <div className="header-right">
        {/* Status Connection Indicator */}
        <div className="header-status-badge" style={{ 
            backgroundColor: connectedCount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(234, 179, 8, 0.1)',
            borderColor: connectedCount > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(234, 179, 8, 0.3)',
        }}>
          <Wifi size={14} className="status-icon-glow" style={{ color: connectedCount > 0 ? 'var(--success)' : '#eab308' }} />
          <span className="status-text" style={{ color: connectedCount > 0 ? 'var(--success)' : '#eab308' }}>
            {connectedCount > 0 ? `${connectedCount} Instância(s) Conectada(s)` : 'Sem Instâncias'}
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onThemeToggle}
          className="theme-switcher-btn"
          title={`Toggle ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon size={18} className="theme-icon theme-icon-rotate" />
          ) : (
            <Sun size={18} className="theme-icon theme-icon-rotate" />
          )}
        </button>

        {/* Notifications */}
        <button type="button" className="notification-btn" title="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        {/* User Profile dropdown */}
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
                <span className="user-header-email">{user?.email || 'sem-email@feedagent.com'}</span>
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
                <span>Meu Perfil</span>
              </button>
              <button type="button" className="dropdown-item dropdown-item-danger" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Sair da Conta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
