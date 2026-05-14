---
sprint_number: 2
phase: "Fundações & Arquitetura"
title: "Sistema de Design em Vanilla CSS, Variáveis HSL e Arquitetura Dark Mode"
---

# Sprint 2: Sistema de Design em Vanilla CSS, Variáveis HSL e Arquitetura Dark Mode
## 📑 Fase: Fundações & Arquitetura

### 🎯 Objetivo Principal
Implementar um sistema de design escalável, moderno e responsivo baseado em CSS Custom Properties usando valores HSL, pronto para suportar temas claro e escuro nativamente.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Configuração do arquivo index.css global**
- **Definição da paleta de cores (Primary, Secondary, Background, Surface, Border, Text) em HSL**
- **Implementação de variáveis utilitárias para Glassmorphism e Efeitos de Blur**
- **Configuração de suporte a Dark Mode usando classe global ou data-theme**
- **Definição da escala tipográfica responsiva e variáveis de espaçamento**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como usuário, desejo um visual moderno de Glassmorphism com sombras e desfoques sutis para sentir que a aplicação é premium.

> [!NOTE]
> **User Story:**
> Como usuário que trabalha à noite, quero um modo escuro confortável para evitar fadiga ocular.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:
- `postcss`
- `autoprefixer`

---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Design System Tokens (:root / [data-theme='dark'])   |
+-------------------------------------------------------+
|  --primary: hsl(220, 90%, 56%)   [Azul Sleek]          |
|  --background: hsl(0, 0%, 98%) / hsl(222, 47%, 11%)    |
|  --surface: hsl(0, 0%, 100%) / hsl(223, 47%, 16%)      |
|  --glass-bg: rgba(255, 255, 255, 0.45) / rgba(15, 23, 42, 0.45) |
|  --glass-blur: blur(12px)                             |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
/* index.css */
:root {
  --primary: 220 90% 56%;
  --background: 210 40% 98%;
  --surface: 0 0% 100%;
  --text-main: 222 47% 12%;
  --border: 214 32% 91%;
  --glass-bg: rgba(255, 255, 255, 0.6);
  --glass-border: rgba(255, 255, 255, 0.25);
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
}

[data-theme='dark'] {
  --background: 222 47% 11%;
  --surface: 223 47% 16%;
  --text-main: 210 40% 98%;
  --border: 217 32% 17%;
  --glass-bg: rgba(15, 23, 42, 0.6);
  --glass-border: rgba(255, 255, 255, 0.05);
}
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar index.css principal definindo variáveis HSL no escopo :root
- [ ] **Implementação:** Criar e configurar o seletor [data-theme='dark'] com a paleta de cores invertida
- [ ] **Implementação:** Implementar classes utilitárias globais para glassmorphism (.glass-panel)
- [ ] **Implementação:** Configurar fontes do Google Fonts (Inter / Outfit) no arquivo index.css
- [ ] **Implementação:** Validar responsividade de fontes e espaçamentos com rem e em
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
