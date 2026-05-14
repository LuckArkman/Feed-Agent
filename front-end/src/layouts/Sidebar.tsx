import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Phone, 
  Users, 
  FileUp, 
  FileText, 
  Send as SendIcon, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  MessageSquareCode,
  ShieldAlert,
  Activity,
  Key,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  onItemClick,
}) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', name: 'Painel Central', icon: Home },
    { path: '/whatsapp', name: 'WhatsApp Hub', icon: Phone },
    { path: '/contacts', name: 'Contatos', icon: Users },
    { path: '/ocr', name: 'Leitor OCR', icon: FileUp },
    { path: '/drafts', name: 'Minutas (Studio)', icon: FileText },
    { path: '/broadcast', name: 'Fila de Disparos', icon: SendIcon },
    { path: '/audit', name: 'Logs (Auditoria)', icon: ShieldAlert },
    { path: '/telemetry', name: 'Monitor (Infra)', icon: Activity },
    { path: '/api-keys', name: 'Chaves API', icon: Key },
    { path: '/help', name: 'Ajuda & Manuais', icon: BookOpen },
    { path: '/settings', name: 'Configurações', icon: Settings },
  ];

  return (
    <aside className={`sidebar glass-panel ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Branding Logo */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <MessageSquareCode size={24} className="brand-icon" />
        </div>
        {!collapsed && <span className="brand-title">Feed-Agent</span>}
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  onClick={onItemClick}
                  className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  title={collapsed ? item.name : undefined}
                >
                  <IconComponent size={20} className="nav-icon" />
                  {!collapsed && <span className="nav-text">{item.name}</span>}
                  {isActive && !collapsed && <span className="active-dot" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Trigger at Bottom */}
      <div className="sidebar-footer">
        <button type="button" className="sidebar-collapse-btn" onClick={onToggle}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
