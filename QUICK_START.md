# 🚀 Ginga ERP 3D - Guia Rápido de Inicialização

## 📋 Status Atual
✅ **Prisma ORM configurado e pronto para uso**  
✅ **PostgreSQL inicializado**  
✅ **API Routes de exemplo implementadas**  
✅ **TypeScript types gerados automaticamente**

---

## 🏃 Início Rápido (3 passos)

### Passo 1: Iniciar o Banco de Dados
```bash
npx prisma dev
```
Este comando inicia o servidor PostgreSQL local. **Mantenha esse terminal aberto.**

### Passo 2: Em outro terminal, iniciar a aplicação
```bash
pnpm dev
```
A aplicação estará disponível em `http://localhost:3000` (ou porta alternativa)

### Passo 3: (Opcional) Visualizar dados do banco
```bash
npx prisma studio
```
Abre uma interface web em `http://localhost:5555` para visualizar/editar dados

---

## 📚 Estrutura de Arquivos Importante

```
src/
├── app/
│   ├── page.tsx          ← Interface do usuário (UI)
│   └── api/              ← Endpoints da API (Backend)
│       ├── pedidos/
│       ├── insumos/
│       ├── transacoes/
│       └── clientes/
├── lib/
│   └── prisma.ts         ← Cliente Prisma (gerenciar DB)
└── generated/
    └── prisma/           ← Types automáticos (não editar!)

prisma/
├── schema.prisma         ← Definição do banco (EDITAR AQUI)
└── migrations/           ← Histórico de mudanças (não editar!)
```

---

## 🔌 Endpoints da API (Prontos para Usar)

### Pedidos
```bash
# Listar todos
GET  /api/pedidos

# Listar com filtro
GET  /api/pedidos?status=RECEBIDO

# Criar novo
POST /api/pedidos
# Body: { cliente, peca, custo, venda, prazo, status }

# Detalhes/Atualizar/Deletar
GET    /api/pedidos/[id]
PATCH  /api/pedidos/[id]  # { status: "..." }
DELETE /api/pedidos/[id]
```

### Insumos
```bash
GET  /api/insumos
POST /api/insumos
GET  /api/insumos?tipo=FILAMENTO
```

### Transações
```bash
GET  /api/transacoes
POST /api/transacoes
GET  /api/transacoes?tipo=ENTRADA&categoria=Venda
```

### Clientes/Leads
```bash
GET  /api/clientes
POST /api/clientes
GET  /api/clientes?statusLead=LEAD_AQUECIDO
```

---

## 🛠️ Tarefas Imediatas

### 1. Testar a API
```bash
# Em um terminal com pnpm dev rodando:
curl http://localhost:3000/api/pedidos
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cliente":"João","peca":"Suporte","custo":10.5,"venda":25,"prazo":"2026-07-15"}'
```

### 2. Migrar o localStorage → Prisma
Na página `src/app/page.tsx`, trocar:
```typescript
// ANTES (localStorage)
const [pedidos, setPedidos] = useState<Pedido[]>([]);
useEffect(() => {
  const saved = localStorage.getItem("ginga_erp_pedidos");
  if (saved) setPedidos(JSON.parse(saved));
}, []);

// DEPOIS (Prisma via API)
const [pedidos, setPedidos] = useState<Pedido[]>([]);
useEffect(() => {
  fetch('/api/pedidos')
    .then(r => r.json())
    .then(setPedidos);
}, []);
```

### 3. Criar função auxiliar
```typescript
// src/lib/api-client.ts
export async function getPedidos() {
  const res = await fetch('/api/pedidos');
  return res.json();
}

export async function createPedido(data: any) {
  const res = await fetch('/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
```

---

## ⚠️ Troubleshooting

### Erro: "Can't reach database server"
```bash
# Solução: Certifique-se de que npx prisma dev está rodando
npx prisma dev
```

### Erro: "Prisma Client not found"
```bash
# Solução: Regenerar o cliente
npx prisma generate
```

### Erro: "Table already exists"
```bash
# Solução: Reset completo (⚠️ DELETA TODOS OS DADOS)
npx prisma migrate reset
```

### Porta já está em uso
```bash
# Se port 3000 está ocupada, Next.js usa 3001, 3002, etc
# Se port 51214 está ocupada, parar outro servidor Prisma:
# pkill -f "prisma dev"
```

---

## 📖 Documentação Completa

- [PRISMA_SETUP.md](PRISMA_SETUP.md) - Guia detalhado
- [CHECKLIST.md](CHECKLIST.md) - O que foi implementado
- [Prisma Docs](https://www.prisma.io/docs/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 🎯 Próximas Etapas (Recomendadas)

1. ✅ Testar endpoints da API (curl ou Postman)
2. ⏳ Integrar fetch() na página para usar API
3. ⏳ Remover localStorage completamente
4. ⏳ Adicionar mais endpoints (DELETE para insumos, etc)
5. ⏳ Adicionar validação robusta
6. ⏳ Implementar tratamento de erros
7. ⏳ Adicionar autenticação (JWT/Sessions)
8. ⏳ Deploy em produção (Vercel + Railway/Render)

---

## 💾 Banco de Dados Atual

- **Provider**: PostgreSQL
- **Host**: localhost
- **Port**: 51214 (main), 51215 (shadow)
- **Database**: template1
- **User**: postgres
- **Password**: postgres

*Nota: Esta é uma configuração local de desenvolvimento. Para produção, use um banco de dados gerenciado (AWS RDS, Railway, etc).*

---

## ❓ Dúvidas Frequentes

**P: Como adicionar um novo campo a uma tabela?**  
R: Edite `prisma/schema.prisma`, então execute `npx prisma migrate dev --name descrição`

**P: Como fazer backup dos dados?**  
R: PostgreSQL local não persiste entre restarts. Use produção para dados importantes.

**P: Posso usar SQLite em produção?**  
R: Não recomendado. PostgreSQL é melhor para aplicações online.

**Q: Como autenticar a API?**  
R: Implemente middleware de autenticação ou use Vercel Auth.

---

## 📞 Suporte

Para dúvidas sobre Prisma:
- [Discord Prisma](https://discord.gg/prisma)
- [GitHub Issues](https://github.com/prisma/prisma/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/prisma)

---

**Última atualização**: 2026-07-08  
**Versão do Prisma**: 7.8.0  
**Versão do Next.js**: 15.5.20  
**Status**: 🟢 Operacional
