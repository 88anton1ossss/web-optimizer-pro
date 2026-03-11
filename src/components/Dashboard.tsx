import { ArrowRight, Zap, Shield, Clock, PlusCircle, Globe } from 'lucide-react';
import { useUser } from '@clerk/react';

interface DashboardProps {
  auditHistory: any[];
  onSelectAudit: (audit: any) => void;
  onNewScan: () => void;
  onUpgrade: () => void;
  plan: string;
}

export function Dashboard({ auditHistory, onSelectAudit, onNewScan, onUpgrade, plan }: DashboardProps) {
  const { user } = useUser();

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-brand-bg border border-brand-text/10 rounded-3xl shadow-sm">
      <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
        <Sparkles size={40} />
      </div>
      <h3 className="text-2xl font-black text-brand-text tracking-tight mb-3">No Audits Found</h3>
      <p className="text-brand-text/60 leading-relaxed max-w-md mx-auto mb-8">
        You haven't scanned any websites yet. Run your first Deep Audit Protocol to uncover hidden revenue and SEO errors.
      </p>
      <button
        onClick={onNewScan}
        className="bg-brand-primary hover:bg-brand-primary/90 text-brand-bg px-8 py-4 rounded-xl font-black text-sm transition-all shadow-xl shadow-brand-primary/20 tracking-wider uppercase inline-flex items-center gap-2"
      >
        <PlusCircle size={18} /> Run First Audit
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-brand-bg transition-colors duration-500 overflow-y-auto px-6 py-10 lg:px-12">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Shield size={12} /> Neural Hub Active
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-brand-text tracking-tighter">
              Welcome back, <br />
              <span className="text-brand-primary">{user?.firstName || 'Protocol Master'}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onUpgrade}
              className="px-5 py-2.5 rounded-xl border border-brand-text/20 bg-brand-bg text-xs font-black text-brand-text hover:bg-brand-text/5 transition-all flex items-center gap-2 tracking-widest uppercase shadow-sm"
            >
              <Zap size={14} className="text-brand-secondary" /> Plan: {plan}
            </button>
            <button
              onClick={onNewScan}
              className="bg-brand-primary text-white hover:bg-brand-primary/90 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-2"
            >
              <PlusCircle size={16} /> New Audit
            </button>
          </div>
        </div>

        {/* Audit Grid */}
        <div>
          <h2 className="text-sm font-black text-brand-text/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <Clock size={14} /> Recent Audits
          </h2>
          
          {auditHistory.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auditHistory.map((audit) => {
                const scoreColor = audit.score >= 80 ? 'text-brand-accent' : audit.score >= 50 ? 'text-brand-secondary' : 'text-brand-primary';
                const scoreLabel = audit.score >= 80 ? 'Excellent' : audit.score >= 50 ? 'Needs Work' : 'Critical';

                return (
                  <div
                    key={audit.id || audit.url}
                    onClick={() => onSelectAudit(audit)}
                    className="group bg-brand-bg border border-brand-text/10 hover:border-brand-primary/30 rounded-3xl p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-brand-primary/10 transition-colors pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-brand-text/5 border border-brand-text/10 flex items-center justify-center">
                        <Globe size={24} className="text-brand-text/60 group-hover:text-brand-primary transition-colors" />
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-black tracking-tighter ${scoreColor}`}>
                          {audit.score}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-brand-text/40">
                          {scoreLabel}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-black text-brand-text/60 uppercase tracking-widest mb-1">Target URL</h4>
                        <p className="text-base font-bold text-brand-text truncate">{audit.url}</p>
                      </div>
                      <div className="pt-4 border-t border-brand-text/10 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">
                          {new Date(audit.date || Date.now()).toLocaleDateString()}
                        </span>
                        <ArrowRight size={16} className="text-brand-text/20 group-hover:text-brand-primary transition-colors group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sparkles icon definition since we didn't import it at the top
function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
