---
sprint_number: 38
phase: "Fila de Transmissão (Broadcast Engine)"
title: "Feed Terminal-Like de Logs de Disparo (SSE Log Viewer)"
---

# Sprint 38: Feed Terminal-Like de Logs de Disparo (SSE Log Viewer)
## 📑 Fase: Fila de Transmissão (Broadcast Engine)

### 🎯 Objetivo Principal
Construir um console estilo terminal de servidor para exibir em tempo real cada evento emitido pela fila (ex.: enviando para X, sucesso para Y, número inválido Z).

---

### 🚀 Recursos & Funcionalidades a Serem Implementados
- **Terminal visual em container dark mono com rolagem automática**
- **Cores de log formatadas (Info: Verde, Erro: Vermelho, Alerta: Amarelo)**
- **Opção de pausar rolagem automática para analisar mensagens passadas**

---

### 👤 Histórias de Usuário (User Stories)
> [!NOTE]
> **User Story:**
> Como administrador técnico, quero monitorar os retornos exatos da API em formato de console para auditar o andamento do processo.

---

### 📦 Dependências & Pacotes Recomendados
Este sprint fará uso das seguintes bibliotecas e pacotes chave:


---

### 🎨 Esboço de UI & Layout Mockup
Abaixo está o layout visual esperado para os componentes desenvolvidos ao longo deste sprint:
```text
+-------------------------------------------------------+
| Console de Transmissão Online                         |
|  +-------------------------------------------------+  |
|  | [10:32:01] [INFO] Iniciando lote para 120 cont. |  |
|  | [10:32:05] [SUCCESS] Mensagem enviada para #001 |  |
|  | [10:32:08] [ERROR] Celular #002 inativo no WA   |  |
|  +-------------------------------------------------+  |
|  [x] Auto-scroll ativo                                |
+-------------------------------------------------------+
```

---

### 💻 Estrutura de Código & Scaffolding Técnico
Abaixo está um modelo de código ou scaffolding técnico principal recomendado para guiar a implementação inicial:

```typescript
// Server events console logger component
```

---

### 📝 Checklist de Tarefas Passo a Passo
- [ ] **Planejamento & Setup de Componentes:** Criar arquivos de código e estilo dentro da estrutura padrão do frontend.
- [ ] **Implementação:** Implementar visualizador de console estético e responsivo
- [ ] **Implementação:** Escrever lógica de colorização de strings por RegExp nas chaves INFO / ERROR
- [ ] **Implementação:** Garantir a limpeza do log em tela após ultrapassar 500 linhas para otimizar RAM
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
