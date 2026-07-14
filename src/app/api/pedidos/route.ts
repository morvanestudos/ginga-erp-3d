import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/pedidos
 * Recupera todos os pedidos ou filtra por status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    console.log("Iniciando busca de pedidos, status:", status);
    console.log("Prisma client:", typeof prisma);

    const pedidos = await prisma.pedido.findMany({
      where: status ? { status } : undefined,
      orderBy: { criadoEm: "desc" },
    });

    console.log("Pedidos encontrados:", pedidos.length);
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Falha ao buscar pedidos", details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pedidos
 * Cria um novo pedido
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      cliente,
      peca,
      custoFilamento,
      custoEnergia,
      custoHoraHomem,
      custoManutencao,
      custoTotal,
      venda,
      prazo,
      status,
    } = body;

    // Validação básica
    if (
      !cliente ||
      !peca ||
      custoFilamento === undefined ||
      custoEnergia === undefined ||
      custoHoraHomem === undefined ||
      custoManutencao === undefined ||
      custoTotal === undefined ||
      venda === undefined ||
      !prazo
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const novoPedido = await prisma.pedido.create({
      data: {
        cliente,
        peca,
        custoFilamento: parseFloat(custoFilamento),
        custoEnergia: parseFloat(custoEnergia),
        custoHoraHomem: parseFloat(custoHoraHomem),
        custoManutencao: parseFloat(custoManutencao),
        custoTotal: parseFloat(custoTotal),
        venda: parseFloat(venda),
        prazo: String(prazo),
        status: status || "RECEBIDO",
      },
    });

    return NextResponse.json(novoPedido, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Falha ao criar pedido" },
      { status: 500 }
    );
  }
}
