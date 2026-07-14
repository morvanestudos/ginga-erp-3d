import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transacao = await prisma.transacao.findUnique({
      where: { id },
    });

    if (!transacao) {
      return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 });
    }

    return NextResponse.json(transacao);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar transação" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const transacao = await prisma.transacao.update({
      where: { id },
      data: {
        ...(body.data && { data: String(body.data) }),
        ...(body.tipo && { tipo: body.tipo }),
        ...(body.categoria && { categoria: body.categoria }),
        ...(body.descricao && { descricao: body.descricao }),
        ...(body.valor !== undefined && { valor: parseFloat(body.valor) }),
        ...(body.pedidoId !== undefined && { pedidoId: body.pedidoId || null }),
      },
    });

    return NextResponse.json(transacao);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar transação" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.transacao.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Transação deletada com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar transação" },
      { status: 500 }
    );
  }
}
