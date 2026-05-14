---
sprint_number: 37
phase: "Fila de Transmissão (Broadcast Engine)"
title: "Painel de Acompanhamento da Fila Ativa (Progress Tracker)"
---

# Sprint 37: Painel de Acompanhamento da Fila Ativa (Progress Tracker)
## 📑 Fase: Fila de Transmissão (Broadcast Engine)

### 🎯 Objetivo Principal
Construir a tela de monitoramento em tempo real do lote em transmissão, exibindo progresso percentual, contagem de sucessos/falhas e botões de controle de fluxo.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Barra de progresso de transmissão gigante de alta fidelidade**
- **Mostrador numérico dinâmico: Sucessos, Falhas, Total Restante**
- **Controles interativos reativos para Pausar, Retomar ou Cancelar o job ativo**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como operador, quero acompanhar a porcentagem real da fila de envio, podendo pausar o fluxo imediatamente caso note que algo está errado.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Transmissão em Lote Ativa                             |
|  Progresso: [=============        ] 64% (82/125)      |
|  Sucessos: 78 | Falhas: 4 | Restantes: 43             |
|  [ PAUSAR FILA ]   [ RETOMAR FILA ]   [ CANCELAR ]    |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Dynamic progress tracker component block
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Codificar componentes de progresso visual de transmissão
- [ ] **Implementação:** Exibir badges com cores dinâmicas reativas aos estados das filas
- [ ] **Implementação:** Integrar botões de controle com o gerenciador de jobs na API
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
