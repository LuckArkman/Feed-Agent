---
sprint_number: 22
phase: "Gerenciamento de Contatos (Destinatários)"
title: "Formulário de Cadastro/Edição de Contato com Máscaras e Sanidade"
---

# Sprint 22: Formulário de Cadastro/Edição de Contato com Máscaras e Sanidade
## 📑 Fase: Gerenciamento de Contatos (Destinatários)

### 🎯 Objetivo Principal
Implementar modal de formulário interativo de contatos com validações rigorosas de número de celular internacional.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Modal integrado de Adicionar / Editar contato**
- **Formatação e sanitização em tempo real do telefone de entrada**
- **Campos: Nome completo, Número, Ativo (Toggle Switch)**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como operador, quero que o sistema ajuste o número de telefone adicionado de forma correta para evitar erros de envio.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  [ Adicionar Novo Contato ]                           |
|  Nome Completo: [ Maria de Souza                   ]  |
|  Celular:       [ 55 (11) 98888-7777               ]  |
|  Status:        (x) Ativo                             |
|  [ Cancelar ]  [ SALVAR CONTATO ]                     |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Input sanitization functions in frontend
export const formatAndSanitize = (num: string): string => {
  return num.replace(/\D/g, ''); // Apenas números
};
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Codificar componente de Modal responsivo com animação de escalonamento
- [ ] **Implementação:** Implementar sanitização e formatação inline no input de telefone
- [ ] **Implementação:** Integrar com Mutation do React Query para POST / PUT /api/contacts
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
