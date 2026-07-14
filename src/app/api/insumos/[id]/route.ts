import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
  try {
    const { id } = await params;
    const body = await request.json();

    const insumo = await prisma.insumo.update({
      where: { id },
      data: {
        ...(body.nome && { nome: body.nome }),
        ...(body.tipo && { tipo: body.tipo }),
        ...(body.cor !== undefined && { cor: body.cor }),
        ...(body.quantidadeGrams !== undefined && { quantidadeGrams: body.quantidadeGrams }),
        ...(body.minGrams !== undefined && { minGrams: body.minGrams }),
        ...(body.preco !== undefined && { preco: body.preco }),
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
