import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/transacoes
 * Recupera todas as transações, com filtros opcionais
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const categoria = searchParams.get("categoria");

    const transacoes = await prisma.transacao.findMany({
      where: {
        ...(tipo && { tipo }),
        ...(categoria && { categoria }),
      },
      orderBy: { data: "desc" },
    });

    return NextResponse.json(transacoes);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return NextResponse.json(
      { error: "Falha ao buscar transações" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transacoes
 * Cria uma nova transação
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, tipo, categoria, descricao, valor, pedidoId } = body;

    if (!data || !tipo || !categoria || !descricao || valor === undefined) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const novaTransacao = await prisma.transacao.create({
      data: {
        data: String(data),
        tipo,
        categoria,
        descricao,
        valor: parseFloat(valor),
        pedidoId: pedidoId || null,
      },
    });

    return NextResponse.json(novaTransacao, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return NextResponse.json(
      { error: "Falha ao criar transação" },
      { status: 500 }
    );
  }
}
