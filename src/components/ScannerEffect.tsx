import React from 'react';
import { Shield, Zap, Globe, Cpu } from 'lucide-react';

interface ScannerEffectProps {
    url: string;
}

export const ScannerEffect: React.FC<ScannerEffectProps> = ({ url }) => {
    let hostname = url;
    try { hostname = new URL(url).hostname; } catch(e){}

    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-brand-bg transition-colors duration-500 overflow-hidden relative">
            {/* Background Light Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col items-center justify-center space-y-16 relative z-10 w-full max-w-lg">
                <div className="relative">
                    {/* Outer Rings */}
                    <div className="w-80 h-80 rounded-full border-[1px] border-brand-primary/20 animate-[spin_12s_linear_infinite]" />
                    <div className="absolute inset-8 rounded-full border-[1.5px] border-t-brand-primary border-r-transparent border-b-brand-accent/30 border-l-transparent animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-16 rounded-full border border-brand-secondary/40 border-dashed animate-[spin_20s_linear_infinite_reverse]" />

                    {/* Core Grid Center */}
                    <div className="absolute inset-24 rounded-full border border-brand-primary/10 flex items-center justify-center bg-brand-primary/[0.02] backdrop-blur-sm">
                        <div className="grid grid-cols-3 gap-3">
                            {[...Array(9)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-2.5 h-2.5 rounded-sm bg-brand-primary/40 animate-pulse shadow-[0_0_10px_rgba(var(--brand-primary),0.5)]"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Floating Icons */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-brand-bg border border-brand-primary/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--brand-primary),0.2)] animate-[bounce_3s_ease-in-out_infinite]">
                        <Globe size={24} className="text-brand-primary" />
                    </div>
                    <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-brand-bg border border-brand-accent/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--brand-accent),0.2)] animate-[pulse_2s_ease-in-out_infinite]">
                        <Zap size={20} className="text-brand-accent" />
                    </div>
                    <div className="absolute bottom-4 -left-2 w-12 h-12 bg-brand-bg border border-brand-secondary/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--brand-secondary),0.2)] animate-[bounce_4s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
                        <Shield size={20} className="text-brand-secondary" />
                    </div>
                </div>

                <div className="text-center space-y-6 w-full">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black tracking-[0.3em] uppercase animate-pulse shadow-sm">
                        <Cpu size={14} className="animate-spin" />
                        Neural Engine Active
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl font-black text-brand-text tracking-tighter">
                        Deconstructing <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent truncate block max-w-md mx-auto">{hostname}</span>
                    </h2>
                    
                    <div className="space-y-3 bg-white/5 dark:bg-black/20 p-6 rounded-3xl border border-brand-text/10 backdrop-blur-xl">
                        <div className="flex justify-between text-[10px] font-black text-brand-text/50 uppercase tracking-[0.2em] mb-3">
                            <span>Protocol Status</span>
                            <span className="text-brand-primary animate-pulse">Scanning Layers...</span>
                        </div>
                        <div className="h-2 w-full bg-brand-bg rounded-full overflow-hidden border border-brand-text/10 relative">
                            <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-brand-primary to-brand-accent animate-[loading_2s_ease-in-out_infinite] shadow-[0_0_20px_rgba(var(--brand-primary),0.5)] rounded-full" />
                        </div>
                        <p className="text-brand-text/40 text-xs font-bold uppercase tracking-widest mt-4">
                            Analyzing SEO, UX, and Ad Competitiveness...
                        </p>
                    </div>
                </div>

                <style>{`
            @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
            }
        `}</style>
            </div>
        </div>
    );
};
