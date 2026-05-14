---
sprint_number: 28
phase: "Fontes de Imagem & OCR"
title: "Mapeamento de Editor Canvas para Pré-Processamento Visual"
---

# Sprint 28: Mapeamento de Editor Canvas para Pré-Processamento Visual
## 📑 Fase: Fontes de Imagem & OCR

### 🎯 Objetivo Principal
Implementar um editor de imagem interativo via HTML5 Canvas para que o usuário rotacione, corte e ajuste brilho de fotos antes do envio ao OCR.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Módulo de rotação de 90 graus para fotos invertidas de celular**
- **Módulo de corte (Cropping) com grid proporcional**
- **Controles básicos de brilho e contraste visual**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como jornalista tirando foto com celular, quero rotacionar a foto do jornal impresso em 90 graus no próprio portal para que o Tesseract consiga ler.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Editor de Imagem (Pré-OCR)                             |
|  +---------------------------+                        |
|  |         [ IMAGEM ]        |   [ Girar 90 ] [ Cortar] |
|  |         [ CANVAS ]        |   Brilho:  [======| ]  |
|  +---------------------------+                        |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Image Canvas manipulator function snippet
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Escrever manipulador de Canvas para renderizar e alterar rotação de imagem no cliente
- [ ] **Implementação:** Criar barra de controle estéticos simples em CSS
- [ ] **Implementação:** Garantir a extração do buffer alterado para submit multipart
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
