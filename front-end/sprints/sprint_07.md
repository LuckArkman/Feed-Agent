---
sprint_number: 7
phase: "Gerenciamento de Estado & Conectividade"
title: "Integração do React Query (TanStack Query) e Motor de Toasts"
---

# Sprint 7: Integração do React Query (TanStack Query) e Motor de Toasts
## 📑 Fase: Gerenciamento de Estado & Conectividade

### 🎯 Objetivo Principal
Implementar cache dinâmico de dados, re-fetch inteligente em segundo plano e motor global de notificações para feedback instantâneo de transações de rede.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Setup do QueryClientProvider com configurações padrões otimizadas (refetchOnWindowFocus desativado em dev)**
- **Configuração do React Hot Toast ou React Toastify com tema dark/glassmorphic**
- **Criação de wrappers utilitários para exibir toasts de erro com base no payload retornado da API**
- **Criação de custom hooks básicos para queries e mutations recorrentes**
- **Instalação e ativação do React Query Devtools em ambiente de desenvolvimento**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como usuário, quero receber notificações visuais elegantes e discretas no topo da tela sempre que salvar dados, alterar o status de um contato ou disparar disparos de mensagens.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:
- `@tanstack/react-query`
- `@tanstack/react-query-devtools`
- `react-hot-toast`

---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Notification System & Cache Engine                   |
+-------------------------------------------------------+
|  [Toast: (v) Contato salvo com sucesso!]              |
|                                                       |
|  Stale-While-Revalidate Cycle:                        |
|  Exibe cache local imediatamente -> Re-fetch em BG    |
|  -> Atualiza UI silenciosamente.                      |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// src/index.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <Toaster position="top-right" toastOptions={{ className: 'glass-toast' }} />
  </QueryClientProvider>
);
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Instalar dependências do TanStack Query e react-hot-toast
- [ ] **Implementação:** Configurar QueryClient global e envolver a aplicação no arquivo principal
- [ ] **Implementação:** Customizar os estilos padrão de toasts para alinhar com o design system
- [ ] **Implementação:** Implementar um manipulador global de erros do React Query para traduzir payloads de falhas do Prisma ou Express
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
