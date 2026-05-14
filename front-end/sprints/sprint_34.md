---
sprint_number: 34
phase: "Gerenciamento de Minutas (Draft Studio)"
title: "Interface de Validação e Editor de Metadados JSON"
---

# Sprint 34: Interface de Validação e Editor de Metadados JSON
## 📑 Fase: Gerenciamento de Minutas (Draft Studio)

### 🎯 Objetivo Principal
Implementar um editor especializado de metadados das minutas, permitindo visualizar e corrigir o payload de tags de controle gerado no pipeline.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Visualizador de árvore JSON interativo**
- **Validador de formato de estrutura impedindo salvamento de JSON corrompido**
- **Editor de tags e campos chave rápidos**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como administrador técnico, quero validar a árvore de metadados JSON gerada para que o fluxo de integração leia o formato esperado.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Editor de Metadados JSON                             |
|  {                                                    |
|    "keywords": ["combustivel", "economia"],           |
|    "relevance": "high"                                |
|  }                                                    |
|  [ VALIDADOR: OK ]      [ SALVAR PAYLOAD ]            |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// JSON payload editor logic with custom validations
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Implementar área de texto com fonte mono para visualização do JSON
- [ ] **Implementação:** Escrever analisador em tempo real com try-catch de JSON.parse
- [ ] **Implementação:** Exibir sinalizadores visuais de erro de sintaxe vermelhos e verdes
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
