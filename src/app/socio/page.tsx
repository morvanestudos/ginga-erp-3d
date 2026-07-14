import Link from "next/link";
import { cookies } from "next/headers";

interface SocioPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function SocioPage({ searchParams }: SocioPageProps) {
  const cookieStore = await cookies();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const autorizado = cookieStore.get("socio_access")?.value === "ok";
  const erro = resolvedSearchParams?.error === "1";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans flex items-center justify-center">
      <section className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h1 className="text-2xl font-black text-white">Acesso do Socio</h1>
        <p className="text-zinc-400 text-sm mt-2">
          Use este caminho para entrada rapida no ERP.
        </p>

        {!autorizado && (
          <form action="/api/socio/login" method="POST" className="mt-6 space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase">
              Codigo de acesso
            </label>
            <input
              type="password"
              name="code"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100"
              placeholder="Digite o codigo"
            />
            {erro && (
              <p className="text-rose-400 text-xs">
                Codigo invalido. Tente novamente.
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-500 font-bold text-sm text-white py-2.5 rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>
        )}

        {autorizado && (
          <div className="mt-6 space-y-3">
            <p className="text-emerald-400 text-sm font-semibold">Acesso liberado.</p>
            <Link
              href="/"
              className="block text-center w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-sm text-white py-2.5 rounded-lg transition-colors"
            >
              Ir para o painel
            </Link>
            <form action="/api/socio/logout" method="POST">
              <button
                type="submit"
                className="w-full bg-zinc-800 hover:bg-zinc-700 font-bold text-sm text-zinc-100 py-2.5 rounded-lg transition-colors"
              >
                Sair deste acesso
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
