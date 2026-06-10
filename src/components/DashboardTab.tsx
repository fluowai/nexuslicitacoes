/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Licitacao } from '../types';
import { TrendingUp, Award, DollarSign, Activity, FileText, CheckCircle, Percent, ShieldCheck } from 'lucide-react';

interface DashboardTabProps {
  licitacoes: Licitacao[];
  onSelectTab: (tab: string) => void;
  onSelectLicitacao: (lic: Licitacao) => void;
}

export default function DashboardTab({ licitacoes, onSelectTab, onSelectLicitacao }: DashboardTabProps) {
  // Compute metrics
  const totalCapturas = licitacoes.length;
  const analisadasIA = licitacoes.filter(l => l.analiseIA !== null).length;
  const emAndamento = licitacoes.filter(l => l.status !== 'Nova' && l.status !== 'Pós-Venda').length;
  
  const valorPotencial = licitacoes.reduce((acc, l) => acc + l.valorEstimado, 0);
  const valorHomologado = licitacoes
    .filter(l => ['Homologação', 'Contrato', 'Pós-Venda'].includes(l.status))
    .reduce((acc, l) => acc + l.valorEstimado, 0) || 185000; // Simulated fallback if none is there

  const contratosAtivos = licitacoes.filter(l => l.status === 'Contrato').length || 1;

  // Render format
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6" id="dashboard-tab-root font-sans">
      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="metrics-grid">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between" id="metric-tenders-count">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Licitações Captadas</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1.5 font-display">{totalCapturas}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 18% este mês</p>
          </div>
          <div className="p-3 bg-blue-50/50 text-blue-600 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between" id="metric-ai-analyzed">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Análises de IA</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1.5 font-display">{analisadasIA}</h3>
            <p className="text-xs text-blue-600 font-semibold mt-1">{Math.round((analisadasIA / (totalCapturas || 1)) * 100)}% de cobertura</p>
          </div>
          <div className="p-3 bg-indigo-50/50 text-indigo-600 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between" id="metric-potential-value">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Pipeline Potencial</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1.5 font-display">{formatBRL(valorPotencial)}</h3>
            <p className="text-xs text-amber-600 font-semibold mt-1">Média: R$ 380mil / edital</p>
          </div>
          <div className="p-3 bg-amber-50/50 text-amber-600 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between" id="metric-won-value">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Valor Homologado</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1.5 font-display">{formatBRL(valorHomologado)}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Proposta vencedora ativa</p>
          </div>
          <div className="p-3 bg-emerald-50/50 text-emerald-600 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Secundária de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="submetrics-grid">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center space-x-3" id="metric-win-rate">
          <div className="p-2.5 bg-emerald-50/50 text-emerald-600 rounded-lg">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-display">Taxa de Sucesso</p>
            <p className="text-sm font-bold text-slate-700">74% de Homologação</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center space-x-3" id="metric-roi">
          <div className="p-2.5 bg-indigo-50/50 text-indigo-600 rounded-lg">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-display">ROI Comercial (SaaS)</p>
            <p className="text-sm font-bold text-slate-700">385% com lances de IA</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center space-x-3" id="metric-active-contracts">
          <div className="p-2.5 bg-blue-50/50 text-blue-600 rounded-lg">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-display">Contratos Ativos</p>
            <p className="text-sm font-bold text-slate-700">{contratosAtivos} Contratos Assinados</p>
          </div>
        </div>
      </div>

      {/* Seção Central de Gráficos e Oportunidades Em Destaque */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-center-sections">
        {/* Gráfico Minimalista de Tendências (SVG custom) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs lg:col-span-7" id="trend-chart-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 font-display">Volume Comercial e Taxa de Sucesso</h4>
              <p className="text-xs text-slate-400">Análise histórica dos últimos 6 meses de licitações públicas</p>
            </div>
            <div className="flex space-x-4 text-xs font-semibold text-slate-500 font-display">
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-1.5"></span>Captadas</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-1.5"></span>Vencidas</span>
            </div>
          </div>

          <div className="h-52 w-full flex flex-col justify-between" id="svg-analytics-wrapper">
            {/* SVG custom bar and line representation for light minimalist theme */}
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />

              {/* Data Bars for Captadas (Blue) and Vencidas (Emerald) */}
              {/* Jan */}
              <rect x="35" y="60" width="16" height="80" rx="3" fill="#3b82f6" fillOpacity="0.12" />
              <rect x="55" y="100" width="16" height="40" rx="3" fill="#10b981" fillOpacity="0.12" />
              
              {/* Fev */}
              <rect x="105" y="45" width="16" height="95" rx="3" fill="#3b82f6" fillOpacity="0.12" />
              <rect x="125" y="90" width="16" height="50" rx="3" fill="#10b981" fillOpacity="0.12" />

              {/* Mar */}
              <rect x="175" y="50" width="16" height="90" rx="3" fill="#3b82f6" fillOpacity="0.12" />
              <rect x="195" y="85" width="16" height="55" rx="3" fill="#10b981" fillOpacity="0.12" />

              {/* Abr */}
              <rect x="245" y="30" width="16" height="110" rx="3" fill="#3b82f6" fillOpacity="0.15" />
              <rect x="265" y="70" width="16" height="70" rx="3" fill="#10b981" fillOpacity="0.15" />

              {/* Mai */}
              <rect x="315" y="40" width="16" height="100" rx="3" fill="#3b82f6" fillOpacity="0.15" />
              <rect x="335" y="60" width="15" height="80" rx="3" fill="#10b981" fillOpacity="0.15" />

              {/* Jun (Current) */}
              <rect x="385" y="20" width="16" height="120" rx="3" fill="#3b82f6" fillOpacity="0.25" />
              <rect x="405" y="50" width="16" height="90" rx="3" fill="#10b981" fillOpacity="0.25" />

              {/* Line graph overlay for Success Rate */}
              <path d="M 45,100 L 115,90 L 185,85 L 255,70 L 325,60 L 395,50" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="45" cy="100" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="115" cy="90" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="185" cy="85" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="255" cy="70" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="325" cy="60" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="395" cy="50" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />

              {/* Labels */}
              <text x="45" y="155" fontFamily="sans-serif" fontSize="9" fill="#9ca3af" textAnchor="middle">JAN</text>
              <text x="115" y="155" fontFamily="sans-serif" fontSize="9" fill="#9ca3af" textAnchor="middle">FEV</text>
              <text x="185" y="155" fontFamily="sans-serif" fontSize="9" fill="#9ca3af" textAnchor="middle">MAR</text>
              <text x="255" y="155" fontFamily="sans-serif" fontSize="9" fill="#9ca3af" textAnchor="middle">ABR</text>
              <text x="325" y="155" fontFamily="sans-serif" fontSize="9" fill="#9ca3af" textAnchor="middle">MAI</text>
              <text x="395" y="155" fontFamily="sans-serif" fontSize="9" fill="#9ca3af" textAnchor="middle">JUN</text>
            </svg>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>Aumento de 35% no índice de acertos pelo cálculo de Score</span>
            <button onClick={() => onSelectTab('analise-mercado')} className="text-blue-500 font-semibold hover:underline cursor-pointer font-display">Ver análise ambiental →</button>
          </div>
        </div>

        {/* Oportunidades Melhores Ranqueadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs lg:col-span-5 flex flex-col justify-between" id="top-opportunities-card">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-800 font-display">Melhores Oportunidades por IA</h4>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider font-display">Score Proprietário</span>
            </div>
            
            <p className="text-xs text-slate-400 mb-4 font-sans">Editais vigentes com maior nível de conformidade do histórico técnico corporativo.</p>

            <div className="space-y-3" id="top-opps-list">
              {licitacoes.slice(0, 3).map((lic) => {
                const badgeColor = 
                  lic.score >= 90 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                  lic.score >= 75 ? 'text-blue-700 bg-blue-50 border-blue-100' :
                  lic.score >= 50 ? 'text-amber-700 bg-amber-50 border-amber-100' :
                  'text-slate-600 bg-slate-50 border-slate-100';

                return (
                  <div 
                    key={lic.id} 
                    onClick={() => onSelectLicitacao(lic)}
                    className="p-3 bg-slate-50/40 rounded-xl border border-slate-100 hover:border-blue-100 cursor-pointer transition-colors duration-155 flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <p className="text-xs font-semibold text-slate-700 truncate leading-snug">{lic.titulo}</p>
                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400 font-sans">
                        <span>{lic.orgao.length > 25 ? lic.orgao.slice(0, 25) + '...' : lic.orgao}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-500 font-mono">{formatBRL(lic.valorEstimado)}</span>
                      </div>
                    </div>
                    <div className={`flex flex-col items-center justify-center border px-2.5 py-1 rounded-lg ${badgeColor} shrink-0`}>
                      <span className="text-xs font-bold leading-none font-display">{lic.score}%</span>
                      <span className="text-[8px] font-bold mt-0.5 uppercase tracking-wider font-display">Win</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 mt-4">
            <button 
              onClick={() => onSelectTab('hub-nacional')}
              className="text-xs font-bold text-blue-600 w-full text-center hover:text-blue-700 transition-colors cursor-pointer font-display"
            >
              Visualizar Todas as {licitacoes.length} Licitações Ativas
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Monitoramento de Contratos e Pipeline Recentes */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs" id="recent-pipeline-card font-sans">
        <h4 className="text-sm font-bold text-slate-800 mb-4 font-display">Pipeline Recente por Fases do CRM</h4>
        <div className="overflow-x-auto" id="recent-pipeline-table-wrapper">
          <table className="min-w-full text-left border-collapse" id="recent-pipeline-table">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
                <th className="py-2.5 pb-3">Edital / Título</th>
                <th className="py-2.5 pb-3">Órgão Comprador</th>
                <th className="py-2.5 pb-3">Valor Estimado</th>
                <th className="py-2.5 pb-3">Localidade</th>
                <th className="py-2.5 pb-3">Probabilidade</th>
                <th className="py-2.5 pb-3">Status Atual</th>
                <th className="py-2.5 pb-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {licitacoes.map((lic) => {
                const scoreColor = 
                  lic.score >= 90 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                  lic.score >= 75 ? 'text-blue-700 bg-blue-50 border-blue-100' :
                  lic.score >= 50 ? 'text-amber-700 bg-amber-50 border-amber-100' :
                  'text-slate-600 bg-slate-50 border-slate-100';

                return (
                  <tr key={lic.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3">
                      <div className="font-semibold text-slate-700 max-w-xs truncate">{lic.titulo}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{lic.modalidade} • Fonte: {lic.fonte}</div>
                    </td>
                    <td className="py-3 text-slate-500">{lic.orgao}</td>
                    <td className="py-3 font-semibold text-slate-700 font-mono">{formatBRL(lic.valorEstimado)}</td>
                    <td className="py-3 text-slate-400">{lic.cidade}/{lic.uf}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] border ${scoreColor}`}>
                        {lic.score}%
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="bg-slate-150 text-slate-700 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider font-display">
                        {lic.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => onSelectLicitacao(lic)}
                        className="text-xs font-bold text-blue-500 hover:text-blue-700 bg-blue-50/50 px-2.5 py-1 rounded-md cursor-pointer font-display"
                      >
                        Analisar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
