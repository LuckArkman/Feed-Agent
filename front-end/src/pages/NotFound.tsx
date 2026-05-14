import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Button } from '@/components/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

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
        padding: '50px 40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-alpha)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)',
        }}>
          <Compass size={36} />
        </div>

        <div>
          <h1 style={{
            fontSize: '5rem',
            fontWeight: 800,
            lineHeight: 1,
            color: 'var(--primary)',
            fontFamily: 'var(--font-heading)',
            margin: '0 0 10px 0',
            letterSpacing: '-0.04em',
          }}>
            404
          </h1>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.5rem' }}>
            Página Não Encontrada
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px' }}>
            O endereço inserido não existe ou o documento foi movido de diretório permanentemente.
          </p>
        </div>

        <Button onClick={() => navigate('/')} variant="primary" icon={Home}>
          Voltar para Home
        </Button>
      </div>
    </div>
  );
};
export default NotFound;
