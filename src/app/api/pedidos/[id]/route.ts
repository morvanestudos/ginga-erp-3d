import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const hojeISO = () => new Date().toISOString().split("T")[0];

/**
 * GET /api/pedidos/[id]
 * Recupera um pedido específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pedido = await prisma.pedido.findUnique({
      where: { id },
    });

    if (!pedido) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    return NextResponse.json(pedido);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return NextResponse.json(
      { error: "Falha ao buscar pedido" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/pedidos/[id]
 * Atualiza um pedido (ex: mudança de status)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const pedidoAtual = await prisma.pedido.findUnique({ where: { id } });
    if (!pedidoAtual) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const novoStatus = body.status || pedidoAtual.status;

    const resultado = await prisma.$transaction(async (tx) => {
      let atualizado = await tx.pedido.update({
        where: { id },
        data: {
          status: novoStatus,
        },
      });

      let estoqueAlerta: string | null = null;

      const virouEmImpressao = pedidoAtual.status !== "EM_IMPRESSAO" && novoStatus === "EM_IMPRESSAO";
      const podeBaixarEstoque = virouEmImpressao && !pedidoAtual.estoqueBaixado;

      if (podeBaixarEstoque) {
        const consumoGrams = Math.max(0, Number(atualizado.pesoPecaGrams || 0));

        if (consumoGrams > 0) {
          const corFilamento = atualizado.filamentoCor?.trim() || null;
          const insumoFilamento = await tx.insumo.findFirst({
            where: {
              tipo: "FILAMENTO",
              ...(corFilamento
                ? {
                    cor: {
                      equals: corFilamento,
                      mode: "insensitive",
                    },
                  }
                : {}),
            },
            orderBy: { quantidadeGrams: "desc" },
          });

          if (insumoFilamento) {
            const qtdAtual = Number(insumoFilamento.quantidadeGrams);
            const qtdMin = Number(insumoFilamento.minGrams);
            const novaQuantidade = Math.max(0, qtdAtual - consumoGrams);
            const novoStatusEstoque = novaQuantidade <= qtdMin ? "ESTOQUE_BAIXO" : "NORMAL";

            await tx.insumo.update({
              where: { id: insumoFilamento.id },
              data: {
                quantidadeGrams: novaQuantidade,
                statusEstoque: novoStatusEstoque,
              },
            });

            await tx.transacao.create({
              data: {
                data: hojeISO(),
                tipo: "SAIDA",
                categoria: "Filamento",
                descricao: `Baixa automática de estoque do pedido ${atualizado.peca} (${atualizado.cliente})`,
                valor: (consumoGrams / 1000) * Number(insumoFilamento.preco),
                pedidoId: atualizado.id,
              },
            });

            if (novoStatusEstoque === "ESTOQUE_BAIXO") {
              estoqueAlerta = `Estoque baixo: ${insumoFilamento.nome}${insumoFilamento.cor ? ` (${insumoFilamento.cor})` : ""}. Reposição recomendada.`;
            }
          }
        }

        atualizado = await tx.pedido.update({
          where: { id },
          data: { estoqueBaixado: true },
        });
      }

      const virouEntregue = pedidoAtual.status !== "ENTREGUE" && novoStatus === "ENTREGUE";
      if (!virouEntregue) {
        return { pedido: atualizado, estoqueAlerta };
      }

      const provisoesExistentes = await tx.transacao.count({ where: { pedidoId: id } });
      if (provisoesExistentes > 0) {
        return atualizado;
      }

      const lucroLiquido = Math.max(0, atualizado.venda - atualizado.custoTotal);
      const dataHoje = new Date().toISOString().split("T")[0];

      await tx.transacao.createMany({
        data: [
          {
            data: dataHoje,
            tipo: "ENTRADA",
            categoria: "Filamento",
            descricao: `Provisao do pedido ${atualizado.peca} (${atualizado.cliente})`,
            valor: atualizado.custoFilamento,
            pedidoId: atualizado.id,
          },
          {
            data: dataHoje,
            tipo: "ENTRADA",
            categoria: "Energia",
            descricao: `Provisao do pedido ${atualizado.peca} (${atualizado.cliente})`,
            valor: atualizado.custoEnergia,
            pedidoId: atualizado.id,
          },
          {
            data: dataHoje,
            tipo: "ENTRADA",
            categoria: "Hora-Homem",
            descricao: `Provisao do pedido ${atualizado.peca} (${atualizado.cliente})`,
            valor: atualizado.custoHoraHomem,
            pedidoId: atualizado.id,
          },
          {
            data: dataHoje,
            tipo: "ENTRADA",
            categoria: "Manutencao Maquina",
            descricao: `Provisao do pedido ${atualizado.peca} (${atualizado.cliente})`,
            valor: atualizado.custoManutencao,
            pedidoId: atualizado.id,
          },
          {
            data: dataHoje,
            tipo: "ENTRADA",
            categoria: "Lucro Liquido",
            descricao: `Lucro liquido do pedido ${atualizado.peca} (${atualizado.cliente})`,
            valor: lucroLiquido,
            pedidoId: atualizado.id,
          },
        ],
      });

      return { pedido: atualizado, estoqueAlerta };
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar pedido" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/pedidos/[id]
 * Remove um pedido
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.pedido.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Pedido removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    return NextResponse.json(
      { error: "Falha ao deletar pedido" },
      { status: 500 }
    );
  }
}
