import React, { useState } from 'react';
import { Megaphone, Copy, Check, ExternalLink } from 'lucide-react';

interface GoogleAd {
    headline: string;
    description: string;
    type: 'search' | 'display';
}

export const AdGenerator: React.FC<{ ads: GoogleAd[] }> = ({ ads }) => {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <Megaphone size={20} className="text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold tracking-tight">AI Ad Generation</h3>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Protocol V2.0 Engine</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ads.map((ad, i) => (
                    <div key={i} className="group relative glass-morphism rounded-3xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-500">
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[8px] font-black text-orange-400 uppercase tracking-tighter">
                                {ad.type} Engine
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Headline</span>
                                <p className="text-white font-bold text-lg leading-tight group-hover:text-orange-400 transition-colors">
                                    {ad.headline}
                                </p>
                            </div>

                            <div>
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Creative Description</span>
                                <p className="text-gray-400 text-sm leading-relaxed italic">
                                    "{ad.description}"
                                </p>
                            </div>

                            <div className="pt-4 flex items-center gap-3">
                                <button
                                    onClick={() => copyToClipboard(`${ad.headline}\n${ad.description}`, i)}
                                    className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-orange-500/20 hover:border-orange-500/40 transition-all active:scale-95"
                                >
                                    {copiedIndex === i ? (
                                        <>
                                            <Check size={14} className="text-emerald-500" />
                                            COPIED
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            COPY PROTOCOLS
                                        </>
                                    )}
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-orange-500/20 transition-all">
                                    <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
