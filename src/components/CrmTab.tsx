/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Licitacao } from '../types';
import { ChevronLeft, ChevronRight, FileText, ArrowRight, Kanban, Trophy, Calendar, CheckSquare } from 'lucide-react';

interface CrmTabProps {
  licitacoes: Licitacao[];
  onUpdateLicitacaoStatus: (id: string, newStatus: Licitacao['status']) => Promise<any>;
  onSelectLicitacao: (lic: Licitacao) => void;
}

const STAGES: Licitacao['status'][] = [
  "Nova",
  "Análise IA",
  "Interesse",
  "Documentação",
  "Proposta",
  "Participação",
  "Disputa",
  "Homologação",
  "Contrato",
  "Pós-Venda"
];

// Groups for display:
// 1. Captação (Nova, Análise IA, Interesse)
// 2. Preparação (Documentação, Proposta, Participação, Disputa)
// 3. Resultado (Homologação, Contrato, Pós-Venda)

export default function CrmTab({ licitacoes, onUpdateLicitacaoStatus, onSelectLicitacao }: CrmTabProps) {
  
  const handleMove = async (lic: Licitacao, direction: 'fwd' | 'back') => {
    const currentIndex = STAGES.indexOf(lic.status);
    let newIndex = currentIndex;
    if (direction === 'fwd' && currentIndex < STAGES.length - 1) {
      newIndex += 1;
    } else if (direction === 'back' && currentIndex > 0) {
      newIndex -= 1;
    }
    
    if (newIndex !== currentIndex) {
      await onUpdateLicitacaoStatus(lic.id, STAGES[newIndex]);
    }
  };

  const getLicitacoesInStage = (stage: Licitacao['status']) => {
    return licitacoes.filter(l => l.status === stage);
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6" id="crm-tab-root font-sans">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4" id="crm-tab-header">
        <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2 font-display">
          <Kanban className="text-blue-500 w-5 h-5 flex-shrink-0" />
          <span>Pipeline de Vendas de Governo (CRM 360)</span>
        </h2>
        <p className="text-xs text-slate-400">Gerencie o amadurecimento das oportunidades públicas desde a análise técnica de conformidade ao cumprimento contratual.</p>
      </div>

      {/* CRM Funnel Overview Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-50/55 p-3 rounded-2xl border border-slate-150 font-display" id="crm-summary-funnel">
        {["Fases Críticas", "Preparação", "Proposta", "Disputa Real", "Prêmio/Contrato"].map((label, index) => {
          let count = 0;
          if (index === 0) count = licitacoes.filter(l => ["Nova", "Análise IA", "Interesse"].includes(l.status)).length;
          else if (index === 1) count = licitacoes.filter(l => ["Documentação"].includes(l.status)).length;
          else if (index === 2) count = licitacoes.filter(l => ["Proposta"].includes(l.status)).length;
          else if (index === 3) count = licitacoes.filter(l => ["Participação", "Disputa"].includes(l.status)).length;
          else count = licitacoes.filter(l => ["Homologação", "Contrato", "Pós-Venda"].includes(l.status)).length;

          return (
            <div key={label} className="bg-white p-3 rounded-xl border border-slate-100 text-center" id={`funnel-stage-${index}`}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">{label}</span>
              <span className="text-lg font-bold text-slate-700 block mt-1">{count}</span>
            </div>
          );
        })}
      </div>

      {/* CRM Kanban Lanes - Responsive flex grid boards */}
      <div className="overflow-x-auto pb-4" id="kanban-lanes-outer">
        <div className="flex space-x-4 min-w-[1240px]" id="kanban-columns-scroller">
          {STAGES.map((stage) => {
            const list = getLicitacoesInStage(stage);
            const sumValor = list.reduce((acc, l) => acc + l.valorEstimado, 0);

            let headerBg = "bg-slate-50 text-slate-600 border-slate-200";
            if (stage === "Análise IA") headerBg = "bg-blue-50 text-blue-700 border-blue-100";
            if (stage === "Documentação") headerBg = "bg-indigo-50/50 text-indigo-700 border-indigo-100";
            if (stage === "Disputa") headerBg = "bg-amber-50 text-amber-700 border-amber-100";
            if (stage === "Homologação" || stage === "Contrato") headerBg = "bg-emerald-50 text-emerald-700 border-emerald-100";

            return (
              <div 
                key={stage} 
                className="w-72 bg-slate-50/20 rounded-2xl border border-slate-100/90 p-4 flex flex-col justify-start space-y-4 flex-shrink-0"
                id={`lane-col-${stage.replace(/\s+/g, '-')}`}
              >
                {/* Lane Header */}
                <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between font-display ${headerBg}`}>
                  <span>{stage}</span>
                  <span className="bg-white/90 rounded-full px-2 py-0.5 shadow-3xs text-slate-700">{list.length}</span>
                </div>

                <div className="text-[10px] font-bold text-slate-400 pl-1 font-mono tracking-wider">
                  VALOR: {formatBRL(sumValor)}
                </div>

                {/* Card Container List */}
                <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1" id={`lane-list-${stage.replace(/\s+/g, '-')}`}>
                  {list.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-[11px] border border-dashed border-slate-200 rounded-xl bg-white/40 font-medium">
                      Nenhum edital nesta fase
                    </div>
                  ) : (
                    list.map((lic) => {
                      const scoreColor = 
                        lic.score >= 90 ? 'border-emerald-200 bg-emerald-50/40 text-emerald-700' :
                        lic.score >= 75 ? 'border-blue-200 bg-blue-50/40 text-blue-700' :
                        lic.score >= 50 ? 'border-amber-200 bg-amber-50/40 text-amber-700' :
                        'border-slate-200 bg-slate-50/40 text-slate-600';

                      return (
                        <div 
                          key={lic.id} 
                          className="bg-white p-3.5 rounded-xl border border-slate-150 hover:border-blue-150 transition-all shadow-3xs hover:shadow-2xs space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-[9px] text-slate-400 uppercase font-bold font-mono">{lic.id} • {lic.fonte}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border font-display ${scoreColor}`}>
                              {lic.score}% Win
                            </span>
                          </div>

                          <h4 
                            onClick={() => onSelectLicitacao(lic)}
                            className="text-xs font-bold text-slate-700 leading-snug hover:text-blue-500 cursor-pointer line-clamp-2 font-display"
                          >
                            {lic.titulo}
                          </h4>

                          <div className="text-[11px] text-slate-400 font-medium leading-relaxed leading-tight">
                            {lic.orgao.length > 28 ? lic.orgao.slice(0, 28) + '...' : lic.orgao}
                          </div>

                          <div className="text-xs font-bold text-slate-800 font-mono">
                            {formatBRL(lic.valorEstimado)}
                          </div>

                          {/* Controls to cycle stages */}
                          <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
                            <button
                              type="button"
                              onClick={() => handleMove(lic, 'back')}
                              disabled={STAGES.indexOf(lic.status) === 0}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded disabled:opacity-30 cursor-pointer"
                              title="Recuar fase"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            
                            <span className="text-slate-400 font-bold font-mono">Fase {_STAGES_INDEX(lic.status)}</span>
                            
                            <button
                              type="button"
                              onClick={() => handleMove(lic, 'fwd')}
                              disabled={STAGES.indexOf(lic.status) === STAGES.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded disabled:opacity-30 cursor-pointer"
                              title="Avançar fase"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function _STAGES_INDEX(status: Licitacao['status']) {
  const index = STAGES.indexOf(status) + 1;
  return `${index}/10`;
}
