import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Users, FileUp, FileText, Send, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { StatePanel } from '@/components/StatePanel';
import { PageHeader } from '@/components/PageHeader';
import apiClient from '@/services/apiClient';
import { BRAND, NAV_LABELS } from '@/config/brand';

export const Dashboard: React.FC = () => {
  const [alertOpen, setAlertOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    disparosConcluidos: 0,
    successRate: '0%',
    minutasGeradas: 0,
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const kpiRes = await apiClient.get('/analytics/kpi');
      const kpiData = kpiRes.data?.data || { totalReachedToday: 0, successRateToday: 0 };

      const contactsRes = await apiClient.get('/contacts?page=1&limit=1');
      const totalLeads = contactsRes.data?.data?.total || 0;

      let totalDrafts = 0;
      try {
        const draftsRes = await apiClient.get('/drafts');
        totalDrafts = draftsRes.data?.data?.length || 0;
      } catch {
        /* optional */
      }

      setMetrics({
        totalLeads,
        disparosConcluidos: kpiData.totalReachedToday,
        successRate: `${kpiData.successRateToday}%`,
        minutasGeradas: totalDrafts,
      });
    } catch {
      setError('Não foi possível carregar as métricas. Verifique a conexão com a API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch inicial + polling — atualização assíncrona de estado remoto
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial da API
    void fetchDashboardData();
  }, []);

  return (
    <div className="page-stack">
      {alertOpen && (
        <Alert variant="info" onClose={() => setAlertOpen(false)}>
          Organize sua operação: conecte o canal, importe contatos, prepare o conteúdo e inicie uma campanha.
        </Alert>
      )}

      <PageHeader
        title="Visão geral"
        description={`Acompanhe contatos, campanhas e atividades recentes do ${BRAND.productName}.`}
        actions={
          <Button variant="secondary" icon={RefreshCw} onClick={fetchDashboardData} isLoading={loading}>
            Atualizar
          </Button>
        }
      />

      {error && (
        <StatePanel
          variant="error"
          title="Falha ao carregar"
          description={error}
          actionLabel="Tentar novamente"
          onAction={fetchDashboardData}
        />
      )}

      {!error && (
        <div className="stat-grid" aria-busy={loading}>
          <div className="glass-panel stat-card">
            <span className="stat-card-label">Contatos</span>
            <div className="stat-card-row">
              <span className="stat-card-value">{loading ? '—' : metrics.totalLeads}</span>
              <Badge variant="neutral">Base</Badge>
            </div>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-card-label">Conteúdos</span>
            <div className="stat-card-row">
              <span className="stat-card-value">{loading ? '—' : metrics.minutasGeradas}</span>
              <Badge variant="primary">Studio</Badge>
            </div>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-card-label">Campanhas hoje</span>
            <div className="stat-card-row">
              <span className="stat-card-value">{loading ? '—' : metrics.disparosConcluidos}</span>
              <Badge variant="success">{metrics.successRate} entrega</Badge>
            </div>
          </div>
        </div>
      )}

      <section className="glass-panel" style={{ padding: 'var(--card-pad)' }}>
        <h2 style={{ marginBottom: 8, fontSize: 'var(--type-h2)' }}>Primeiros passos</h2>
        <p style={{ marginBottom: 20, color: 'var(--text-muted)' }}>
          Conecte seu canal, importe contatos, prepare o conteúdo e inicie uma campanha.
        </p>
        <div className="quick-actions">
          <Link to="/whatsapp" className="quick-action">
            <span className="quick-action-icon" aria-hidden>
              <Phone size={18} />
            </span>
            <strong>1. {NAV_LABELS.whatsapp}</strong>
            <span>Conectar canal e ler o QR</span>
          </Link>
          <Link to="/contacts" className="quick-action">
            <span className="quick-action-icon" aria-hidden>
              <Users size={18} />
            </span>
            <strong>2. {NAV_LABELS.contacts}</strong>
            <span>Importar lista ou cadastrar destinatários</span>
          </Link>
          <Link to="/ocr" className="quick-action">
            <span className="quick-action-icon" aria-hidden>
              <FileUp size={18} />
            </span>
            <strong>3. {NAV_LABELS.ocr}</strong>
            <span>Extrair texto de PDF ou imagem</span>
          </Link>
          <Link to="/drafts" className="quick-action">
            <span className="quick-action-icon" aria-hidden>
              <FileText size={18} />
            </span>
            <strong>4. {NAV_LABELS.drafts}</strong>
            <span>Revisar e aprovar conteúdo</span>
          </Link>
          <Link to="/broadcast" className="quick-action">
            <span className="quick-action-icon" aria-hidden>
              <Send size={18} />
            </span>
            <strong>5. {NAV_LABELS.broadcast}</strong>
            <span>Iniciar envio e acompanhar histórico</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
