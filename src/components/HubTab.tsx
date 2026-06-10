/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Licitacao, LicitacaoScoreDetalhes } from '../types';
import { Search, Filter, Sliders, MapPin, Compass, PlusCircle, Server, Calendar, DollarSign, Brain, FileText, ChevronRight } from 'lucide-react';

interface HubTabProps {
  licitacoes: Licitacao[];
  onAddLicitacao: (newLic: Partial<Licitacao>) => Promise<any>;
  onSelectLicitacao: (lic: Licitacao) => void;
}

export default function HubTab({ licitacoes, onAddLicitacao, onSelectLicitacao }: HubTabProps) {
  const [search, setSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState("Todos");
  const [selectedModalidade, setSelectedModalidade] = useState("Todos");
  const [minValue, setMinValue] = useState("");

  // Create mock injector state
  const [showInjector, setShowInjector] = useState(false);
  const [injectTitle, setInjectTitle] = useState("PE 058/2026 - Instalação de Filtros de Osmose");
  const [injectOrgao, setInjectOrgao] = useState("Sanepar - Saneamento do Paraná");
  const [injectObjeto, setInjectObjeto] = useState("Registro de preços para Aquisição de Equipamento Purificador Compacto de Dessalinização por Osmose Reversa de Água Salobra.");
  const [injectValor, setInjectValor] = useState("165000");
  const [injectUf, setInjectUf] = useState("PR");
  const [injectCidade, setInjectCidade] = useState("Curitiba");
  const [injectModalidade, setInjectModalidade] = useState<any>("Pregão Eletrônico");
  const [loadingAdd, setLoadingAdd] = useState(false);

  const handleInject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAdd(true);
    try {
      await onAddLicitacao({
        titulo: injectTitle,
        orgao: injectOrgao,
        objeto: injectObjeto,
        valorEstimado: Number(injectValor),
        uf: injectUf,
        cidade: injectCidade,
        modalidade: injectModalidade,
        fonte: "PNCP"
      });
      // reset
      setShowInjector(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdd(false);
    }
  };

  const loadPreset = (type: 'osmose' | 'ti' | 'esgoto_alto') => {
    if (type === 'osmose') {
      setInjectTitle("PE 110/2026 - Planta de Osmose Reversa em Campo");
      setInjectOrgao("Secretaria de Saúde do Ceará");
      setInjectObjeto("Fornecimento integral de tecnologia de Osmose Reversa para tratamento de salinidade em poços tubulares rurais de potabilidade de água.");
      setInjectValor("142000");
      setInjectUf("CE");
      setInjectCidade("Sobral");
      setInjectModalidade("Pregão Eletrônico");
    } else if (type === 'ti') {
      setInjectTitle("PE 988/2026 - Notebooks e Redes de TI");
      setInjectOrgao("Tribunal Regional Eleitoral de Minas Gerais");
      setInjectObjeto("Aquisição de notebooks corporativos de processadores múltiplos, infraestrutura de cabeamento estruturado óptico de TI.");
      setInjectValor("890000");
      setInjectUf("MG");
      setInjectCidade("Belo Horizonte");
      setInjectModalidade("Pregão Eletrônico");
    } else if (type === 'esgoto_alto') {
      setInjectTitle("Dispensa Dispensável 09/2026 - Manutenção Corretiva Flutuador");
      setInjectOrgao("Prefeitura de Campinas - Secretaria de Serviços");
      setInjectObjeto("Contratação imediata e emergencial para limpeza de barramentos de digestores de lodo e gradeamento em Estação de Esgoto ETE.");
      setInjectValor("25000");
      setInjectUf("SP");
      setInjectCidade("Campinas");
      setInjectModalidade("Dispensa");
    }
  };

  // Filter application
  const filteredLicitacoes = licitacoes.filter((lic) => {
    const matchesSearch = 
      lic.titulo.toLowerCase().includes(search.toLowerCase()) ||
      lic.objeto.toLowerCase().includes(search.toLowerCase()) ||
      lic.orgao.toLowerCase().includes(search.toLowerCase());
    
    const matchesSource = 
      selectedSource === "Todos" || 
      (selectedSource === "Compras.gov" && lic.fonte === "Compras.gov") ||
      (selectedSource === "PNCP" && lic.fonte === "PNCP") ||
      (selectedSource === "Outros" && lic.fonte !== "Compras.gov" && lic.fonte !== "PNCP");

    const matchesModalidade = 
      selectedModalidade === "Todos" || 
      lic.modalidade === selectedModalidade;

    const matchesVal = !minValue || lic.valorEstimado >= Number(minValue);

    return matchesSearch && matchesSource && matchesModalidade && matchesVal;
  });

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6" id="hub-tab-root font-sans">
      {/* Header com Descrição Estilo Minimalista */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4" id="hub-tab-header">
        <div>
          <h2 className="text-lg font-bold text-slate-800 font-display">Hub Nacional de Licitações</h2>
          <p className="text-xs text-slate-400">Varredura automática em portais como PNCP, Compras.gov, e Diários Oficiais de todo território nacional.</p>
        </div>
        <button
          onClick={() => setShowInjector(!showInjector)}
          className="mt-3 md:mt-0 flex items-center space-x-2 text-xs font-bold bg-blue-50/60 hover:bg-blue-100 text-blue-600 px-3.5 py-2 rounded-xl border border-blue-100 transition-all duration-155 cursor-pointer font-display"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Simular Nova Licitação</span>
        </button>
      </div>

      {/* Caixa de Entrada de Simulação IA */}
      {showInjector && (
        <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5" id="simulation-box">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-705 uppercase tracking-widest flex items-center space-x-1.5 font-display">
                <Brain className="w-4 h-4 text-blue-500 animate-pulse" />
                <span>Simulador de Licitações (Calcular IA Score)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Defina os parâmetros do edital e nosso algoritmo proprietário recalculará a vitória em tempo-real.</p>
            </div>
            <button 
              onClick={() => setShowInjector(false)} 
              className="text-xs text-slate-400 hover:text-slate-605 font-bold cursor-pointer font-display"
            >
              Fechar
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 font-display" id="injectors-preset-group">
            <button 
              type="button" 
              onClick={() => loadPreset('osmose')}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-left text-xs text-slate-700 hover:border-blue-300 transition-all cursor-pointer"
            >
              <span className="font-bold text-blue-600 block">Preset A: Alta Aderência</span>
              Osmose Reversa Poço Rural (Ceará)
            </button>
            <button 
              type="button" 
              onClick={() => loadPreset('ti')}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-left text-xs text-slate-700 hover:border-amber-300 transition-all cursor-pointer"
            >
              <span className="font-bold text-amber-605 block">Preset B: Desvio de Ramo</span>
              Notebooks corporativos (Minas Gerais)
            </button>
            <button 
              type="button" 
              onClick={() => loadPreset('esgoto_alto')}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-left text-xs text-slate-700 hover:border-emerald-300 transition-all cursor-pointer"
            >
              <span className="font-bold text-emerald-600 block">Preset C: Baixa Complexidade</span>
              Manutenção emergencial ETE (Campinas)
            </button>
          </div>

          <form onSubmit={handleInject} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">Título do Edital</label>
                <input 
                  type="text" 
                  required
                  value={injectTitle} 
                  onChange={e => setInjectTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">Órgão Promotor</label>
                <input 
                  type="text" 
                  required
                  value={injectOrgao} 
                  onChange={e => setInjectOrgao(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">Objeto do Termo de Referência</label>
                <textarea 
                  rows={2}
                  required
                  value={injectObjeto} 
                  onChange={e => setInjectObjeto(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400 font-sans" 
                />
              </div>
            </div>

            <div className="md:col-span-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">Valor Estimado (R$)</label>
                <input 
                  type="number" 
                  required
                  value={injectValor} 
                  onChange={e => setInjectValor(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400 font-mono" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">UF</label>
                  <input 
                    type="text" 
                    value={injectUf} 
                    onChange={e => setInjectUf(e.target.value)}
                    maxLength={2}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400 text-center uppercase font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">Cidade</label>
                  <input 
                    type="text" 
                    value={injectCidade} 
                    onChange={e => setInjectCidade(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">Modalidade</label>
                <select
                  value={injectModalidade}
                  onChange={e => setInjectModalidade(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400 font-display"
                >
                  <option value="Pregão Eletrônico">Pregão Eletrônico</option>
                  <option value="Pregão Presencial">Pregão Presencial</option>
                  <option value="Dispensa">Dispensa</option>
                  <option value="Inexigibilidade">Inexigibilidade</option>
                  <option value="Concorrência">Concorrência</option>
                  <option value="Leilão">Leilão</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loadingAdd}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-xs transition-all cursor-pointer font-display"
              >
                {loadingAdd ? "Processando Inteligência..." : "Salvar e Analisar IA"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Caixa de Filtros Avançados */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4" id="filters-container-box">
        <div className="flex-1 relative" id="search-input-wrapper">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por edital, órgão promotor ou objeto técnico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-150 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-105 focus:border-blue-400"
          />
        </div>

        <div className="flex space-x-2" id="quick-filters-menus">
          <div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-slate-50 border border-slate-150 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-600 focus:outline-none focus:border-blue-400 font-display cursor-pointer"
            >
              <option value="Todos">Todas as Fontes</option>
              <option value="Compras.gov">Compras.gov</option>
              <option value="PNCP">PNCP</option>
              <option value="Outros">Outras Fontes</option>
            </select>
          </div>

          <div>
            <select
              value={selectedModalidade}
              onChange={(e) => setSelectedModalidade(e.target.value)}
              className="bg-slate-50 border border-slate-150 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-600 focus:outline-none focus:border-blue-400 font-display cursor-pointer"
            >
              <option value="Todos">Modalidade: Todas</option>
              <option value="Pregão Eletrônico">Pregão Eletrônico</option>
              <option value="Dispensa">Dispensa</option>
              <option value="Concorrência">Concorrência</option>
              <option value="Inexigibilidade">Inexigibilidade</option>
            </select>
          </div>

          <div>
            <input 
              type="number"
              placeholder="Valor mín (R$)"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              className="bg-slate-50 border border-slate-150 rounded-xl py-2.5 px-3 text-xs w-28 text-slate-600 placeholder-slate-400 focus:outline-none focus:border-blue-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Resultados em Grade de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="tenders-cards-grid">
        {filteredLicitacoes.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-3" id="no-tenders-fall">
            <Sliders className="w-10 h-10 text-slate-300" />
            <p className="text-slate-500 font-bold text-sm font-display">Nenhuma licitação condizente com estes filtros.</p>
            <p className="text-xs text-slate-400 max-w-sm">Tente redefinir a busca de termos técnicos ou remova os limites de menor valor.</p>
            <button 
              onClick={() => { setSearch(""); setSelectedSource("Todos"); setSelectedModalidade("Todos"); setMinValue(""); }}
              className="text-xs font-bold text-blue-500 hover:underline cursor-pointer font-display"
            >
              Resetar Filtros
            </button>
          </div>
        ) : (
          filteredLicitacoes.map((lic) => {
            const scoreBg = 
              lic.score >= 90 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
              lic.score >= 75 ? 'bg-blue-50 border-blue-100 text-blue-700' :
              lic.score >= 50 ? 'bg-amber-50 border-amber-100 text-amber-700' :
              'bg-slate-50 border-slate-150 text-slate-600';

            const formattedDate = new Date(lic.dataAbertura).toLocaleDateString('pt-BR', {
              day: '2-digit', month: '2-digit'
            });

            return (
              <div
                key={lic.id}
                onClick={() => onSelectLicitacao(lic)}
                className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between hover:border-blue-200 hover:shadow-xs hover:-translate-y-0.5 cursor-pointer transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50/55 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-display">
                        {lic.fonte}
                      </span>
                      <span className="ml-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md font-display">
                        {lic.modalidade}
                      </span>
                    </div>

                    <div className={`flex flex-col items-center border px-2.5 py-1 rounded-lg ${scoreBg} shrink-0`}>
                      <span className="text-sm font-bold leading-none font-display">{lic.score}%</span>
                      <span className="text-[7.5px] font-bold tracking-widest mt-0.5 font-display">SCORE</span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-700 mt-3 hover:text-blue-600 leading-snug line-clamp-2 font-display">
                    {lic.titulo}
                  </h3>
                  
                  <p className="text-[11px] text-slate-400 mt-2 font-medium line-clamp-3 font-sans leading-relaxed">
                    {lic.objeto}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-300" />
                    <span>{lic.cidade}/{lic.uf}</span>
                  </div>

                  <div className="flex items-center space-x-1 font-semibold text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    <span>Abertura: {formattedDate}</span>
                  </div>
                </div>

                <div className="mt-2 text-right border-t border-slate-50 pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {formatBRL(lic.valorEstimado)}
                  </span>
                  <span className="text-xs font-bold text-blue-500 hover:underline flex items-center font-display">
                    Visualizar Score
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
