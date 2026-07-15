"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type StatusOrcamento = "PENDENTE" | "APROVADO" | "REJEITADO" | "EXPIRADO" | "CONVERTIDO";

interface OrcamentoPublico {
  id: string;
  clienteNome: string;
  clienteWhatsapp: string;
  pecaNome: string;
  pesoGrams: number;
  tempoHoras: number;
  custoMaterial: number;
  custoEnergia: number;
  custoManutencao: number;
  precoVenda: number;
  status: StatusOrcamento;
  token: string;
  validadeDias: number;
  criadoEm: string;
}

const statusLabel: Record<StatusOrcamento, string> = {
  PENDENTE: "Aguardando Aprovacao",
  APROVADO: "Aprovado",
  REJEITADO: "Recusado",
  EXPIRADO: "Expirado",
  CONVERTIDO: "Convertido em Pedido",
};

const statusClass: Record<StatusOrcamento, string> = {
  PENDENTE: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  APROVADO: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  REJEITADO: "bg-rose-500/15 text-rose-300 border-rose-400/30",
  EXPIRADO: "bg-zinc-700/40 text-zinc-200 border-zinc-500/40",
  CONVERTIDO: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
};

export default function OrcamentoPublicoPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;

  const [orcamento, setOrcamento] = useState<OrcamentoPublico | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const mensagemWhatsapp = useMemo(() => {
    if (!orcamento) return "";
    return `Ola! Acabei de aprovar o orcamento da peca ${orcamento.pecaNome} no valor de R$ ${orcamento.precoVenda.toFixed(2)}.`;
  }, [orcamento]);

  useEffect(() => {
    if (!token) return;

    const carregar = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const res = await fetch(`/api/orcamentos?token=${token}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Orcamento nao encontrado");

        const data = await res.json();
        setOrcamento(data);
      } catch (err) {
        console.error(err);
        setErro("Nao foi possivel carregar o orcamento.");
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [token]);

  const alterarStatus = async (novoStatus: "APROVADO" | "REJEITADO") => {
    if (!token || !orcamento) return;

    try {
      setAtualizando(true);
      const res = await fetch(`/api/orcamentos/${token}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Falha ao atualizar status");
      }

      setOrcamento(data);

      if (novoStatus === "APROVADO") {
        alert("Orcamento aprovado com sucesso!");
      } else {
        alert("Orcamento recusado.");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Erro ao atualizar status.");
    } finally {
      setAtualizando(false);
    }
  };

  if (carregando) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center p-6">
        <p className="text-sm text-zinc-400">Carregando proposta...</p>
      </main>
    );
  }

  if (erro || !orcamento) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
          <h1 className="text-xl font-bold text-white">Proposta indisponivel</h1>
          <p className="text-sm text-zinc-400 mt-2">{erro || "Este link nao e valido."}</p>
        </div>
      </main>
    );
  }

  const whatsappUrl = `https://wa.me/${orcamento.clienteWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(mensagemWhatsapp)}`;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Ginga 3D</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-2">Ginga 3D - Proposta Comercial</h1>
          <p className="text-zinc-400 mt-3">Ola, {orcamento.clienteNome}. Veja abaixo os detalhes da sua proposta.</p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 md:p-8 space-y-6 shadow-[0_20px_80px_-40px_rgba(236,72,153,.45)]">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-zinc-100">Resumo do Projeto</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusClass[orcamento.status]}`}>
              {statusLabel[orcamento.status]}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-3">
              <p className="text-zinc-400 text-xs uppercase">Modelo 3D</p>
              <p className="text-zinc-100 font-semibold mt-1">{orcamento.pecaNome}</p>
            </div>
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-3">
              <p className="text-zinc-400 text-xs uppercase">Peso estimado</p>
              <p className="text-zinc-100 font-semibold mt-1">{Number(orcamento.pesoGrams).toFixed(1)} g</p>
            </div>
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-3">
              <p className="text-zinc-400 text-xs uppercase">Tempo estimado</p>
              <p className="text-zinc-100 font-semibold mt-1">{Number(orcamento.tempoHoras).toFixed(1)} h</p>
            </div>
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-3">
              <p className="text-zinc-400 text-xs uppercase">Quantidade</p>
              <p className="text-zinc-100 font-semibold mt-1">1 unidade</p>
            </div>
          </div>

          <div className="rounded-xl border border-pink-500/30 bg-pink-500/5 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-pink-300">Valor total da proposta</p>
            <p className="text-4xl font-black text-white mt-2">R$ {Number(orcamento.precoVenda).toFixed(2)}</p>
          </div>

          {orcamento.status === "PENDENTE" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={atualizando}
                onClick={() => alterarStatus("APROVADO")}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 transition-colors disabled:opacity-60"
              >
                Aprovar Orcamento
              </button>
              <button
                type="button"
                disabled={atualizando}
                onClick={() => alterarStatus("REJEITADO")}
                className="rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-bold py-3 transition-colors disabled:opacity-60"
              >
                Recusar
              </button>
            </div>
          )}

          {orcamento.status === "APROVADO" && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-4 transition-colors"
            >
              Falar no WhatsApp
            </a>
          )}
        </section>
      </div>
    </main>
  );
}
