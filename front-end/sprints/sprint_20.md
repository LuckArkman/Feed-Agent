---
sprint_number: 20
phase: "Canal de Comunicação (WhatsApp Hub)"
title: "Módulo de Diagnósticos e Painel de Alertas de Banimento"
---

# Sprint 20: Módulo de Diagnósticos e Painel de Alertas de Banimento
## 📑 Fase: Canal de Comunicação (WhatsApp Hub)

### 🎯 Objetivo Principal
Exibir uma lista de verificação de sanidade para prevenir bans do WhatsApp (como checagem de delay ativo, quantidade de contatos enviada nas últimas horas e integridade do canal).

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Checklist interativo contendo indicadores preventivos contra banimentos**
- **Aviso sobre taxas elevadas de mensagens em curtos períodos**
- **Sinalizador visual de risco (Seguro / Moderado / Crítico)**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como gestor, quero ver um indicador claro de risco para saber se o delay configurado para o dia está seguro contra detecção de robôs.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Alerta de Saúde Antispam                              |
| Risco Atual: (   MODERADO   )                         |
| - Volume de mensagens/hora: 150 (Seguro)              |
| - Tempo de delay ativo: 1.5s (Aumente para 5s)        |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Health check visualizer component
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Codificar painel informativo de diagnóstico
- [ ] **Implementação:** Exibir dados históricos de disparos agregados
- [ ] **Implementação:** Adicionar link para manual de boas práticas
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
