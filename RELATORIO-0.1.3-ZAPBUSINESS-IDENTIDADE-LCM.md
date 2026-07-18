# RELATÓRIO 0.1.3 — Identidade Visual LCM e Rebranding ZapBusiness

**Projeto:** Feed-Agent (repositório) → produto **ZapBusiness by LCM**  
**Branch:** `Front`  
**Base:** sobre `6154cc7` (0.1.2) e histórico `c813f17` (0.1.1)  
**Data:** 18/07/2026  
**Escopo:** exclusivamente front-end (`front-end/`)

---

## 1. Resumo executivo

O aplicativo passou a apresentar a marca **ZapBusiness** com assinatura **ZapBusiness by LCM** e copyright **LCM Enterprise Ltda.** Identidade visual premium (navy + azul + ciano), tipografia Plus Jakarta Sans, assets provisórios substituíveis, metadados/PWA atualizados, nomenclatura empresarial na navegação e copyright dinâmico. Lógica de autenticação, WhatsApp, filas e disparos **não** foi alterada. Backend intacto.

**Identidade de logo:** provisória (tipografia + símbolo abstrato de fluxo). Substituível em `src/assets/brand/` e `public/` sem mudança estrutural.

---

## 2. Estado prévio da branch

| Item | Valor |
|------|--------|
| Branch | `Front` |
| Working tree | limpo antes do início |
| Commits locais preservados | `c813f17`, `6154cc7` (não resetados/rebased) |
| Baseline lint/typecheck/test/build | todos OK |

---

## 3. Identidade adotada

| Campo | Valor |
|-------|--------|
| Produto | ZapBusiness |
| Empresa | LCM Enterprise Ltda. |
| Assinatura | ZapBusiness by LCM |
| Tagline | Automação inteligente para comunicação empresarial |
| Fonte canônica | `src/config/brand.ts` |

---

## 4. Paleta final (tokens)

Consolidados em `src/index.css` (`--lcm-*` + mapeamento para tokens de app):

- Navy: `--lcm-navy-950/900/850`
- Azul: `--lcm-blue-700/600/500` → `--primary`
- Ciano: `--lcm-cyan-500/400` → destaque / `--accent`
- Surfaces: `--lcm-surface-1/2/3`
- Texto: `--lcm-text-primary/secondary/muted`
- Semântica: success / warning / error apenas nestes papéis

Tema padrão do shell: **dark** (LCM premium). Tema claro permanece como variante corporativa.

Documentação: `front-end/docs/TOKENS.md`

---

## 5. Tipografia

- Família única: **Plus Jakarta Sans**
- Escala: `--type-display`, `--type-h1` … `--type-caption`

---

## 6. Assets

### Criados / substituídos

| Asset | Local |
|-------|--------|
| Símbolo provisório | `src/assets/brand/zapbusiness-symbol.svg` |
| Logo horizontal | `src/assets/brand/zapbusiness-logo.svg` |
| Mono light/dark | `zapbusiness-logo-light.svg`, `zapbusiness-logo-dark.svg` |
| Assinatura LCM | `src/assets/brand/lcm-signature.svg` |
| Favicon | `public/favicon.svg` |
| PWA 192/512 | `public/pwa-*.svg` |
| Apple touch | `public/apple-touch-icon.svg` |
| Manifest | `public/manifest.webmanifest` |

### Ainda necessários (oficiais)

- Logo horizontal oficial ZapBusiness by LCM (SVG/PNG)
- Símbolo oficial
- Versões mono oficiais
- Favicon/.ico e PNGs PWA raster se exigidos por lojas

---

## 7. Componentes e superfícies alterados

| Área | Mudança |
|------|---------|
| `BrandMark` / `BrandCopyright` | Novos |
| `useDocumentBrand` | Meta title/description/theme-color |
| Sidebar | Marca + by LCM + copyright |
| Login | Layout LCM, CTA, show/hide senha, copyright |
| Header | Títulos NAV + status “Canal …” |
| Dashboard | Visão geral / primeiros passos |
| Help | FAQ + disclaimer Meta |
| Settings / OCR / Conteúdos / Campanhas / Conexão | Rótulos UI |
| `StateViews` Loading | Splash com símbolo |
| `index.html` + PWA | Metadados |

---

## 8. Nomenclatura (UI × rotas)

| Antigo (UI) | Novo (UI) | Rota (inalterada) |
|-------------|-----------|-------------------|
| Painel | Visão geral | `/dashboard` |
| WhatsApp | Conexão | `/whatsapp` |
| Leitor OCR | Leitor inteligente | `/ocr` |
| Minutas | Conteúdos | `/drafts` |
| Disparos | Campanhas | `/broadcast` |
| Ajuda | Central de ajuda | `/help` |
| Preferências | Configurações | `/settings` |

---

## 9. Ocorrências técnicas do nome antigo (mantidas)

| Tipo | Exemplos | Classificação |
|------|----------|---------------|
| localStorage | `feedagent-session`, `feedagent-theme`, `feedagent-auth-storage`, `feedagent-preferences-storage`, `feedagent-display-hint` | Necessária / compatibilidade |
| Testes | `admin@feedagent.local` (dado mock) | Legado interno de teste |
| Stub API keys | URL `feedagent.com.br` em página stub | Legado interno documentado |
| Pasta/repo | `Feed-Agent` | Legado de repositório |
| `sprints/*.md` | histórico de sprints | Legado documental (não UI) |

**Nenhuma ocorrência “Feed-Agent” permanece visível ao usuário final na UI.**

---

## 10. Copyright e disclaimer

- `brandCopyright(year)` com `new Date().getFullYear()`
- Exibido em sidebar, login e Central de ajuda
- Disclaimer de não afiliação Meta apenas em Ajuda

---

## 11. Testes

- Suíte atualizada + `brand.test.tsx`
- **20 testes** passando (6 arquivos)
- Cobrem marca no login, sidebar, copyright dinâmico, status acessível, ausência de credenciais demo em UI

---

## 12. Checks

| Check | Resultado |
|-------|-----------|
| `npm run lint` | OK (0 erros / 0 warnings) |
| `npm run typecheck` | OK |
| `npm run test:run` | OK (20/20) |
| `npm run build` | OK |

---

## 13. Evidência funcional

- `git diff -- back-end` vazio
- Endpoints, payloads, auth store (comportamento), filas e integração de canal preservados
- Rotas internas inalteradas

---

## 14. Pendências de branding

1. Substituir assets provisórios pelos oficiais LCM.  
2. Opcional: migrar chaves `feedagent-*` do localStorage com migração one-shot.  
3. Revisar copy residual de “disparo/minuta” em toasts internos de páginas monolíticas (não bloqueante).  
4. Ícone `.ico` raster se necessário para clientes legados.  
5. Validação visual humana em todos os breakpoints listados na milestone.

---

## 15. Commit

Mensagem: `feat(brand): transforma Feed-Agent em ZapBusiness by LCM`  
Sem push / merge / deploy.
