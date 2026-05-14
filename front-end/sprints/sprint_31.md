---
sprint_number: 31
phase: "Gerenciamento de Minutas (Draft Studio)"
title: "Quadro de Minutas Kanban por Status"
---

# Sprint 31: Quadro de Minutas Kanban por Status
## 📑 Fase: Gerenciamento de Minutas (Draft Studio)

### 🎯 Objetivo Principal
Desenvolver uma visão visual moderna estilo Kanban (Trello-like) organizando as minutas geradas nos status PENDING, APPROVED, REJECTED e CANCELLED.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Visualização das colunas de status de minutas em painel Kanban**
- **Mini-cards com cabeçalho contendo dados de criação de data e origem**
- **Indicadores coloridos com base nos status de visualização**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como editor de conteúdo, quero ver uma visão geral das minutas pendentes separadas das aprovadas para priorizar minhas revisões diárias.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------------------+
|  Minutas (Drafts)                                                 |
|  +-----------------+  +-----------------+  +-----------------+    |
|  | PENDENTES (3)   |  | APROVADAS (12)  |  | CANCELADAS (2)  |    |
|  | [Card: Notícia] |  | [Card: Outra ]  |  | [Card: Velha ]  |    |
|  +-----------------+  +-----------------+  +-----------------+    |
+-------------------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// src/pages/DraftsKanban.tsx
// Lista minutas vindas da API agrupadas por status
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Desenvolver estrutura visual das colunas de status Kanban
- [ ] **Implementação:** Codificar cartões compactos de minutas com badge de prioridade
- [ ] **Implementação:** Configurar clique reativo no card para abrir o detalhe do editor
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
