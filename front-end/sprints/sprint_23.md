---
sprint_number: 23
phase: "Gerenciamento de Contatos (Destinatários)"
title: "Operações em Lote nos Contatos (Bulk Actions)"
---

# Sprint 23: Operações em Lote nos Contatos (Bulk Actions)
## 📑 Fase: Gerenciamento de Contatos (Destinatários)

### 🎯 Objetivo Principal
Disponibilizar controles de lote para exclusão em massa, ativação em massa e desativação de múltiplos destinatários.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Checkboxes de seleção individual e cabeçalho para 'Selecionar Todos'**
- **Barra de ações flutuante contendo botões de ação em lote**
- **Modal de confirmação de exclusão contendo contagem de selecionados**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como administrador, quero desativar 50 contatos de uma única vez ao invés de abrir o editar de cada um deles.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  [x] 25 Contatos Selecionados                          |
|  [ Excluir Selecionados ] [ Ativar ] [ Desativar ] [x]|
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Bulk actions handler component
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar barra flutuante de lote reativa à quantidade de ids no estado de selecionados
- [ ] **Implementação:** Implementar lógica de exclusão em lote no React Query
- [ ] **Implementação:** Adicionar alertas de confirmação seguros contra acidentes de exclusão
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
