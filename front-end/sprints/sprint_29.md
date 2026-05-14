---
sprint_number: 29
phase: "Fontes de Imagem & OCR"
title: "Visão Dividida (Split-Screen) de Extração OCR"
---

# Sprint 29: Visão Dividida (Split-Screen) de Extração OCR
## 📑 Fase: Fontes de Imagem & OCR

### 🎯 Objetivo Principal
Construir uma interface integrada que exiba em tempo real a foto enviada em paralelo com o editor contendo o texto extraído pelo Tesseract.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Layout Split-screen adaptativo (Lado a lado em desktop, empilhado em celular)**
- **Atualizador de barra de carregamento de progresso real do OCR**
- **Exibição de bloco contendo texto cru com rolagem dedicada**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como editor, quero ver a imagem original e o texto cru extraído lado a lado para verificar facilmente se algum parágrafo ou dado essencial foi pulado.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Visão de Extração de Texto                            |
| +-------------------------+ +-------------------------+ |
| | [Imagem Original]       | | [Texto OCR Extraído]    | |
| |                         | | Ocorreu um aumento...   | |
| +-------------------------+ +-------------------------+ |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Split view container structure
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Codificar layout de tela dividida em CSS flexbox/grid
- [ ] **Implementação:** Escrever visualizadores de transição contendo barra de carregamento
- [ ] **Implementação:** Implementar componente de visualização de texto puro em pre-wrap
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
