---
sprint_number: 27
phase: "Fontes de Imagem & OCR"
title: "Painel de Gerenciamento de Arquivos de Origem"
---

# Sprint 27: Painel de Gerenciamento de Arquivos de Origem
## 📑 Fase: Fontes de Imagem & OCR

### 🎯 Objetivo Principal
Construir uma galeria para listar todas as mídias submetidas, fornecendo opções de deleção, visualização ampliada e disparador manual de extração.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Grade (Grid) de arquivos contendo visualizações em miniatura e dados básicos**
- **Visualizador lightbox em overlay do documento original**
- **Controle para apagar mídias salvas em disco**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como operador, quero apagar fotos antigas do sistema para economizar espaço de armazenamento do servidor.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Galeria de Documentos Recentes                        |
|  +---------------+  +---------------+  +---------------+  |
|  | [Thumbnail]   |  | [Thumbnail]   |  | [Thumbnail]   |  |
|  | foto_jorn.jpg |  | clip_01.png   |  | folha_doc.pdf |  |
|  +---------------+  +---------------+  +---------------+  |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// File viewer grid controller
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar grid de mídias de origem responsivo
- [ ] **Implementação:** Construir visualizador lightbox amigável
- [ ] **Implementação:** Integrar botões de exclusão na API de mídias
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
