---
sprint_number: 32
phase: "Gerenciamento de Minutas (Draft Studio)"
title: "Editor Avançado de Conteúdo de Minuta"
---

# Sprint 32: Editor Avançado de Conteúdo de Minuta
## 📑 Fase: Gerenciamento de Minutas (Draft Studio)

### 🎯 Objetivo Principal
Desenvolver um formulário de edição de minuta refinado para que o administrador corrija livremente o texto sintetizado pela IA antes do broadcast.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Painel de formulário contendo: Título, Resumo, Fonte, Corpo do texto e Anexos**
- **Editor de texto rico com suporte a quebras de linha e emojis do WhatsApp**
- **Visualizador interativo exibindo em tempo real o mockup de exibição em celular**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como jornalista, quero ter um editor flexível para ajustar qualquer erro ortográfico da IA na minuta antes de colocá-la na fila de disparos.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Editar Minuta                                         |
| Título:  [ Alta dos combustíveis impacta mercado    ] |
| Fonte:   [ Folha de S. Paulo                        ] |
| Texto:   [ Ocorreu um aumento de 5% no diesel...   ] |
| [ Cancelar ] [ SALVAR ALTERAÇÕES ]                    |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Draft editor page module
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Desenvolver página de edição detalhada de minuta
- [ ] **Implementação:** Implementar visualizador de preview instantâneo
- [ ] **Implementação:** Integrar alteração na API via POST / PUT /api/news/drafts/:id
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
