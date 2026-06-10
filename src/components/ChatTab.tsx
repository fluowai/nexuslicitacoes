/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Brain, Send, MessageSquareCode, Sparkles, HelpCircle, User, Bot, AlertCircle } from 'lucide-react';

interface ChatTabProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<any>;
}

export default function ChatTab({ messages, onSendMessage }: ChatTabProps) {
  const [typedText, setTypedText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested quick questions
  const SUGGESTIONS = [
    "Quais licitações tenho maior chance de vencer?",
    "Quem são meus maiores concorrentes?",
    "Quais órgãos compram osmose reversa?",
    "Qual o status do documento que vence em 5 dias?",
  ];

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const finalMsg = (customText || typedText).trim();
    if (!finalMsg || loading) return;

    setTypedText("");
    setLoading(true);
    try {
      await onSendMessage(finalMsg);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 flex flex-col h-[525px] font-sans" id="chat-tab-root">
      {/* Mini banner */}
      <div className="p-4 border-b border-slate-150 flex justify-between items-center bg-slate-50/50 rounded-t-2xl" id="chat-header">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center font-display">
              Nexus AI Co-Pilot
              <span className="ml-2 bg-blue-50 text-blue-600 px-2 py-0.2 rounded text-[8px] font-bold">GEMINI ACT</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Assistente comercial conversacional de inteligência regulatória.</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-150 px-2.5 py-1 rounded-lg">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          <span>Online</span>
        </div>
      </div>

      {/* Messages Scrollbox */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" id="chat-messages-container" ref={scrollRef}>
        {messages.map((m) => {
          const isUser = m.role === 'user';
          
          return (
            <div 
              key={m.id} 
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              id={`chat-msg-${m.id}`}
            >
              {/* Avatar */}
              <div className={`p-1.5 rounded-lg flex-shrink-0 border ${isUser ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-55 border-slate-150 text-slate-600'}`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div 
                className={`p-3 max-w-[80%] rounded-2xl text-xs leading-relaxed whitespace-pre-wrap font-medium shadow-3xs ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-50 text-slate-705 rounded-tl-none border border-slate-100'
                }`}
              >
                {/* Formatting standard ticks into bold styling cleanly */}
                {m.text}
                <span className={`block text-[9px] mt-1.5 ${isUser ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start space-x-2.5">
            <div className="p-1.5 rounded-lg border bg-slate-50 border-slate-150 text-slate-600">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none flex items-center space-x-1.5 shadow-3xs">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      {messages.length <= 1 && !loading && (
        <div className="px-4 pb-2 pt-1 border-t border-slate-100" id="suggestion-container-box">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center font-display">
            <HelpCircle className="w-3 h-3 mr-1" />
            Sugestões de Perguntas Comerciais
          </p>
          <div className="flex flex-wrap gap-1.5" id="suggested-chips">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(undefined, s)}
                className="text-[10px] font-bold text-slate-600 bg-slate-50 hover:bg-blue-50 border border-slate-150 hover:border-blue-200 rounded-lg px-2.5 py-1.5 text-left transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex items-center space-x-2 bg-slate-50/30 rounded-b-2xl" id="chat-input-form font-display">
        <input 
          type="text"
          value={typedText}
          disabled={loading}
          onChange={e => setTypedText(e.target.value)}
          placeholder="Peça relatórios, faça estimativas ou pergunte quem são seus maiores concorrentes..."
          className="flex-1 bg-white border border-slate-150 rounded-xl px-3 py-2 text-xs text-slate-700 placeholder-slate-400 font-bold focus:outline-none focus:border-blue-300"
        />

        <button 
          type="submit"
          disabled={loading || !typedText.trim()}
          className="p-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl transition-all shadow-xs flex-shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
