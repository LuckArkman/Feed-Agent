---
sprint_number: 14
phase: "Autenticação & Controle de Acesso"
title: "Dashboard de Perfil de Usuário, Alteração de Nome e Logs de Sessão"
---

# Sprint 14: Dashboard de Perfil de Usuário, Alteração de Nome e Logs de Sessão
## 📑 Fase: Autenticação & Controle de Acesso

### 🎯 Objetivo Principal
Construir uma interface administrativa onde o usuário logado visualize seus dados, altere configurações de conta e acompanhe logs de acessos passados.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Formulário de alteração de Nome e E-mail**
- **Visualizador de Logs de Sessão: histórico de logins com IP, data e dispositivo**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como administrador, quero auditar meu histórico de login para verificar se minha conta não foi usada em localizações suspeitas.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Minha Conta                                           |
|  Logs de Sessão Recentes:                             |
|  - Windows / Chrome | IP: 189.12.33.22 | 10/05/2026   |
|  - Android / App    | IP: 189.12.33.22 | 09/05/2026   |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Log viewer interface contract
interface SessionLog {
  id: string;
  device: string;
  ip: string;
  accessedAt: string;
}
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar página Profile.tsx com formulário integrado
- [ ] **Implementação:** Carregar logs de sessões mockadas ou integradas do backend
- [ ] **Implementação:** Implementar alteração segura de dados de usuário
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
