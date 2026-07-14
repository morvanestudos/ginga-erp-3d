# 🚀 Guia Rápido - Ginga ERP 3D

## ▶️ Para Rodar a Aplicação

### 1. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000**

### 2. Testar API Manualmente

```bash
# Ver todos os pedidos
curl http://localhost:3000/api/pedidos

# Criar um pedido
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "cliente":"Seu Cliente",
    "peca":"Seu Produto",
    "custo":15.50,
    "venda":30.00,
    "prazo":"2025-12-31",
    "status":"pendente"
  }'

# Verificar health
curl http://localhost:3000/api/health
```

### 3. Build para Produção

```bash
npm run build
npm start
```

## 📱 Funcionalidades da UI

### 📋 Aba Pedidos
- Adicionar novos pedidos
- Ver custos e preços de venda
- Mudar status (RECEBIDO → EM IMPRESSÃO → ACABAMENTO → PRONTO → ENTREGUE)
- Deletar pedidos
- Dashboard com faturamento, custos e lucro

### 📦 Aba Estoque
- Gerenciar insumos (filamento, cola, etc)
- Rastrear quantidades
- Alertas de estoque mínimo

### 💰 Aba Finanças
- Registrar entradas/saídas de caixa
- Ver saldo do mês
- Gráficos de fluxo de caixa

### 👥 Aba Clientes & Leads
- Cadastrar clientes
- Rastrear histórico de compras
- Gerenciar leads aquecidos

## 🛠️ Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
```bash
# Regenerar cliente Prisma
npx prisma generate
```

### Porta 3000 já está em uso
```bash
# Next.js vai automaticamente usar a próxima porta disponível (3001, 3002, etc)
# Ou mate o processo na porta 3000:
# Windows: netstat -ano | findstr :3000
# Linux: lsof -i :3000
```

### Banco de dados vazio
- Dados criados via API são salvos em PostgreSQL
- Crie um pedido de teste via formulário ou API
- Reload da página carrega os dados

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Interface principal (React)
│   ├── globals.css           # Estilos globais
│   ├── layout.tsx            # Layout padrão
│   └── api/
│       ├── health/route.ts   # Health check
│       ├── pedidos/
│       │   ├── route.ts      # GET/POST pedidos
│       │   └── [id]/route.ts # GET/PATCH/DELETE pedido específico
│       ├── insumos/          # Mesmo padrão para insumos
│       ├── transacoes/       # Mesmo padrão para transações
│       └── clientes/         # Mesmo padrão para clientes
└── lib/
    └── prisma.ts            # Cliente Prisma singleton

prisma/
├── schema.prisma            # Definição dos modelos de dados
└── migrations/              # Histórico de migrações (se houver)
```

## 🗄️ Variáveis de Ambiente

Crie um `.env.local` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ginga_erp"
```

## 🎯 Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Tailwind CSS 4.x
- **Backend**: Next.js 15 + TypeScript
- **Database**: PostgreSQL + Prisma 6.x
- **Build**: Turbopack (Next.js)
- **Styling**: Tailwind CSS com tema dark

## 📊 Modelos de Dados

### Pedido
- `id`: CUID único
- `cliente`: Nome do cliente
- `peca`: Nome do produto
- `custo`: Valor de custo (Decimal)
- `venda`: Valor de venda (Decimal)
- `prazo`: Data de entrega
- `status`: Estado do pedido
- `criadoEm`, `atualizadoEm`: Timestamps

### Insumo
- `id`: CUID único
- `nome`: Nome do insumo
- `tipo`: FILAMENTO | COLA | OUTROS
- `cor`: Cor do insumo
- `quantidadeGrams`: Quantidade em gramas
- `minGrams`: Quantidade mínima em estoque
- `preco`: Preço unitário

### Transacao
- `id`: CUID único
- `data`: Data da transação
- `tipo`: ENTRADA | SAIDA
- `categoria`: Categoria (Energia, Vendas, etc)
- `descricao`: Descrição
- `valor`: Valor monetário

### ClienteLead
- `id`: CUID único
- `nome`: Nome do cliente
- `contato`: Telefone/Email
- `interessePrincipal`: Tipo de produto interessado
- `dataUltimaCompra`: Última compra
- `frequenciaRecorrencia`: Dias entre compras
- `statusLead`: FREGUES | LEAD_AQUECIDO | FRIO

## ✅ Verificação de Saúde

1. **Server rodando**: http://localhost:3000 (deve carregar)
2. **API respondendo**: http://localhost:3000/api/health (deve retornar JSON)
3. **Data loading**: Abra DevTools (F12) → Console (deve estar sem erros)
4. **Database**: Crie um pedido e recarregue (deve persistir)

## 🎉 Pronto para Usar!

A aplicação está totalmente funcional e pronta para gerenciar sua produção de impressão 3D. Bom uso! 🚀
