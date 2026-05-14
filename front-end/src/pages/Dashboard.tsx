import React, { useState } from 'react';
import { Sparkles, Link } from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Alert } from '@/components/Alert';

export const Dashboard: React.FC = () => {
  const [alertOpen, setAlertOpen] = useState(true);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const triggerLoading = () => {
    setLoadingDemo(true);
    setTimeout(() => setLoadingDemo(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {alertOpen && (
        <Alert variant="success" onClose={() => setAlertOpen(false)}>
          <strong>Conexão Estabelecida:</strong> O back-end e o WhatsApp Service estão prontos para receber requisições de disparos!
        </Alert>
      )}

      {/* Quick Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total de Leads</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700 }}>1,248</span>
            <Badge variant="success">+12%</Badge>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Minutas Geradas</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700 }}>156</span>
            <Badge variant="primary">Ativas</Badge>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Disparos Concluídos</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700 }}>4,912</span>
            <Badge variant="success">99.8% OK</Badge>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Tempo de Fila</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700 }}>1.2s</span>
            <Badge variant="neutral">Baixo</Badge>
          </div>
        </div>
      </div>

      {/* Main Welcome */}
      <section className="glass-panel" style={{ padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10px', right: '15px', opacity: 0.1 }}>
          <Sparkles size={120} />
        </div>
        <h1 style={{ marginBottom: '16px', fontSize: '2.5rem', letterSpacing: '-0.03em' }}>Bem-vindo ao Feed-Agent</h1>
        <p style={{ maxWidth: '640px', margin: '0 auto 24px auto', fontSize: '1.1rem' }}>
          A inteligência artificial que converte imagens de contatos físicos, minutas e planilhas em filas de disparos de WhatsApp automatizados com OCR inteligente.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Button variant="primary" icon={Sparkles} onClick={triggerLoading} isLoading={loadingDemo}>
            Verificar Diagnóstico
          </Button>
          <Button variant="secondary" icon={Link}>Configurar Webhook</Button>
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
