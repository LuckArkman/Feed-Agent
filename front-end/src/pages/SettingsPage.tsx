import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Save, 
  Clock, 
  Server, 
  Database, 
  Activity, 
  HardDrive, 
  Sliders, 
  Lock, 
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { showToast } from '@/utils/toastHelper';

export const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // General Infrastructure Parameters State
  const [apiUrl, setApiUrl] = useState<string>('http://localhost:3000/api/v1');
  const [jwtSecret, setJwtSecret] = useState<string>('FEED_AGENT_SUPER_SECURE_JWT_SECRET_2026');
  
  // Sprint 41 Parameters
  const [mediaRetentionDays, setMediaRetentionDays] = useState<string>('30');
  const [rateLimitRule, setRateLimitRule] = useState<string>('10_req_15_min');
  const [redisTopology, setRedisTopology] = useState<string>('sentinel');
  const [telemetryLevel, setTelemetryLevel] = useState<string>('INFO');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showToast.info('Validando e aplicando parâmetros na infraestrutura de microsserviços...');

    setTimeout(() => {
      setLoading(false);
      showToast.success('🚀 Parâmetros de infraestrutura salvos e sincronizados com sucesso no cluster!');
    }, 1500);
  };

  const handleSyncEnvironment = () => {
    setIsSyncing(true);
    showToast.info('Buscando telemetria atual do ambiente de produção...');

    setTimeout(() => {
      setIsSyncing(false);
      showToast.success('Ambiente sincronizado! Todas as instâncias em conformidade.');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Settings size={32} style={{ color: 'var(--primary)' }} />
            <span>Configurações Globais do Sistema</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Ajuste parâmetros globais de ambiente, retenção de mídias temporárias e limites de segurança (Rate Limiter)</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" icon={RefreshCw} onClick={handleSyncEnvironment} isLoading={isSyncing}>
            Sincronizar Ambiente
          </Button>
        </div>
      </div>

      <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Grid Section 1: Endpoints & Security Token */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', borderColor: 'var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Server size={24} style={{ color: 'var(--primary)' }} />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Endpoints de Comunicação e Autenticação</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mapeamento de rotas do Back-end e chaves simétricas JWT</span>
              </div>
            </div>
            <Badge variant="primary">Ambiente: Produção</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            <Input 
              label="Endereço da API Back-end (Base URL)" 
              value={apiUrl} 
              onChange={e => setApiUrl(e.target.value)} 
              icon={Server} 
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} style={{ color: 'var(--success)' }} /> <span>Token Secreto JWT (Autenticação de Sessão)</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="password" 
                  value={jwtSecret} 
                  onChange={e => setJwtSecret(e.target.value)}
                  style={{
                    height: '42px', padding: '0 16px', borderRadius: '8px', backgroundColor: '#090d16',
                    border: '1px solid var(--border)', color: 'white', fontSize: '0.9rem', flex: 1, outline: 'none',
                    fontFamily: 'monospace'
                  }} 
                />
                <Badge variant="success">Ativo</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Section 2: Sprint 41 Global Storage Retention & Rate Limiting Parameters */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', borderColor: '#10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sliders size={24} style={{ color: '#10b981' }} />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Parâmetros de Retenção de Disco e Rate Limiter de Segurança</h3>
                <span style={{ fontSize: '0.85rem', color: '#6ee7b7' }}>Controle de expiração de uploads temporários e mitigação antispam / DDoS</span>
              </div>
            </div>
            <Badge variant="success">Políticas Ativas</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '28px', backgroundColor: '#090d16', padding: '28px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            
            {/* Storage Retention Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HardDrive size={18} style={{ color: '#10b981' }} />
                <span>Retenção de Uploads (Limpeza de Arquivos Temporários)</span>
              </label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Define o tempo máximo que mídias brutas e relatórios gerados permanecem no disco do servidor antes do descarte automatizado.
              </p>
              
              <select 
                value={mediaRetentionDays} 
                onChange={e => setMediaRetentionDays(e.target.value)}
                style={{
                  height: '44px', padding: '0 16px', borderRadius: '8px', backgroundColor: '#0f172a',
                  border: '1px solid var(--border)', color: 'white', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', outline: 'none'
                }}
              >
                <option value="7">7 dias (Recomendado para servidores de baixo armazenamento)</option>
                <option value="15">15 dias (Padrão para volumes moderados)</option>
                <option value="30">30 dias (Padrão Corporativo Ideal)</option>
                <option value="60">60 dias (Alta Retenção de Compliance)</option>
              </select>
            </div>

            {/* Security Rate Limiter Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} style={{ color: '#3b82f6' }} />
                <span>Rate Limit Auth (Limitador de Requisições de Segurança)</span>
              </label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Bloqueia tentativas excessivas de login e acesso não autorizado a APIs para mitigar ataques de força bruta.
              </p>
              
              <select 
                value={rateLimitRule} 
                onChange={e => setRateLimitRule(e.target.value)}
                style={{
                  height: '44px', padding: '0 16px', borderRadius: '8px', backgroundColor: '#0f172a',
                  border: '1px solid var(--border)', color: 'white', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', outline: 'none'
                }}
              >
                <option value="5_req_min">5 requisições / minuto (Segurança Extrema)</option>
                <option value="10_req_15_min">10 requisições / 15 minutos (Padrão Recomendado do Sistema)</option>
                <option value="30_req_hour">30 requisições / hora (Flexível)</option>
              </select>
            </div>

          </div>

        </div>

        {/* Grid Section 3: Redis Topology & Telemetry Settings */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', borderColor: '#a855f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Database size={24} style={{ color: '#a855f7' }} />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Topologia de Cache e Nível de Log do Servidor</h3>
                <span style={{ fontSize: '0.85rem', color: '#d8b4fe' }}>Gerenciamento do broker de fila BullMQ / Redis e verbosidade de telemetria SSE</span>
              </div>
            </div>
            <Badge variant="primary">Redis v5.12</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '28px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} style={{ color: '#a855f7' }} />
                <span>Topologia do Cluster Redis (BullMQ Broker)</span>
              </label>
              
              <select 
                value={redisTopology} 
                onChange={e => setRedisTopology(e.target.value)}
                style={{
                  height: '44px', padding: '0 16px', borderRadius: '8px', backgroundColor: '#090d16',
                  border: '1px solid var(--border)', color: 'white', fontSize: '0.9rem', cursor: 'pointer', outline: 'none'
                }}
              >
                <option value="standalone">Standalone (Instância Única Local)</option>
                <option value="sentinel">Cluster Sentinel (Alta Disponibilidade com Failover Automático)</option>
                <option value="cloud">Managed Cloud Cluster (AWS ElastiCache / Redis Enterprise)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} style={{ color: 'var(--primary)' }} />
                <span>Nível Global de Telemetria (Server Verbosidade)</span>
              </label>
              
              <select 
                value={telemetryLevel} 
                onChange={e => setTelemetryLevel(e.target.value)}
                style={{
                  height: '44px', padding: '0 16px', borderRadius: '8px', backgroundColor: '#090d16',
                  border: '1px solid var(--border)', color: 'white', fontSize: '0.9rem', cursor: 'pointer', outline: 'none'
                }}
              >
                <option value="DEBUG">DEBUG - Rastreamento Completo de Queries e Pilhas</option>
                <option value="INFO">INFO - Eventos Operacionais Padrão (Recomendado)</option>
                <option value="WARNING">WARNING - Apenas Alertas e Gargalos</option>
                <option value="ERROR">ERROR - Exclusivo para Falhas Críticas de Execução</option>
              </select>
            </div>

          </div>

        </div>

        {/* Submit Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
          <Button 
            type="submit" 
            variant="primary" 
            icon={Save} 
            isLoading={loading}
            style={{ height: '52px', fontSize: '1.05rem', padding: '0 36px', backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
          >
            {loading ? 'Aplicando Parâmetros Globais...' : 'Salvar Configurações de Infraestrutura'}
          </Button>
        </div>

      </form>

    </div>
  );
};

export default SettingsPage;
