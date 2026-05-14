---
sprint_number: 5
phase: "Fundações & Arquitetura"
title: "Configuração do Roteamento (React Router v6), Guards e Error Boundary"
---

# Sprint 5: Configuração do Roteamento (React Router v6), Guards e Error Boundary
## 📑 Fase: Fundações & Arquitetura

### 🎯 Objetivo Principal
Implementar uma navegação de rotas sólida, segura contra acessos não autorizados de usuários deslogados, com transições visuais e tratamento gracioso de erros de runtime.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Estruturação de rotas usando React Router v6.x (createBrowserRouter)**
- **Criar Guard de Rota Protegida (Protected Route) que valida sessão de autenticação**
- **Criar Guard de Rota Pública que impede usuários já logados de ver a tela de login**
- **Página 404 customizada com estética dark glassmorphism e botão de retorno**
- **Componente ErrorBoundary para capturar falhas globais do React e exibir página amigável**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como usuário deslogado, quero ser redirecionado para a tela de login caso tente acessar '/dashboard'.

> [!NOTE]
> **User Story:**
> Como usuário logado, não quero conseguir navegar de volta para '/login' sem dar logout primeiro.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:
- `react-router-dom`

---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Protected Route Guard Flow                           |
+-------------------------------------------------------+
|   Route Request: /drafts                              |
|         |                                             |
|         v                                             |
|   Has valid JWT token?                                |
|    [ Sim ] ------------> Renderize Page               |
|    [ Não ] ------------> Redirect to /login           |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// src/routes/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: '', element: <Navigate to="/dashboard" replace /> }
    ]
  }
]);
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Instalar o react-router-dom e configurar o router provider na raiz do app
- [ ] **Implementação:** Implementar componente ProtectedRoute utilizando o estado de login
- [ ] **Implementação:** Configurar componente ErrorBoundary customizado para envolver o app
- [ ] **Implementação:** Criar animações simples de Fade-In para troca de páginas
- [ ] **Implementação:** Garantir que links inválidos caiam no elemento de captura de 404
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
