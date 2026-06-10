/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Competidor, EmpresaPerfil } from '../types';
import { ShieldAlert, Users, TrendingUp, BarChart3, HelpCircle, Landmark, ExternalLink, Award, Coins, Compass } from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface InteligenciaTabProps {
  competidores: Competidor[];
  perfil: EmpresaPerfil | null;
}

export default function InteligenciaTab({ competidores, perfil }: InteligenciaTabProps) {
  // Mock buying trends sectors for Modulo 8
  const setoresAquecidos = [
    { id: "set-1", nome: "Tratamento de Água e Dessalinização", crescimento: "+34.2%", volume: "R$ 145 Milhões", status: "Em Alta Expressiva" },
    { id: "set-2", nome: "Sanitização de Efluentes e ETEs", crescimento: "+18.5%", volume: "R$ 310 Milhões", status: "Crescimento Constante" },
    { id: "set-3", nome: "Supras e Filtros Industriais", crescimento: "+9.1%", volume: "R$ 48 Milhões", status: "Estável" },
    { id: "set-4", nome: "TI e Telemetria de Saneamento", crescimento: "+14.8%", volume: "R$ 82 Milhões", status: "Expansão" }
  ];

  const orgaosCompradoresMaisAtivos = [
    { orgao: "DNOCS - Secas e Dessalinização", volumeLicitado: 54, valorTotal: 12400000.00, estado: "CE" },
    { orgao: "SABESP - Saneamento Básico SP", volumeLicitado: 38, valorTotal: 9800000.00, estado: "SP" },
    { orgao: "CASAL - Água e Esgotos Alagoas", volumeLicitado: 12, valorTotal: 2100000.00, estado: "AL" },
    { orgao: "Hospital das Clínicas da Capital", volumeLicitado: 8, valorTotal: 1500000.00, estado: "SP" }
  ];

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  // Structured radar data comparison
  const radarData = [
    {
      subject: 'Frequência de Vitória',
      'Sua Empresa': 75,
      'HidroFiltros': 60,
      'AcquaVida': 45,
      'SaneFlow': 35,
    },
    {
      subject: 'Atuação Geográfica',
      'Sua Empresa': perfil?.areaAtendimento === 'Nacional' ? 95 : perfil?.areaAtendimento === 'Regional' ? 75 : perfil?.areaAtendimento === 'Estadual' ? 50 : 30,
      'HidroFiltros': 70,
      'AcquaVida': 65,
      'SaneFlow': 60,
    },
    {
      subject: 'Catálogo de Produtos',
      'Sua Empresa': Math.min(95, 40 + (perfil?.produtos?.length || 2) * 15),
      'HidroFiltros': 70,
      'AcquaVida': 55,
      'SaneFlow': 50,
    },
    {
      subject: 'Score de Ticket',
      'Sua Empresa': perfil?.produtos && perfil.produtos.length > 0 
        ? Math.min(95, 45 + Math.round(Math.max(...perfil.produtos.map(p => p.valorMedio)) / 5000))
        : 65,
      'HidroFiltros': 75,
      'AcquaVida': 85,
      'SaneFlow': 70,
    },
    {
      subject: 'Prontidão de IA',
      'Sua Empresa': 95,
      'HidroFiltros': 50,
      'AcquaVida': 40,
      'SaneFlow': 45,
    },
    {
      subject: 'Segurança Documental',
      'Sua Empresa': 90,
      'HidroFiltros': 80,
      'AcquaVida': 70,
      'SaneFlow': 65,
    },
  ];

  return (
    <div className="space-y-6" id="inteligencia-tab-root font-sans">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4" id="inteligencia-tab-header">
        <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2 font-display">
          <TrendingUp className="text-blue-500 w-5 h-5 flex-shrink-0 animate-pulse" />
          <span>Monitoramento de Concorrentes & Inteligência de Mercado</span>
        </h2>
        <p className="text-xs text-slate-400">Rastreie o modus-operandi de concorrentes prioritários, filtre órgãos que mais realizam compras na sua categoria e visualize tendências setoriais.</p>
      </div>

      {/* Confronto Radial Radar Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-150/80 shadow-md space-y-6" id="radar-market-confrontation">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center font-display">
              <Compass className="w-5 h-5 text-blue-500 mr-2 animate-spin-slow" />
              Confronto Radial de Capacidades Comerciais
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Visão mapeada de competitividade relativa de mercado. Pontuações normatizadas de 0 a 100 geradas dinamicamente com base nas metas e estrutura da sua empresa.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-bold shrink-0 font-display">
            <div className="flex items-center space-x-1 border border-blue-200 bg-blue-50/50 text-blue-700 px-2 py-0.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-blue-500 block"></span>
              <span>Sua Empresa (Você)</span>
            </div>
            <div className="flex items-center space-x-1 border border-slate-200 bg-slate-50 text-slate-650 px-2 py-0.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-slate-500 block"></span>
              <span>HidroFiltros</span>
            </div>
            <div className="flex items-center space-x-1 border border-cyan-200 bg-cyan-50/50 text-cyan-700 px-2 py-0.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-500 block"></span>
              <span>AcquaVida</span>
            </div>
            <div className="flex items-center space-x-1 border border-emerald-200 bg-emerald-50/50 text-emerald-700 px-2 py-0.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
              <span>SaneFlow</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Chart Section */}
          <div className="lg:col-span-7 h-[280px] w-full" id="radar-chart-viewport">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#475569', fontSize: 9, fontWeight: 700 }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: '#94a3b8', fontSize: 7 }}
                />
                
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#f8fafc',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />

                <Radar 
                  name="Sua Empresa" 
                  dataKey="Sua Empresa" 
                  stroke="#2563eb" 
                  fill="#3b82f6" 
                  fillOpacity={0.15} 
                />
                <Radar 
                  name="HidroFiltros" 
                  dataKey="HidroFiltros" 
                  stroke="#64748b" 
                  fill="#64748b" 
                  fillOpacity={0.02} 
                />
                <Radar 
                  name="AcquaVida" 
                  dataKey="AcquaVida" 
                  stroke="#06b6d4" 
                  fill="#06b6d4" 
                  fillOpacity={0.02} 
                />
                <Radar 
                  name="SaneFlow" 
                  dataKey="SaneFlow" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.02} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Key Insights Section on the right */}
          <div className="lg:col-span-5 space-y-4" id="radar-insights-panel">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">insights estratégicos da rodada</h4>
            
            <div className="space-y-3 text-xs leading-relaxed font-sans text-slate-600">
              <div className="p-3 bg-blue-50/20 border border-blue-100 rounded-xl flex items-start space-x-2.5">
                <span className="p-1 text-blue-600 bg-blue-50 border border-blue-100 rounded-md text-[10px] shrink-0 font-bold font-display">IA/TECH</span>
                <div>
                  <p className="font-bold text-slate-800 font-display">Prontidão Tecnológica Sobressalente</p>
                  <p className="text-slate-405 text-[11px] mt-0.5">Sua empresa lidera no quesito <strong>Prontidão de IA</strong> (95/100) devido à correlação automatizada do Vitória Score no robô de lances, economizando ~12 horas de diligência prévia por edital comparativamente aos concorrentes.</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/20 border border-emerald-100 rounded-xl flex items-start space-x-2.5">
                <span className="p-1 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md text-[10px] shrink-0 font-bold font-display font-display">GEOGRAFIA</span>
                <div>
                  <p className="font-bold text-slate-800 font-display">Oportunidade Logística Regional</p>
                  {perfil?.areaAtendimento === 'Nacional' ? (
                    <p className="text-slate-405 text-[11px] mt-0.5 font-sans">Com abrangência <strong>Nacional</strong> ativa, sua empresa rivaliza diretamente com a HidroFiltros no Sudeste e a AcquaVida no Nordeste, tendo canais capilares estendidos para lances distantes.</p>
                  ) : (
                    <p className="text-slate-405 text-[11px] mt-0.5 font-sans">Sua cobertura geográfica atual ({perfil?.areaAtendimento || 'Nacional'}) protege suas margens estaduais. Para captar mais mercado, considere expandir a abrangência na aba Perfil Comercial.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="inteligencia-panels-grid">
        
        {/* MÓDULO 7 - RIVALIDADES / CONCORRENTES */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-100 space-y-4" id="competitor-intelligence-panel">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50 font-display">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center">
              <Users className="w-4 h-4 text-cyan-600 mr-2" />
              Monitoramento Competitivo Nacional
            </h4>
            <span className="text-[9px] bg-cyan-50 text-cyan-700 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">3 Principais Rivais</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">Análise agregada de vitórias e preço-diretriz praticado pelos seus principais competidores em editais de Saneamento/Sistemas Filtrantes.</p>

          <div className="space-y-4 font-sans" id="competitors-analytics-cards">
            {competidores.map((comp, idx) => {
              const colors = [
                'bg-blue-50 border-blue-100 text-blue-700',
                'bg-slate-50 border-slate-150 text-slate-700',
                'bg-emerald-50 border-emerald-100 text-emerald-700'
              ];
              const color = colors[idx] || 'bg-slate-100 border-slate-150 text-slate-700';

              return (
                <div key={comp.id} className="p-4 bg-slate-50/40 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex items-start justify-between font-display">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 leading-snug">{comp.nome}</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-sans font-medium">Região preferencial de atuação: {comp.regioesAtuantes.join(", ")}</p>
                    </div>
                    <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-md uppercase leading-none font-mono ${color}`}>
                      Frequência {comp.frequenciaVitoriaPercent}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center font-display" id="comp-grid-stats">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold">Licitações Ganhas</span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5 font-mono">{comp.vitoriasCount} editais</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold">Margem Estimada</span>
                      <span className="text-xs font-bold text-slate-850 block mt-0.5 font-mono">~32% de lucro</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold">Lance Médio</span>
                      <span className="text-xs font-bold text-emerald-600 block mt-0.5 font-mono">{formatBRL(comp.faixaPrecoMedia)}</span>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-50">
                    <span className="font-bold text-slate-500 font-display">Clientes Comuns:</span> {comp.orgaosCompradores.join(", ")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MÓDULO 8 - INTELIGENCIA DE MERCADO / SETORES */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-100 space-y-4" id="market-intelligence-panel">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50 font-display">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center">
              <BarChart3 className="w-4 h-4 text-emerald-600 mr-2" />
              Inteligência Setorial & Demandas
            </h4>
            <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Novo Marco Geral</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">Sinalização de mercados públicos em expansão no Brasil, estimulados pelas novas diretrizes de saneamento básico e investimentos estruturais.</p>

          <div className="space-y-3 font-sans" id="procurement-sectors-trends">
            {setoresAquecidos.map((sec) => (
              <div 
                key={sec.id} 
                className="p-3 bg-slate-50/40 rounded-xl border border-slate-100 flex items-center justify-between hover:border-slate-250 transition-colors"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-800 font-display">{sec.nome}</h5>
                  <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400 font-medium">
                    <span>Volume licitado: {sec.volume}</span>
                    <span>•</span>
                    <span className="text-blue-500 font-bold">{sec.status}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2 font-mono">
                  <span className="bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100 px-2 py-1 rounded-md">
                    {sec.crescimento}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3" id="top-buying-organs-section">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center font-display">
              <Landmark className="w-4 h-4 mr-2 text-slate-400" />
              Unidades de Compras Mais Desafiadoras (Volume Contratual)
            </h5>

            <div className="overflow-x-auto text-xs" id="buying-organs-scroller">
              <table className="min-w-full text-left font-sans" id="buying-organs-table">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold text-[9px] uppercase tracking-wider font-displayAndTheme">
                    <th className="pb-2">Unidade Órgão</th>
                    <th className="pb-2 text-center">Editais / Ano</th>
                    <th className="pb-2 text-right">Valor Total Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[11px]">
                  {orgaosCompradoresMaisAtivos.map((org, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2 text-slate-700 font-medium font-display">
                        {org.orgao} <span className="text-[9px] text-slate-400 uppercase font-mono">({org.estado})</span>
                      </td>
                      <td className="py-2 text-center text-slate-600 font-bold font-mono">{org.volumeLicitado}</td>
                      <td className="py-2 text-right text-slate-800 font-bold font-mono">{formatBRL(org.valorTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
