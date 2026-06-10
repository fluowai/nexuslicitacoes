/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EmpresaPerfil, ProdutoCadastro, ServicoCadastro } from '../types';
import { Sliders, Plus, Trash2, Building, Globe, Layers, Percent, HeartHandshake, ShieldAlert } from 'lucide-react';

interface PerfilModalProps {
  perfil: EmpresaPerfil;
  onClose: () => void;
  onSavePerfil: (updated: Partial<EmpresaPerfil>) => Promise<any>;
}

export default function PerfilModal({ perfil, onClose, onSavePerfil }: PerfilModalProps) {
  const [razaoSocial, setRazaoSocial] = useState(perfil.razaoSocial);
  const [nomeFantasia, setNomeFantasia] = useState(perfil.nomeFantasia);
  const [cnpj, setCnpj] = useState(perfil.cnpj);
  const [porte, setPorte] = useState(perfil.porte);
  const [cidade, setCidade] = useState(perfil.cidade);
  const [estado, setEstado] = useState(perfil.estado);
  const [areaAtendimento, setAreaAtendimento] = useState(perfil.areaAtendimento);

  // Lists
  const [produtos, setProdutos] = useState<ProdutoCadastro[]>(perfil.produtos);
  const [servicos, setServicos] = useState<ServicoCadastro[]>(perfil.servicos);
  const [segmentosAtuantes, setSegmentosAtuantes] = useState<string[]>(perfil.segmentosAtuantes);
  const [cnaes, setCnaes] = useState<string[]>(perfil.cnaes);

  // New item temps
  const [newProdName, setNewProdName] = useState("");
  const [newProdCat, setNewProdCat] = useState("Tratamento de Água");
  const [newProdValue, setNewProdValue] = useState("");

  const [newServName, setNewServName] = useState("");
  const [newServCat, setNewServCat] = useState("Tratamento de Água");

  const [newSeg, setNewSeg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProduto = () => {
    if (!newProdName.trim()) return;
    const item: ProdutoCadastro = {
      id: `p-${Date.now()}`,
      produto: newProdName,
      categoria: newProdCat,
      valorMedio: Number(newProdValue) || 120000
    };
    setProdutos([...produtos, item]);
    setNewProdName("");
    setNewProdValue("");
  };

  const handleRemoveProduto = (id: string) => {
    setProdutos(produtos.filter(p => p.id !== id));
  };

  const handleAddServico = () => {
    if (!newServName.trim()) return;
    const item: ServicoCadastro = {
      id: `s-${Date.now()}`,
      servico: newServName,
      categoria: newServCat
    };
    setServicos([...servicos, item]);
    setNewServName("");
  };

  const handleRemoveServico = (id: string) => {
    setServicos(servicos.filter(s => s.id !== id));
  };

  const handleAddSeg = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSeg.trim()) {
      e.preventDefault();
      if (!segmentosAtuantes.includes(newSeg.trim())) {
        setSegmentosAtuantes([...segmentosAtuantes, newSeg.trim()]);
      }
      setNewSeg("");
    }
  };

  const handleRemoveSeg = (val: string) => {
    setSegmentosAtuantes(segmentosAtuantes.filter(s => s !== val));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSavePerfil({
        razaoSocial,
        nomeFantasia,
        cnpj,
        porte,
        cidade,
        estado,
        areaAtendimento,
        produtos,
        servicos,
        segmentosAtuantes,
        cnaes
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto" id="perfil-modal-overlay">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto flex flex-col justify-between" id="perfil-modal-box">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl font-display" id="modal-header">
          <div className="flex items-center space-x-3">
            <Sliders className="w-5 h-5 text-blue-500 animate-spin-slow" />
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Perfil Empresarial Inteligente</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Personalize os dados de licitação de modo a sintonizar os gatilhos matemáticos de aderência.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
          >
            Fechar [X]
          </button>
        </div>

        {/* Form Body split into structural divisions */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans" id="modal-body-scroller">
          
          {/* Seção 1: Identidade Jurídica */}
          <div className="space-y-4" id="section-identity">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center font-display">
              <Building className="w-4 h-4 mr-1.5 text-slate-400" />
              Identidade Jurídica e Sede
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="identity-inputs-grid">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-display">Razão Social</label>
                <input 
                  type="text" 
                  value={razaoSocial} 
                  onChange={e => setRazaoSocial(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-display">Nome Fantasia</label>
                <input 
                  type="text" 
                  value={nomeFantasia} 
                  onChange={e => setNomeFantasia(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-display">CNPJ</label>
                <input 
                  type="text" 
                  value={cnpj} 
                  onChange={e => setCnpj(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="address-inputs-grid">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-display">Porte</label>
                <select 
                  value={porte} 
                  onChange={e => setPorte(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-xs text-slate-700 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="ME">ME (Microempresa)</option>
                  <option value="EPP">EPP (Empresa Pequeno Porte)</option>
                  <option value="Demais">Demais (S.A, LTDA, etc)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-display">Cidade</label>
                <input 
                  type="text" 
                  value={cidade} 
                  onChange={e => setCidade(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-400" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-display">Estado (UF)</label>
                <input 
                  type="text" 
                  value={estado} 
                  onChange={e => setEstado(e.target.value)} 
                  maxLength={2}
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-xs text-center text-slate-700 font-bold focus:outline-none focus:border-blue-400 uppercase" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-display">Área de Atendimento</label>
                <select 
                  value={areaAtendimento} 
                  onChange={e => setAreaAtendimento(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-xs text-slate-700 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="Municipal">Municipal</option>
                  <option value="Estadual">Estadual</option>
                  <option value="Regional">Regional (Sudeste/etc)</option>
                  <option value="Nacional">Nacional (Todo Brasil)</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Seção 2: Segmentos Tags */}
          <div className="space-y-3" id="section-segments">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center font-display">
              <Globe className="w-4 h-4 mr-1.5 text-slate-400" />
              Segmentos Atuantes (Palavras-chave do Filtro)
            </h4>
            <p className="text-[11px] text-slate-400">Termos chave de varredura que nossa IA cruzará no resumo do edital para determinar o Score Técnico.</p>
            
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50/40 border border-slate-100 rounded-xl" id="segments-box">
              {segmentosAtuantes.map((seg) => (
                <span key={seg} className="bg-white border border-slate-150 text-slate-650 text-xs px-2.5 py-1 rounded-md flex items-center space-x-1 font-bold">
                  <span>{seg}</span>
                  <button type="button" onClick={() => handleRemoveSeg(seg)} className="text-rose-500 hover:text-rose-700 font-bold ml-1.5 text-xs cursor-pointer">×</button>
                </span>
              ))}
              <input 
                type="text" 
                placeholder="Escreva e tecle Enter..." 
                value={newSeg}
                onChange={e => setNewSeg(e.target.value)}
                onKeyDown={handleAddSeg}
                className="bg-transparent text-xs p-1 text-slate-700 focus:outline-none min-w-[150px] font-bold"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Seção 3: Catálogo de Produtos e Valores */}
          <div className="space-y-4" id="section-products">
            <div className="flex justify-between items-center font-display">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <Layers className="w-4 h-4 mr-1.5 text-slate-400" />
                Cadastro de Produtos Disponíveis
              </h4>
              <span className="text-[10px] font-bold text-slate-400 font-mono">Total de Produtos: {produtos.length}</span>
            </div>

            {/* Inputs para adicionar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50/20 p-3 rounded-xl border border-slate-100" id="add-product-mini-box">
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  placeholder="Nome do Produto Técnico (Filtro, Purificador, etc)" 
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  className="w-full bg-white border border-slate-150 rounded-lg p-2 text-xs focus:outline-none font-bold"
                />
              </div>
              <div>
                <input 
                  type="number" 
                  placeholder="Valor Estimado (R$)" 
                  value={newProdValue}
                  onChange={e => setNewProdValue(e.target.value)}
                  className="w-full bg-white border border-slate-150 rounded-lg p-2 text-xs focus:outline-none font-bold"
                />
              </div>
              <button 
                type="button" 
                onClick={handleAddProduto}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-2 rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer font-display"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>

            {/* Lista cadastrados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2" id="registered-products-list">
              {produtos.map(p => (
                <div key={p.id} className="p-3 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-xs font-bold text-slate-700 block truncate font-display">{p.produto}</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Média: {p.valorMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveProduto(p.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-150 flex justify-between items-center bg-slate-50/50 rounded-b-3xl font-display" id="modal-footer">
          <span className="text-[10px] text-slate-400 font-sans">Mudanças nos CNAEs ou segmentos reajustam dinamicamente nossa IA comercial.</span>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="text-xs font-bold text-slate-500 hover:text-slate-750 border border-slate-200 px-4 py-2 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {loading ? "Salvando..." : "Salvar Perfil Inteligente"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
