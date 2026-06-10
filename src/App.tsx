/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Licitacao, EmpresaPerfil, DocumentoCertidao, Competidor, AlertaInteligente, ChatMessage } from './types';

// Components
import DashboardTab from './components/DashboardTab';
import HubTab from './components/HubTab';
import LiaTab from './components/LiaTab';
import CrmTab from './components/CrmTab';
import CertidoesTab from './components/CertidoesTab';
import InteligenciaTab from './components/InteligenciaTab';
import AlertasTab from './components/AlertasTab';
import ChatTab from './components/ChatTab';
import PerfilModal from './components/PerfilModal';
import ScoreDetalhe from './components/ScoreDetalhe';
import OnboardingFlow from './components/OnboardingFlow';

// Lucide Icons
import {
  Sparkles,
  LayoutDashboard,
  SearchCode,
  SlidersHorizontal,
  Kanban,
  FileLock,
  Compass,
  BellRing,
  Bot,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [licitacoes, setLicitacoes] = useState<Licitacao[]>([]);
  const [perfil, setPerfil] = useState<EmpresaPerfil | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoCertidao[]>([]);
  const [alertas, setAlertas] = useState<AlertaInteligente[]>([]);
  const [competidores, setCompetidores] = useState<Competidor[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedLicitacao, setSelectedLicitacao] = useState<Licitacao | null>(null);
  const [showPerfil, setShowPerfil] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "model",
      text: "Olá! Sou o **Nexus AI**, seu co-piolot de inteligência comercial. Acabo de revisar seu perfil corporativo e suas certidões atuais.\n\nAtualmente, a sua melhor oportunidade é o **PE 012/2026** (Hospital das Clínicas de Campo Limpo) com **97% de Score de Vitória** (Excelente).\n\nComo posso te ajudar a planejar ou analisar o mercado hoje?",
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Initial load
  useEffect(() => {
    async function loadAllData() {
      try {
        const [resL, resP, resD, resA, resC] = await Promise.all([
          fetch("/api/licitacoes"),
          fetch("/api/profile"),
          fetch("/api/documents"),
          fetch("/api/alertas"),
          fetch("/api/competidores")
        ]);

        const dataL = await resL.json();
        const dataP = await resP.json();
        const dataD = await resD.json();
        const dataA = await resA.json();
        const dataC = await resC.json();

        setLicitacoes(dataL);
        setPerfil(dataP);
        setDocumentos(dataD);
        setAlertas(dataA);
        setCompetidores(dataC);

        if (localStorage.getItem("nexus_onboarding_completed") === null) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error("Falha ao se conectar com os dados da API Nexus:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  // API Call helper state loaders
  const reloadLicitacoes = async () => {
    try {
      const res = await fetch("/api/licitacoes");
      const d = await res.json();
      setLicitacoes(d);
    } catch (e) {
      console.error(e);
    }
  };

  const reloadAlerts = async () => {
    try {
      const res = await fetch("/api/alertas");
      const d = await res.json();
      setAlertas(d);
    } catch (e) {
      console.error(e);
    }
  };

  const reloadDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      const d = await res.json();
      setDocumentos(d);
    } catch (e) {
      console.error(e);
    }
  };

  // Actions
  const handleAddLicitacao = async (partialLic: Partial<Licitacao>) => {
    try {
      const res = await fetch("/api/licitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partialLic)
      });
      const data = await res.json();
      await Promise.all([reloadLicitacoes(), reloadAlerts()]);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLicitacaoStatus = async (id: string, newStatus: Licitacao['status']) => {
    try {
      const res = await fetch(`/api/licitacoes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      await reloadLicitacoes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDocumento = async (partialDoc: Partial<DocumentoCertidao>) => {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partialDoc)
      });
      await Promise.all([reloadDocuments(), reloadAlerts()]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDocumento = async (id: string) => {
    try {
      await fetch(`/api/documents/${id}`, { method: "DELETE" });
      await reloadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePerfil = async (updatedPerfil: Partial<EmpresaPerfil>) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPerfil)
      });
      const data = await res.json();
      setPerfil(data.profile);
      await reloadLicitacoes(); // Score recalculates on server
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteOnboarding = async (updatedPerfil: EmpresaPerfil) => {
    try {
      await handleSavePerfil(updatedPerfil);
      localStorage.setItem("nexus_onboarding_completed", "true");
      setShowOnboarding(false);
      setActiveTab("dashboard");
    } catch (err) {
      console.error("Erro ao finalizar onboarding:", err);
    }
  };

  const handleAnalyzeLicitacao = async (id: string, customText?: string) => {
    try {
      const res = await fetch("/api/gemini/analisar-edital", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licitacaoId: id, textContent: customText })
      });
      const data = await res.json();
      await Promise.all([reloadLicitacoes(), reloadAlerts()]);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    try {
      const sMessages = [...chatMessages, userMsg].map(m => ({ role: m.role, text: m.text }));
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: sMessages })
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: "Desculpe, tive uma oscilação na consulta com o motor de inteligência artificial. Por favor, tente falar comigo novamente em breve ou reformule.",
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errMsg]);
    }
  };

  const handleMarkAlertLido = async (id: string) => {
    try {
      await fetch(`/api/alertas/${id}/lido`, { method: "PUT" });
      await reloadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAllAlerts = async () => {
    try {
      await fetch("/api/alertas/ler-todos", { method: "POST" });
      await reloadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerSimulatedAlert = async (type: "nova_oportunidade" | "documento" | "concorrente") => {
    // Generate manual client-side state pushes simulating the triggers
    if (type === "nova_oportunidade") {
      await handleAddLicitacao({
        titulo: "PE 150/2026 - Central Hidro-purificadora do Hospital da Bahia",
        orgao: "Hospital Regional Irmã Dulce - Salvador",
        objeto: "Contratação direta para reparos industriais em sistemas purificadores contínuos de Osmose Reversa de água hospitalar.",
        valorEstimado: 145000,
        uf: "BA",
        cidade: "Salvador",
        modalidade: "Pregão Eletrônico"
      });
    } else if (type === "documento") {
      // Add soon expiring documento directly
      await handleAddDocumento({
        nome: "Licença de Operação CETESB - Purificação",
        tipo: "Outro",
        emissor: "CETESB São Paulo",
        vencimento: "2026-06-11", // Tomorrow! (from 10/06/2026 reference)
        fileName: "licenca_reforma_cetesb.pdf"
      });
    } else if (type === "concorrente") {
      // Append a simulated competitor notification to state directly for instant feedback
      const response = await fetch("/api/alertas");
      const current = await response.json();
      setAlertas([
        {
          id: `sim-alert-${Date.now()}`,
          tipo: "concorrente",
          titulo: "Mudança em Concorrentes Locais",
          mensagem: "Alerta: AcquaVida Membranas aumentou participação no certame CASAL Maceió.",
          data: new Date().toISOString(),
          lido: false
        },
        ...current
      ]);
    }
  };

  const unreadAlertsCount = alertas.filter(a => !a.lido).length;

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50/50 space-y-3 flex-col" id="global-loading">
        <div className="w-8 h-8 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse font-display">Carregando Nexus AI Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800" id="app-con">
      
      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40" id="top-app-header">
        <div className="flex items-center space-x-2.5">
          <div className="bg-blue-50 text-blue-600 p-2 rounded-xl border border-blue-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-[15px] font-bold tracking-wider text-slate-800 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 font-display">NEXUS LICITAÇÕES AI</h1>
              <span className="text-[9px] font-bold bg-blue-50/60 border border-blue-100 text-blue-600 px-1.5 py-0.2 rounded-full uppercase font-display">SaaS v2.4</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium font-sans">Plataforma de Inteligência Comercial e CRM para Mercado Público</p>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center space-x-4">
          
          {/* Quick status alerts badge */}
          <button 
            onClick={() => setActiveTab('alertas')}
            className="p-2 bg-slate-50/60 hover:bg-slate-100 border border-slate-200/70 rounded-full relative transition-colors"
            title="Sinalizações Inteligentes"
          >
            <BellRing className="w-4 h-4 text-slate-600" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white font-display">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Org Name Display details */}
          {perfil && (
            <div className="hidden md:block text-right">
              <span className="text-[11px] font-bold text-slate-700 block">{perfil.nomeFantasia}</span>
              <span className="text-[9.5px] font-medium text-slate-400 block font-mono">CNPJ: {perfil.cnpj}</span>
            </div>
          )}

          {/* Trigger onboarding flow */}
          <button
            onClick={() => setShowOnboarding(true)}
            className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 font-bold text-xs px-3.5 py-2 rounded-xl border border-indigo-150 transition-all cursor-pointer font-display shadow-xs"
            title="Acessar Tutorial e Onboarding de Configuração"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
            <span>Guia Onboarding</span>
          </button>

          {/* Trigger corporate profile */}
          <button
            onClick={() => setShowPerfil(true)}
            className="flex items-center space-x-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-250 hover:border-blue-100 transition-all cursor-pointer font-display"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Perfil Inteligente</span>
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <div className="flex-1 flex" id="core-body-split">
        
        {/* LEFTSIDE NAVIGATION BAR - Minimalistic light slate line styled */}
        <aside className="w-64 bg-white border-r border-slate-100 p-5 flex flex-col justify-between space-y-6 shrink-0 hidden lg:flex" id="left-navbar">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-2 mb-2 font-display">Workspace</span>
              
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all font-display cursor-pointer ${activeTab === 'dashboard' ? 'bg-blue-50/50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 bg-transparent border border-transparent'}`}
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                <span>Dashboard Executivo</span>
              </button>

              <button
                onClick={() => setActiveTab('hub-nacional')}
                className={`w-full flex items-center space-x-3 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all font-display cursor-pointer ${activeTab === 'hub-nacional' ? 'bg-blue-50/50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 bg-transparent border border-transparent'}`}
              >
                <SearchCode className="w-4.5 h-4.5" />
                <span>Hub de Licitações</span>
              </button>

              <button
                onClick={() => setActiveTab('leitor-ia')}
                className={`w-full flex items-center space-x-3 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all font-display cursor-pointer ${activeTab === 'leitor-ia' ? 'bg-blue-50/50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 bg-transparent border border-transparent'}`}
                title="Módulo Leitura de editais com IA"
              >
                <Sparkles className="w-4.5 h-4.5 text-blue-500 animate-pulse" />
                <span>Leitor de Editais IA</span>
              </button>

              <button
                onClick={() => setActiveTab('crm-comercial')}
                className={`w-full flex items-center space-x-3 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all font-display cursor-pointer ${activeTab === 'crm-comercial' ? 'bg-blue-50/50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 bg-transparent border border-transparent'}`}
              >
                <Kanban className="w-4.5 h-4.5" />
                <span>CRM de Licitações</span>
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-2 mb-2 font-display">Habilitação & Inteligência</span>

              <button
                onClick={() => setActiveTab('certidoes')}
                className={`w-full flex items-center space-x-3 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all font-display cursor-pointer ${activeTab === 'certidoes' ? 'bg-blue-50/50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 bg-transparent border border-transparent'}`}
              >
                <FileLock className="w-4.5 h-4.5" />
                <span>Cofre & Certidões</span>
              </button>

              <button
                onClick={() => setActiveTab('analise-mercado')}
                className={`w-full flex items-center space-x-3 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all font-display cursor-pointer ${activeTab === 'analise-mercado' ? 'bg-blue-50/50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 bg-transparent border border-transparent'}`}
              >
                <Compass className="w-4.5 h-4.5" />
                <span>Análise de Mercado</span>
              </button>

              <button
                onClick={() => setActiveTab('alertas')}
                className={`w-full flex items-center space-x-3 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all font-display cursor-pointer ${activeTab === 'alertas' ? 'bg-blue-50/50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 bg-transparent border border-transparent'}`}
              >
                <BellRing className="w-4.5 h-4.5" />
                <span>Alertas e Canais</span>
                {unreadAlertsCount > 0 && (
                  <span className="bg-rose-500 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full ml-auto font-display">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest block pl-2 mb-2 uppercase font-display">Agente Comercial</span>
              
              <button
                onClick={() => setActiveTab('agente-chat')}
                className={`w-full flex items-center space-x-3 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all font-display cursor-pointer ${activeTab === 'agente-chat' ? 'bg-blue-50/50 text-blue-600 border border-blue-100 animate-pulse' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 bg-transparent border border-transparent'}`}
              >
                <Bot className="w-4.5 h-4.5 text-blue-500" />
                <span>Agente de Decisão IA</span>
              </button>
            </div>
          </div>

          {/* Quick advice small board */}
          {perfil && (
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-1" id="quick-tip-card">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-display">Dica Reguladora</span>
              <p className="text-[11px] text-slate-600 font-medium">Sua Certidão Federal municipal caducou em 05/06. Atualize-a para não ser bloqueado em julgamento.</p>
            </div>
          )}
        </aside>

        {/* MAIN VISUAL WORKSPACE PANEL - Content switchboard */}
        <main className="flex-1 p-6 md:p-8 max-w-full overflow-y-auto" id="main-content-canvas">
          {activeTab === 'dashboard' && (
            <DashboardTab 
              licitacoes={licitacoes} 
              onSelectTab={setActiveTab} 
              onSelectLicitacao={(lic) => setSelectedLicitacao(lic)} 
            />
          )}

          {activeTab === 'hub-nacional' && (
            <HubTab
              licitacoes={licitacoes}
              onAddLicitacao={handleAddLicitacao}
              onSelectLicitacao={(lic) => setSelectedLicitacao(lic)}
            />
          )}

          {activeTab === 'leitor-ia' && (
            <LiaTab
              licitacoes={licitacoes}
              onAnalyzeLicitacao={handleAnalyzeLicitacao}
            />
          )}

          {activeTab === 'crm-comercial' && (
            <CrmTab
              licitacoes={licitacoes}
              onUpdateLicitacaoStatus={handleUpdateLicitacaoStatus}
              onSelectLicitacao={(lic) => setSelectedLicitacao(lic)}
            />
          )}

          {activeTab === 'certidoes' && (
            <CertidoesTab
              documentos={documentos}
              onAddDocumento={handleAddDocumento}
              onDeleteDocumento={handleDeleteDocumento}
            />
          )}

          {activeTab === 'analise-mercado' && (
            <InteligenciaTab
              competidores={competidores}
              perfil={perfil}
            />
          )}

          {activeTab === 'alertas' && (
            <AlertasTab
              alertas={alertas}
              onMarkRead={handleMarkAlertLido}
              onClearAll={handleClearAllAlerts}
              onTriggerSimulatedAlert={handleTriggerSimulatedAlert}
            />
          )}

          {activeTab === 'agente-chat' && (
            <ChatTab
              messages={chatMessages}
              onSendMessage={handleSendMessage}
            />
          )}
        </main>
      </div>

      {/* MODAL POPUPS & DETAILS PANEL */}

      {/* Modal 1: Perfil do Cliente */}
      {showPerfil && perfil && (
        <PerfilModal 
          perfil={perfil} 
          onClose={() => setShowPerfil(false)} 
          onSavePerfil={handleSavePerfil} 
        />
      )}

      {/* Modal 2: Detalhes do Score de Vitória de uma Oportunidade */}
      {selectedLicitacao && (
        <ScoreDetalhe
          licitacao={selectedLicitacao}
          onClose={() => setSelectedLicitacao(null)}
          onGoToAnalyzer={() => {
            setSelectedLicitacao(null);
            setActiveTab('leitor-ia');
          }}
        />
      )}

      {/* Modal 3: Onboarding Interativo */}
      {showOnboarding && (
        <OnboardingFlow
          perfilAtual={perfil}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleCompleteOnboarding}
        />
      )}
      
    </div>
  );
}
