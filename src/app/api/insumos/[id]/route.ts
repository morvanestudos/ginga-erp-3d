import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const toNumber = (value: unknown): number | null => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const buildStatusEstoque = (
  quantidade: number,
  minimo: number
): string => {
  return quantidade <= minimo ? "ESTOQUE_BAIXO" : "NORMAL";
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const insumo = await prisma.insumo.findUnique({
      where: { id },
    });

    if (!insumo) {
      return NextResponse.json({ error: "Insumo não encontrado" }, { status: 404 });
    }

    return NextResponse.json(insumo);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar insumo" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return atualizarInsumo(request, params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return atualizarInsumo(request, params);
}

async function atualizarInsumo(
  request: NextRequest,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const insumoAtual = await prisma.insumo.findUnique({ where: { id } });
    if (!insumoAtual) {
      return NextResponse.json({ error: "Insumo não encontrado" }, { status: 404 });
    }

    const quantidadeBody = body.quantidadeGrams;
    const precoBody = body.preco;
    const minBody = body.minGrams;

    const quantidadeNova = quantidadeBody !== undefined ? toNumber(quantidadeBody) : Number(insumoAtual.quantidadeGrams);
    const precoNovo = precoBody !== undefined ? toNumber(precoBody) : Number(insumoAtual.preco);
    const minNovo = minBody !== undefined ? toNumber(minBody) : Number(insumoAtual.minGrams);

    if (quantidadeNova === null || precoNovo === null || minNovo === null) {
      return NextResponse.json(
        { error: "Campos numéricos inválidos para quantidade, preço ou mínimo" },
        { status: 400 }
      );
    }

    const statusEstoque = buildStatusEstoque(quantidadeNova, minNovo);

    const insumo = await prisma.insumo.update({
      where: { id },
      data: {
        ...(body.nome && { nome: body.nome }),
        ...(body.tipo && { tipo: body.tipo }),
        ...(body.cor !== undefined && { cor: body.cor }),
        ...(body.unidadeMedida !== undefined && { unidadeMedida: body.unidadeMedida }),
        quantidadeGrams: quantidadeNova,
        minGrams: minNovo,
        preco: precoNovo,
        statusEstoque,
      },
    });

    return NextResponse.json(insumo);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar insumo" },
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
    await prisma.insumo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Insumo deletado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar insumo" },
      { status: 500 }
    );
  }
}
