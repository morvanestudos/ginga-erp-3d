import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const fechamentos = await prisma.fechamentoCaixa.findMany({
      orderBy: { criadoEm: "desc" },
    });

    return NextResponse.json(fechamentos);
  } catch (error) {
    console.error("Erro ao buscar fechamentos:", error);
    return NextResponse.json(
      { error: "Falha ao buscar fechamentos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tipoPeriodo,
      dataInicio,
      dataFim,
      saldoCalculado,
      saldoDeclarado,
      diferenca,
      status,
      observacao,
      fechadoPor,
      caixaFilamento,
      caixaEnergia,
      caixaHoraHomem,
      caixaManutencao,
      caixaLucro,
    } = body;

    if (
      !tipoPeriodo ||
      !dataInicio ||
      !dataFim ||
      saldoCalculado === undefined ||
      saldoDeclarado === undefined ||
      diferenca === undefined ||
      !status ||
      caixaFilamento === undefined ||
      caixaEnergia === undefined ||
      caixaHoraHomem === undefined ||
      caixaManutencao === undefined ||
      caixaLucro === undefined
    ) {
      return NextResponse.json(
        { error: "Campos obrigatorios faltando" },
        { status: 400 }
      );
    }

    const novoFechamento = await prisma.fechamentoCaixa.create({
      data: {
        tipoPeriodo,
        dataInicio: String(dataInicio),
        dataFim: String(dataFim),
        saldoCalculado: Number(saldoCalculado),
        saldoDeclarado: Number(saldoDeclarado),
        diferenca: Number(diferenca),
        status,
        observacao: observacao || null,
        fechadoPor: fechadoPor || "Sistema",
        caixaFilamento: Number(caixaFilamento),
        caixaEnergia: Number(caixaEnergia),
        caixaHoraHomem: Number(caixaHoraHomem),
        caixaManutencao: Number(caixaManutencao),
        caixaLucro: Number(caixaLucro),
      },
    });

    return NextResponse.json(novoFechamento, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar fechamento:", error);
    return NextResponse.json(
      { error: "Falha ao criar fechamento" },
      { status: 500 }
    );
  }
}
