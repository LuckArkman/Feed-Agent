---
sprint_number: 36
phase: "Fila de Transmissão (Broadcast Engine)"
title: "Controle de Lançamento de Disparo de Lote de Notícias"
---

# Sprint 36: Controle de Lançamento de Disparo de Lote de Notícias
## 📑 Fase: Fila de Transmissão (Broadcast Engine)

### 🎯 Objetivo Principal
Desenvolver a interface modal de configuração que antecede o disparo de um lote de notícias, permitindo alterar o delay entre mensagens e disparar um teste prévio.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Seletor deslizante (Slider) para ajustar delay (em segundos)**
- **Opção de 'Disparo de Teste' para o celular do administrador antes do envio em lote**
- **Mostrador dinâmico contendo o tempo total estimado de transmissão com base no delay e contatos ativos**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como operador, quero simular o tempo total de envio arrastando o delay para configurar uma velocidade segura de disparos.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Configuração de Lançamento                           |
|  Delay entre mensagens: [=====o=====] 3.5 segundos    |
|  Tempo estimado de execução total: 7 minutos          |
|  [ DISPARAR TESTE PRÉVIO ]  [ ENTRAR NA FILA AGORA ]  |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// src/pages/BroadcastControl.tsx
// Configura payload para POST /api/broadcast/launch
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar controles deslizantes interativos com feedbacks numéricos dinâmicos
- [ ] **Implementação:** Desenvolver painel informativo de estimativas matemáticas
- [ ] **Implementação:** Vincular ações ao endpoint do gerenciador de filas
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
