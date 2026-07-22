import React, { useState } from 'react';
import { User, Mail, Save } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuthStore } from '@/store/authStore';
import { showToast } from '@/utils/toastHelper';

export const Profile: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast.error('O nome não pode ficar vazio.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      showToast.error('Informe um e-mail válido.');
      return;
    }

    setSaving(true);
    // Persistência local da sessão — o backend não expõe PATCH de perfil.
    setTimeout(() => {
      updateProfile({ name, email });
      setSaving(false);
      showToast.success('Perfil atualizado nesta sessão.');
    }, 400);
  };

  return (
    <div className="page-stack">
      <div className="page-hero">
        <div className="page-hero-copy">
          <h1>Perfil</h1>
          <p>Dados exibidos no painel. Alterações ficam na sessão deste navegador.</p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="glass-panel" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 520 }}>
        <Input label="Nome" icon={User} value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="E-mail" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="primary" icon={Save} isLoading={saving}>
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
