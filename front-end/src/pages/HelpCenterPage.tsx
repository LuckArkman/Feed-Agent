import React, { useMemo, useState } from 'react';
import { BookOpen, Search, ChevronDown, ChevronUp, Download, HelpCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { BrandCopyright } from '@/components/BrandCopyright';
import { showToast } from '@/utils/toastHelper';
import { BRAND, NAV_LABELS } from '@/config/brand';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Conexão',
    question: 'Como conectar o canal?',
    answer: `Abra o aplicativo de mensagens no aparelho → Aparelhos conectados → Conectar um aparelho. No ${BRAND.productName}, vá em ${NAV_LABELS.whatsapp}, abra a instância e escaneie o QR. O status é atualizado em tempo real.`,
  },
  {
    id: 'faq-2',
    category: 'Campanhas',
    question: 'Como operar envios com mais segurança?',
    answer:
      'O sistema processa envios com cadência controlada e pausas entre mensagens. Prefira listas autorizadas e revisadas; contatos inválidos podem ser desativados automaticamente.',
  },
  {
    id: 'faq-3',
    category: 'Conteúdos',
    question: 'Como preparar um conteúdo a partir de PDF ou imagem?',
    answer: `Em ${NAV_LABELS.ocr}, envie o arquivo. O servidor extrai o texto e gera um rascunho. Revise em ${NAV_LABELS.drafts}, aprove e inicie a campanha.`,
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
    question: 'Onde altero tema e configurações?',
    answer: `Use o ícone de sol/lua no topo para o tema. Em ${NAV_LABELS.settings} você salva um apelido local neste navegador. Segredos de servidor não são editados pelo painel.`,
  },
];

const QUICK_GUIDE = `# ${BRAND.signature} — guia rápido

## Fluxo
1. Conectar canal (QR)
2. Importar contatos (CSV)
3. Preparar conteúdo (leitor inteligente)
4. Revisar e aprovar em Conteúdos
5. Acompanhar em Campanhas

## Frontend
- npm run dev
- npm run build

## API
Configure VITE_API_URL apontando para o backend.
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
    link.download = 'ZapBusiness_Guia_Rapido.md';
    link.click();
    URL.revokeObjectURL(url);
    showToast.success('Guia baixado.');
  };

  return (
    <div className="page-stack">
      <div className="page-hero">
        <div className="page-hero-copy">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={28} style={{ color: 'var(--primary)' }} aria-hidden />
            {NAV_LABELS.help}
          </h1>
          <p>
            Orientação para conexão, contatos, conteúdos e campanhas no {BRAND.productName}.
          </p>
        </div>
        <Button variant="secondary" icon={Download} onClick={downloadGuide}>
          Baixar guia
        </Button>
      </div>

      <div className="glass-panel" style={{ padding: 20 }}>
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <Search
            size={18}
            aria-hidden
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            className="form-input"
            style={{ paddingLeft: 40 }}
            placeholder="Buscar no FAQ…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar no FAQ"
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
                <HelpCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} aria-hidden />
                <div style={{ flex: 1 }}>
                  <Badge variant="neutral">{item.category}</Badge>
                  <div style={{ marginTop: 6, fontWeight: 650, fontFamily: 'var(--font-heading)' }}>{item.question}</div>
                </div>
                {open ? <ChevronUp size={18} aria-hidden /> : <ChevronDown size={18} aria-hidden />}
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

      <aside className="glass-panel brand-disclaimer" style={{ padding: 20 }}>
        <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 8 }}>Sobre a integração</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: 12 }}>
          {BRAND.integrationDisclaimer}
        </p>
        <BrandCopyright showSolutionLine />
      </aside>
    </div>
  );
};

export default HelpCenterPage;
