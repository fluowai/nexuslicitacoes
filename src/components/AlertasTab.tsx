/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertaInteligente } from '../types';
import { Bell, Smartphone, Send, Mail, CheckCircle2, AlertTriangle, PlayCircle, ToggleLeft, ToggleRight, Sparkles, MessageCircle } from 'lucide-react';

interface AlertasTabProps {
  alertas: AlertaInteligente[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onTriggerSimulatedAlert: (tipo: "nova_oportunidade" | "documento" | "concorrente") => void;
}

export default function AlertasTab({ alertas, onMarkRead, onClearAll, onTriggerSimulatedAlert }: AlertasTabProps) {
  // Alert channel statuses
  const [waOn, setWaOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);
  const [teleOn, setTeleOn] = useState(false);
  const [pushOn, setPushOn] = useState(true);

  return (
    <div className="space-y-6" id="alertas-tab-root font-sans">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center md:justify-between" id="alertas-tab-header">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2 font-display">
            <Bell className="text-blue-500 w-5 h-5 flex-shrink-0" />
            <span>Automação e Alertas Inteligentes</span>
          </h2>
          <p className="text-xs text-slate-400">Notificações preditivas integradas para não perder prazos de recursos operacionais ou editais de altíssimo retorno financeiro.</p>
        </div>

        {alertas.some(a => !a.lido) && (
          <button
            onClick={onClearAll}
            className="mt-3 md:mt-0 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-display"
          >
            Marcar Todos como Lidos
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="alertas-components-grid">
        
        {/* Configuração de Canais */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 space-y-4" id="alert-channels-card">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest pb-2 border-b border-slate-50 font-display">Canais de Notificação Ativos</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">Vincule suas contas cadastrais para nossa IA disparar envios instantâneos assim que um edital Excelente for captado.</p>

          <div className="space-y-3 font-sans" id="alert-channels-toggles">
            {/* WhatsApp */}
            <div className="p-3.5 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 block">WhatsApp CRM push</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Ativo no número principal cadastrado</span>
                </div>
              </div>
              <button onClick={() => setWaOn(!waOn)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                {waOn ? <ToggleRight className="w-9 h-9 text-emerald-500" /> : <ToggleLeft className="w-9 h-9 text-slate-300" />}
              </button>
            </div>

            {/* E-mail */}
            <div className="p-3.5 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 block">E-mail Diário consolidado</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Formatado com resumos comerciais</span>
                </div>
              </div>
              <button onClick={() => setEmailOn(!emailOn)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                {emailOn ? <ToggleRight className="w-9 h-9 text-blue-500" /> : <ToggleLeft className="w-9 h-9 text-slate-300" />}
              </button>
            </div>

            {/* Telegram */}
            <div className="p-3.5 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg border border-sky-100">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Telegram de lances ao vivo</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Alertas críticos de lances de competidores</span>
                </div>
              </div>
              <button onClick={() => setTeleOn(!teleOn)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                {teleOn ? <ToggleRight className="w-9 h-9 text-sky-500" /> : <ToggleLeft className="w-9 h-9 text-slate-300" />}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2" id="alert-sim-suite">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center font-display">
              <Sparkles className="w-4 h-4 text-blue-500 mr-2 animate-pulse" />
              Ambiente de Demonstração (Simulador de Gatilhos)
            </h5>
            <p className="text-[11px] text-slate-400 font-medium">Simule novos eventos do mercado público para testar as regras neurais de categorização:</p>
            
            <div className="grid grid-cols-1 gap-2 pt-2 font-display" id="simulators-btn-set">
              <button
                onClick={() => onTriggerSimulatedAlert('nova_oportunidade')}
                className="text-left text-xs bg-slate-50 hover:bg-blue-50 border border-slate-150 hover:border-blue-200 text-slate-700 p-2.5 rounded-xl transition-all font-bold flex items-center cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                Simular Nova Licitação Muito Elevada (Score 98%)
              </button>
              <button
                onClick={() => onTriggerSimulatedAlert('documento')}
                className="text-left text-xs bg-slate-50 hover:bg-amber-50 border border-slate-150 hover:border-amber-200 text-slate-700 p-2.5 rounded-xl transition-all font-bold flex items-center cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                Simular Notificação de Certidão Vencendo em 24h
              </button>
              <button
                onClick={() => onTriggerSimulatedAlert('concorrente')}
                className="text-left text-xs bg-slate-50 hover:bg-indigo-50 border border-slate-150 hover:border-indigo-200 text-slate-700 p-2.5 rounded-xl transition-all font-bold flex items-center cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" />
                Simular Vitória de Concorrente no Sabesp
              </button>
            </div>
          </div>
        </div>

        {/* Caixa Postal de Mensagens */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between" id="notifications-box">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest pb-2 border-b border-slate-50 mb-3 font-display">Histórico de Alertas Recentes</h4>
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 font-sans" id="alerts-scroller-list">
              {alertas.length === 0 ? (
                <div className="p-8 text-center text-slate-350 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/20 font-bold" id="no-alerts-fall font-semibold">
                  Nenhum alerta pendente de verificação.
                </div>
              ) : (
                alertas.map(a => {
                  let badgeCol = "bg-slate-100 text-slate-600";
                  let isUnreadStyle = !a.lido ? 'border-l-4 border-l-blue-500 bg-blue-50/10' : 'bg-slate-50/20';
                  
                  if (a.tipo === "nova_oportunidade") badgeCol = "bg-emerald-50 text-emerald-800 border-emerald-100";
                  if (a.tipo === "documento") badgeCol = "bg-amber-50 text-amber-800 border-amber-100";
                  if (a.tipo === "concorrente") badgeCol = "bg-indigo-50 text-indigo-800 border-indigo-100";

                  return (
                    <div 
                      key={a.id} 
                      className={`p-3.5 border border-slate-100 rounded-xl transition-colors ${isUnreadStyle} flex items-start justify-between`}
                    >
                      <div className="space-y-1.5 pr-3">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded-md uppercase tracking-wider font-display ${badgeCol}`}>
                            {a.tipo.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(a.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-800 leading-snug font-display">{a.titulo}</h5>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{a.mensagem}</p>
                      </div>

                      {!a.lido && (
                        <button
                          onClick={() => onMarkRead(a.id)}
                          className="flex-shrink-0 text-[9px] font-bold text-blue-500 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 cursor-pointer font-display"
                        >
                          Lido
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-xs text-slate-400 flex justify-between items-center bg-slate-50/30 p-3 rounded-xl overflow-hidden font-display">
            <span>Sincronizado há menos de 1 minuto</span>
            <span className="font-bold text-slate-500">Referência: São Paulo (GMT-3)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
