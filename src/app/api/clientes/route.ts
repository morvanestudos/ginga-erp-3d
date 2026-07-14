import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/clientes
 * Recupera todos os clientes/leads, com filtros opcionais
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusLead = searchParams.get("statusLead");

    const clientes = await prisma.clienteLead.findMany({
      where: statusLead ? { statusLead } : undefined,
      orderBy: { nome: "asc" },
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Falha ao buscar clientes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clientes
 * Cria um novo cliente/lead
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nome,
      contato,
      interessePrincipal,
      dataUltimaCompra,
      frequenciaRecorrencia,
      statusLead,
    } = body;

    if (!nome || !contato) {
      return NextResponse.json(
        { error: "Nome e Contato são obrigatórios" },
        { status: 400 }
      );
    }

    const novoCliente = await prisma.clienteLead.create({
      data: {
        nome,
        contato,
        interessePrincipal: interessePrincipal || "Não especificado",
        dataUltimaCompra: dataUltimaCompra
          ? new Date(dataUltimaCompra)
          : new Date(),
        frequenciaRecorrencia: frequenciaRecorrencia || 30,
        statusLead: statusLead || "FRIO",
      },
    });

    return NextResponse.json(novoCliente, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      { error: "Falha ao criar cliente" },
      { status: 500 }
    );
  }
}
