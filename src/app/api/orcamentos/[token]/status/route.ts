import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const STATUS_PERMITIDO = new Set(["APROVADO", "REJEITADO"]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const status = String(body.status || "").toUpperCase();

    if (!STATUS_PERMITIDO.has(status)) {
      return NextResponse.json(
        { error: "Status permitido: APROVADO ou REJEITADO" },
        { status: 400 }
      );
    }

    const existente = await prisma.orcamento.findUnique({ where: { token } });

    if (!existente) {
      return NextResponse.json({ error: "Orcamento nao encontrado" }, { status: 404 });
    }

    if (existente.status !== "PENDENTE") {
      return NextResponse.json(
        { error: "Somente orcamentos pendentes podem ser atualizados" },
        { status: 409 }
      );
    }

    const atualizado = await prisma.orcamento.update({
      where: { token },
      data: { status },
    });

    return NextResponse.json(atualizado);
  } catch (error) {
    console.error("Erro ao atualizar status do orcamento:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar status do orcamento" },
      { status: 500 }
    );
  }
}
