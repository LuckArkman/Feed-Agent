import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Users, FileUp, FileText, Send, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import apiClient from '@/services/apiClient';

export const Dashboard: React.FC = () => {
  const [alertOpen, setAlertOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    disparosConcluidos: 0,
    successRate: '0%',
    minutasGeradas: 0,
  });

  const fetchDashboardData = async () => {
    setLoading(true);
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
    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="page-stack">
      {alertOpen && (
        <Alert variant="info" onClose={() => setAlertOpen(false)}>
          Fluxo sugerido: conectar WhatsApp → importar contatos → gerar minuta (OCR) → aprovar → disparar.
        </Alert>
      )}

      <div className="page-hero">
        <div className="page-hero-copy">
          <h1>Painel</h1>
          <p>Resumo do dia e atalhos para o fluxo de disparos.</p>
        </div>
        <Button variant="secondary" icon={RefreshCw} onClick={fetchDashboardData} isLoading={loading}>
          Atualizar
        </Button>
      </div>

      <div className="stat-grid">
        <div className="glass-panel stat-card">
          <span className="stat-card-label">Contatos</span>
          <div className="stat-card-row">
            <span className="stat-card-value">{metrics.totalLeads}</span>
            <Badge variant="neutral">Base</Badge>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-card-label">Minutas</span>
          <div className="stat-card-row">
            <span className="stat-card-value">{metrics.minutasGeradas}</span>
            <Badge variant="primary">Studio</Badge>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-card-label">Disparos hoje</span>
          <div className="stat-card-row">
            <span className="stat-card-value">{metrics.disparosConcluidos}</span>
            <Badge variant="success">{metrics.successRate} OK</Badge>
          </div>
        </div>
      </div>

      <section className="glass-panel" style={{ padding: 28 }}>
        <h2 style={{ marginBottom: 8 }}>Começar</h2>
        <p style={{ marginBottom: 20 }}>Escolha a próxima etapa do fluxo operacional.</p>
        <div className="quick-actions">
          <Link to="/whatsapp" className="quick-action">
            <span className="quick-action-icon">
              <Phone size={18} />
            </span>
            <strong>WhatsApp</strong>
            <span>Conectar aparelho e ler o QR</span>
          </Link>
          <Link to="/contacts" className="quick-action">
            <span className="quick-action-icon">
              <Users size={18} />
            </span>
            <strong>Contatos</strong>
            <span>Importar CSV ou cadastrar números</span>
          </Link>
          <Link to="/ocr" className="quick-action">
            <span className="quick-action-icon">
              <FileUp size={18} />
            </span>
            <strong>Leitor OCR</strong>
            <span>Extrair texto de PDF ou imagem</span>
          </Link>
          <Link to="/drafts" className="quick-action">
            <span className="quick-action-icon">
              <FileText size={18} />
            </span>
            <strong>Minutas</strong>
            <span>Revisar e aprovar conteúdo</span>
          </Link>
          <Link to="/broadcast" className="quick-action">
            <span className="quick-action-icon">
              <Send size={18} />
            </span>
            <strong>Disparos</strong>
            <span>Acompanhar fila e histórico</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
