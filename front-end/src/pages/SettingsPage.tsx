import React, { useState } from 'react';
import { Settings, Palette, Monitor, Save } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { showToast } from '@/utils/toastHelper';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const SettingsPage: React.FC = () => {
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('feedagent-display-hint') || '');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    localStorage.setItem('feedagent-display-hint', displayName.trim());
    setTimeout(() => {
      setSaving(false);
      showToast.success('Preferências locais salvas neste navegador.');
    }, 400);
  };

  return (
    <div className="page-stack">
      <div className="page-hero">
        <div className="page-hero-copy">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Settings size={28} style={{ color: 'var(--primary)' }} />
            Preferências
          </h1>
          <p>
            Ajustes deste navegador. Infraestrutura (JWT, Redis, retenção) é configurada no servidor — não
            neste painel.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="page-stack">
        <div className="glass-panel" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Palette size={20} style={{ color: 'var(--primary)' }} />
            <h3>Interface</h3>
            <Badge variant="neutral">Local</Badge>
          </div>
          <p style={{ fontSize: '0.9rem' }}>
            O tema claro/escuro fica no botão do topo. O apelido abaixo é só um lembrete visual neste
            dispositivo.
          </p>
          <Input
            label="Apelido de exibição (opcional)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ex.: Operação manhã"
          />
        </div>

        <div className="glass-panel" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Monitor size={20} style={{ color: 'var(--primary)' }} />
            <h3>API em uso</h3>
            <Badge variant="primary">Somente leitura</Badge>
          </div>
          <Input label="Base URL" value={API_BASE} disabled helperText="Definida por VITE_API_URL no build do frontend." />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="primary" icon={Save} isLoading={saving}>
            Salvar preferências
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
