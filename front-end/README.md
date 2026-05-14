# Feed-Agent Enterprise: Portal de Disparos Corporativos & WhatsApp Hub
Versão: 2026.5 (Enterprise Release)

Este é o repositório front-end do sistema **Feed-Agent**, construído com **React 19**, **TypeScript** e **Vite 8**, oferecendo uma interface rica em *glassmorphism*, modo escuro nativo e altíssima responsividade.

## 📦 Módulos Ativos do Sistema

- **`/dashboard`**: Painel Central Analítico com estatísticas em tempo real, gráficos de engajamento e métricas de funil.
- **`/whatsapp`**: WhatsApp Hub com conexão WebSocket criptografada, leitor de QR Code para múltiplos aparelhos e monitoramento de *rate limit*.
- **`/contacts`**: Gestão avançada de contatos com segmentação inteligente e importação/exportação CSV RFC 4180.
- **`/ocr`**: Leitor e Ingestão OCR com motor Tesseract V5 para conversão automatizada de Diários Oficiais e PDFs brutos.
- **`/drafts`**: Studio de Rascunhos e Minutas com editor *rich-text* avançado, pré-visualização de *mockup* de celular e central de revisão.
- **`/broadcast`**: Fila de Disparos com controle antispam dinâmico, terminal de logs SSE ao vivo, relatórios históricos e central de retentativas.
- **`/audit`**: Console de Monitoramento de Logs do Servidor (Syslog) com buscas avançadas via expressões regulares (Regex) e exportação JSON.
- **`/telemetry`**: Dashboard Gráfico de Recursos e Containers com monitoramento de memória Heap Node.js, vCPU e latência de APIs.
- **`/api-keys`**: Gestão de Chaves de API e Tokens Estáticos JWT para comunicação externa e *webhooks*.
- **`/help`**: Central de Ajuda Interativa, FAQ Operacional e Validação E2E de Segurança de Cookies e CSP.
- **`/settings`**: Painel Geral de Configurações do Sistema e Infraestrutura de Armazenamento/Redis.

---

## 🚀 Guia de Build & Deploy em Produção

### 1. Requisitos do Servidor
- Node.js v22+
- Nginx Ingress Controller ou Apache HTTPD
- Suporte a conexões WebSockets seguras (WSS)

### 2. Transpilação e Minificação
Para executar a verificação estrita de tipagem e compilar o pacote de produção minificado:
```bash
npm run build
```
O pacote estático otimizado será gerado no diretório `/dist`.

### 3. Configuração Nginx Recomendada
```nginx
server {
    listen 443 ssl http2;
    server_name feedagent.com.br;

    ssl_certificate /etc/letsencrypt/live/feedagent/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/feedagent/privkey.pem;

    # Proteções Estritas de Cabeçalho (XSS, Clickjacking, CSP)
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Content-Security-Policy "default-src 'self' https: wss:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Proxy para Back-end e WebSockets
    location /api/ {
        proxy_pass http://backend_cluster:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🛡️ Políticas de Segurança e Blindagem
A aplicação adota estritas regras de blindagem no lado do cliente:
- **Cookies de Autenticação**: Exclusivamente configurados com `SameSite=Strict; Secure`.
- **Prevenção de XSS**: Uso da biblioteca `DOMPurify` para sanitização de todas as minutas brutas de texto e HTML.
- **Monitoramento de Sessão**: Temporizador corporativo de inatividade integrado com renovação assíncrona de tokens JWT.
