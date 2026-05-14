---
sprint_number: 15
phase: "Autenticação & Controle de Acesso"
title: "Alerta de Expiração de Token JWT e Logout Automático"
---

# Sprint 15: Alerta de Expiração de Token JWT e Logout Automático
## 📑 Fase: Autenticação & Controle de Acesso

### 🎯 Objetivo Principal
Evitar brechas de segurança, detectando a proximidade da expiração do JWT, avisando o usuário por meio de um modal e efetuando logout forçado se necessário.

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Decodificador de JWT para analisar tempo restante (exp)**
- **Modal de contagem regressiva em tela para alertar expiração ('Sua sessão expira em 60 segundos. Deseja estender?')**
- **Logout limpo com limpeza completa de estados e cookies**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como usuário, quero ser avisado antes da minha sessão expirar para não perder as edições de minutas que estou fazendo.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:
- `jwt-decode`

---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
|  [!] Alerta de Segurança                              |
|  Sua sessão expira em 45 segundos.                    |
|  [ Estender Sessão ]  [ Sair Agora ]                  |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Token expiration check timer
import { jwtDecode } from 'jwt-decode';

export const checkTokenExpiration = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar hook useTokenMonitor de verificação de tempo de vida do JWT
- [ ] **Implementação:** Construir modal elegante de aviso com contagem regressiva reativa
- [ ] **Implementação:** Implementar extensão de token fazendo request refresh se desejado pelo usuário
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
