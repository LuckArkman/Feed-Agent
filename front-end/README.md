# ZapBusiness — Frontend

Portal web do **ZapBusiness**, solução de comunicação empresarial da **LCM Enterprise Ltda.**

Stack: React 19, TypeScript, Vite 8.

## Identidade

Configuração canônica da marca: `src/config/brand.ts`  
Assets provisórios: `src/assets/brand/` e `public/`

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test:run
npm run build
```

## Nota técnica

Chaves de `localStorage`, nomes de pacote e alguns identificadores internos ainda usam o prefixo legado `feedagent-*` por compatibilidade. Isso não aparece na interface.

## API

Configure `VITE_API_URL` apontando para o backend (ex.: `http://localhost:3001/api`).
