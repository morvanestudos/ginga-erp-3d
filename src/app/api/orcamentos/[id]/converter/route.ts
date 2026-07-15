import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function adicionarDiasUteis(base: Date, diasUteis: number): Date {
  const data = new Date(base);
  let restantes = diasUteis;

  while (restantes > 0) {
    data.setDate(data.getDate() + 1);
    const dia = data.getDay();
    const ehFimDeSemana = dia === 0 || dia === 6;
    if (!ehFimDeSemana) {
      restantes -= 1;
    }
  }

  return data;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const resultado = await prisma.$transaction(async (tx) => {
      let orcamento = await tx.orcamento.findUnique({ where: { id } });

      if (!orcamento) {
        orcamento = await tx.orcamento.findUnique({ where: { token: id } });
      }

      if (!orcamento) {
        throw new Error("ORCAMENTO_NAO_ENCONTRADO");
      }

      if (orcamento.status !== "APROVADO") {
        if (orcamento.status === "CONVERTIDO") {
          throw new Error("ORCAMENTO_JA_CONVERTIDO");
        }
        throw new Error("ORCAMENTO_NAO_APROVADO");
      }

      const custoTotal =
        Number(orcamento.custoMaterial || 0) +
        Number(orcamento.custoEnergia || 0) +
        Number(orcamento.custoManutencao || 0);

      const prazoDate = adicionarDiasUteis(new Date(), 5);
      const prazo = prazoDate.toISOString().split("T")[0];

      const pedido = await tx.pedido.create({
        data: {
          cliente: orcamento.clienteNome,
          peca: orcamento.pecaNome,
          pesoPecaGrams: Number(orcamento.pesoGrams || 0),
          custoFilamento: Number(orcamento.custoMaterial || 0),
          custoEnergia: Number(orcamento.custoEnergia || 0),
          custoHoraHomem: 0,
          custoManutencao: Number(orcamento.custoManutencao || 0),
          custoTotal,
          venda: Number(orcamento.precoVenda || 0),
          status: "RECEBIDO",
          prazo,
        },
      });

      const orcamentoAtualizado = await tx.orcamento.update({
        where: { id: orcamento.id },
        data: { status: "CONVERTIDO" },
      });

      return { pedido, orcamento: orcamentoAtualizado };
    });

    return NextResponse.json(resultado, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "ORCAMENTO_NAO_ENCONTRADO") {
      return NextResponse.json({ error: "Orcamento nao encontrado" }, { status: 404 });
    }

    if (message === "ORCAMENTO_NAO_APROVADO") {
      return NextResponse.json(
        { error: "Somente orcamentos aprovados podem ser convertidos" },
        { status: 409 }
      );
    }

    if (message === "ORCAMENTO_JA_CONVERTIDO") {
      return NextResponse.json(
        { error: "Este orcamento ja foi convertido para pedido" },
        { status: 409 }
      );
    }

    console.error("Erro ao converter orcamento:", error);
    return NextResponse.json(
      { error: "Falha ao converter orcamento em pedido" },
      { status: 500 }
    );
  }
}
