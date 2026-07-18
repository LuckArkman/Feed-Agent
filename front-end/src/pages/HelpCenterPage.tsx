import React, { useMemo, useState } from 'react';
import { BookOpen, Search, ChevronDown, ChevronUp, Download, HelpCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { showToast } from '@/utils/toastHelper';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'WhatsApp',
    question: 'Como conectar o celular?',
    answer:
      'Abra WhatsApp → Aparelhos conectados → Conectar um aparelho. No Feed-Agent, vá em WhatsApp, abra a instância e escaneie o QR. O status chega em tempo real via SSE (Server-Sent Events).',
  },
  {
    id: 'faq-2',
    category: 'Disparos',
    question: 'Como reduzir risco de bloqueio?',
    answer:
      'O backend envia com concorrência 1 e pausas aleatórias entre mensagens. Evite lotes enormes em números novos; mantenha a lista limpa (contatos inválidos são desativados automaticamente).',
  },
  {
    id: 'faq-3',
    category: 'OCR & Minutas',
    question: 'Como gerar uma minuta a partir de PDF ou imagem?',
    answer:
      'Em Leitor OCR, envie o arquivo. O servidor faz OCR (Tesseract) e gera a minuta com o modelo local. Revise em Minutas, aprove e dispare.',
  },
  {
    id: 'faq-4',
    category: 'Contatos',
    question: 'Como importar a base?',
    answer:
      'Em Contatos, use a importação CSV com colunas name e phoneNumber. Números inválidos ou duplicados são ignorados; o retorno mostra importados e ignorados.',
  },
  {
    id: 'faq-5',
    category: 'Conta',
    question: 'Onde altero tema e preferências?',
    answer:
      'Use o ícone de sol/lua no topo para o tema. Em Preferências você salva um apelido local neste navegador. Segredos de servidor (JWT, Redis) não são editados pelo painel.',
  },
];

const QUICK_GUIDE = `# Feed-Agent — guia rápido

## Fluxo
1. Conectar WhatsApp (QR)
2. Importar contatos (CSV)
3. Gerar minuta (OCR)
4. Revisar e aprovar em Minutas
5. Acompanhar em Disparos

## Frontend
- npm run dev
- npm run build

## API
Configure VITE_API_URL apontando para o backend (padrão http://localhost:3000/api).
`;

export const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const filteredFaq = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATA;
    const q = searchQuery.toLowerCase();
    return FAQ_DATA.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const downloadGuide = () => {
    const blob = new Blob([QUICK_GUIDE], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FeedAgent_Guia_Rapido.md';
    link.click();
    URL.revokeObjectURL(url);
    showToast.success('Guia baixado.');
  };

  return (
    <div className="page-stack">
      <div className="page-hero">
        <div className="page-hero-copy">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={28} style={{ color: 'var(--primary)' }} />
            Ajuda
          </h1>
          <p>Perguntas frequentes do fluxo real: WhatsApp, OCR, minutas e disparos.</p>
        </div>
        <Button variant="secondary" icon={Download} onClick={downloadGuide}>
          Baixar guia
        </Button>
      </div>

      <div className="glass-panel" style={{ padding: 20 }}>
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            className="form-input"
            style={{ paddingLeft: 40 }}
            placeholder="Buscar no FAQ…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredFaq.map((item) => {
          const open = expandedId === item.id;
          return (
            <div key={item.id} className="glass-panel" style={{ overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setExpandedId(open ? null : item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 18px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--text-main)',
                }}
              >
                <HelpCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Badge variant="neutral">{item.category}</Badge>
                  <div style={{ marginTop: 6, fontWeight: 650, fontFamily: 'var(--font-heading)' }}>{item.question}</div>
                </div>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {open && (
                <div style={{ padding: '0 18px 18px 48px', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.55 }}>
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
        {filteredFaq.length === 0 && (
          <div className="glass-panel" style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum resultado para “{searchQuery}”.
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenterPage;
