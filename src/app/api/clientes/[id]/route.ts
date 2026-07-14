import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cliente = await prisma.clienteLead.findUnique({
      where: { id },
    });

    if (!cliente) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json(cliente);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar cliente" },
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

    const cliente = await prisma.clienteLead.update({
      where: { id },
      data: {
        ...(body.nome && { nome: body.nome }),
        ...(body.contato && { contato: body.contato }),
        ...(body.interessePrincipal && { interessePrincipal: body.interessePrincipal }),
        ...(body.dataUltimaCompra && { dataUltimaCompra: body.dataUltimaCompra }),
        ...(body.frequenciaRecorrencia !== undefined && { frequenciaRecorrencia: body.frequenciaRecorrencia }),
        ...(body.statusLead && { statusLead: body.statusLead }),
      },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
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
    await prisma.clienteLead.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar cliente" },
      { status: 500 }
    );
  }
}
