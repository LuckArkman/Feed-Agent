---
sprint_number: 4
phase: "Fundações & Arquitetura"
title: "Layout Shell responsivo (Sidebar, Header, Profile Menu e Theme Switcher)"
---

# Sprint 4: Layout Shell responsivo (Sidebar, Header, Profile Menu e Theme Switcher)
## 📑 Fase: Fundações & Arquitetura

### 🎯 Objetivo Principal
Construir a moldura estrutural da aplicação SaaS, contendo menus de navegação colapsáveis, barra de status, painel de perfil e chaveamento suave de temas.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Sidebar colapsável com transições suaves e estados ativos para links**
- **Header fixo com efeito blur glassmorphism, indicador de conexão e perfil**
- **Menu dropdown de perfil do usuário**
- **Chaveador de tema (Light/Dark) com micro-animação de rotação de ícones**
- **Gaveta lateral (Drawer) responsiva para dispositivos móveis**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como usuário de tablet/mobile, quero que a sidebar se recolha em um menu hambúrguer para que o conteúdo do sistema use toda a tela.

> [!NOTE]
> **User Story:**
> Como administrador, quero visualizar o status de conexão geral no header sem sair da tela de trabalho.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:
- `lucide-react`

---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| [=] FEED-AGENT  (Conn: Connected)   [Sun/Moon] [User V] |
+-------------------------------------------------------+
| (D) Dashboard |                                       |
| (W) WhatsApp  |  Dashboard / Home                     |
| (C) Contacts  |  +---------------------------------+  |
| (F) Files     |  | Welcome to Feed-Agent System    |  |
| (M) Drafts    |  +---------------------------------+  |
+---------------+---------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// src/layouts/MainLayout.tsx
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="app-shell">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="main-content-wrapper">
        <Header />
        <main className="content-container">{children}</main>
      </div>
    </div>
  );
};
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar componente Sidebar com links e lógica de colapso
- [ ] **Implementação:** Implementar Header contendo o botão do menu hambúrguer, avatar e chaveador de tema
- [ ] **Implementação:** Escrever lógica de persistência do modo escuro no localStorage e aplicação no tag html/body
- [ ] **Implementação:** Adicionar efeito backdrop-filter nos componentes fixos
- [ ] **Implementação:** Testar responsividade em resoluções de 320px até 2560px
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
