---
sprint_number: 17
phase: "Canal de Comunicação (WhatsApp Hub)"
title: "Exibição Dinâmica do QR Code com Timeout e Feedback de Sucesso"
---

# Sprint 17: Exibição Dinâmica do QR Code com Timeout e Feedback de Sucesso
## 📑 Fase: Canal de Comunicação (WhatsApp Hub)

### 🎯 Objetivo Principal
Implementar uma interface fluida que exibe o QR Code em Base64 gerado pelo Baileys, com barras de carregamento de timeout de 60s, splash screen de sucesso no escaneamento.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Renderizador de imagem em Base64 do QR Code recebido**
- **Barra de progresso visual decrescente representando o timeout de validade de 60s**
- **Splash screen com checkmark gigante animado e confete ao conectar**
- **Botão de gerar novo código caso expire**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como administrador, quero escanear o código e ver uma confirmação visual na tela para saber que deu tudo certo imediatamente.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Escanear QR Code                                     |
|  +-------------------------+                          |
|  | [    IMAGEM QR CODE    ] |                          |
|  | [      BASE64 EMBED    ] |                          |
|  +-------------------------+                          |
|  Expira em: [|||||||||||||        ] 32s               |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// QR code renderer block
// Escuta o evento 'wa:qr' para receber o Base64 e 'wa:open' para comemorar
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar container de renderização do QR Code com estados vazios (Skeleton)
- [ ] **Implementação:** Escrever o timer regressivo do timeout em React com setInterval limpando no unmount
- [ ] **Implementação:** Desenvolver modal/splash comemorativo de sucesso de conexão
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
