---
sprint_number: 39
phase: "Fila de Transmissão (Broadcast Engine)"
title: "Painel de Histórico de Lotes Transmitidos"
---

# Sprint 39: Painel de Histórico de Lotes Transmitidos
## 📑 Fase: Fila de Transmissão (Broadcast Engine)

### 🎯 Objetivo Principal
Desenvolver o painel histórico onde o administrador acompanhe transmissões passadas, auditando índices de entrega de cada lote disparado no mês.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Tabela listando os lotes concluídos históricos**
- **Controles para baixar relatórios individuais do lote em CSV**
- **Duração total do envio de cada lote**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como gestor de comunicação, quero baixar um relatório em CSV dos envios concluídos para validar o atingimento da nossa base de contatos.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Histórico de Transmissões Passadas                    |
|  Data       Notícia/Minuta   Base   Sucesso   Ação    |
|  10/05/26   Aumento Diesel   120    98%       [Baixar]|
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Broadcast history list model
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Mapear tabela de histórico de transmissões concluidas
- [ ] **Implementação:** Escrever rotinas de exportação de dados para CSV no navegador
- [ ] **Implementação:** Tratar estados de carregamento iniciais de histórico
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
