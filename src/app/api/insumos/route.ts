import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/insumos
 * Recupera todos os insumos ou filtra por tipo
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");

    const insumos = await prisma.insumo.findMany({
      where: tipo ? { tipo } : undefined,
      orderBy: { nome: "asc" },
    });

    return NextResponse.json(insumos);
  } catch (error) {
    console.error("Erro ao buscar insumos:", error);
    return NextResponse.json(
      { error: "Falha ao buscar insumos" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/insumos
 * Cria um novo insumo
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, tipo, cor, quantidadeGrams, minGrams, preco, unidadeMedida } = body;

    if (!nome || !tipo || quantidadeGrams === undefined || minGrams === undefined || preco === undefined) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const quantidadeNova = parseFloat(String(quantidadeGrams));
    const minNovo = parseFloat(String(minGrams));
    const precoNovo = parseFloat(String(preco));
    const unidadeNormalizada = (unidadeMedida || "G").toUpperCase();

    if (Number.isNaN(quantidadeNova) || Number.isNaN(minNovo) || Number.isNaN(precoNovo)) {
      return NextResponse.json(
        { error: "Valores numéricos inválidos" },
        { status: 400 }
      );
    }

    const corNormalizada = cor?.trim() || null;

    const insumoExistente = await prisma.insumo.findFirst({
      where: {
        nome: {
          equals: String(nome).trim(),
          mode: "insensitive",
        },
        cor:
          corNormalizada === null
            ? null
            : {
                equals: corNormalizada,
                mode: "insensitive",
              },
      },
    });

    if (insumoExistente) {
      const quantidadeAtual = Number(insumoExistente.quantidadeGrams);
      const precoAtual = Number(insumoExistente.preco);
      const novaQuantidadeTotal = quantidadeAtual + quantidadeNova;

      const precoMedio =
        novaQuantidadeTotal > 0
          ? ((precoAtual * quantidadeAtual) + (precoNovo * quantidadeNova)) / novaQuantidadeTotal
          : precoNovo;

      const insumoAtualizado = await prisma.insumo.update({
        where: { id: insumoExistente.id },
        data: {
          quantidadeGrams: novaQuantidadeTotal,
          minGrams: minNovo,
          preco: precoMedio,
          tipo,
          unidadeMedida: unidadeNormalizada,
          cor: corNormalizada,
        },
      });

      return NextResponse.json(insumoAtualizado, { status: 200 });
    }

    const novoInsumo = await prisma.insumo.create({
      data: {
        nome: String(nome).trim(),
        tipo,
        cor: corNormalizada,
        quantidadeGrams: quantidadeNova,
        unidadeMedida: unidadeNormalizada,
        minGrams: minNovo,
        preco: precoNovo,
      },
    });

    return NextResponse.json(novoInsumo, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar insumo:", error);
    return NextResponse.json(
      { error: "Falha ao criar insumo" },
      { status: 500 }
    );
  }
}
