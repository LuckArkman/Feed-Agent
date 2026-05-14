---
sprint_number: 33
phase: "Gerenciamento de Minutas (Draft Studio)"
title: "Visualizador Visual Comparativo de Texto (OCR vs IA)"
---

# Sprint 33: Visualizador Visual Comparativo de Texto (OCR vs IA)
## 📑 Fase: Gerenciamento de Minutas (Draft Studio)

### 🎯 Objetivo Principal
Construir uma ferramenta interativa contendo destaque de palavras (diff view) mapeando onde a IA sintetizou dados, facilitando auditoria e checagem de fatos.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Markup interativo de realce de texto original side-by-side**
- **Painel de termos suspeitos ou incompatíveis identificados**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como redator sênior, quero comparar o texto cru extraído com a redação feita pela IA para identificar e banir possíveis alucinações do modelo.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Auditoria Fact-Checking (Comparativo)                |
|  Original: [ ...inflação de 5.2%... ]                 |
|  IA Sintentizado: [ ...inflação de 5.2%... (v) ]      |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Diff visualizer block mockup
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Estruturar visualizadores de blocos em paralelo
- [ ] **Implementação:** Codificar lógica estática simples de correspondência de termos essenciais (números e datas)
- [ ] **Implementação:** Garantir legibilidade em telas menores
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
