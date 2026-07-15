import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const STATUS_VALIDO = new Set(["PENDENTE", "APROVADO", "REJEITADO", "EXPIRADO"]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (token) {
      const orcamento = await prisma.orcamento.findUnique({ where: { token } });
      if (!orcamento) {
        return NextResponse.json({ error: "Orcamento nao encontrado" }, { status: 404 });
      }
      return NextResponse.json(orcamento);
    }

    const orcamentos = await prisma.orcamento.findMany({
      orderBy: { criadoEm: "desc" },
    });

    return NextResponse.json(orcamentos);
  } catch (error) {
    console.error("Erro ao buscar orcamentos:", error);
    return NextResponse.json({ error: "Falha ao buscar orcamentos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const clienteNome = String(body.clienteNome || "").trim();
    const clienteWhatsapp = String(body.clienteWhatsapp || "").trim();
    const pecaNome = String(body.pecaNome || "").trim();
    const pesoGrams = Number(body.pesoGrams || 0);
    const tempoHoras = Number(body.tempoHoras || 0);
    const custoMaterial = Number(body.custoMaterial || 0);
    const custoEnergia = Number(body.custoEnergia || 0);
    const custoManutencao = Number(body.custoManutencao || 0);
    const precoVenda = Number(body.precoVenda || 0);
    const validadeDias = Number(body.validadeDias || 7);
    const status = String(body.status || "PENDENTE").toUpperCase();

    if (!clienteNome || !clienteWhatsapp || !pecaNome) {
      return NextResponse.json({ error: "Campos obrigatorios faltando" }, { status: 400 });
    }

    if (pesoGrams <= 0 || tempoHoras <= 0 || precoVenda <= 0) {
      return NextResponse.json({ error: "Peso, tempo e preco devem ser maiores que zero" }, { status: 400 });
    }

    if (!STATUS_VALIDO.has(status)) {
      return NextResponse.json({ error: "Status invalido" }, { status: 400 });
    }

    const novoOrcamento = await prisma.orcamento.create({
      data: {
        clienteNome,
        clienteWhatsapp,
        pecaNome,
        pesoGrams,
        tempoHoras,
        custoMaterial,
        custoEnergia,
        custoManutencao,
        precoVenda,
        validadeDias: Math.max(1, validadeDias),
        status,
      },
    });

    return NextResponse.json(novoOrcamento, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar orcamento:", error);
    return NextResponse.json({ error: "Falha ao criar orcamento" }, { status: 500 });
  }
}
