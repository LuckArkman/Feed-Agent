---
sprint_number: 26
phase: "Fontes de Imagem & OCR"
title: "Área de Upload Multiversátil Drag-and-Drop (Imagens/PDFs)"
---

# Sprint 26: Área de Upload Multiversátil Drag-and-Drop (Imagens/PDFs)
## 📑 Fase: Fontes de Imagem & OCR

### 🎯 Objetivo Principal
Desenvolver uma zona de upload interativa, responsiva e robusta, aceitando múltiplos formatos de mídia, aplicando limites de tamanho e exibindo barras de progresso reais.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Área ativa de Drag-and-drop com efeito de dashed border interativo**
- **Validação de tamanho do arquivo e tipos de extensão aceitos (PNG, JPEG, PDF)**
- **Pré-visualização (Thumbnail) instantânea de imagem no momento da seleção**
- **Controle de fila de upload com barras de progresso progressivas**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como operador, quero arrastar várias fotos do jornal impresso de uma vez e ver o progresso de cada upload de forma clara e visual.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:
- `lucide-react`

---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  Upload de Documentos de Notícias                     |
|  +-------------------------------------------------+  |
|  | Arraste as imagens/PDFs das notícias aqui       |  |
|  | Suporta: PNG, JPG, JPEG e PDF (Máx 15MB)        |  |
|  +-------------------------------------------------+  |
|  Enviando: jornal_folha.jpg [======     ] 62%         |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Drag-and-drop file uploader block
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar página de upload com design elegante
- [ ] **Implementação:** Implementar manipulador de eventos de drag-and-drop em React
- [ ] **Implementação:** Integrar upload via multipart/form-data usando Axios para POST /api/news/upload
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
