# HOTFIX 0.1.3B — Reconstrução do modal de Conexão

**Branch:** `Front`  
**Data:** 18/07/2026

---

## Causa raiz

1. **`WhatsAppInstanceModal` não usava portal** — o overlay era filho de `WhatsAppHub` → `Outlet` → `.main-viewport-wrapper` (`overflow-y: auto`), competindo com o scroll do shell.
2. **CSS destrutivo da Hotfix 0.1.3A:** em `@media (max-width: 768px)` o overlay usava `align-items: flex-end`. Com dialog mais alto que o viewport, o **topo (título + X) era empurrado para fora da área visível**.
3. Overlay com `overflow: hidden` impedia recuperar o header cortado.
4. Em ≤480px, `height: 100%` + `align-items: stretch` agravava o corte.

Não era “falta de z-index” nem necessidade de `translateY`.

---

## Correção estrutural

| Antes | Depois |
|-------|--------|
| Markup próprio + `ui-modal*` | `ResponsiveModal` único |
| Render no árvore da página | `createPortal(..., document.body)` |
| `align-items: flex-end` / `height: 100%` | `display: grid; place-items: center` + `max-height: calc(100dvh - …)` |
| Header dentro de fluxo frágil | Grid: `auto minmax(0,1fr) auto` — só `.modal-body` rola |

Arquivos principais:
- `src/components/ResponsiveModal.tsx`
- `src/pages/WhatsAppInstanceModal.tsx`
- `src/styles/modal.css` (novo; CSS antigo de `connect-sheet` / patches removido de `index.css`)

### CSS removido / eliminado

- `.connect-sheet*` (bloco completo)
- `@media` com `align-items: flex-end` no overlay
- `height: 100%` no dialog mobile
- overrides `.ui-modal--sheet` e `.ui-modal__footer .btn` nos media queries
- remendos de `overflow: hidden` no overlay que escondiam o corte

---

## Marca

- Logo / sidebar: somente **ZapBusiness** (sem “by LCM”).
- Copyright: `© {ano} LCM Enterprise Ltda. Todos os direitos reservados.`
- `BRAND.signature` permanece só como constante interna (não renderizada por padrão).

---

## Validação no navegador (Playwright + Chromium)

Script: `node scripts/validate-connection-modal.mjs`  
Fixture: `public/modal-fixture.html` (mesmas classes CSS do modal de produção)

| Viewport | Header visível | Dialog ≤ viewport |
|----------|----------------|-------------------|
| 1920×1080 | OK | OK |
| 1440×900 | OK | OK |
| **1366×768** | **OK** (headerTop=24) | **OK** (dialogH=720) |
| 1280×720 | OK | OK |
| 1024×768 | OK | OK |
| 768×1024 | OK | OK |
| 430×932 | OK | OK |
| 390×844 | OK | OK |
| 360×800 | OK | OK |
| **320×568** | **OK** (headerTop=8) | **OK** (dialogH=552) |

Zoom 100/125/150/200% em 1366×768 e 320×568: **OK**.

Evidência: título e botão “Fechar modal” com `getBoundingClientRect().top >= 0` e dentro de `innerHeight`.

---

## Testes automatizados

- Portal no `document.body`
- Header fora do elemento com overflow
- Título “Conectar canal” + “Fechar modal”
- Escape fecha
- Marca sem “by LCM”

**24 testes** passando.

---

## Checks

| Check | Resultado |
|-------|-----------|
| lint | OK |
| typecheck | OK |
| test:run | OK (24) |
| build | OK |
| Playwright viewports | OK |

---

## Pendências

- Validação visual com login real + QR live (requer backend/WhatsApp) — estrutura CSS já validada no Chromium.
- `apple-touch-icon.png` ainda é placeholder mínimo.
