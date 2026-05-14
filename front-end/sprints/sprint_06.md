---
sprint_number: 6
phase: "Gerenciamento de Estado & Conectividade"
title: "Configuração do Cliente HTTP (Axios) e Interceptadores de Autenticação"
---

# Sprint 6: Configuração do Cliente HTTP (Axios) e Interceptadores de Autenticação
## 📑 Fase: Gerenciamento de Estado & Conectividade

### 🎯 Objetivo Principal
Desenvolver uma camada resiliente para comunicações HTTP, injetando automaticamente cabeçalhos JWT, tratando expirações de token de forma centralizada e interceptando respostas de erro de servidor.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Configuração da instância global do Axios com baseURL a partir do .env**
- **Interceptor de Request para injetar cabeçalho 'Authorization: Bearer <token>'**
- **Interceptor de Response para capturar erros 401 (não autorizado) e deslogar usuário automaticamente**
- **Abstração de métodos de API (get, post, put, delete) com tipagem forte**
- **Injeção de cabeçalhos de segurança customizados e tratamento de timeout**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como administrador, quero que minha sessão expire com segurança sem vazamento de dados caso eu passe muito tempo inativo.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:
- `axios`

---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Axios Interceptor Interception Loop                  |
+-------------------------------------------------------+
|   Outbound Request ---> Injeta Bearer Token em Header |
|                                                       |
|   Inbound Response <--- Se 401: Dispare Logout        |
|                    <--- Se 429: Exiba Aviso Rate Limit|
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// src/services/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar arquivo de configuração apiClient.ts e configurar URL base
- [ ] **Implementação:** Adicionar interceptor de request para ler token JWT do localStorage
- [ ] **Implementação:** Adicionar interceptor de response para interceptar erros HTTP genéricos
- [ ] **Implementação:** Definição de tipos TypeScript genéricos para respostas padrão da API
- [ ] **Implementação:** Escrever testes unitários mockando o Axios para garantir o fluxo de login expirado
- [ ] **Testes de Unidade/Integração:** Validar se os componentes respondem de forma correta a interações e feedbacks de erro.
- [ ] **Garantia de Acessibilidade & Responsividade:** Validar em diferentes tamanhos de tela.

---

### 🏁 Critérios de Aceite (Definition of Done - DoD)
1. **Compilação sem Erros:** O código transpile de TypeScript para JavaScript de produção sem emitir nenhum erro do compilador (`tsc`).
2. **Qualidade de Código:** Sem alertas ou violações das regras do ESLint ou Prettier.
3. **Validação de Feedback:** Toasts de aviso, alertas ou modais exibindo mensagens apropriadas em caso de sucesso ou falhas HTTP de rede.
4. **Responsividade:** Layout testado em resoluções mobile, tablet e desktop.
5. **Revisão:** Código livre de placeholders, mockings desnecessários de produção e segredos de chaves API expostos.

---
