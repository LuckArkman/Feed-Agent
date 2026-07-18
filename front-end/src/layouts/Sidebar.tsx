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
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

type NavItem = { path: string; name: string; icon: React.ComponentType<{ size?: number; className?: string }> };
type NavSection = { label: string; items: NavItem[] };

const sections: NavSection[] = [
  {
    label: 'Operação',
    items: [
      { path: '/dashboard', name: 'Painel', icon: Home },
      { path: '/whatsapp', name: 'WhatsApp', icon: Phone },
      { path: '/contacts', name: 'Contatos', icon: Users },
    ],
  },
  {
    label: 'Conteúdo',
    items: [
      { path: '/ocr', name: 'Leitor OCR', icon: FileUp },
      { path: '/drafts', name: 'Minutas', icon: FileText },
      { path: '/broadcast', name: 'Disparos', icon: SendIcon },
    ],
  },
  {
    label: 'Conta',
    items: [
      { path: '/help', name: 'Ajuda', icon: BookOpen },
      { path: '/settings', name: 'Preferências', icon: Settings },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, onItemClick }) => {
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-logo">
          <MessageSquareCode size={22} className="brand-icon" />
        </div>
        {!collapsed && <span className="brand-title">Feed-Agent</span>}
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            <ul className="nav-list">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path} className="nav-item">
                    <Link
                      to={item.path}
                      onClick={onItemClick}
                      className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon size={20} className="nav-icon" />
                      {!collapsed && <span className="nav-text">{item.name}</span>}
                      {isActive && !collapsed && <span className="active-dot" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

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
