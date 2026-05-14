---
sprint_number: 30
phase: "Fontes de Imagem & OCR"
title: "Módulo de Customização de Prompt para o Llama 3"
---

# Sprint 30: Módulo de Customização de Prompt para o Llama 3
## 📑 Fase: Fontes de Imagem & OCR

### 🎯 Objetivo Principal
Disponibilizar painéis interativos de configuração de inteligência artificial, onde o usuário selecione tom de escrita, tamanho do resumo e insira prompts adicionais.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Opção de seleção de tom de voz (Formal, Informativo, Dinâmico, Urgente)**
- **Opção de tamanho de saída de texto (Curto, Médio, Longo)**
- **Input de instruções livres adicionais de IA**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como redator, quero configurar a geração para tom profissional e conciso para que as notícias combinem com nossa identidade padrão de marca.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Configuração de Prompt da IA                         |
|  Tom de Voz:  [ Informativo (v) ]                      |
|  Instruções:  [ Traduza termos estrangeiros...      ] |
|  [        GERAR MINUTA COM ESSES PARÂMETROS        ] |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Prompt options submit contract
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar formulário de controle de geração de prompts de IA
- [ ] **Implementação:** Integrar estados de prompt com requisição POST de disparo de geração
- [ ] **Implementação:** Criar presets padrões prontos para cliques rápidos de tom
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
