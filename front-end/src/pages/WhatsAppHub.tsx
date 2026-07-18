import React, { useState, useEffect } from 'react';
import { 
  Phone,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/Button';
import { showToast } from '@/utils/toastHelper';
import apiClient from '@/services/apiClient';
import { WhatsAppInstanceModal } from './WhatsAppInstanceModal';

interface WhatsAppInstance {
  id: number;
  name: string;
  dbStatus: string;
  liveStatus: {
    state: string;
    qrCode?: string;
  };
}

export const WhatsAppHub: React.FC = () => {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstance, setSelectedInstance] = useState<WhatsAppInstance | null>(null);

  const fetchInstances = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/whatsapp/instances');
      if (res.data?.success) {
        setInstances(res.data.data);
      }
    } catch (err) {
      console.error('Falha ao obter instâncias:', err);
      showToast.error('Falha ao carregar instâncias do WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
    // Poll every 10 seconds to keep live states updated on the grid
    const interval = setInterval(fetchInstances, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateInstance = async () => {
    try {
      if (instances.length >= 500) {
        showToast.error('Você atingiu o limite máximo de 500 instâncias.');
        return;
      }
      await apiClient.post('/whatsapp/instances', { name: `Dispositivo ${instances.length + 1}` });
      showToast.success('Nova instância criada com sucesso!');
      await fetchInstances();
    } catch (err) {
      showToast.error('Erro ao criar instância.');
    }
  };

  const handleDeleteInstance = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar esta instância? Todas as conexões serão perdidas.')) return;
    
    try {
      await apiClient.delete(`/whatsapp/instances/${id}`);
      showToast.success('Instância deletada.');
      setSelectedInstance(null);
      await fetchInstances();
    } catch (err) {
      showToast.error('Erro ao deletar instância.');
    }
  };

  const getStateDetails = (state: string) => {
    const s = state?.toLowerCase() || 'disconnected';
    if (s === 'open') return { label: 'Conectado', color: 'var(--success)' };
    if (s === 'connecting') return { label: 'Conectando / QR', color: '#eab308' };
    if (s === 'banned') return { label: 'Banido', color: 'var(--error)' };
    return { label: 'Desconectado', color: 'var(--text-muted)' };
  };

  return (
    <div className="page-stack">
      {selectedInstance && (
        <WhatsAppInstanceModal
          instanceId={selectedInstance.id}
          instanceName={selectedInstance.name}
          initialWaState={selectedInstance.liveStatus?.state || 'DISCONNECTED'}
          onClose={() => {
            setSelectedInstance(null);
            fetchInstances();
          }}
          onDelete={() => handleDeleteInstance(selectedInstance.id)}
        />
      )}

      <div className="page-hero">
        <div className="page-hero-copy">
          <h1>Instâncias WhatsApp</h1>
          <p>Conecte aparelhos via QR e gerencie o status ao vivo de cada sessão.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" icon={RefreshCw} onClick={fetchInstances} isLoading={loading}>
            Atualizar
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleCreateInstance} disabled={instances.length >= 500}>
            Nova instância
          </Button>
        </div>
      </div>

      {loading && instances.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <RefreshCw size={28} style={{ color: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {instances.map((instance) => {
            const details = getStateDetails(instance.liveStatus?.state);
            return (
              <button
                key={instance.id}
                type="button"
                className="glass-panel"
                style={{
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  borderLeft: `3px solid ${details.color}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'inherit',
                  font: 'inherit',
                }}
                onClick={() => setSelectedInstance(instance)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: 'var(--primary-alpha)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: details.color,
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{instance.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID {instance.id}</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    backgroundColor: 'var(--surface)',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 650, color: details.color }}>{details.label}</span>
                </div>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Abrir: QR, teste e logout
                </span>
              </button>
            );
          })}
          {instances.length === 0 && !loading && (
            <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              Nenhuma instância ainda. Crie a primeira para escanear o QR.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
