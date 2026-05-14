---
sprint_number: 25
phase: "Gerenciamento de Contatos (Destinatários)"
title: "Módulo de Métricas e Gráficos de Contatos"
---

# Sprint 25: Módulo de Métricas e Gráficos de Contatos
## 📑 Fase: Gerenciamento de Contatos (Destinatários)

### 🎯 Objetivo Principal
Exibir dados consolidados de crescimento de carteira de contatos por meio de painéis de análises estatísticas.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Gráfico de linha mostrando contatos criados por mês**
- **Indicador de Pizza mostrando a taxa de contatos ativos versus inativos**
- **Painel de contatos que mais receberam broadcast**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como gestor, quero analisar a evolução mensal de novos destinatários adicionados.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:
- `recharts`

---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Estatísticas de Destinatários                         |
|  Ativos: [=========   ] 82%  | Inativos: [== ] 18%    |
|  Gráfico de Crescimento: ( Linha Crescente )          |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Charts config for dashboard view
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Instalar biblioteca de gráficos de preferência
- [ ] **Implementação:** Conectar painel estatístico na API de contatos
- [ ] **Implementação:** Garantir layout responsivo para os canvas dos gráficos
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
