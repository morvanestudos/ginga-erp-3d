import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const catalogoProdutos = await prisma.catalogoProduto.findMany({
      orderBy: { categoria: "asc" },
    });
    return NextResponse.json(catalogoProdutos || [], { status: 200 });
  } catch (erro) {
    console.error("Erro ao buscar catálogo:", erro);
    return NextResponse.json(
      { error: "Erro ao buscar catálogo" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, descricao, pesoGrams, tempoImpressao, precoSugerido, categoria, linkStl } =
      await request.json();

    if (!nome || !pesoGrams || !tempoImpressao || !categoria) {
      return NextResponse.json(
        { error: "Nome, peso, tempo de impressão e categoria são obrigatórios" },
        { status: 400 }
      );
    }

    const novoProduto = await prisma.catalogoProduto.create({
      data: {
        nome,
        descricao,
        pesoGrams: parseFloat(String(pesoGrams)),
        tempoImpressao: parseFloat(String(tempoImpressao)),
        precoSugerido: parseFloat(String(precoSugerido || 0)),
        categoria,
        linkStl,
      },
    });

    return NextResponse.json(novoProduto, { status: 201 });
  } catch (erro) {
    console.error("Erro ao criar produto do catálogo:", erro);
    return NextResponse.json(
      { error: "Erro ao criar produto do catálogo" },
      { status: 500 }
    );
  }
}
