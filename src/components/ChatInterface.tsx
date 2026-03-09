import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Terminal } from 'lucide-react';
import { AuditService } from '../services/AuditService';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

export const ChatInterface: React.FC<{ auditData: any }> = ({ auditData }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: "Protocol initialized. I'm your elite marketing strategist, targetologist, and SEO auditor. I've analyzed your site data — ask me anything about ads setup, keyword implementation, campaign structure, or conversion optimization." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const context = JSON.stringify(auditData);
            const text = await AuditService.chatWithAudit(userMsg, context);
            setMessages(prev => [...prev, { role: 'bot', content: text }]);
        } catch (error: any) {
            setMessages(prev => [...prev, { role: 'bot', content: `Error: ${error?.message || 'Connection interrupted. Please retry.'}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-morphism rounded-3xl border border-brand-text/10 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-brand-text/10 bg-brand-text/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-brand-primary" />
                    <h3 className="text-brand-text font-bold text-sm uppercase tracking-widest">Protocol Assistant</h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                    <span className="text-[10px] font-bold text-brand-accent/80 uppercase">Active</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-brand-primary' : 'bg-brand-text/10 border border-brand-text/20'
                                }`}>
                                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-brand-primary" />}
                            </div>
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-brand-primary/20 border border-brand-primary/30 text-brand-text'
                                : 'bg-brand-text/5 border border-brand-text/10 text-brand-text/80'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-brand-text/10 flex items-center justify-center">
                                <Loader2 size={16} className="animate-spin text-brand-primary" />
                            </div>
                            <div className="px-4 py-3 rounded-2xl bg-brand-text/5 border border-brand-text/10">
                                <Loader2 size={16} className="animate-spin text-brand-text/50" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-brand-bg/40 border-t border-brand-text/10">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about ads setup, keywords, campaigns..."
                        className="w-full bg-brand-text/5 border border-brand-text/10 rounded-xl px-4 py-3 pr-12 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all placeholder:text-brand-text/30"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand-primary hover:bg-brand-primary/80 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-brand-text/20"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </form>
        </div>
    );
};
