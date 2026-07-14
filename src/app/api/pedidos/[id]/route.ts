import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    const pedidoAtualizado = await prisma.$transaction(async (tx) => {
      const atualizado = await tx.pedido.update({
        where: { id },
        data: {
          status: novoStatus,
        },
      });

      const virouEntregue = pedidoAtual.status !== "ENTREGUE" && novoStatus === "ENTREGUE";
      if (!virouEntregue) {
        return atualizado;
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

      return atualizado;
    });

    return NextResponse.json(pedidoAtualizado);
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
