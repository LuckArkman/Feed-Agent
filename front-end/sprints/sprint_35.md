---
sprint_number: 35
phase: "Gerenciamento de Minutas (Draft Studio)"
title: "Painel Centralizado de Ações e Aprovação Rápida"
---

# Sprint 35: Painel Centralizado de Ações e Aprovação Rápida
## 📑 Fase: Gerenciamento de Minutas (Draft Studio)

### 🎯 Objetivo Principal
Construir uma barra de utilidades na tela de minuta para disparar rejeição rápida, cancelamento ou aprovação que joga a minuta diretamente na fila de transmissão do BullMQ.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Botão de Aprovar com fluxo de animação de envio reativo**
- **Modal de rejeição com campo para justificativa textual**
- **Alerta de carregamento indicando a alocação de jobs na fila do Redis**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como administrador, quero aprovar uma minuta revisada de forma instantânea enviando-a imediatamente para os contatos.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Aprovar para Envio Imediato?                         |
|  Esta minuta será enviada para 125 contatos ativos.   |
|  [ CANCELAR ]   [x] CONFIRMAR E ADICIONAR À FILA      |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Draft Fast Action Hub component
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Codificar botões de status rápido com confirmações de segurança
- [ ] **Implementação:** Implementar modal explicativo de volume de envios a serem disparados
- [ ] **Implementação:** Integrar chamada à rota de broadcast POST /api/news/drafts/:id/approve
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
