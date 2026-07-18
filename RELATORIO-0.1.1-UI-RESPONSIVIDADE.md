# RELATÓRIO 0.1.1 — UI, Responsividade e Consistência Visual

**Projeto:** Feed-Agent  
**Branch:** `Front`  
**Data:** 18/07/2026  
**Escopo:** exclusivamente front-end (`front-end/`)

---

## 1. Resumo executivo

Foi concluída a auditoria e correção da interface do Feed-Agent com foco em responsividade (320px–1920px), prevenção de scroll horizontal no `body`, shell (sidebar/header/drawer), grids fluidos, modais com viewport constraints, tabela de contatos adaptativa (cards no mobile), estados de painel, e acessibilidade básica (aria-labels, focus-visible, Escape, lock de scroll no menu).

**Não foram alterados:** contratos de API, lógica de disparo BullMQ, integração Baileys/SSE de envio, nem código do `back-end/`.

---

## 2. Problemas encontrados (principais)

| Problema | Causa | Correção |
|----------|--------|----------|
| Scroll horizontal / `100vw` | Largura de viewport inclui scrollbar; shell com `100vw` | `width: 100%`, `overflow-x: clip` em `html`/`body`/shell |
| Grids quebrando em mobile | `minmax(400px\|450px\|500px, 1fr)` força overflow | `minmax(min(100%, …), 1fr)`, classes `.responsive-grid` / `.split-pane` |
| Modais maiores que a tela | `maxWidth` fixo alto (1250–1450px), overlay sem clamp | `ui-modal` com `max-height: min(92vh, …)`, `width: min(100%, …)` |
| QR / WhatsApp modal pouco usável | Layout 2 colunas fixas, texto técnico, cores `white` | Modal responsivo + copy amigável + Escape |
| Tabela Contatos no mobile | Tabela desktop espremida | `.contacts-desktop-table` + `.contact-mobile-list` cards |
| Menu mobile sem lock de scroll | Body continuava rolando | `body.menu-open { overflow: hidden }` + Escape |
| Tokens espalhados | Valores ad hoc em páginas | Tokens `--page-pad`, `--content-max`, `--z-*`, `--touch-min` |
| Hierarquia / a11y incompleta | Título do header como heading duplicado; botões sem nome | Header como texto; `aria-label` / `aria-current` / focus-visible |
| Alertas com texto longo | Sem `overflow-wrap` | `.alert-message` com wrap |

---

## 3. Arquivos alterados

### Criados
- `front-end/src/components/StatePanel.tsx`
- `RELATORIO-0.1.1-UI-RESPONSIVIDADE.md` (este arquivo)

### Refatorados / ajustados
- `front-end/src/index.css` — tokens, shell, utilitários responsivos, modais, tabelas, estados
- `front-end/src/styles/login.css` — remove `100vw`
- `front-end/src/layouts/MainLayout.tsx` — drawer a11y, offline banner, modal de sessão
- `front-end/src/layouts/Header.tsx` — truncate, dropdown fora/Escape, aria
- `front-end/src/layouts/Sidebar.tsx` — aria-current, labels
- `front-end/src/components/Alert.tsx` — aria em PT
- `front-end/src/pages/Dashboard.tsx` — estados loading/erro, grids
- `front-end/src/pages/WhatsAppHub.tsx` — lint catch
- `front-end/src/pages/WhatsAppInstanceModal.tsx` — UI responsiva + mensagens amigáveis
- `front-end/src/pages/Contacts.tsx` — tabela + cards mobile + paginação
- `front-end/src/pages/BroadcastQueue.tsx` — grids/tabela scroll (sem mudar lógica de envio)
- `front-end/src/pages/DraftsStudio.tsx` — modais/grids
- `front-end/src/pages/OcrReader.tsx` — modais/grids

---

## 4. Componentes

| Tipo | Nome | Função |
|------|------|--------|
| Novo | `StatePanel` | Empty / error / loading reutilizável |
| CSS system | `.ui-modal*`, `.table-scroll`, `.responsive-grid`, `.split-pane`, `.qr-frame`, `.contact-mobile-*`, `.stack-actions`, `.truncate` | Padrões de layout |

---

## 5. Breakpoints adotados

Estratégia **mobile-first / fluid** (não estilos “só para uma resolução”):

| Token / media | Largura |
|---------------|---------|
| base | fluid |
| `@media (max-width: 900px)` | split-pane → 1 coluna |
| `@media (max-width: 768px)` | drawer, tabela→cards, padding reduzido |
| `@media (max-width: 480px)` | stats/quick-actions 1 coluna, status compacto |
| `@media (max-width: 360px)` | padding mínimo |
| `@media (min-width: 1440px)` / `1920px` | `--content-max` maior |

Validação manual alvo: 1920, 1440, 1366, 1280, 1024, 768, 480, 390, 360, 320.

---

## 6. Decisões de responsividade

1. Conteúdo limitado por `--content-max` (não estica infinito em ultrawide).
2. Flex/grid com `min-width: 0` e `minmax(min(100%, Npx), 1fr)`.
3. Scroll horizontal **apenas** dentro de `.table-scroll`, nunca no `body`.
4. Sidebar desktop sticky; mobile = overlay drawer com fechamento por rota/fora/Escape.
5. Modais: header/footer fixos, body com scroll interno.
6. Contatos: tabela ≥768px; cards &lt;768px.

---

## 7. Rotas revisadas

`/login`, `/register`, `/forgot-password`, `/dashboard`, `/whatsapp`, `/contacts`, `/ocr`, `/drafts`, `/broadcast`, `/help`, `/settings`, `/profile` (shell + tokens; páginas stub removidas da nav em etapa anterior permanecem redirecionadas).

---

## 8. Testes executados

| Check | Comando | Resultado |
|-------|---------|-----------|
| Typecheck | `npx tsc -b` | **OK** (exit 0) |
| Build | `npm run build` | **OK** (exit 0); aviso de chunk &gt;500kB pré-existente |
| Lint (arquivos do milestone) | `eslint` layouts + Dashboard + WA modal/hub + Alert + StatePanel | **OK** |
| Lint (projeto inteiro) | `eslint src/**` | **Pendência:** ~40 erros pré-existentes em páginas legadas (any, hooks em OCR/Drafts/etc.) — fora do escopo de correção total sem reescrever páginas inteiras |
| Testes unitários FE | — | **N/A** — `package.json` do front não define script `test` |

### Evidência: lógica de disparo intacta
- Nenhuma alteração em `back-end/src/queues/broadcastQueue.ts`, `WhatsAppService.ts`, rotas de broadcast ou `test-message` além de UI do modal.
- Em `BroadcastQueue.tsx` apenas CSS/markup de layout (grids, cores de título, wrapper de tabela).

---

## 9. Validação visual (descrição)

- **Desktop 1440+:** painel com 3 stats, quick-actions em múltiplas colunas, sidebar expansível.
- **Tablet 768–1024:** drawer disponível; split-pane empilha; tabela Contatos ainda desktop até 768.
- **Mobile 360–480:** 1 coluna; cards de contatos; QR centralizado ≤70vw; botões de modal empilhados; sem scroll horizontal no body.

---

## 10. Pendências reais

1. ESLint global do front ainda falha por dívida em páginas grandes (OCR, Drafts, Broadcast, ForgotPassword, etc.).
2. Alguns estilos inline legados com `color: white` / fundos `#090d16` em OCR/Drafts/Broadcast — mitigados parcialmente; limpeza total exigiria refatoração maior.
3. Preview “celular” em Minutas ainda usa largura ~350px (aceitável em desktop; em mobile o split empilha).
4. Sem suite de testes automatizados de UI no front.
5. Modelo Llama ausente não afeta este milestone (UI only).

---

## 11. Commit

Mensagem planejada:

```
feat(ui): revisa responsividade e consistência visual do Feed-Agent
```

Sem push / merge / deploy.
