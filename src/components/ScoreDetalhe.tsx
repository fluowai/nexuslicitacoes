/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Licitacao } from '../types';
import { Brain, MapPin, DollarSign, Award, Target, FileLock, BarChart3, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ScoreDetalheProps {
  licitacao: Licitacao;
  onClose: () => void;
  onGoToAnalyzer: () => void;
}

export default function ScoreDetalhe({ licitacao, onClose, onGoToAnalyzer }: ScoreDetalheProps) {
  const details = licitacao.scoreDetalhes;

  const scoreColor = 
    licitacao.score >= 90 ? 'text-green-700 bg-green-50 border-green-200' :
    licitacao.score >= 75 ? 'text-blue-700 bg-blue-50 border-blue-200' :
    licitacao.score >= 50 ? 'text-amber-700 bg-amber-50 border-amber-200' :
    'text-red-700 bg-red-50 border-red-200';

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans" id="score-detalhe-overlay">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden flex flex-col" id="score-detalhe-box">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center font-display" id="score-header">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Amostragem do Vitória Score</h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Algoritmo de qualificação comercial proprietário da plataforma.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
          >
            Fechar [X]
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto" id="score-body">
          {/* Main Score Indicator */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between font-display ${scoreColor}`} id="main-score-card">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-95">Grau de Probabilidade de Vitória</h4>
              <p className="text-[11px] opacity-80 mt-1 font-sans">Compara exigências do TR contra a regularidade produtiva e logística do cliente.</p>
              <div className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white/70 border border-slate-100/10 px-2 py-0.5 rounded w-max">
                Rank: Oportunidade {licitacao.scoreClassificacao}
              </div>
            </div>

            <div className="text-right flex flex-col items-center justify-center pr-2 font-display">
              <span className="text-4xl font-black leading-none">{licitacao.score}</span>
              <span className="text-[9px] font-bold tracking-widest mt-1">PONTOS</span>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="space-y-4" id="score-breakdown-metrics">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Matriz de Pesos e Notas Atribuídas</h5>
            
            <div className="space-y-3" id="breakdown-bars">
              {/* Compatibilidade Técnica (35%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-650">
                  <span className="flex items-center"><Brain className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Compatibilidade Técnica (Peso: 35%)</span>
                  <span className="font-mono">Nota: {details.compatibilidadeTecnica} / 35</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(details.compatibilidadeTecnica / 35) * 100}%` }}></div>
                </div>
              </div>

              {/* Histórico do Órgão (15%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-650">
                  <span className="flex items-center"><Target className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Histórico Qualitativo do Órgão (Peso: 15%)</span>
                  <span className="font-mono">Nota: {details.historicoOrgao} / 15</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${(details.historicoOrgao / 15) * 100}%` }}></div>
                </div>
              </div>

              {/* Localização (10%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-650">
                  <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-cyan-500" /> Logística e Proximidade Sede (Peso: 10%)</span>
                  <span className="font-mono">Nota: {details.localizacao} / 10</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${(details.localizacao / 10) * 100}%` }}></div>
                </div>
              </div>

              {/* Ticket Médio (10%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-650">
                  <span className="flex items-center"><DollarSign className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Desvio do Ticket Médio da Empresa (Peso: 10%)</span>
                  <span className="font-mono">Nota: {details.ticketMedio} / 10</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(details.ticketMedio / 10) * 100}%` }}></div>
                </div>
              </div>

              {/* Concorrência (10%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-650">
                  <span className="flex items-center"><BarChart3 className="w-3.5 h-3.5 mr-1.5 text-purple-500" /> Densidade Competitiva Provável (Peso: 10%)</span>
                  <span className="font-mono">Nota: {details.concorrencia} / 10</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${(details.concorrencia / 10) * 100}%` }}></div>
                </div>
              </div>

              {/* Demais variáveis menores agregadas */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-[10px]" id="minor-score-variables">
                <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <span className="block text-slate-400 font-bold uppercase tracking-wider">Complex. Doc (5%)</span>
                  <span className="text-xs font-bold text-slate-800 block mt-1 font-mono">{details.complexidadeDocumental} / 5</span>
                </div>
                <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <span className="block text-slate-400 font-bold uppercase tracking-wider">Hist. Compras (10%)</span>
                  <span className="text-xs font-bold text-slate-800 block mt-1 font-mono">{details.historicoContratacoes} / 10</span>
                </div>
                <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <span className="block text-slate-400 font-bold uppercase tracking-wider">Margem Potencial (5%)</span>
                  <span className="text-xs font-bold text-slate-800 block mt-1 font-mono">{details.margemPotencial} / 5</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Decision advice */}
          <div className="bg-blue-50/40 p-4 border border-blue-100 rounded-2xl space-y-1.5 font-display" id="ai-advice-block">
            <h5 className="text-xs font-bold text-blue-800 uppercase tracking-widest flex items-center">
              <ShieldCheck className="w-4 h-4 text-blue-500 mr-1.5" />
              Parecer Recomendatório do Nexus AI
            </h5>
            <p className="text-xs text-blue-700 leading-relaxed font-sans font-bold">
              {licitacao.score >= 85 
                ? `Esta é uma oportunidade primorosa de participação direta! O valor licitado de ${formatBRL(licitacao.valorEstimado)} confere excelente margem de lucro com baixo risco de inabilitação concorrencial.`
                : licitacao.score >= 60 
                  ? "Recomendamos cautela e estruturação. A participação é viável, porém certifique-se de recolher cada um dos atestados técnicos solicitados para prevenir litígios administrativos."
                  : "Baixa viabilidade teórica. O desvio de localização ou incompatibilidade técnica com sua CNAE atual aponta de antemão alta taxa de retrabalho na proposta."}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-150 bg-slate-50/50 flex justify-between items-center font-display" id="score-footer">
          <button 
            onClick={onClose} 
            className="text-xs font-bold text-slate-500 hover:text-slate-700 py-2 px-4 border border-slate-200 bg-white rounded-xl cursor-pointer"
          >
            Fechar Janela
          </button>
          
          <button
            onClick={onGoToAnalyzer}
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-750 py-2 px-4 rounded-xl flex items-center space-x-1 shadow-sm cursor-pointer"
          >
            <span>Executar Leitor Edital IA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
