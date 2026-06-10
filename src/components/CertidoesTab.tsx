/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DocumentoCertidao } from '../types';
import { ShieldCheck, FileText, UploadCloud, AlertCircle, Trash2, Calendar, File, Plus, AlertTriangle, Sparkles } from 'lucide-react';

interface CertidoesTabProps {
  documentos: DocumentoCertidao[];
  onAddDocumento: (newDoc: Partial<DocumentoCertidao>) => Promise<any>;
  onDeleteDocumento: (id: string) => Promise<any>;
}

export default function CertidoesTab({ documentos, onAddDocumento, onDeleteDocumento }: CertidoesTabProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<any>("Federal");
  const [emissor, setEmissor] = useState("");
  const [vencimento, setVencimento] = useState("2026-06-30");
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  // Expirations warnings
  const alertsVencimento = documentos.filter(d => d.status === 'Vencendo' || d.status === 'Vencido');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !vencimento) return;
    setLoading(true);
    try {
      await onAddDocumento({
        nome,
        tipo,
        emissor: emissor || "Órgão emissor cadastrado",
        vencimento,
        fileName: fileName || "comprovante_documento_gov.pdf"
      });
      // Reset
      setNome("");
      setEmissor("");
      setFileName("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const simulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFileName(f.name);
      if (!nome) {
        // Safe guessed name
        setNome(f.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setFileName(f.name);
      if (!nome) {
        setNome(f.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
      }
    }
  };  return (
    <div className="space-y-6" id="certidoes-tab-root font-sans">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4" id="certidoes-tab-header">
        <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2 font-display">
          <ShieldCheck className="text-blue-500 w-5 h-5 flex-shrink-0" />
          <span>Controle de Certidões e Habilitação (Cofre Digital)</span>
        </h2>
        <p className="text-xs text-slate-400">Armazene de forma segura as certidões obrigatórias federais, estaduais, municipais e técnicas para habilitar lances imediatos.</p>
      </div>

      {/* Alertas de Vencimento de Documentos */}
      {alertsVencimento.length > 0 && (
         <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl space-y-2 font-display" id="expiry-risk-container">
          <h4 className="text-xs font-bold text-rose-800 uppercase tracking-widest flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-600" />
            Vulnerabilidade Detectada na Habilitação
          </h4>
          <p className="text-xs text-rose-700 leading-relaxed font-sans">A inabilitação imediata é o maior motivo de derrota de licitantes propensos a vence. Corrija os seguintes documentos vencidos ou próximos à expiração:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 font-sans" id="expiring-list-grid">
            {alertsVencimento.map(d => {
              const borderCol = d.status === 'Vencido' ? 'border-rose-200 bg-rose-100/40 text-rose-800 font-bold' : 'border-amber-200 bg-amber-100/40 text-amber-800 font-bold';
              return (
                <div key={d.id} className={`p-2.5 rounded-xl border text-xs font-medium flex justify-between items-center ${borderCol}`}>
                  <div>
                    <span className="font-bold">[{d.tipo}]</span> {d.nome}
                    <span className="block text-[10px] opacity-80 mt-0.5 font-mono">Vence em: {new Date(d.vencimento).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-white border border-slate-100 font-mono">
                    {d.status === 'Vencido' ? 'VENCIDO' : 'Vence em breves dias'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="certidoes-grid-container">
        {/* Cofre de Documentos Guardados */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 space-y-4" id="documents-vault-card">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 font-display">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Certificados no Cofre Digital</h4>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Criptografia Local</span>
          </div>

          <div className="space-y-3 font-sans" id="vault-documents-list">
            {documentos.map((doc) => {
              let statusLabel = "Válido";
              let badgeStyle = "text-emerald-700 bg-emerald-50 border-emerald-100 font-bold";

              if (doc.status === "Vencido") {
                 statusLabel = "Vencido";
                 badgeStyle = "text-rose-700 bg-rose-50 border-rose-100 font-bold";
              } else if (doc.status === "Vencendo") {
                 statusLabel = "Expira em Breve";
                 badgeStyle = "text-amber-700 bg-amber-50 border-amber-100 font-bold";
              }

              return (
                <div 
                  key={doc.id} 
                  className="p-3.5 bg-slate-50/40 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-start space-x-3 truncate">
                    <div className="p-2 bg-white text-slate-400 rounded-lg border border-slate-100">
                      <File className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-755 truncate leading-snug font-display">{doc.nome}</p>
                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400 font-medium">
                        <span>Emissor: {doc.emissor}</span>
                        <span>•</span>
                        <span>Tipo: {doc.tipo}</span>
                      </div>
                      {doc.fileName && (
                        <span className="text-[9.5px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-1.5 block w-max">
                          📎 {doc.fileName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
                    <div className="flex flex-col items-end font-display">
                      <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${badgeStyle}`}>
                        {statusLabel}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-1 font-mono">exp: {new Date(doc.vencimento).toLocaleDateString("pt-BR")}</span>
                    </div>

                    <button
                      onClick={() => onDeleteDocumento(doc.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50/30 rounded-lg transition-colors cursor-pointer"
                      title="Excluir do cofre"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form para Inserção / Upload de novos docs */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 space-y-4 flex flex-col justify-between font-display" id="add-document-card">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest pb-2 border-b border-slate-100">Upload e Envio de Documento</h4>
            <p className="text-xs text-slate-400 mt-2 mb-4 font-sans leading-relaxed">Adicione novas certidões de regularidade emitidas por portais do governo ou atestados de capacitação comercial.</p>

            {/* Drag & Drop simulated container */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border border-dashed rounded-xl p-6 text-center transition-all ${dragging ? 'border-blue-500 bg-blue-50/20' : 'border-slate-250 bg-slate-50/40'} flex flex-col items-center justify-center cursor-pointer`}
              onClick={() => document.getElementById('file-upload-dialog')?.click()}
            >
              <UploadCloud className="w-8 h-8 text-blue-400 mb-2" />
              <p className="text-xs font-bold text-slate-700">Arrastar & Soltar Certidão PDF</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-sans">ou clique para importar arquivo local</p>
              {fileName && (
                <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-1 px-3 text-[10px] font-mono text-blue-700">
                  Importado: {fileName}
                </div>
              )}
              <input 
                id="file-upload-dialog" 
                type="file" 
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={simulatedFileUpload}
                className="hidden" 
              />
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 font-sans" id="manual-doc-reg-form">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">Nome do Documento / Certidão</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Certidão Municipal de Tributos de São Paulo"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">Tipo de Certidão</label>
                  <select
                    value={tipo}
                    onChange={e => setTipo(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-xs text-slate-105 font-bold focus:outline-none focus:border-blue-300 cursor-pointer"
                  >
                    <option value="Federal">Federal</option>
                    <option value="Estadual">Estadual</option>
                    <option value="Municipal">Municipal</option>
                    <option value="FGTS">FGTS</option>
                    <option value="Trabalhista">Trabalhista</option>
                    <option value="Outro">Atestado / Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">Emissor Regulador</label>
                  <input 
                    type="text"
                    placeholder="Sefaz / Prefeitura / etc"
                    value={emissor}
                    onChange={e => setEmissor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">Vencimento Imutável</label>
                <input 
                  type="date"
                  required
                  value={vencimento}
                  onChange={e => setVencimento(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-xs text-slate-705 font-bold focus:outline-none focus:border-blue-300 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-blue-600 text-white font-bold text-xs py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center space-x-1 cursor-pointer font-display"
              >
                <Plus className="w-4 h-4" />
                <span>{loading ? "Cadastrando Documento..." : "Salvar no Cofre Digital"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
