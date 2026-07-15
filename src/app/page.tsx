"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

interface Pedido {
  id: string;
  cliente: string;
  peca: string;
  pesoPecaGrams: number;
  filamentoCor?: string;
  estoqueBaixado?: boolean;
  custoFilamento: number;
  custoEnergia: number;
  custoHoraHomem: number;
  custoManutencao: number;
  custoTotal: number;
  venda: number;
  prazo: string;
  status: "RECEBIDO" | "EM_IMPRESSAO" | "ACABAMENTO" | "PRONTO" | "ENTREGUE";
}

interface Insumo {
  id: string;
  nome: string;
  tipo: "FILAMENTO" | "COLA" | "EMBALAGEM" | "OUTROS";
  cor?: string;
  statusEstoque?: "NORMAL" | "ESTOQUE_BAIXO";
  quantidadeGrams: number;
  unidadeMedida: string;
  minGrams: number;
  preco: number;
}

interface Transacao {
  id: string;
  data: string;
  tipo: "ENTRADA" | "SAIDA";
  categoria: string;
  descricao: string;
  valor: number;
  pedidoId?: string;
}

interface FechamentoCaixa {
  id: string;
  tipoPeriodo: "DIARIO" | "SEMANAL" | "MENSAL";
  dataInicio: string;
  dataFim: string;
  saldoCalculado: number;
  saldoDeclarado: number;
  diferenca: number;
  status: "ABERTO" | "CONCLUIDO";
  observacao?: string;
  fechadoPor: string;
  caixaFilamento: number;
  caixaEnergia: number;
  caixaHoraHomem: number;
  caixaManutencao: number;
  caixaLucro: number;
  criadoEm: string;
}

interface ClienteLead {
  id: string;
  nome: string;
  contato: string;
  interessePrincipal: string;
  dataUltimaCompra: string;
  frequenciaRecorrencia: number;
  statusLead: "FREGUES" | "LEAD_AQUECIDO" | "FRIO";
}

interface CatalogoProduto {
  id: string;
  nome: string;
  descricao?: string;
  pesoGrams: number;
  tempoImpressao: number;
  precoSugerido: number;
  categoria: string;
  linkStl?: string;
}

interface Orcamento {
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
  status: "PENDENTE" | "APROVADO" | "REJEITADO" | "EXPIRADO" | "CONVERTIDO";
  token: string;
  validadeDias: number;
  criadoEm: string;
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pedidos" | "estoque" | "financeiro" | "clientes" | "catalogo" | "orcamentos">("pedidos");

  const [pesoPeca, setPesoPeca] = useState<number>(100);
  const [tempoImpressao, setTempoImpressao] = useState<number>(4);
  const [precoRolo, setPrecoRolo] = useState<number>(95);
  const [pesoRolo] = useState<number>(1000);
  const [potenciaMaquina] = useState<number>(150);
  const [precoKwh] = useState<number>(1.18);
  const [valorHoraHomem, setValorHoraHomem] = useState<number>(8);
  const [taxaManutencao, setTaxaManutencao] = useState<number>(12);
  const [custoEmbalagem] = useState<number>(5.0);
  const [margemLucro, setMargemLucro] = useState<number>(100);

  const [nomeCliente, setNomeCliente] = useState<string>("");
  const [nomePeca, setNomePeca] = useState<string>("");
  const [corFilamentoPedido, setCorFilamentoPedido] = useState<string>("");
  const [prazoEntrega, setPrazoEntrega] = useState<string>("");

  const [nomeInsumo, setNomeInsumo] = useState<string>("");
  const [tipoInsumo, setTipoInsumo] = useState<"FILAMENTO" | "COLA" | "EMBALAGEM" | "OUTROS">("FILAMENTO");
  const [unidadeInsumo, setUnidadeInsumo] = useState<string>("G");
  const [corInsumo, setCorInsumo] = useState<string>("");
  const [qtdInsumo, setQtdInsumo] = useState<number>(1000);
  const [minInsumo, setMinInsumo] = useState<number>(200);
  const [precoInsumo, setPrecoInsumo] = useState<number>(95);

  const [finTipo, setFinTipo] = useState<"ENTRADA" | "SAIDA">("SAIDA");
  const [finCategoria, setFinCategoria] = useState<string>("Filamento");
  const [finDescricao, setFinDescricao] = useState<string>("");
  const [finValor, setFinValor] = useState<number>(0);
  const [financeiroSecao, setFinanceiroSecao] = useState<"caixa" | "fechamento">("caixa");
  const [fechamentos, setFechamentos] = useState<FechamentoCaixa[]>([]);
  const [tipoFechamento, setTipoFechamento] = useState<"DIARIO" | "SEMANAL" | "MENSAL">("DIARIO");
  const [saldoDeclarado, setSaldoDeclarado] = useState<number>(0);
  const [obsFechamento, setObsFechamento] = useState<string>("");

  const [crmNome, setCrmNome] = useState<string>("");
  const [crmContato, setCrmContato] = useState<string>("");
  const [crmInteresse, setCrmInteresse] = useState<string>("Action Figures");
  const [crmUltimaCompra, setCrmUltimaCompra] = useState<string>("");
  const [crmFrequencia, setCrmFrequencia] = useState<number>(30);
  const [crmStatus, setCrmStatus] = useState<"FREGUES" | "LEAD_AQUECIDO" | "FRIO">("LEAD_AQUECIDO");

  // Estados para formulário de catálogo
  const [catNome, setCatNome] = useState<string>("");
  const [catDescricao, setCatDescricao] = useState<string>("");
  const [catPeso, setCatPeso] = useState<number>(100);
  const [catTempo, setCatTempo] = useState<number>(4);
  const [catCategoria, setCatCategoria] = useState<string>("Action Figures");
  const [catLinkStl, setCatLinkStl] = useState<string>("");

  const [orcClienteNome, setOrcClienteNome] = useState<string>("");
  const [orcClienteWhatsapp, setOrcClienteWhatsapp] = useState<string>("");
  const [orcPecaNome, setOrcPecaNome] = useState<string>("");
  const [orcPesoGrams, setOrcPesoGrams] = useState<number>(100);
  const [orcTempoHoras, setOrcTempoHoras] = useState<number>(4);
  const [orcMargem, setOrcMargem] = useState<number>(100);
  const [orcValidadeDias, setOrcValidadeDias] = useState<number>(7);
  const [orcCustoMaterial, setOrcCustoMaterial] = useState<number>(0);
  const [orcCustoEnergia, setOrcCustoEnergia] = useState<number>(0);
  const [orcCustoManutencao, setOrcCustoManutencao] = useState<number>(0);
  const [orcPrecoVenda, setOrcPrecoVenda] = useState<number>(0);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [clientes, setClientes] = useState<ClienteLead[]>([]);
  const [catalogo, setCatalogo] = useState<CatalogoProduto[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [editandoInsumoId, setEditandoInsumoId] = useState<string | null>(null);
  const [ajusteQtd, setAjusteQtd] = useState<number>(0);
  const [ajustePreco, setAjustePreco] = useState<number>(0);
  const [ajusteMin, setAjusteMin] = useState<number>(0);
  const [carregado, setCarregado] = useState<boolean>(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [pedidosRes, insumosRes, transacoesRes, clientesRes, catalogoRes, fechamentosRes, orcamentosRes] = await Promise.all([
          fetch("/api/pedidos"),
          fetch("/api/insumos"),
          fetch("/api/transacoes"),
          fetch("/api/clientes"),
          fetch("/api/catalogo"),
          fetch("/api/fechamentos"),
          fetch("/api/orcamentos"),
        ]);

        if (!pedidosRes.ok || !insumosRes.ok || !transacoesRes.ok || !clientesRes.ok || !catalogoRes.ok || !fechamentosRes.ok || !orcamentosRes.ok) {
          throw new Error("Erro ao carregar dados do servidor");
        }

        const [pedidosData, insumosData, transacoesData, clientesData, catalogoData, fechamentosData, orcamentosData] = await Promise.all([
          pedidosRes.json(),
          insumosRes.json(),
          transacoesRes.json(),
          clientesRes.json(),
          catalogoRes.json(),
          fechamentosRes.json(),
          orcamentosRes.json(),
        ]);

        setPedidos(pedidosData || []);
        setInsumos(insumosData || []);
        setTransacoes(transacoesData || []);
        setClientes(clientesData || []);
        setCatalogo(catalogoData || []);
        setFechamentos(fechamentosData || []);
        setOrcamentos(orcamentosData || []);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        alert("Erro ao carregar dados do banco de dados. Verifique se o servidor está rodando.");
      } finally {
        setCarregado(true);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (tipoInsumo === "FILAMENTO") {
      setUnidadeInsumo("G");
    }
  }, [tipoInsumo]);


  const custoPorGrama = precoRolo / pesoRolo;
  const custoFilamento = pesoPeca * custoPorGrama;
  const custoEnergia = ((potenciaMaquina * tempoImpressao) / 1000) * precoKwh;
  const custoHoraHomem = tempoImpressao * valorHoraHomem;
  const custoManutencao = (custoFilamento + custoEnergia) * (taxaManutencao / 100);
  const custoTotalAtual = custoFilamento + custoEnergia + custoHoraHomem + custoManutencao;
  const valorLucroAtual = custoTotalAtual * (margemLucro / 100);
  const precoVendaAtual = custoTotalAtual + valorLucroAtual;

  const statusOrcamentoClass = (status: Orcamento["status"]) => {
    if (status === "APROVADO") return "bg-emerald-500/10 text-emerald-400";
    if (status === "REJEITADO") return "bg-rose-500/10 text-rose-400";
    if (status === "EXPIRADO") return "bg-zinc-700/40 text-zinc-300";
    if (status === "CONVERTIDO") return "bg-cyan-500/10 text-cyan-300";
    return "bg-amber-500/10 text-amber-300";
  };

  const statusOrcamentoLabel = (status: Orcamento["status"]) => {
    if (status === "APROVADO") return "Aprovado";
    if (status === "REJEITADO") return "Rejeitado";
    if (status === "EXPIRADO") return "Expirado";
    if (status === "CONVERTIDO") return "Convertido";
    return "Aguardando";
  };

  useEffect(() => {
    const custoMaterialEstimado = orcPesoGrams * custoPorGrama;
    const custoEnergiaEstimado = ((potenciaMaquina * orcTempoHoras) / 1000) * precoKwh;
    const custoManutencaoEstimado = (custoMaterialEstimado + custoEnergiaEstimado) * (taxaManutencao / 100);
    const base = custoMaterialEstimado + custoEnergiaEstimado + custoManutencaoEstimado;
    const venda = base + base * (orcMargem / 100);

    setOrcCustoMaterial(Number(custoMaterialEstimado.toFixed(2)));
    setOrcCustoEnergia(Number(custoEnergiaEstimado.toFixed(2)));
    setOrcCustoManutencao(Number(custoManutencaoEstimado.toFixed(2)));
    setOrcPrecoVenda(Number(venda.toFixed(2)));
  }, [orcPesoGrams, orcTempoHoras, orcMargem, custoPorGrama, potenciaMaquina, precoKwh, taxaManutencao]);

  // Converter para números para evitar erros de cálculo
  const toNumber = (val: unknown): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") return parseFloat(val) || 0;
    return 0;
  };

  const faturamentoTotal = pedidos.reduce((acc, p) => acc + toNumber(p.venda), 0);
  const custosTotaisAcumulados = pedidos.reduce((acc, p) => acc + toNumber(p.custoTotal), 0);
  const lucroTotalAcumulado = faturamentoTotal - custosTotaisAcumulados;

  const totalEntradasCaixa = transacoes.filter((t) => t.tipo === "ENTRADA").reduce((acc, t) => acc + toNumber(t.valor), 0);
  const totalSaidasCaixa = transacoes.filter((t) => t.tipo === "SAIDA").reduce((acc, t) => acc + toNumber(t.valor), 0);
  const saldoCaixaReal = totalEntradasCaixa - totalSaidasCaixa;
  const totalMovimentado = totalEntradasCaixa + totalSaidasCaixa;
  const pctEntradas = totalMovimentado > 0 ? (totalEntradasCaixa / totalMovimentado) * 100 : 0;
  const pctSaidas = totalMovimentado > 0 ? (totalSaidasCaixa / totalMovimentado) * 100 : 0;
  const saldoPorCategoria = (categoria: string): number => {
    return transacoes
      .filter((t) => t.categoria === categoria)
      .reduce((acc, t) => acc + (t.tipo === "ENTRADA" ? toNumber(t.valor) : -toNumber(t.valor)), 0);
  };

  const caixaFilamento = saldoPorCategoria("Filamento");
  const caixaEnergia = saldoPorCategoria("Energia");
  const caixaHoraHomem = saldoPorCategoria("Hora-Homem");
  const caixaManutencao = saldoPorCategoria("Manutencao Maquina");
  const caixaLucroComercial = saldoPorCategoria("Lucro Liquido");
  const saldoCalculadoFechamento = caixaFilamento + caixaEnergia + caixaHoraHomem + caixaManutencao + caixaLucroComercial;
  const diferencaFechamento = saldoDeclarado - saldoCalculadoFechamento;
  const caixaPerfeito = Math.abs(diferencaFechamento) < 0.01;

  const formatarDataISO = (data: Date): string => {
    return data.toISOString().split("T")[0];
  };

  const obterIntervaloFechamento = (tipo: "DIARIO" | "SEMANAL" | "MENSAL") => {
    const hoje = new Date();
    const fim = formatarDataISO(hoje);

    if (tipo === "DIARIO") {
      return { inicio: fim, fim };
    }

    if (tipo === "SEMANAL") {
      const inicioSemana = new Date(hoje);
      const diaSemana = inicioSemana.getDay();
      const ajuste = diaSemana === 0 ? 6 : diaSemana - 1;
      inicioSemana.setDate(inicioSemana.getDate() - ajuste);
      return { inicio: formatarDataISO(inicioSemana), fim };
    }

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    return { inicio: formatarDataISO(inicioMes), fim };
  };

  const obterDiasDesdeUltimaCompra = (dataString: string): number => {
    if (!dataString) return 999;
    const diffTime = Math.abs(new Date().getTime() - new Date(dataString).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleCriarPedido = async (e: FormEvent) => {
    e.preventDefault();
    if (!nomeCliente || !nomePeca || !prazoEntrega) return alert("Preencha todos os campos do pedido!");

    try {
      // Criar pedido
      const pedidoRes = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: nomeCliente,
          peca: nomePeca,
          pesoPecaGrams: pesoPeca,
          filamentoCor: corFilamentoPedido || null,
          custoFilamento,
          custoEnergia,
          custoHoraHomem,
          custoManutencao,
          custoTotal: custoTotalAtual,
          venda: precoVendaAtual,
          prazo: prazoEntrega,
          status: "RECEBIDO",
        }),
      });

      if (!pedidoRes.ok) throw new Error("Erro ao criar pedido");
      const novoPedido = await pedidoRes.json();

      // Verificar se cliente existe ou criar novo
      const clienteExistente = clientes.find((c) => c.nome.toLowerCase() === nomeCliente.toLowerCase());
      if (!clienteExistente) {
        await fetch("/api/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: nomeCliente,
            contato: "Definir",
            interessePrincipal: "Novos Projetos",
            dataUltimaCompra: new Date().toISOString().split("T")[0],
            frequenciaRecorrencia: 30,
            statusLead: "FREGUES",
          }),
        });
      } else {
        // Atualizar cliente existente
        await fetch(`/api/clientes/${clienteExistente.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dataUltimaCompra: new Date().toISOString().split("T")[0],
            statusLead: "FREGUES",
          }),
        });
      }

      // Atualizar estado local
      setPedidos((prev) => [novoPedido, ...prev]);

      if (!clienteExistente) {
        setClientes((prev) => [
          {
            id: `c_${Date.now()}`,
            nome: nomeCliente,
            contato: "Definir",
            interessePrincipal: "Novos Projetos",
            dataUltimaCompra: new Date().toISOString().split("T")[0],
            frequenciaRecorrencia: 30,
            statusLead: "FREGUES",
          },
          ...prev,
        ]);
      } else {
        setClientes((prev) =>
          prev.map((c) =>
            c.id === clienteExistente.id
              ? { ...c, dataUltimaCompra: new Date().toISOString().split("T")[0], statusLead: "FREGUES" as const }
              : c
          )
        );
      }

      setNomeCliente("");
      setNomePeca("");
      setCorFilamentoPedido("");
      setPrazoEntrega("");
    } catch (erro) {
      console.error("Erro ao criar pedido:", erro);
      alert("Erro ao criar pedido. Tente novamente.");
    }
  };

  const handleCriarInsumo = async (e: FormEvent) => {
    e.preventDefault();
    if (!nomeInsumo) return alert("Preencha o nome do insumo!");

    try {
      const unidadeNormalizada = tipoInsumo === "FILAMENTO" ? "G" : unidadeInsumo.toUpperCase();
      const valorFinanceiroReal = tipoInsumo === "FILAMENTO" ? (qtdInsumo / 1000) * precoInsumo : qtdInsumo * precoInsumo;

      // Criar insumo
      const insumoRes = await fetch("/api/insumos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeInsumo,
          tipo: tipoInsumo,
          cor: tipoInsumo === "FILAMENTO" ? corInsumo || undefined : undefined,
          quantidadeGrams: qtdInsumo,
          unidadeMedida: unidadeNormalizada,
          minGrams: minInsumo,
          preco: precoInsumo,
        }),
      });

      if (!insumoRes.ok) throw new Error("Erro ao criar insumo");
      const novoInsumo = await insumoRes.json();

      // Criar transação de saída
      const transacaoRes = await fetch("/api/transacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: new Date().toISOString().split("T")[0],
          tipo: "SAIDA",
          categoria: "Compra de Insumo",
          descricao: `Compra: ${nomeInsumo}${corInsumo ? ` (${corInsumo})` : ""} - ${qtdInsumo} ${unidadeNormalizada.toLowerCase()} - R$ ${valorFinanceiroReal.toFixed(2)}`,
          valor: valorFinanceiroReal,
        }),
      });

      if (!transacaoRes.ok) throw new Error("Erro ao criar transação");

      // Atualizar estado local
      setInsumos((prev) => {
        const idx = prev.findIndex((item) => item.id === novoInsumo.id);
        if (idx >= 0) {
          const atualizado = [...prev];
          atualizado[idx] = novoInsumo;
          return atualizado;
        }
        return [novoInsumo, ...prev];
      });
      setTransacoes((prev) => [
        {
          id: Date.now().toString(),
          data: new Date().toISOString().split("T")[0],
          tipo: "SAIDA",
          categoria: "Compra de Insumo",
          descricao: `Compra: ${nomeInsumo}${corInsumo ? ` (${corInsumo})` : ""} - ${qtdInsumo} ${unidadeNormalizada.toLowerCase()} - R$ ${valorFinanceiroReal.toFixed(2)}`,
          valor: valorFinanceiroReal,
        },
        ...prev,
      ]);

      setNomeInsumo("");
      setCorInsumo("");
    } catch (erro) {
      console.error("Erro ao criar insumo:", erro);
      alert("Erro ao criar insumo. Tente novamente.");
    }
  };

  const handleCriarLancamentoManual = async (e: FormEvent) => {
    e.preventDefault();
    if (!finDescricao || finValor <= 0) return alert("Preencha a descrição e um valor válido!");

    try {
      const transacaoRes = await fetch("/api/transacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: new Date().toISOString().split("T")[0],
          tipo: finTipo,
          categoria: finCategoria,
          descricao: finDescricao,
          valor: finValor,
        }),
      });

      if (!transacaoRes.ok) throw new Error("Erro ao criar transação");
      const novaTransacao = await transacaoRes.json();

      setTransacoes((prev) => [novaTransacao, ...prev]);
      setFinDescricao("");
      setFinValor(0);
    } catch (erro) {
      console.error("Erro ao criar transação:", erro);
      alert("Erro ao criar transação. Tente novamente.");
    }
  };

  const handleSalvarFechamento = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const intervalo = obterIntervaloFechamento(tipoFechamento);

      const fechamentoRes = await fetch("/api/fechamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoPeriodo: tipoFechamento,
          dataInicio: intervalo.inicio,
          dataFim: intervalo.fim,
          saldoCalculado: saldoCalculadoFechamento,
          saldoDeclarado,
          diferenca: diferencaFechamento,
          status: "CONCLUIDO",
          observacao: obsFechamento || null,
          fechadoPor: "Operador",
          caixaFilamento,
          caixaEnergia,
          caixaHoraHomem,
          caixaManutencao,
          caixaLucro: caixaLucroComercial,
        }),
      });

      if (!fechamentoRes.ok) throw new Error("Erro ao salvar fechamento");
      const novoFechamento = await fechamentoRes.json();

      setFechamentos((prev) => [novoFechamento, ...prev]);
      setObsFechamento("");
      alert("Fechamento registrado com sucesso.");
    } catch (erro) {
      console.error("Erro ao salvar fechamento:", erro);
      alert("Erro ao salvar fechamento. Tente novamente.");
    }
  };

  const handleCriarClienteCRM = async (e: FormEvent) => {
    e.preventDefault();
    if (!crmNome || !crmContato) return alert("Nome e Contato são obrigatórios!");

    try {
      const clienteRes = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: crmNome,
          contato: crmContato,
          interessePrincipal: crmInteresse,
          dataUltimaCompra: crmUltimaCompra || new Date().toISOString().split("T")[0],
          frequenciaRecorrencia: crmFrequencia,
          statusLead: crmStatus,
        }),
      });

      if (!clienteRes.ok) throw new Error("Erro ao criar cliente");
      const novoCliente = await clienteRes.json();

      setClientes((prev) => [novoCliente, ...prev]);
      setCrmNome("");
      setCrmContato("");
      setCrmUltimaCompra("");
    } catch (erro) {
      console.error("Erro ao criar cliente:", erro);
      alert("Erro ao criar cliente. Tente novamente.");
    }
  };

  const handleMudarStatus = async (id: string, novoStatus: Pedido["status"]) => {
    try {
      const res = await fetch(`/api/pedidos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar status");
      const dados = await res.json();

      setPedidos((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const pedidoAtualizado = dados?.pedido || {};
          return {
            ...p,
            status: novoStatus,
            estoqueBaixado: Boolean(pedidoAtualizado.estoqueBaixado ?? p.estoqueBaixado),
          };
        })
      );

      if (novoStatus === "EM_IMPRESSAO") {
        const insumosRes = await fetch("/api/insumos");
        if (insumosRes.ok) {
          const insumosData = await insumosRes.json();
          setInsumos(insumosData || []);
        }

        if (dados?.estoqueAlerta) {
          alert(dados.estoqueAlerta);
        }
      }

      if (novoStatus === "ENTREGUE") {
        const transacoesRes = await fetch("/api/transacoes");
        if (transacoesRes.ok) {
          const transacoesData = await transacoesRes.json();
          setTransacoes(transacoesData || []);
        }
      }
    } catch (erro) {
      console.error("Erro ao atualizar status do pedido:", erro);
      alert("Erro ao atualizar status. Tente novamente.");
    }
  };

  const handleMudarStatusCRM = async (id: string, novoStatus: ClienteLead["statusLead"]) => {
    try {
      const res = await fetch(`/api/clientes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusLead: novoStatus }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar status");

      setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, statusLead: novoStatus } : c)));
    } catch (erro) {
      console.error("Erro ao atualizar status do cliente:", erro);
      alert("Erro ao atualizar status. Tente novamente.");
    }
  };
  const handleDeletarPedido = async (id: string) => {
    try {
      const res = await fetch(`/api/pedidos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar pedido");
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    } catch (erro) {
      console.error("Erro ao deletar pedido:", erro);
      alert("Erro ao deletar pedido. Tente novamente.");
    }
  };

  const handleDeletarInsumo = async (id: string) => {
    try {
      const res = await fetch(`/api/insumos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar insumo");
      setInsumos((prev) => prev.filter((item) => item.id !== id));
    } catch (erro) {
      console.error("Erro ao deletar insumo:", erro);
      alert("Erro ao deletar insumo. Tente novamente.");
    }
  };

  const handleIniciarAjusteInsumo = (item: Insumo) => {
    setEditandoInsumoId(item.id);
    setAjusteQtd(toNumber(item.quantidadeGrams));
    setAjustePreco(toNumber(item.preco));
    setAjusteMin(toNumber(item.minGrams));
  };

  const handleCancelarAjusteInsumo = () => {
    setEditandoInsumoId(null);
  };

  const handleSalvarAjusteInsumo = async (id: string) => {
    try {
      const res = await fetch(`/api/insumos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantidadeGrams: ajusteQtd,
          preco: ajustePreco,
          minGrams: ajusteMin,
        }),
      });

      if (!res.ok) throw new Error("Erro ao ajustar insumo");
      const atualizado = await res.json();

      setInsumos((prev) => prev.map((item) => (item.id === id ? atualizado : item)));
      setEditandoInsumoId(null);
    } catch (erro) {
      console.error("Erro ao ajustar insumo:", erro);
      alert("Erro ao salvar ajuste do estoque.");
    }
  };

  const handleDeletarTransacao = async (id: string) => {
    try {
      const res = await fetch(`/api/transacoes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar transação");
      setTransacoes((prev) => prev.filter((t) => t.id !== id));
    } catch (erro) {
      console.error("Erro ao deletar transação:", erro);
      alert("Erro ao deletar transação. Tente novamente.");
    }
  };

  const handleDeletarCliente = async (id: string) => {
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar cliente");
      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch (erro) {
      console.error("Erro ao deletar cliente:", erro);
      alert("Erro ao deletar cliente. Tente novamente.");
    }
  };

  const handleCriarCatalogoProduto = async (e: FormEvent) => {
    e.preventDefault();
    if (!catNome || !catPeso || !catTempo || !catCategoria) {
      return alert("Preencha os campos obrigatórios do catálogo!");
    }

    try {
      // Calcular preço sugerido com custos atuais
      const custoPorGrama = precoRolo / pesoRolo;
      const custoFilamento = catPeso * custoPorGrama;
      const custoEnergia = ((potenciaMaquina * catTempo) / 1000) * precoKwh;
      const custoTotal = custoFilamento + custoEnergia + custoEmbalagem;
      const valorLucro = custoTotal * (margemLucro / 100);
      const precoSugerido = custoTotal + valorLucro;

      const res = await fetch("/api/catalogo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: catNome,
          descricao: catDescricao,
          pesoGrams: catPeso,
          tempoImpressao: catTempo,
          precoSugerido,
          categoria: catCategoria,
          linkStl: catLinkStl || null,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar produto do catálogo");
      const novoProduto = await res.json();

      setCatalogo((prev) => [novoProduto, ...prev]);
      setCatNome("");
      setCatDescricao("");
      setCatPeso(100);
      setCatTempo(4);
      setCatCategoria("Action Figures");
      setCatLinkStl("");
      alert("✓ Produto adicionado ao catálogo!");
    } catch (erro) {
      console.error("Erro ao criar produto do catálogo:", erro);
      alert("Erro ao criar produto. Tente novamente.");
    }
  };

  const handleCriarOrcamento = async (e: FormEvent) => {
    e.preventDefault();

    if (!orcClienteNome || !orcClienteWhatsapp || !orcPecaNome) {
      return alert("Nome do cliente, WhatsApp e nome do modelo são obrigatórios.");
    }

    try {
      const res = await fetch("/api/orcamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteNome: orcClienteNome,
          clienteWhatsapp: orcClienteWhatsapp,
          pecaNome: orcPecaNome,
          pesoGrams: orcPesoGrams,
          tempoHoras: orcTempoHoras,
          custoMaterial: orcCustoMaterial,
          custoEnergia: orcCustoEnergia,
          custoManutencao: orcCustoManutencao,
          precoVenda: orcPrecoVenda,
          validadeDias: orcValidadeDias,
          status: "PENDENTE",
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar orçamento");
      const novoOrcamento = await res.json();

      setOrcamentos((prev) => [novoOrcamento, ...prev]);
      setOrcClienteNome("");
      setOrcClienteWhatsapp("");
      setOrcPecaNome("");
      setOrcPesoGrams(100);
      setOrcTempoHoras(4);
      setOrcValidadeDias(7);
      alert("✓ Orçamento criado e pronto para envio.");
    } catch (erro) {
      console.error("Erro ao criar orçamento:", erro);
      alert("Erro ao criar orçamento. Tente novamente.");
    }
  };

  const handleCopiarLinkOrcamento = async (token: string) => {
    try {
      const link = `${window.location.origin}/orcamento/${token}`;
      await navigator.clipboard.writeText(link);
      alert("Link copiado para a área de transferência.");
    } catch (erro) {
      console.error("Erro ao copiar link:", erro);
      alert("Não foi possível copiar o link.");
    }
  };

  const handleConverterOrcamento = async (id: string) => {
    try {
      const res = await fetch(`/api/orcamentos/${id}/converter`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erro ao converter orçamento");
      }

      setOrcamentos((prev) => prev.map((item) => (item.id === id ? data.orcamento : item)));
      setPedidos((prev) => [data.pedido, ...prev]);
      alert("✓ Orçamento convertido em pedido com sucesso.");
    } catch (erro) {
      console.error("Erro ao converter orçamento:", erro);
      alert(erro instanceof Error ? erro.message : "Erro ao converter orçamento.");
    }
  };

  const handleDeletarCatalogoProduto = async (id: string) => {
    try {
      const res = await fetch(`/api/catalogo/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar produto");
      setCatalogo((prev) => prev.filter((p) => p.id !== id));
    } catch (erro) {
      console.error("Erro ao deletar produto do catálogo:", erro);
      alert("Erro ao deletar produto. Tente novamente.");
    }
  };

  const handleIniciarProducaoRapida = (produto: CatalogoProduto) => {
    // Preencher automaticamente o formulário de pedidos com dados do catálogo
    setPesoPeca(toNumber(produto.pesoGrams));
    setTempoImpressao(toNumber(produto.tempoImpressao));
    setNomePeca(produto.nome);
    setActiveTab("pedidos");
    // Scroll para o formulário (opcional)
    setTimeout(() => {
      const formElement = document.querySelector("input[placeholder='Nome do Cliente']") as HTMLInputElement;
      if (formElement) formElement.focus();
    }, 100);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  if (!carregado) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">Carregando Ginga ERP...</div>;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">Ginga ERP 3D</h1>
          <p className="text-zinc-400 text-sm mt-1">Gestão de Custos, Produção e Leads Recorrentes</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex-wrap gap-1">
            <button onClick={() => setActiveTab("pedidos")} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "pedidos" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>📋 Pedidos</button>
            <button onClick={() => setActiveTab("estoque")} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "estoque" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>📦 Estoque</button>
            <button onClick={() => setActiveTab("financeiro")} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "financeiro" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>💰 Finanças</button>
            <button onClick={() => setActiveTab("clientes")} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "clientes" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>👥 Clientes & Leads</button>
            <button onClick={() => setActiveTab("catalogo")} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "catalogo" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>🗂️ Catálogo</button>
            <button onClick={() => setActiveTab("orcamentos")} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "orcamentos" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>📋 Orçamentos</button>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="ml-auto md:ml-0 px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:text-white transition-colors text-sm font-bold"
          >
            🚪 Sair
          </button>
        </div>
      </header>

      {activeTab === "pedidos" && (
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Faturamento Projetado</p>
              <p className="text-2xl font-black text-white mt-1">R$ {faturamentoTotal.toFixed(2)}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Custos Estimados</p>
              <p className="text-2xl font-black text-rose-500 mt-1">R$ {custosTotaisAcumulados.toFixed(2)}</p>
            </div>
            <div className="bg-zinc-900 border border-pink-500/30 p-4 rounded-xl shadow-md bg-gradient-to-br from-zinc-900 to-pink-950/10">
              <p className="text-xs font-bold text-pink-400 uppercase tracking-wider">Margem de Lucro</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">R$ {lucroTotalAcumulado.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-2">1. Calculadora de Custos Avançada</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Peso da Peça (g)</label>
                  <input type="number" value={pesoPeca} onChange={(e) => setPesoPeca(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Tempo de Impressão (h)</label>
                  <input type="number" value={tempoImpressao} onChange={(e) => setTempoImpressao(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Preço do Rolo (R$)</label>
                  <input type="number" value={precoRolo} onChange={(e) => setPrecoRolo(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Hora-Homem (R$/h)</label>
                  <input type="number" value={valorHoraHomem} onChange={(e) => setValorHoraHomem(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Taxa de Manutenção (%)</label>
                  <input type="number" value={taxaManutencao} onChange={(e) => setTaxaManutencao(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Margem de Lucro (%)</label>
                  <input type="number" value={margemLucro} onChange={(e) => setMargemLucro(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-pink-500" />
                </div>
              </div>
              <form onSubmit={handleCriarPedido} className="border-t border-zinc-800 pt-4 mt-4 space-y-3">
                <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Converter este cálculo em Pedido</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input type="text" placeholder="Nome do Cliente" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100" />
                  <input type="text" placeholder="Nome do Produto" value={nomePeca} onChange={(e) => setNomePeca(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100" />
                  <input type="text" placeholder="Cor do Filamento (opcional)" value={corFilamentoPedido} onChange={(e) => setCorFilamentoPedido(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100" />
                  <input type="date" value={prazoEntrega} onChange={(e) => setPrazoEntrega(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100" />
                </div>
                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 font-bold text-sm text-white py-2.5 rounded-lg transition-colors">✓ Adicionar à Esteira e Vincular CRM</button>
              </form>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-2 mb-4">2. Detalhamento Técnico</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-zinc-400">Filamento:</span><span>R$ {custoFilamento.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Energia:</span><span>R$ {custoEnergia.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Hora-Homem:</span><span>R$ {custoHoraHomem.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Manutenção:</span><span>R$ {custoManutencao.toFixed(2)}</span></div>
                  <div className="border-t border-zinc-800 my-2 pt-2 flex justify-between font-semibold text-base"><span className="text-zinc-300">Custo Total:</span><span className="text-emerald-400">R$ {custoTotalAtual.toFixed(2)}</span></div>
                </div>
              </div>
              <div className="bg-zinc-950 border border-pink-500/20 rounded-xl p-4 text-center mt-6">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-500">Preço Sugerido Final</span>
                <div className="text-4xl font-black text-white">R$ {precoVendaAtual.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-4 mb-4">📋 Esteira de Produção & Pedidos Ativos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-2">Cliente</th>
                    <th className="py-3 px-2">Peça / STL</th>
                    <th className="py-3 px-2">Custo</th>
                    <th className="py-3 px-2">Preço Venda</th>
                    <th className="py-3 px-2">Prazo</th>
                    <th className="py-3 px-2 text-center">Status</th>
                    <th className="py-3 px-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="py-4 px-2 font-semibold text-zinc-200">{pedido.cliente}</td>
                      <td className="py-4 px-2 text-zinc-400">{pedido.peca}</td>
                      <td className="py-4 px-2 text-zinc-400">R$ {toNumber(pedido.custoTotal).toFixed(2)}</td>
                      <td className="py-4 px-2 text-pink-400 font-bold">R$ {toNumber(pedido.venda).toFixed(2)}</td>
                      <td className="py-4 px-2 text-zinc-400 font-mono text-xs">{pedido.prazo}</td>
                      <td className="py-4 px-2 text-center">
                        <select value={pedido.status} onChange={(e) => handleMudarStatus(pedido.id, e.target.value as Pedido["status"])} className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs font-bold text-pink-400 focus:outline-none">
                          <option value="RECEBIDO">📥 RECEBIDO</option>
                          <option value="EM_IMPRESSAO">🖨️ EM IMPRESSÃO</option>
                          <option value="ACABAMENTO">✨ ACABAMENTO</option>
                          <option value="PRONTO">✅ PRONTO</option>
                          <option value="ENTREGUE">📦 ENTREGUE</option>
                        </select>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button onClick={() => handleDeletarPedido(pedido.id)} className="text-xs text-rose-500 hover:underline">Remover</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "estoque" && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-fit space-y-4">
            <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-2">Entrada de Material</h2>
            <form onSubmit={handleCriarInsumo} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Nome do Item</label>
                <input type="text" placeholder="Ex: PLA Filamento" value={nomeInsumo} onChange={(e) => setNomeInsumo(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Tipo de Material</label>
                <select value={tipoInsumo} onChange={(e) => setTipoInsumo(e.target.value as Insumo["tipo"])} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-300">
                  <option value="FILAMENTO">🖨️ FILAMENTO</option>
                  <option value="COLA">🧪 COLA</option>
                  <option value="EMBALAGEM">📦 EMBALAGEM</option>
                  <option value="OUTROS">🛠️ OUTROS</option>
                </select>
              </div>
              {tipoInsumo !== "FILAMENTO" && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Unidade</label>
                  <select value={unidadeInsumo} onChange={(e) => setUnidadeInsumo(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-300">
                    <option value="UN">un</option>
                    <option value="G">g</option>
                    <option value="ML">ml</option>
                  </select>
                </div>
              )}
              {tipoInsumo === "FILAMENTO" && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Cor</label>
                  <input type="text" placeholder="Ex: Rosa Neon" value={corInsumo} onChange={(e) => setCorInsumo(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Qtd ({(tipoInsumo === "FILAMENTO" ? "G" : unidadeInsumo).toLowerCase()})</label>
                  <input type="number" value={qtdInsumo} onChange={(e) => setQtdInsumo(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Mín ({(tipoInsumo === "FILAMENTO" ? "G" : unidadeInsumo).toLowerCase()})</label>
                  <input type="number" value={minInsumo} onChange={(e) => setMinInsumo(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Preço (R$)</label>
                <input type="number" value={precoInsumo} onChange={(e) => setPrecoInsumo(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-100" />
              </div>
              <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 font-bold text-sm text-white py-2.5 rounded-lg transition-colors mt-2">✓ Registrar Material</button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-4 mb-4">📦 Almoxarifado Ginga 3D</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-2">Material</th>
                    <th className="py-3 px-2">Tipo</th>
                    <th className="py-3 px-2">Cor</th>
                    <th className="py-3 px-2">Qtd Atual</th>
                    <th className="py-3 px-2">Preço</th>
                    <th className="py-3 px-2">Mínimo</th>
                    <th className="py-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {insumos.map((item) => {
                    const estoqueBaixo = (item.statusEstoque || "NORMAL") === "ESTOQUE_BAIXO" || item.quantidadeGrams <= item.minGrams;
                    const emEdicao = editandoInsumoId === item.id;
                    return (
                      <tr key={item.id} className="hover:bg-zinc-800/20 transition-colors">
                        <td className="py-4 px-2 font-semibold text-zinc-200">{item.nome}</td>
                        <td className="py-4 px-2 text-xs text-zinc-400">{item.tipo}</td>
                        <td className="py-4 px-2 text-zinc-300">{item.cor || "—"}</td>
                        <td className="py-4 px-2 font-mono text-zinc-200">
                          {emEdicao ? (
                            <input
                              type="number"
                              value={ajusteQtd}
                              onChange={(e) => setAjusteQtd(Number(e.target.value))}
                              className="w-24 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                            />
                          ) : (
                            <>
                              {item.quantidadeGrams} {item.unidadeMedida?.toLowerCase?.() || "g"}
                            </>
                          )}
                        </td>
                        <td className="py-4 px-2 text-zinc-400">
                          {emEdicao ? (
                            <input
                              type="number"
                              value={ajustePreco}
                              onChange={(e) => setAjustePreco(Number(e.target.value))}
                              className="w-24 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                            />
                          ) : (
                            <>R$ {toNumber(item.preco).toFixed(2)}</>
                          )}
                        </td>
                        <td className="py-4 px-2 text-zinc-400">
                          {emEdicao ? (
                            <input
                              type="number"
                              value={ajusteMin}
                              onChange={(e) => setAjusteMin(Number(e.target.value))}
                              className="w-20 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
                            />
                          ) : (
                            <>{item.minGrams}</>
                          )}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {estoqueBaixo ? (
                              <span className="bg-rose-500/10 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">Abastecer!</span>
                            ) : (
                              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Normal</span>
                            )}
                            {emEdicao ? (
                              <>
                                <button onClick={() => handleSalvarAjusteInsumo(item.id)} className="text-emerald-400 hover:text-emerald-300 text-xs">Salvar</button>
                                <button onClick={handleCancelarAjusteInsumo} className="text-zinc-400 hover:text-zinc-300 text-xs">Cancelar</button>
                              </>
                            ) : (
                              <button onClick={() => handleIniciarAjusteInsumo(item)} className="text-sky-400 hover:text-sky-300 text-xs">✏️ Ajustar</button>
                            )}
                            <button onClick={() => handleDeletarInsumo(item.id)} className="text-zinc-500 hover:text-rose-400 text-xs">✕</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "financeiro" && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex-wrap gap-1">
            <button onClick={() => setFinanceiroSecao("caixa")} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${financeiroSecao === "caixa" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>💰 Operação de Caixa</button>
            <button onClick={() => setFinanceiroSecao("fechamento")} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${financeiroSecao === "fechamento" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>🔒 Fechamento & Auditoria</button>
          </div>

          {financeiroSecao === "caixa" && (
            <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs font-bold text-zinc-400 uppercase">Entradas</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">R$ {totalEntradasCaixa.toFixed(2)}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs font-bold text-zinc-400 uppercase">Saídas</p>
              <p className="text-2xl font-black text-rose-500 mt-1">R$ {totalSaidasCaixa.toFixed(2)}</p>
            </div>
            <div className="bg-zinc-900 border border-pink-500/40 rounded-xl p-4 shadow-lg bg-gradient-to-br from-zinc-900 to-pink-950/20">
              <p className="text-xs font-bold text-pink-400 uppercase">Saldo</p>
              <p className={`text-2xl font-black mt-1 ${saldoCaixaReal >= 0 ? "text-emerald-400" : "text-rose-500"}`}>R$ {saldoCaixaReal.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-zinc-200 mb-4">Caixinhas de Provisão</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                <p className="text-[11px] uppercase text-zinc-400 font-bold">Filamento</p>
                <p className="text-xl font-black text-emerald-400 mt-1">R$ {caixaFilamento.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                <p className="text-[11px] uppercase text-zinc-400 font-bold">Energia</p>
                <p className="text-xl font-black text-cyan-400 mt-1">R$ {caixaEnergia.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                <p className="text-[11px] uppercase text-zinc-400 font-bold">Mao de Obra</p>
                <p className="text-xl font-black text-amber-400 mt-1">R$ {caixaHoraHomem.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                <p className="text-[11px] uppercase text-zinc-400 font-bold">Manutencao</p>
                <p className="text-xl font-black text-orange-400 mt-1">R$ {caixaManutencao.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                <p className="text-[11px] uppercase text-zinc-400 font-bold">Lucro Comercial</p>
                <p className="text-xl font-black text-pink-400 mt-1">R$ {caixaLucroComercial.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-xs font-bold text-zinc-300 uppercase mb-3">Proporção Entradas vs Saídas</h3>
            <div className="w-full h-8 bg-zinc-950 rounded-lg overflow-hidden flex border border-zinc-800">
              {totalMovimentado > 0 ? (
                <>
                  <div style={{ width: `${pctEntradas}%` }} className="h-full bg-emerald-500 transition-all duration-500 flex items-center justify-center text-[10px] font-black text-black">
                    {pctEntradas > 15 && `${pctEntradas.toFixed(0)}%`}
                  </div>
                  <div style={{ width: `${pctSaidas}%` }} className="h-full bg-rose-500 transition-all duration-500 flex items-center justify-center text-[10px] font-black text-white">
                    {pctSaidas > 15 && `${pctSaidas.toFixed(0)}%`}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600">Sem movimento</div>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-4 mb-4">💰 Livro Caixa</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase">
                    <th className="py-3 px-2">Data</th>
                    <th className="py-3 px-2">Tipo</th>
                    <th className="py-3 px-2">Categoria</th>
                    <th className="py-3 px-2">Descrição</th>
                    <th className="py-3 px-2">Valor</th>
                    <th className="py-3 px-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {transacoes.map((t) => (
                    <tr key={t.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="py-4 px-2 text-zinc-400 font-mono text-xs">{t.data}</td>
                      <td className="py-4 px-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.tipo === "ENTRADA" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                          {t.tipo === "ENTRADA" ? "📥" : "📤"}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-zinc-300 text-xs">{t.categoria}</td>
                      <td className="py-4 px-2 text-zinc-400 truncate max-w-[150px]">{t.descricao}</td>
                      <td className={`py-4 px-2 font-bold ${t.tipo === "ENTRADA" ? "text-emerald-400" : "text-rose-500"}`}>
                        {t.tipo === "ENTRADA" ? "+" : "-"} R$ {toNumber(t.valor).toFixed(2)}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button onClick={() => handleDeletarTransacao(t.id)} className="text-zinc-600 hover:text-rose-400 text-xs">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-zinc-200 mb-4">Lançamento Avulso</h3>
            <form onSubmit={handleCriarLancamentoManual} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Tipo</label>
                  <div className="flex gap-2 mt-1">
                    <button type="button" onClick={() => setFinTipo("ENTRADA")} className={`flex-1 py-1.5 rounded text-xs font-bold ${finTipo === "ENTRADA" ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-300"}`}>➕ Entrada</button>
                    <button type="button" onClick={() => setFinTipo("SAIDA")} className={`flex-1 py-1.5 rounded text-xs font-bold ${finTipo === "SAIDA" ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300"}`}>➖ Saída</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Categoria</label>
                  <select value={finCategoria} onChange={(e) => setFinCategoria(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs focus:outline-none text-zinc-300">
                    <option>Filamento</option>
                    <option>Energia</option>
                    <option>Hora-Homem</option>
                    <option>Manutencao Maquina</option>
                    <option>Lucro Liquido</option>
                    <option>Marketing</option>
                    <option>Outros</option>
                  </select>
                </div>
              </div>
              <input type="text" placeholder="Descrição" value={finDescricao} onChange={(e) => setFinDescricao(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none text-zinc-100" />
              <div className="flex gap-2">
                <input type="number" step="0.01" placeholder="Valor R$" value={finValor} onChange={(e) => setFinValor(Number(e.target.value))} className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none text-zinc-100" />
                <button type="submit" className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-4 py-2 rounded transition-colors text-sm">✓ Lançar</button>
              </div>
            </form>
          </div>
            </>
          )}

          {financeiroSecao === "fechamento" && (
            <>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-4 mb-4">🔒 Assistente de Fechamento Diário</h2>
                <form onSubmit={handleSalvarFechamento} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                      <p className="text-[11px] uppercase text-zinc-400 font-bold">Saldo Calculado do Sistema</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">R$ {saldoCalculadoFechamento.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Período</label>
                      <select value={tipoFechamento} onChange={(e) => setTipoFechamento(e.target.value as "DIARIO" | "SEMANAL" | "MENSAL")} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none text-zinc-100">
                        <option value="DIARIO">Diário</option>
                        <option value="SEMANAL">Semanal</option>
                        <option value="MENSAL">Mensal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Saldo Físico Real</label>
                      <input type="number" step="0.01" value={saldoDeclarado} onChange={(e) => setSaldoDeclarado(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none text-zinc-100" />
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                      <p className="text-[11px] uppercase text-zinc-400 font-bold">Diferença</p>
                      <p className={`text-2xl font-black mt-1 ${caixaPerfeito ? "text-emerald-400" : "text-rose-400"}`}>R$ {diferencaFechamento.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {caixaPerfeito ? (
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">Caixa Perfeito</span>
                    ) : (
                      <span className="bg-rose-500/10 text-rose-400 text-xs font-bold px-3 py-1 rounded-full">Diferença detectada</span>
                    )}
                    <button type="button" onClick={() => setSaldoDeclarado(saldoCalculadoFechamento)} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded">Usar saldo calculado</button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Observação</label>
                    <textarea value={obsFechamento} onChange={(e) => setObsFechamento(e.target.value)} placeholder="Ex: R$ 5,00 de desconto arredondado para cliente" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none text-zinc-100 min-h-20 resize-none" />
                  </div>

                  <button type="submit" className="w-full sm:w-auto bg-pink-600 hover:bg-pink-500 text-white font-bold px-4 py-2 rounded transition-colors text-sm">✓ Salvar Fechamento</button>
                </form>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-4 mb-4">📚 Histórico de Fechamentos</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase">
                        <th className="py-3 px-2">Período</th>
                        <th className="py-3 px-2">Data</th>
                        <th className="py-3 px-2">Caixinhas</th>
                        <th className="py-3 px-2">Calculado</th>
                        <th className="py-3 px-2">Declarado</th>
                        <th className="py-3 px-2">Diferença</th>
                        <th className="py-3 px-2">Fechado Por</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {fechamentos.map((f) => (
                        <tr key={f.id} className="hover:bg-zinc-800/20 transition-colors">
                          <td className="py-4 px-2 text-zinc-200 font-semibold">{f.tipoPeriodo}</td>
                          <td className="py-4 px-2 text-zinc-400 text-xs">{f.dataInicio} até {f.dataFim}</td>
                          <td className="py-4 px-2 text-zinc-300 text-xs">Fil: R$ {toNumber(f.caixaFilamento).toFixed(2)} | En: R$ {toNumber(f.caixaEnergia).toFixed(2)} | HH: R$ {toNumber(f.caixaHoraHomem).toFixed(2)} | Man: R$ {toNumber(f.caixaManutencao).toFixed(2)} | Luc: R$ {toNumber(f.caixaLucro).toFixed(2)}</td>
                          <td className="py-4 px-2 text-emerald-400 font-bold">R$ {toNumber(f.saldoCalculado).toFixed(2)}</td>
                          <td className="py-4 px-2 text-zinc-200">R$ {toNumber(f.saldoDeclarado).toFixed(2)}</td>
                          <td className={`py-4 px-2 font-bold ${Math.abs(toNumber(f.diferenca)) < 0.01 ? "text-emerald-400" : "text-rose-400"}`}>R$ {toNumber(f.diferenca).toFixed(2)}</td>
                          <td className="py-4 px-2 text-zinc-400 text-xs">{f.fechadoPor}</td>
                        </tr>
                      ))}
                      {fechamentos.length === 0 && (
                        <tr>
                          <td className="py-6 px-2 text-zinc-500 text-sm" colSpan={7}>Nenhum fechamento registrado ainda.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "clientes" && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-pink-950/20 to-zinc-900 border border-pink-500/30 rounded-xl p-5">
            <h3 className="text-sm font-black uppercase text-pink-400 mb-3 animate-pulse">🔥 Oportunidades Críticas de Venda</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {clientes.filter((c) => obterDiasDesdeUltimaCompra(c.dataUltimaCompra) >= c.frequenciaRecorrencia).map((c) => (
                <div key={c.id} className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-zinc-200">{c.nome} <span className="text-zinc-500">({c.contato})</span></p>
                    <p className="text-zinc-400 mt-0.5">Último pedido há <span className="text-rose-400 font-bold">{obterDiasDesdeUltimaCompra(c.dataUltimaCompra)} dias</span> (ciclo {c.frequenciaRecorrencia}d)</p>
                  </div>
                  <a href={`https://wa.me/${c.contato.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-3 py-1.5 rounded text-center whitespace-nowrap">📢 Ativar</a>
                </div>
              ))}
              {clientes.filter((c) => obterDiasDesdeUltimaCompra(c.dataUltimaCompra) >= c.frequenciaRecorrencia).length === 0 && (
                <p className="text-xs text-zinc-400 col-span-2">✅ Todos dentro do ciclo esperado.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-fit space-y-4">
              <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-2">Novo Lead</h2>
              <form onSubmit={handleCriarClienteCRM} className="space-y-3">
                <input type="text" placeholder="Nome" value={crmNome} onChange={(e) => setCrmNome(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100" />
                <input type="text" placeholder="WhatsApp ou @social" value={crmContato} onChange={(e) => setCrmContato(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100" />
                <select value={crmInteresse} onChange={(e) => setCrmInteresse(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-300">
                  <option value="Action Figures">🧸 Action Figures</option>
                  <option value="Suportes">🎧 Suportes</option>
                  <option value="Peças">🛠️ Peças Técnicas</option>
                  <option value="Cosplay">🎭 Cosplay</option>
                </select>
                <input type="date" value={crmUltimaCompra} onChange={(e) => setCrmUltimaCompra(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-300" />
                <input type="number" placeholder="Ciclo (dias)" value={crmFrequencia} onChange={(e) => setCrmFrequencia(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-100" />
                <select value={crmStatus} onChange={(e) => setCrmStatus(e.target.value as ClienteLead["statusLead"])} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-300">
                  <option value="FREGUES">💎 Frequês</option>
                  <option value="LEAD_AQUECIDO">🔥 Aquecido</option>
                  <option value="FRIO">❄️ Frio</option>
                </select>
                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 font-bold text-sm text-white py-2.5 rounded-lg transition-colors">✓ Salvar Lead</button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-4 mb-4">👥 Carteira de Clientes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase">
                      <th className="py-3 px-2">Cliente</th>
                      <th className="py-3 px-2">Interesse</th>
                      <th className="py-3 px-2">Última Compra</th>
                      <th className="py-3 px-2">Ciclo</th>
                      <th className="py-3 px-2 text-center">Status</th>
                      <th className="py-3 px-2 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {clientes.map((c) => {
                      const diasPassados = obterDiasDesdeUltimaCompra(c.dataUltimaCompra);
                      const precisaAviso = diasPassados >= c.frequenciaRecorrencia;
                      return (
                        <tr key={c.id} className="hover:bg-zinc-800/20 transition-colors">
                          <td className="py-4 px-2">
                            <p className="font-semibold text-zinc-200">{c.nome}</p>
                            <span className="text-xs text-zinc-500">{c.contato}</span>
                          </td>
                          <td className="py-4 px-2 text-xs text-zinc-300">{c.interessePrincipal}</td>
                          <td className="py-4 px-2 text-xs text-zinc-400 font-mono">{c.dataUltimaCompra}<br/><span className="text-[10px] text-zinc-500">({diasPassados}d atrás)</span></td>
                          <td className="py-4 px-2"><span className={`text-xs font-bold ${precisaAviso ? "text-rose-400" : "text-emerald-400"}`}>{c.frequenciaRecorrencia}d</span></td>
                          <td className="py-4 px-2 text-center">
                            <select value={c.statusLead} onChange={(e) => handleMudarStatusCRM(c.id, e.target.value as ClienteLead["statusLead"])} className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs font-bold text-pink-400 focus:outline-none">
                              <option value="FREGUES">💎 Frequês</option>
                              <option value="LEAD_AQUECIDO">🔥 Aquecido</option>
                              <option value="FRIO">❄️ Frio</option>
                            </select>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <button onClick={() => handleDeletarCliente(c.id)} className="text-zinc-600 hover:text-rose-400 text-xs">✕</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "orcamentos" && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 h-fit">
            <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-2">📋 Calculadora de Orçamentos</h2>
            <form onSubmit={handleCriarOrcamento} className="space-y-3">
              <input
                type="text"
                placeholder="Nome do Cliente"
                value={orcClienteNome}
                onChange={(e) => setOrcClienteNome(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100"
              />
              <input
                type="text"
                placeholder="WhatsApp do Cliente"
                value={orcClienteWhatsapp}
                onChange={(e) => setOrcClienteWhatsapp(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100"
              />
              <input
                type="text"
                placeholder="Nome do Modelo 3D"
                value={orcPecaNome}
                onChange={(e) => setOrcPecaNome(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Peso (g)"
                  value={orcPesoGrams}
                  onChange={(e) => setOrcPesoGrams(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-100"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Tempo (h)"
                  value={orcTempoHoras}
                  onChange={(e) => setOrcTempoHoras(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Margem (%)</label>
                  <input
                    type="number"
                    step="1"
                    value={orcMargem}
                    onChange={(e) => setOrcMargem(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Validade (dias)</label>
                  <input
                    type="number"
                    min={1}
                    value={orcValidadeDias}
                    onChange={(e) => setOrcValidadeDias(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-100"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-400">Custos sugeridos</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={orcCustoMaterial}
                    onChange={(e) => setOrcCustoMaterial(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-100"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={orcCustoEnergia}
                    onChange={(e) => setOrcCustoEnergia(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-100"
                  />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={orcCustoManutencao}
                  onChange={(e) => setOrcCustoManutencao(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-100"
                />
                <input
                  type="number"
                  step="0.01"
                  value={orcPrecoVenda}
                  onChange={(e) => setOrcPrecoVenda(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-pink-500/30 rounded px-2 py-2 text-sm font-bold text-zinc-100"
                />
                <div className="text-[11px] text-zinc-500 grid grid-cols-2 gap-2">
                  <span>Material</span>
                  <span>Energia</span>
                  <span>Manutenção</span>
                  <span className="text-pink-400">Preço final</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 font-bold text-sm text-white py-2.5 rounded-lg transition-colors">
                ✓ Gerar Orçamento
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-4 mb-4">📋 Orçamentos Gerados</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase">
                    <th className="py-3 px-2">Cliente</th>
                    <th className="py-3 px-2">Modelo</th>
                    <th className="py-3 px-2">Peso/Tempo</th>
                    <th className="py-3 px-2">Valor</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {orcamentos.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="py-4 px-2">
                        <p className="text-zinc-200 font-semibold">{item.clienteNome}</p>
                        <p className="text-[11px] text-zinc-500">{item.clienteWhatsapp}</p>
                      </td>
                      <td className="py-4 px-2 text-zinc-300">{item.pecaNome}</td>
                      <td className="py-4 px-2 text-zinc-400 text-xs">
                        {toNumber(item.pesoGrams).toFixed(1)}g / {toNumber(item.tempoHoras).toFixed(1)}h
                      </td>
                      <td className="py-4 px-2 text-emerald-400 font-bold">R$ {toNumber(item.precoVenda).toFixed(2)}</td>
                      <td className="py-4 px-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusOrcamentoClass(item.status)}`}>
                          {statusOrcamentoLabel(item.status)}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.status === "APROVADO" && (
                            <button
                              type="button"
                              onClick={() => handleConverterOrcamento(item.id)}
                              className="text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-3 py-1.5 rounded"
                            >
                              📦 Converter em Pedido
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleCopiarLinkOrcamento(item.token)}
                            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded"
                          >
                            🔗 Copiar Link
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orcamentos.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 px-2 text-center text-zinc-500 text-sm">
                        Nenhum orçamento criado ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "catalogo" && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800 pb-2">Cadastro de Produto no Catálogo</h2>
            <form onSubmit={handleCriarCatalogoProduto} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Nome do Produto" value={catNome} onChange={(e) => setCatNome(e.target.value)} className="col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100" />
                <textarea placeholder="Descrição (opcional)" value={catDescricao} onChange={(e) => setCatDescricao(e.target.value)} className="col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-zinc-100 min-h-24 resize-none" />
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Peso (gramas)</label>
                  <input type="number" step="0.01" value={catPeso} onChange={(e) => setCatPeso(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Tempo de Impressão (horas)</label>
                  <input type="number" step="0.5" value={catTempo} onChange={(e) => setCatTempo(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Categoria</label>
                  <select value={catCategoria} onChange={(e) => setCatCategoria(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-300">
                    <option value="Action Figures">🧸 Action Figures</option>
                    <option value="Suportes">🎧 Suportes</option>
                    <option value="Peças Técnicas">🛠️ Peças Técnicas</option>
                    <option value="Cosplay">🎭 Cosplay</option>
                    <option value="Setup">💻 Setup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Link do STL (opcional)</label>
                  <input type="url" placeholder="https://..." value={catLinkStl} onChange={(e) => setCatLinkStl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-zinc-100" />
                </div>
              </div>
              <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 font-bold text-sm text-white py-2.5 rounded-lg transition-colors">✓ Adicionar ao Catálogo</button>
            </form>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-200">📦 Produtos no Catálogo ({catalogo.length})</h2>
            {catalogo.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
                <p className="text-zinc-400 text-sm">Nenhum produto cadastrado. Crie o primeiro produto acima!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalogo.map((produto) => {
                  // Recalcular preço sugerido baseado nos custos atuais
                  const custoPorGrama = precoRolo / pesoRolo;
                  const custoFilamentoCard = produto.pesoGrams * custoPorGrama;
                  const custoEnergiaCard = ((potenciaMaquina * produto.tempoImpressao) / 1000) * precoKwh;
                  const custoTotalCard = custoFilamentoCard + custoEnergiaCard + custoEmbalagem;
                  const valorLucroCard = custoTotalCard * (margemLucro / 100);
                  const precoVendaCard = custoTotalCard + valorLucroCard;

                  return (
                    <div key={produto.id} className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-pink-500/10">
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-zinc-100 text-sm line-clamp-2">{produto.nome}</h3>
                          <p className="text-xs text-zinc-400 mt-1">{produto.categoria}</p>
                        </div>

                        {produto.descricao && (
                          <p className="text-xs text-zinc-400 line-clamp-2">{produto.descricao}</p>
                        )}

                        <div className="bg-zinc-950/50 rounded-lg p-2.5 space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Peso:</span>
                            <span className="font-semibold text-zinc-200">{toNumber(produto.pesoGrams).toFixed(1)}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Tempo:</span>
                            <span className="font-semibold text-zinc-200">{toNumber(produto.tempoImpressao).toFixed(1)}h</span>
                          </div>
                          <div className="flex justify-between border-t border-zinc-700 pt-1.5 mt-1.5">
                            <span className="text-zinc-400">Custo:</span>
                            <span className="font-bold text-rose-400">R$ {custoTotalCard.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Preço:</span>
                            <span className="font-bold text-emerald-400">R$ {precoVendaCard.toFixed(2)}</span>
                          </div>
                        </div>

                        {produto.linkStl && (
                          <a href={produto.linkStl} target="_blank" rel="noreferrer" className="block text-xs text-center bg-zinc-800 hover:bg-zinc-700 text-pink-400 py-1.5 rounded transition-colors">
                            🔗 Abrir STL
                          </a>
                        )}

                        <div className="flex gap-2 pt-2">
                          <button onClick={() => handleIniciarProducaoRapida(produto)} className="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs py-2 rounded transition-colors">
                            🖨️ Produzir
                          </button>
                          <button onClick={() => handleDeletarCatalogoProduto(produto.id)} className="px-3 bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 font-bold text-xs py-2 rounded transition-colors">
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
