---
sprint_number: 18
phase: "Canal de Comunicação (WhatsApp Hub)"
title: "Detalhamento e Diagnóstico de Dispositivo Conectado"
---

# Sprint 18: Detalhamento e Diagnóstico de Dispositivo Conectado
## 📑 Fase: Canal de Comunicação (WhatsApp Hub)

### 🎯 Objetivo Principal
Fornecer informações completas sobre o celular pareado no sistema, como nível de bateria, nome do modelo, sinal de rede e histórico de conexões do dia.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Grid contendo dados do dispositivo: Celular, Fabricante, Versão de SO e Bateria**
- **Ação para solicitar desconexão remota segura**
- **Histórico de logouts e instabilidades nas últimas 24h**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como operador, quero saber a bateria do celular para não correr o risco de os disparos pararem por desligamento do aparelho físico.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Informações do Dispositivo                            |
|  Aparelho: iPhone 14 Pro Max  | Bateria: [====] 88%   |
|  Sinal: Excelente [||||]       | [ DESCONECTAR DISP ]  |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Device details visual component contract
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Mapear dados extras de dispositivo no layout de WhatsApp
- [ ] **Implementação:** Construir botão de confirmação de perigo para logout e encerramento de sessão do Baileys
- [ ] **Implementação:** Integrar rota DELETE /api/whatsapp/disconnect
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
