# Configuração Prisma ORM - Ginga ERP 3D

## Status: ✅ Configurado com Sucesso

### O que foi realizado:

#### 1. **Instalação das Dependências**
- ✅ `@prisma/client@7.8.0` - Cliente Prisma para acesso ao banco de dados
- ✅ `prisma@7.8.0` - CLI Prisma para gerenciamento de migrações

#### 2. **Inicialização do Prisma**
- ✅ Pasta `prisma/` criada
- ✅ Arquivo `schema.prisma` configurado
- ✅ Arquivo `prisma.config.ts` criado
- ✅ Arquivo `.env` atualizado com DATABASE_URL

#### 3. **Modelagem do Banco de Dados**
Foram criados 4 modelos no `prisma/schema.prisma`:

##### **Modelo: Pedido** (Pedidos de Produção)
```prisma
- id: String (CUID - chave primária)
- cliente: String (varchar 255)
- peca: String (varchar 255)
- custo: Decimal(10,2) - valores monetários precisos
- venda: Decimal(10,2)
- prazo: DateTime (stored as DATE)
- status: String (padrão: "RECEBIDO")
- criadoEm: DateTime (auto timestamp)
- atualizadoEm: DateTime (auto updated)
- Índices: cliente, status
```

##### **Modelo: Insumo** (Estoque e Materiais)
```prisma
- id: String (CUID)
- nome: String (varchar 255)
- tipo: String (FILAMENTO | COLA | OUTROS)
- cor: String? (varchar 100, opcional)
- quantidadeGrams: Decimal(10,2)
- minGrams: Decimal(10,2)
- preco: Decimal(10,2)
- criadoEm: DateTime
- atualizadoEm: DateTime
- Índices: tipo, nome
```

##### **Modelo: Transacao** (Movimentação Financeira)
```prisma
- id: String (CUID)
- data: DateTime (stored as DATE)
- tipo: String (ENTRADA | SAIDA)
- categoria: String (varchar 100)
- descricao: String (texto livre)
- valor: Decimal(10,2)
- criadoEm: DateTime
- atualizadoEm: DateTime
- Índices: tipo, data, categoria
```

##### **Modelo: ClienteLead** (CRM - Clientes e Leads)
```prisma
- id: String (CUID)
- nome: String (varchar 255)
- contato: String (varchar 255) - WhatsApp ou redes sociais
- interessePrincipal: String (varchar 255)
- dataUltimaCompra: DateTime (stored as DATE)
- frequenciaRecorrencia: Int (em dias)
- statusLead: String (padrão: "FRIO")
- criadoEm: DateTime
- atualizadoEm: DateTime
- Índices: nome, statusLead, dataUltimaCompra
```

#### 4. **Banco de Dados**
- ✅ PostgreSQL inicializado via `npx prisma dev`
- ✅ Tabelas criadas: Pedido, Insumo, Transacao, ClienteLead
- ✅ Índices criados para otimizar buscas
- ✅ Prisma Client gerado em `src/generated/prisma/`

### Configurações Ativas:

**DATABASE_URL:** `postgres://postgres:postgres@localhost:51214/template1`  
**SHADOW_DATABASE_URL:** `postgres://postgres:postgres@localhost:51215/template1`

### Próximos Passos:

#### 1. **Integrar Prisma Client na Aplicação**
Criar um arquivo de inicialização do Prisma Client:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@/generated/prisma";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = global.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
```

#### 2. **Criar API Routes para CRUD**
Criar endpoints Next.js em `src/app/api/`:
- `GET/POST /api/pedidos` - Gerenciar pedidos
- `GET/POST /api/insumos` - Gerenciar estoque
- `GET/POST /api/transacoes` - Gerenciar transações financeiras
- `GET/POST /api/clientes` - Gerenciar clientes e leads

#### 3. **Migrar do localStorage para Prisma**
Atualizar o componente `src/app/page.tsx` para:
- Usar Prisma Client em vez de localStorage
- Implementar Server Components ou API routes
- Manter a interface de usuário idêntica

#### 4. **Verificar Tipos TypeScript**
O Prisma gera tipos automaticamente em `src/generated/prisma/`:
```typescript
import { Pedido, Insumo, Transacao, ClienteLead } from "@/generated/prisma";
```

### Estrutura de Diretórios:

```
ginga-app/
├── prisma/
│   ├── schema.prisma         ✅ Modelo do banco
│   ├── migrations/           ✅ Pasta de migrações
│   └── seed.ts               (opcional - para dados iniciais)
├── prisma.config.ts          ✅ Configuração Prisma
├── .env                       ✅ Variáveis de ambiente
├── src/
│   ├── app/
│   │   ├── page.tsx          (A ser atualizado)
│   │   └── api/              (Novos endpoints)
│   ├── generated/
│   │   └── prisma/           ✅ Cliente gerado
│   ├── lib/
│   │   └── prisma.ts         (A ser criado)
│   └── ...
└── package.json              ✅ Dependências adicionadas
```

### Comandos Úteis:

```bash
# Iniciar servidor PostgreSQL local
npx prisma dev

# Aplicar mudanças no schema ao banco
npx prisma db push

# Criar migração versionada (melhor para produção)
npx prisma migrate dev --name <nome_migracao>

# Visualizar dados no Prisma Studio
npx prisma studio

# Gerar Prisma Client
npx prisma generate

# Resetar banco de dados (CUIDADO - deleta tudo)
npx prisma migrate reset

# Ver status de migrações
npx prisma migrate status
```

### Notas Importantes:

1. **Tipos Precisos**: Use `Decimal` para valores monetários (não `Float`)
2. **Datas**: Armazenadas como `DateTime @db.Date` no PostgreSQL
3. **Índices**: Criados automaticamente para colunas de busca frequente
4. **CUID**: Identificadores únicos globais (melhor que UUID para performance)
5. **Timestamps**: `criadoEm` e `atualizadoEm` gerenciados automaticamente

### Troubleshooting:

**Erro: "Server has closed the connection"**
- Certifique-se de que `npx prisma dev` está rodando em outro terminal
- Verifique se DATABASE_URL está correto

**Erro: "Migration lock is taken"**
```bash
npx prisma migrate resolve --rolled-back <migration_name>
```

**Regenerar Prisma Client:**
```bash
npx prisma generate
```

---

**Data de Configuração**: 2026-07-08  
**Versão do Prisma**: 7.8.0  
**Database**: PostgreSQL (local via Prisma Postgres)
