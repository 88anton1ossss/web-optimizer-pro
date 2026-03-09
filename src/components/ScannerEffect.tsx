import React from 'react';
import { Shield, Zap, Globe, Cpu } from 'lucide-react';

interface ScannerEffectProps {
    url: string;
}

export const ScannerEffect: React.FC<ScannerEffectProps> = ({ url }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-12">
            <div className="relative">
                <div className="w-64 h-64 rounded-full border-2 border-blue-500/20 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border-2 border-t-blue-500 border-r-blue-500/0 border-b-blue-500/0 border-l-blue-500/0 animate-spin" />

                <div className="absolute inset-8 rounded-full border border-blue-500/10 flex items-center justify-center bg-blue-500/[0.02]">
                    <div className="grid grid-cols-3 gap-4">
                        {[...Array(9)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 rounded-sm bg-blue-500/20 animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-black/40 border border-blue-500/30 rounded-lg flex items-center justify-center backdrop-blur-md animate-bounce">
                    <Globe size={20} className="text-blue-400" />
                </div>
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 bg-black/40 border border-purple-500/30 rounded-lg flex items-center justify-center backdrop-blur-md animate-pulse">
                    <Zap size={20} className="text-purple-400" />
                </div>
                <div className="absolute bottom-0 left-0 w-10 h-10 bg-black/40 border border-emerald-500/30 rounded-lg flex items-center justify-center backdrop-blur-md animate-bounce" style={{ animationDelay: '1s' }}>
                    <Shield size={20} className="text-emerald-400" />
                </div>
            </div>

            <div className="text-center space-y-4 max-w-md mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase">
                    <Cpu size={12} className="animate-spin" />
                    Neural Engine Active
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                    Analyzing <span className="text-blue-400">{new URL(url).hostname}</span>
                </h2>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-blue-400/60 uppercase tracking-wider mb-2">
                        <span>Protocol Status</span>
                        <span className="animate-pulse">Deep Scan in Progress...</span>
                    </div>
                    <div className="h-1.5 w-full bg-blue-500/10 rounded-full overflow-hidden border border-blue-500/20">
                        <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite] w-1/3 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium italic">
                        "Deconstructing SEO architecture and AI semantic layers..."
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
        </div>
    );
};
