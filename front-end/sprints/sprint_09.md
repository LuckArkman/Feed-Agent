---
sprint_number: 9
phase: "Gerenciamento de Estado & Conectividade"
title: "Gateway de Conectividade em Tempo Real (SSE Client & WebSockets)"
---

# Sprint 9: Gateway de Conectividade em Tempo Real (SSE Client & WebSockets)
## 📑 Fase: Gerenciamento de Estado & Conectividade

### 🎯 Objetivo Principal
Implementar uma conexão síncrona persistente (Server-Sent Events) no frontend para ouvir as alterações de estado do WhatsApp (QR Code, conexões, andamento de disparos de filas).

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Criação de um hook hook customizável useSseGateway para abrir conexão SSE com o backend**
- **Implementação de lógica de reconexão automática e resiliência a quedas de rede**
- **Mapeamento de eventos SSE do backend: 'wa:qr', 'wa:open', 'wa:close', 'message:status'**
- **Injeção automática do Bearer token do Zustand nas requisições do SSE (via query strings)**
- **Dispatcher de eventos local para propagar dados recebidos a múltiplos stores**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como usuário, quero ver o QR Code atualizar na tela imediatamente sem precisar recarregar a interface.

> [!NOTE]
> **User Story:**
> Como administrador, quero acompanhar em tempo real as estatísticas de disparos de mensagens.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Real-time Event Subscription Model (SSE)              |
+-------------------------------------------------------+
|   Server Broadcast (wa:qr, status)                    |
|          |                                            |
|          v (HTTP Event Stream)                        |
|   useSseGateway (React Hook)                          |
|          |                                            |
|          +----> Trigger: state update / Zustand       |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// src/hooks/useSseGateway.ts
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useSseGateway = (onEvent: (event: string, data: any) => void) => {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;
    
    const eventSource = new EventSource(`http://localhost:3000/api/whatsapp/status/sse?token=${token}`);
    
    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onEvent(parsed.type, parsed.payload);
      } catch (err) {
        console.error('SSE JSON Parse Error', err);
      }
    };

    return () => eventSource.close();
  }, [token, onEvent]);
};
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Criar custom hook de SSE global de conexão com o backend
- [ ] **Implementação:** Desenvolver lógica de escuta reativa para eventos WaStatus
- [ ] **Implementação:** Configurar tratamento para expirações ou fechamentos de rede (reconectando com delay exponencial)
- [ ] **Implementação:** Verificar se o fechamento do componente causa a liberação apropriada do objeto EventSource para evitar vazamento de memória
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
