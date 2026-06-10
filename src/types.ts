/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LicitacaoScoreDetalhes {
  compatibilidadeTecnica: number; // 35%
  historicoOrgao: number; // 15%
  localizacao: number; // 10%
  ticketMedio: number; // 10%
  concorrencia: number; // 10%
  complexidadeDocumental: number; // 5%
  historicoContratacoes: number; // 10%
  margemPotencial: number; // 5%
}

export interface LicitacaoAnaliseIA {
  objetoDetalhado: string;
  certidoesExigidas: string[];
  qualificacoesTecnicas: string[];
  pontosAtencao: string[];
  prazoGarantia: string;
  criterioJulgamento: string;
  resumoComercial: string;
  resumoJuridico: string;
  resumoOperacional: string;
  resumoFinanceiro: string;
}

export interface Licitacao {
  id: string;
  titulo: string;
  orgao: string;
  objeto: string;
  modalidade: "Pregão Eletrônico" | "Pregão Presencial" | "Dispensa" | "Inexigibilidade" | "Concorrência" | "Leilão" | "Credenciamento";
  valorEstimado: number;
  dataAbertura: string;
  uf: string;
  cidade: string;
  fonte: string; // PNCP, Compras.gov, Portal de Compras Públicas, etc.
  score: number;
  scoreClassificacao: "Excelente" | "Boa" | "Média" | "Baixa";
  scoreDetalhes: LicitacaoScoreDetalhes;
  analiseIA: LicitacaoAnaliseIA | null;
  status: "Nova" | "Análise IA" | "Interesse" | "Documentação" | "Proposta" | "Participação" | "Disputa" | "Homologação" | "Contrato" | "Pós-Venda";
}

export interface ProdutoCadastro {
  id: string;
  produto: string;
  categoria: string;
  valorMedio: number;
}

export interface ServicoCadastro {
  id: string;
  servico: string;
  categoria: string;
}

export interface EmpresaPerfil {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  cnaes: string[];
  porte: "ME" | "EPP" | "Demais" | "LTDA" | "S/A";
  cidade: string;
  estado: string;
  segmentosAtuantes: string[];
  produtos: ProdutoCadastro[];
  servicos: ServicoCadastro[];
  areaAtendimento: "Municipal" | "Estadual" | "Regional" | "Nacional";
}

export interface Competidor {
  id: string;
  nome: string;
  vitoriasCount: number;
  frequenciaVitoriaPercent: number;
  orgaosCompradores: string[];
  faixaPrecoMedia: number;
  regioesAtuantes: string[];
}

export interface FornecedorTendencia {
  id: string;
  nome: string;
  municipio: string;
  estado: string;
  licitacoesGanhas: number;
  valorTotalGanho: number;
}

export interface DocumentoCertidao {
  id: string;
  nome: string;
  tipo: "Federal" | "Estadual" | "Municipal" | "FGTS" | "Trabalhista" | "Outro";
  emissor: string;
  vencimento: string; // YYYY-MM-DD
  status: "Valido" | "Vencendo" | "Vencido" | "Pendente";
  arquivoUrl?: string;
  fileName?: string;
}

export interface AlertaInteligente {
  id: string;
  tipo: "nova_oportunidade" | "documento" | "concorrente";
  titulo: string;
  mensagem: string;
  data: string;
  lido: boolean;
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
