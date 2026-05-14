---
sprint_number: 19
phase: "Canal de Comunicação (WhatsApp Hub)"
title: "Widget de Mensagem de Teste Direta"
---

# Sprint 19: Widget de Mensagem de Teste Direta
## 📑 Fase: Canal de Comunicação (WhatsApp Hub)

### 🎯 Objetivo Principal
Disponibilizar uma mini interface para que o administrador envie uma mensagem de teste imediata, validando a integridade do pipeline do Baileys.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Widget lateral contendo campos de Número e Mensagem de texto simples**
- **Lógica de simulação humana de digitação na API visível visualmente no celular**
- **Visualizador de recibos de envio instantâneo**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como administrador, quero enviar uma mensagem de teste antes de disparar o lote de notícias para garantir que o número está conectável.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Enviar Mensagem de Teste                             |
|  Número:   [ (55) 1199999-0001 ]                      |
|  Mensagem: [ Digite a mensagem de teste...          ] |
|  [        ENVIAR MENSAGEM AGORA        ]              |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Test message submittal hook
// POST /api/whatsapp/test-message
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Desenvolver widget interativo com formulário simplificado
- [ ] **Implementação:** Implementar máscara de telefone para o input no formato internacional
- [ ] **Implementação:** Adicionar toasts indicando sucesso ou falha rápida no envio
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
