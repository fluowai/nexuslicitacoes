import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Building,
  Target,
  SearchCode,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Brain,
  Layers,
  Globe,
  MapPin,
  FileSpreadsheet,
  Network
} from "lucide-react";
import { EmpresaPerfil, ProdutoCadastro } from "../types";

interface OnboardingFlowProps {
  onComplete: (perfil: EmpresaPerfil) => void;
  onClose: () => void;
  perfilAtual: EmpresaPerfil | null;
}

export default function OnboardingFlow({ onComplete, onClose, perfilAtual }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  
  // Step 2 Form States (Profile / Identity)
  const [razaoSocial, setRazaoSocial] = useState(perfilAtual?.razaoSocial || "Nexus Purificadores de Água S/A");
  const [nomeFantasia, setNomeFantasia] = useState(perfilAtual?.nomeFantasia || "Nexus Purifica");
  const [cnpj, setCnpj] = useState(perfilAtual?.cnpj || "12.345.678/0001-90");
  const [porte, setPorte] = useState<"ME" | "EPP" | "Demais" | "LTDA" | "S/A">(perfilAtual?.porte || "EPP");
  const [cidade, setCidade] = useState(perfilAtual?.cidade || "São Paulo");
  const [estado, setEstado] = useState(perfilAtual?.estado || "SP");
  const [areaAtendimento, setAreaAtendimento] = useState<"Municipal" | "Estadual" | "Regional" | "Nacional">(
    perfilAtual?.areaAtendimento || "Nacional"
  );

  // Step 3 Form States (Keywords / Segments)
  const [segmentosAtuantes, setSegmentosAtuantes] = useState<string[]>(
    perfilAtual?.segmentosAtuantes || ["Tratamento de Água", "Osmose Reversa"]
  );
  const [newTag, setNewTag] = useState("");

  // Step 4 Form States (Products Setup)
  const [produtos, setProdutos] = useState<ProdutoCadastro[]>(
    perfilAtual?.produtos || [
      { id: "p-init-1", produto: "Equipamento Osmose 300L/h", categoria: "Tratamento de Água", valorMedio: 120000 },
      { id: "p-init-2", produto: "Manutenção e Troca de Membranas", categoria: "Tratamento de Água", valorMedio: 15000 }
    ]
  );
  const [newProdName, setNewProdName] = useState("");
  const [newProdValue, setNewProdValue] = useState("");

  // Step 5 Simulation Progress
  const [simLines, setSimLines] = useState<string[]>([]);
  const [simulating, setSimulating] = useState(false);

  // Suggested keywords list for easy on-click selection
  const sugestoesTags = [
    "Tratamento de Água",
    "Saneamento Básico",
    "Osmose Reversa",
    "Filtros Industriais",
    "Engenharia Química",
    "Filtros de Areia",
    "Bombas Centrífugas",
    "Válvulas Inox",
    "Construção Civil",
    "Peças para Clínicas"
  ];

  const handleNextStep = () => {
    if (step === 4) {
      // Trigger dynamic matching simulation before finalizing
      setStep(5);
      runMatchingSimulation();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (!segmentosAtuantes.includes(trimmed)) {
      setSegmentosAtuantes(prev => [...prev, trimmed]);
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSegmentosAtuantes(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleAddProduct = () => {
    const name = newProdName.trim();
    const val = parseFloat(newProdValue.replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", "."));
    if (!name || isNaN(val)) return;

    const newProd: ProdutoCadastro = {
      id: `p-${Date.now()}`,
      produto: name,
      categoria: "Cadastro Inicial",
      valorMedio: val
    };

    setProdutos(prev => [...prev, newProd]);
    setNewProdName("");
    setNewProdValue("");
  };

  const handleRemoveProduct = (id: string) => {
    setProdutos(prev => prev.filter(p => p.id !== id));
  };

  const runMatchingSimulation = () => {
    setSimulating(true);
    const lines = [
      "🔄 Conectando com a base municipal e canais federais (COGEF & PNCP)...",
      "📝 Mapeando CNAEs vinculados e filtros corporativos...",
      `📍 Sintonizando rotas de entrega para ${cidade} (${estado}) e abrangência ${areaAtendimento}...`,
      `🧠 Algoritmo Vitória Score lendo termos: ${segmentosAtuantes.slice(0, 3).join(", ")}...`,
      "⚖️ Recalculando aderência com produtos no catálogo: " + produtos.map(p => p.produto.split(" ")[0]).join(", ") + "...",
      "⚡ Cruzando matriz de licitações nacionais com alta correspondência...",
      "🎉 Modelo comercial estabelecido com sucesso! Pronto para captar editais Excelente."
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < lines.length) {
        setSimLines(prev => [...prev, lines[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setSimulating(false);
        setStep(6);
      }
    }, 1100);
  };

  const handleFinalize = () => {
    const finalizedProfile: EmpresaPerfil = {
      razaoSocial,
      nomeFantasia,
      cnpj,
      porte,
      cidade,
      estado,
      areaAtendimento,
      cnaes: perfilAtual?.cnaes || ["36.00-6-01 - Captação, tratamento e distribuição de água"],
      segmentosAtuantes,
      produtos,
      servicos: perfilAtual?.servicos || [
        { id: "s1", servico: "Manutenção Preventiva de Planta de Osmose Reversa", categoria: "Tratamento de Água" }
      ]
    };
    onComplete(finalizedProfile);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 md:p-6 overflow-y-auto" id="onboarding-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" 
        id="onboarding-modal-card"
      >
        
        {/* Upper Visual Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 flex" id="onboarding-progress-bar">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div 
              key={num} 
              className={`h-full flex-1 transition-all duration-300 ${
                step >= num ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50" id="onboarding-header">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 text-white p-2.5 rounded-2xl shadow-sm">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest font-display flex items-center space-x-1">
                <span>Bem-vindo ao Nexus AI</span>
                <span className="text-[10px] ml-2 text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">Onboarding</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans">Passos guiados de configuração do modelo de lances</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 bg-white ring-1 ring-slate-150 px-3 py-1.5 rounded-xl cursor-pointer transition-colors shadow-sm"
          >
            Pular [X]
          </button>
        </div>

        {/* Onboarding Steps Body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto" id="onboarding-viewport">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: WELCOME & CAPABILITIES */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl font-black text-slate-800 font-display tracking-tight">
                    Sua jornada inteligente em editais públicos do Brasil começa aqui!
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed font-sans">
                    Nossa IA captura, filtra e qualifica todas as oportunidades federais e municipais do país para o perfil exato da sua empresa de maneira automatizada. Conheça as principais engrenagens do Nexus:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4" id="intro-modules-grid">
                  {/* Module 1 */}
                  <div className="p-5 bg-gradient-to-b from-slate-50/40 to-white border border-slate-150 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all space-y-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 w-max">
                      <SearchCode className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm font-display">1. Hub Nacional de Editais</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Varredura diária nos portais (PNCP, Compras.gov) consolidada para trazer instantaneamente apenas as licitações vigentes de alta relevância.
                    </p>
                  </div>

                  {/* Module 2 */}
                  <div className="p-5 bg-gradient-to-b from-slate-50/40 to-white border border-slate-150 rounded-2xl hover:border-emerald-200 hover:shadow-md transition-all space-y-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 w-max">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm font-display">2. Perfil Corporativo Inteligente</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Calibração do catálogo de preços de serviços, regiões-alvo e palavras de busca. Evite ruídos de editais desalinhados.
                    </p>
                  </div>

                  {/* Module 3 */}
                  <div className="p-5 bg-gradient-to-b from-slate-50/40 to-white border border-slate-150 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all space-y-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 w-max">
                      <Target className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm font-display">3. Vitória Score</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Algoritmo preditivo de lances. Compara as requisições contratuais contra o portfólio da sua empresa e sinaliza o parecer de vitória.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50/40 border border-blue-100/60 p-4 rounded-2xl flex items-start space-x-3 max-w-3xl mx-auto" id="warning-notice">
                  <Brain className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700 leading-relaxed font-sans">
                    <strong>Configuração em menos de 3 minutos:</strong> Forneça os segmentos adequados no próximo passo para que nosso robô neuronal filtre e elimine o lixo informático da sua caixa de alerta de forma imediata!
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: FIRM PROFILE */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-display">Identificação da Empresa</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Preencha as credenciais comerciais. Estes dados ajudam a calibrar as regularidades fiscais e fiscais estaduais.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="onboarding-form-identity">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block font-display">Razão Social</label>
                    <input 
                      type="text" 
                      value={razaoSocial} 
                      onChange={e => setRazaoSocial(e.target.value)} 
                      placeholder="Ex: Alfa Purificação de Água Ltda"
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block font-display">Nome Fantasia Comercial</label>
                    <input 
                      type="text" 
                      value={nomeFantasia} 
                      onChange={e => setNomeFantasia(e.target.value)} 
                      placeholder="Ex: Alfa Saneamento"
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block font-display">CNPJ da Organização</label>
                    <input 
                      type="text" 
                      value={cnpj} 
                      onChange={e => setCnpj(e.target.value)} 
                      placeholder="00.000.000/0000-00"
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block font-display">Porte Organizacional</label>
                    <select 
                      value={porte} 
                      onChange={e => setPorte(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-705 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="ME">ME (Microempresa)</option>
                      <option value="EPP">EPP (Empresa Pequeno Porte)</option>
                      <option value="LTDA">LTDA (Responsabilidade Limitada)</option>
                      <option value="S/A">S/A (Grande Porte / Capital Aberto)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-3 md:col-span-2">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block font-display">Cidade da Sede</label>
                      <input 
                        type="text" 
                        value={cidade} 
                        onChange={e => setCidade(e.target.value)} 
                        placeholder="Ex: Campinas"
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block font-display">Estado (UF)</label>
                      <input 
                        type="text" 
                        value={estado} 
                        onChange={e => setEstado(e.target.value)} 
                        placeholder="SP"
                        maxLength={2}
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-center text-slate-700 font-bold focus:outline-none focus:border-blue-400 uppercase transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block font-display">Área de Cobertura Física para Lances</label>
                    <div className="grid grid-cols-4 gap-2 font-display">
                      {["Municipal", "Estadual", "Regional", "Nacional"].map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setAreaAtendimento(loc as any)}
                          className={`p-3 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                            areaAtendimento === loc 
                              ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs" 
                              : "bg-slate-50/50 border-slate-150 text-slate-550 hover:bg-slate-50"
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Isso filtra licitações fora das suas metas de custos logísticos ou fretes.</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: KEYWORDS & CHANNELS */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-display">Segmentação e Palavras-chave do Filtro</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Defina os termos de busca que o algoritmo utilizará para varrer e encontrar editais diariamente.</p>
                </div>

                <div className="space-y-4" id="keywords-selector-container">
                  <div className="flex space-x-2">
                    <input 
                      type="text"
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddTag(newTag)}
                      placeholder="Digite um termo e pressione Enter (ex: Filtros de Areia, Tecnologia)"
                      className="flex-1 bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400 transition-colors"
                    />
                    <button 
                      onClick={() => handleAddTag(newTag)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 rounded-xl flex items-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-display">Termos Ativos no Filtro Neural</span>
                    <div className="p-4 bg-slate-50/40 border border-slate-200/65 rounded-2xl flex flex-wrap gap-2 min-h-[80px]" id="onboarding-tags-box">
                      {segmentosAtuantes.length === 0 ? (
                        <span className="text-xs text-slate-350 italic m-auto">Nenhum termo ativo. Clique nas sugestões abaixo para iniciar.</span>
                      ) : (
                        segmentosAtuantes.map(tag => (
                          <span 
                            key={tag} 
                            className="bg-white border border-slate-150 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm"
                          >
                            <span>{tag}</span>
                            <button 
                              onClick={() => handleRemoveTag(tag)}
                              className="text-rose-500 hover:text-rose-700 font-bold ml-1 text-xs cursor-pointer focus:outline-none"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Sugestões de Segmentos */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-display flex items-center">
                      <Globe className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Sugestões do Saneamento e Engenharia (clique para adicionar)
                    </span>
                    <div className="flex flex-wrap gap-1.5" id="sugestions-tags">
                      {sugestoesTags
                        .filter(t => !segmentosAtuantes.includes(t))
                        .map(sug => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => handleAddTag(sug)}
                            className="text-[11px] bg-slate-100/60 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer"
                          >
                            + {sug}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: PRODUCTS SETUP */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-display">Catálogo de Produtos & Valores Referenciais</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Determine o preço médio e nome dos produtos principais da empresa. Isso ajuda a calibrar o desvio do Ticket Médio da licitação.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4" id="onboarding-prod-inputs">
                  <div className="md:col-span-7 space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block font-display">Nome do Produto ou Escopo de Serviço</label>
                    <input 
                      type="text"
                      value={newProdName}
                      onChange={e => setNewProdName(e.target.value)}
                      placeholder="Ex: Estação de Filtração Contínua EF-100"
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block font-display">Valor Praticado Médio (R$)</label>
                    <input 
                      type="text"
                      value={newProdValue}
                      onChange={e => setNewProdValue(e.target.value)}
                      placeholder="Ex: 85000"
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-end">
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-3.5 rounded-xl flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Cadastrar</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-display flex items-center">
                    <Layers className="w-4 h-4 mr-1 text-slate-400" />
                    Catálogo de Portfólio Cadastrado ({produtos.length})
                  </span>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-[220px] overflow-y-auto" id="onboarding-prod-scroller flex flex-col">
                    {produtos.length === 0 ? (
                      <div className="p-8 text-center text-slate-350 italic text-xs">Nenhum produto cadastrado até o momento.</div>
                    ) : (
                      produtos.map(p => (
                        <div key={p.id} className="p-4 bg-slate-50/20 hover:bg-slate-55/40 transition-colors flex justify-between items-center">
                          <div className="truncate pr-4">
                            <span className="text-xs font-bold text-slate-750 block truncate font-display">{p.produto}</span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">Categoria Referencial: {p.categoria}</span>
                          </div>
                          
                          <div className="flex items-center space-x-3 shrink-0">
                            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 border border-emerald-100 rounded-lg">
                              {p.valorMedio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(p.id)}
                              className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: SIMULATING MATCHING KEYWORDS WITH OPPS */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 flex flex-col justify-center items-center py-8"
              >
                <div className="relative flex items-center justify-center" id="simulation-pulsing">
                  <div className="absolute w-24 h-24 bg-blue-100/40 rounded-full animate-ping border border-blue-200"></div>
                  <div className="p-6 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-3xl z-10 shadow-lg animate-spin-slow">
                    <Brain className="w-10 h-10" />
                  </div>
                </div>

                <div className="text-center max-w-md space-y-2">
                  <h3 className="text-base font-bold text-slate-800 font-display">Nexus AI Sintetizando...</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Estamos cruzando suas regras recém-inseridas contra os editais municipais no banco de dados para criar seus primeiros pareces analíticos e recalcular seu Vitória Score.
                  </p>
                </div>

                {/* Virtual terminal logs */}
                <div className="w-full max-w-xl bg-slate-950 border border-slate-900 rounded-2xl p-4 font-mono text-[10px] text-slate-300 space-y-1.5 shadow-xl max-h-[160px] overflow-y-auto" id="onboarding-terminal">
                  {simLines.map((line, i) => (
                    <div key={i} className="flex items-start">
                      <span className="text-sky-400 mr-2 shrink-0">&gt;&gt;</span>
                      <span className="leading-normal">{line}</span>
                    </div>
                  ))}
                  {simulating && (
                    <div className="w-2.5 h-4 bg-white/60 animate-pulse inline-block ml-1"></div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 6: SUCCESS */}
            {step === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                tabIndex={0}
                className="space-y-6 flex flex-col justify-center items-center py-8 text-center max-w-xl mx-auto"
              >
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 w-max shadow-sm animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-800 font-display tracking-tight">Onboarding Concluído com Sucesso!</h2>
                  <p className="text-sm text-slate-400 font-sans leading-relaxed">
                    Parabéns! Sua empresa <strong>{nomeFantasia}</strong> está com o modelo comercial parametrizado nas ferramentas da Nexus AI. Os pesos de probabilidade de vitória foram recalculados em tempo real na aba inicial do seu workspace.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full p-4 bg-slate-50 border border-slate-150 rounded-2xl text-left" id="onboarding-summary-box">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-display">Filtro Ativado</span>
                    <span className="text-xs font-bold text-slate-700 mt-0.5 block truncate">{segmentosAtuantes.slice(0, 3).join(", ") || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-display">Preço Base Mínimo</span>
                    <span className="text-xs font-bold text-emerald-600 mt-0.5 font-mono block">
                      {produtos[0]?.valorMedio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) || "-"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleFinalize}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer font-display"
                >
                  <span>Explorar Meu Dashboard Nexus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50" id="onboarding-footer">
            <button
              onClick={handlePrevStep}
              className={`flex items-center space-x-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                step === 1 
                  ? "opacity-40 pointer-events-none text-slate-300 border-slate-100 bg-transparent" 
                  : "text-slate-550 border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>

            <span className="text-xs text-slate-400 font-mono font-medium">Passo {step} de 4</span>

            <button
              onClick={handleNextStep}
              className="flex items-center space-x-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer font-display"
            >
              <span>{step === 4 ? "Finalizar Cadastro" : "Próximo Passo"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
}
