# RELATÓRIO 0.1.4 — Nova identidade visual ZapBusiness (monograma ZB oficial)

**Marco:** Milestone 0.1.4 (vetorização fiel)  
**Branch:** `Front`  
**Fonte de verdade:** `front-end/src/assets/brand/reference-official.png`  
**Método:** traço da silhueta oficial → SVG fill + gradiente amostrado + acabamento de dobra

---

## Princípio

A imagem anexada é a **identidade oficial**, não inspiração.  
O SVG reproduz a mesma geometria (Z, B, encaixe, inclinação, curvas, espessuras).  
Sem novo conceito, sem balões, sem raios, sem “by LCM” na marca.

---

## Assets gerados

### Símbolos e logos (`front-end/src/assets/brand/`)

| Arquivo | Descrição |
|---------|-----------|
| `zb-symbol.svg` | Símbolo oficial (fundo navy + ZB) |
| `zb-symbol-dark.svg` | Versão escura (app icon) |
| `zb-symbol-light.svg` | Símbolo sem fundo (temas claros / overlays) |
| `zb-horizontal.svg` | Logo horizontal ZapBusiness |
| `zb-vertical.svg` | Logo vertical ZapBusiness |
| `zb-monogram.svg` | Monograma sem fundo |
| `app-icon-{128,192,256,512}.png` | App icons raster |
| `reference-official.png` | Referência oficial commitada |

### Públicos (`front-end/public/`)

| Arquivo | Uso |
|---------|-----|
| `favicon.svg` / `favicon.ico` | Favicon |
| `favicon-{16,32,48,64}.png` | Favicon PNG |
| `app-icon-{128,192,256,512}.png` | App icons |
| `apple-touch-icon.png` | Apple (180) |
| `pwa-*` / `android-chrome-*` | PWA / Android |
| `manifest.webmanifest` | Manifest |

### Regeneração

```bash
cd front-end
npm run generate:brand
```

Script: `scripts/build-zb-official.mjs` (sharp + imagetracerjs + Playwright).

---

## Locais substituídos

| Superfície | Integração |
|------------|------------|
| Sidebar | `BrandMark` → `zb-symbol.svg` |
| Login | `BrandMark` |
| Splash / Loading | `StateViews` → `zb-symbol.svg` |
| Header / Document title | `BRAND` / `useDocumentBrand` |
| Favicon / PWA / Apple / Android | `index.html` + `manifest.webmanifest` + `public/*` |
| Copyright | Somente `BrandCopyright` / rodapé LCM |

Wordmark UI: **Zap** `#FFFFFF` (dark) / **Business** azul da identidade. Sem subtítulo.

---

## Validação visual

Comparação lado a lado referência × SVG: geometria, proporção, encaixe Z+B e leitura preservados.  
Diferenças esperadas: arestas vetoriais nítidas vs. raster suave; gradiente vetorial limpo.

Testes: typecheck, lint, vitest, build.

---

## Arquivos principais alterados

- `scripts/build-zb-official.mjs`
- `src/assets/brand/zb-*.svg` + rasters + `reference-official.png`
- `public/favicon*` / `app-icon-*` / PWA / manifest
- `BrandMark.tsx`, `StateViews.tsx`, `index.css`, `brand.ts`, `index.html`
- `package.json` (deps: `sharp`, `imagetracerjs`)

**Não alterados:** backend, API, QR, WhatsApp, lógica de negócio.

---

## Commit

```
feat(brand): vetoriza monograma oficial ZB do ZapBusiness
```
