"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErro(data?.error || "Não foi possível entrar. Tente novamente.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-fuchsia-700/20 blur-3xl" />
        <div className="absolute top-1/2 -right-24 h-72 w-72 rounded-full bg-cyan-700/20 blur-3xl" />
      </div>

      <section className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur p-8 shadow-2xl shadow-black/40">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Ginga ERP 3D</p>
          <h1 className="text-3xl font-black mt-2">Entrar na plataforma</h1>
          <p className="text-zinc-400 text-sm mt-2">Acesse com seu email e senha de sócio.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Email</span>
              <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-3">
                <span className="text-zinc-500 mr-2">✉</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@empresa.com"
                  className="w-full bg-transparent py-3 outline-none"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Senha</span>
              <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-3">
                <span className="text-zinc-500 mr-2">🔒</span>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full bg-transparent py-3 outline-none"
                  required
                />
              </div>
            </label>

            {erro ? <p className="text-sm text-rose-400">{erro}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-zinc-100 text-zinc-900 font-bold py-3 hover:bg-white transition-colors disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-sm text-zinc-400">
            Ainda não tem conta?{" "}
            <Link className="font-semibold text-cyan-300 hover:text-cyan-200" href="/cadastro">
              Criar conta de sócio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
