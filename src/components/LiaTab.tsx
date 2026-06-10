/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Licitacao } from '../types';
import { Brain, FileText, CheckSquare, ShieldQuestion, Calendar, DollarSign, Activity, Sparkles, CheckCircle2, Lock, Landmark, AlertTriangle } from 'lucide-react';

interface LiaTabProps {
  licitacoes: Licitacao[];
  onAnalyzeLicitacao: (id: string, customText?: string) => Promise<any>;
}

export default function LiaTab({ licitacoes, onAnalyzeLicitacao }: LiaTabProps) {
  const [selectedId, setSelectedId] = useState(licitacoes[1]?.id || licitacoes[0]?.id || "");
  const [customText, setCustomText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeResumoTab, setActiveResumoTab] = useState<'comercial' | 'juridico' | 'operacional' | 'financeiro'>('comercial');

  const selectedLic = licitacoes.find(l => l.id === selectedId);

  const handleRunAnalysis = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      await onAnalyzeLicitacao(selectedId, customText || undefined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSimulatedEditalText = (lic: Licitacao | undefined) => {
    if (!lic) return "";
    return `EDITAL DE LICITAÇÃO PÚBLICA NACIONAL DE COMPRAS
PROMOTOR REGULADOR: ${lic.orgao}
MODALIDADE: ${lic.modalidade} COM RATING DE SEGURANÇA
REGISTRO TÉCNICO INTERNO: ${lic.id}-A

1. DO OBJETO:
O escopo principal consiste em: ${lic.objeto}
O fornecimento compreende todos os insumos de instalação, suprimento químico, filtros, membranas ativas de dessalinização contínua por processos químicos de Osmose Reversa de água salobra (vazão nominal de 500L/h+) e suporte.

2. REQUISITOS DE CAPACITAÇÃO E HABILITAÇÃO JURÍDICO-FISCAL:
A empresa proponente deve comprovar regularidade irrestrita mediante apresentação de:
a) Certidão Conjunta de Tributos Federais e à Dívida Ativa da União (PGFN).
b) Certidão de Regularidade perante o FGTS (CRF) sob pena de inabilitação imediata.
c) Prova de inexistência de débitos inadimplidos perante a Justiça do Trabalho (CNDT).
d) Inscrição regular no conselho profissional específico regional do domicílio da sede da empresa.

3. REQUISITOS DE QUALIFICAÇÃO TÉCNICA OPERACIONAL:
- Atestado de Capacidade Técnica devidamente registrado, comprovando que a licitante já executou serviços de natureza assemelhada em instalação ou manutenção de purificação de água por filtragem molecular ou osmose reversa industrial.
- Declaração de vistoria técnica do local das obras, emitida por profissional químico ou sanitarista.

4. DAS PENALIDADES E RETENÇÕES FINANCEIRAS:
O descumprimento do cronograma físico de entrega incidirá em multa moratória de 0,5% ao dia, calculada sobre o item adjudicado em atraso. Retenções de garantia de 5% de caução financeira serão exercidas em cofre digital até a assinatura termo definitivo.

5. DO JULGAMENTO E DO PAGAMENTO:
Julgamento pelo critério de Menor Preço Global pelo Portal de Licitantes.
Pagamentos em até 30 dias subsequentes à lavratura da respectiva nota de execução.`;
  };

  return (
    <div className="space-y-6" id="lia-tab-root font-sans">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4" id="lia-tab-header">
        <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2 font-display">
          <Brain className="text-blue-500 w-5 h-5" />
          <span>Leitor de Editais com Inteligência Artificial</span>
        </h2>
        <p className="text-xs text-slate-400">Varre documentos pesados, identifica pegadinhas jurídicas e extrai certidões em segundos com processamento de LLM do Gemini.</p>
      </div>

      {/* Seleta do Edital a analisar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="lia-selector-grid">
        <div className="md:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 space-y-4" id="lia-left-selector">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Selecione uma Captação Recente</label>
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setCustomText(""); // reset
            }}
            className="w-full bg-slate-50 border border-slate-150 rounded-xl p-2.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400 cursor-pointer"
          >
            <option value="">Selecione...</option>
            {licitacoes.map(l => (
              <option key={l.id} value={l.id}>
                {l.id} - {l.titulo.substring(0, 45)}...
              </option>
            ))}
          </select>

          {selectedLic && (
            <div className="p-4 bg-slate-50/40 rounded-xl border border-slate-100 space-y-3 font-sans" id="lia-lic-quick-details">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-display">Órgão Promotor</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5 leading-tight">{selectedLic.orgao}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-display">Valor Máximo Estimado</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5 font-mono">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(selectedLic.valorEstimado)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-display">Análise Anterior</p>
                {selectedLic.analiseIA ? (
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center w-max font-display">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Processada por IA
                  </span>
                ) : (
                  <span className="inline-block mt-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-display">
                    Pendente de Análise
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Text do Edital ou Símbolo */}
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between" id="lia-text-compiler">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-display">Cláusulas e Texto do Edital (Doc Parser / PDF bruto)</h4>
            <textarea
              rows={6}
              value={customText || getSimulatedEditalText(selectedLic)}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-[11px] font-mono text-slate-500 focus:outline-none focus:border-blue-400 resize-none leading-relaxed"
              placeholder="Cole cláusulas aqui se desejar recalcular ou use a simulação de extração de pdf..."
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 max-w-xs leading-none">Processado em tempo real pelo modelo Gemini integrado à plataforma.</span>
            
            <button
              onClick={handleRunAnalysis}
              disabled={loading || !selectedId}
              className="flex items-center space-x-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer font-display"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Processando IA com Gemini..." : "Analisar com Gemini AI"}</span>
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white p-12 border border-blue-50 rounded-2xl text-center space-y-4 shadow-xs" id="loading-ia-state">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h4 className="text-xs font-bold text-slate-705 uppercase tracking-widest animate-pulse font-display">Consultando Conhecimento de Compras Públicas...</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">Extraindo obrigatoriedades do termo de referências, mapeando certidões indispensáveis e gerando relatórios de risco operacional em tempo recorde.</p>
          </div>
        </div>
      )}

      {/* Resultado da Análise de IA */}
      {!loading && selectedLic && selectedLic.analiseIA && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6" id="lia-results-presentation-box">
          
          {/* Top banner de conclusão de leitura */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center space-x-3" id="lia-banner-success">
            <div className="p-2 bg-white text-blue-600 rounded-lg shadow-2xs">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider font-display">Leitura IA Concluída</h4>
              <p className="text-xs text-blue-600">Nosso agente interpretou as obrigações e regras do edital. Revise os relatórios de aderência abaixo.</p>
            </div>
          </div>

          {/* Grid de Informações Extraídas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="extracted-variables-grid">
            
            {/* Esquerda: Objeto, Julgamento, Garantias */}
            <div className="space-y-4" id="lia-left-col-results">
              <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 shadow-2xs">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center font-display">
                  <FileText className="w-4 h-4 text-slate-400 mr-2" />
                  Objeto Efetivo do Edital
                </h5>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {selectedLic.analiseIA.objetoDetalhado}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3" id="extracted-mini-vars">
                <div className="bg-slate-50/40 p-3 rounded-xl border border-slate-100">
                  <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-display">Critério de Julgamento</h5>
                  <p className="text-xs font-bold text-slate-700">{selectedLic.analiseIA.criterioJulgamento}</p>
                </div>
                <div className="bg-slate-50/40 p-3 rounded-xl border border-slate-100">
                  <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-display">Prazo de Garantia</h5>
                  <p className="text-xs font-bold text-slate-700">{selectedLic.analiseIA.prazoGarantia || "Não consta expressamente"}</p>
                </div>
              </div>

              {/* Qualificações Técnicas Exigidas */}
              <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center font-display">
                  <Landmark className="w-4 h-4 text-blue-500 mr-2" />
                  Qualificações Técnicas e Exigências Comprobatórias
                </h5>
                <ul className="space-y-2 font-sans" id="extracted-tech-qualifs">
                  {selectedLic.analiseIA.qualificacoesTecnicas.map((q, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Direita: Certidões e Pontos de Atenção de Risco */}
            <div className="space-y-4" id="lia-right-col-results">
              {/* Certidões Exigidas */}
              <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center font-display">
                  <Lock className="w-4 h-4 text-emerald-500 mr-2" />
                  Certidões e Burocracia Fiscal Exigida
                </h5>
                <div className="flex flex-wrap gap-1.5" id="extracted-certs-tags">
                  {selectedLic.analiseIA.certidoesExigidas.map((c, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-100 font-display">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pontos de Atenção de Risco (Pegadinhas contratuais) */}
              <div className="bg-amber-50/25 p-4 rounded-xl border border-amber-100">
                <h5 className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-2 flex items-center font-display">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                  Pontos de Atenção e Cláusulas Críticas
                </h5>
                <ul className="space-y-2 font-sans" id="extracted-warnings">
                  {selectedLic.analiseIA.pontosAtencao.map((p, i) => (
                    <li key={i} className="text-xs text-amber-900 bg-amber-55/65 p-2 rounded-lg border border-amber-100 flex items-start leading-relaxed shadow-3xs">
                      <span className="text-amber-500 font-bold mr-2">⚠</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Abas do Resumo Executivo Completo */}
          <div className="mt-4 border-t border-slate-100 pt-6" id="lia-resumos-holder">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-display">Resumo Executivo Multi-Aderência</h4>
            
            <div className="flex border-b border-slate-100 font-display" id="resumo-tab-switcher">
              <button
                onClick={() => setActiveResumoTab('comercial')}
                className={`py-2 px-4 text-xs font-bold transition-all border-b-2 -mb-[2px] cursor-pointer ${activeResumoTab === 'comercial' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Resumo Comercial
              </button>
              <button
                onClick={() => setActiveResumoTab('juridico')}
                className={`py-2 px-4 text-xs font-bold transition-all border-b-2 -mb-[2px] cursor-pointer ${activeResumoTab === 'juridico' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Resumo Jurídico
              </button>
              <button
                onClick={() => setActiveResumoTab('operacional')}
                className={`py-2 px-4 text-xs font-bold transition-all border-b-2 -mb-[2px] cursor-pointer ${activeResumoTab === 'operacional' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Resumo Operacional
              </button>
              <button
                onClick={() => setActiveResumoTab('financeiro')}
                className={`py-2 px-4 text-xs font-bold transition-all border-b-2 -mb-[2px] cursor-pointer ${activeResumoTab === 'financeiro' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Resumo Financeiro
              </button>
            </div>

            <div className="p-4 bg-slate-50/40 border border-slate-100 border-t-0 rounded-b-xl" id="resumo-content">
              {activeResumoTab === 'comercial' && (
                <p className="text-xs text-slate-605 leading-relaxed font-medium font-sans">
                  {selectedLic.analiseIA.resumoComercial}
                </p>
              )}
              {activeResumoTab === 'juridico' && (
                <p className="text-xs text-slate-605 leading-relaxed font-medium font-sans">
                  {selectedLic.analiseIA.resumoJuridico}
                </p>
              )}
              {activeResumoTab === 'operacional' && (
                <p className="text-xs text-slate-605 leading-relaxed font-medium font-sans">
                  {selectedLic.analiseIA.resumoOperacional}
                </p>
              )}
              {activeResumoTab === 'financeiro' && (
                <p className="text-xs text-slate-605 leading-relaxed font-medium font-sans">
                  {selectedLic.analiseIA.resumoFinanceiro}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
