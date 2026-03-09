import React from 'react';
import { Target, Zap, Search, TrendingUp, Globe, CheckCircle2 } from 'lucide-react';
import { RadialScore } from './RadialScore';

interface AuditSection {
    id: string;
    title: string;
    score: number;
    status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
    summary: string;
    details: string[];
    recommendations: string[];
}

export const AuditSectionDetails: React.FC<{ section: AuditSection }> = ({ section }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'excellent': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'good': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'needs-improvement': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const getIcon = (id: string) => {
        if (id.includes('technical')) return <Zap size={20} />;
        if (id.includes('visibility')) return < Globe size={20} />;
        if (id.includes('design')) return <TrendingUp size={20} />;
        return <Target size={20} />;
    };

    return (
        <div className="glass-morphism rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 group">
            <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="shrink-0 flex flex-col items-center">
                        <RadialScore score={section.score} label="Score" size="md" />
                        <div className={`mt-4 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusColor(section.status)}`}>
                            {section.status.replace('-', ' ')}
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                {getIcon(section.id)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">{section.title}</h3>
                                <p className="text-gray-500 text-xs font-medium italic mt-1">{section.summary}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Search size={14} className="text-gray-400" />
                                    Deep Scan Findings
                                </h4>
                                <ul className="space-y-3">
                                    {section.details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-3 group/item">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 mt-1.5 shrink-0 group-hover/item:bg-blue-400 transition-colors" />
                                            <span className="text-sm text-gray-400 leading-relaxed font-medium">{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap size={14} />
                                    Optimization Roadmap
                                </h4>
                                <div className="space-y-3">
                                    {section.recommendations.map((rec, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10 group/rec hover:bg-blue-500/[0.08] transition-all">
                                            <CheckCircle2 size={16} className="text-blue-500/60 mt-0.5 shrink-0 group-hover/rec:text-blue-400" />
                                            <span className="text-sm text-gray-300 font-medium leading-relaxed">{rec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
