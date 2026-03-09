import { ArrowLeft, Check, Sparkles, Zap, Crown, BarChart3, ShieldCheck, Target } from 'lucide-react';
import { Button } from './ui/button';

interface PricingProps {
  onBack: () => void;
  onSelectPlan: (plan: 'free' | 'pro' | 'enterprise') => void;
}

export function Pricing({ onBack, onSelectPlan }: PricingProps) {
  const plans = [
    {
      id: 'free' as const,
      name: 'Free Basic',
      price: '$0',
      priceNote: 'forever',
      icon: Sparkles,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-400/10',
      description: 'Quick site health check',
      features: [
        '3 Audits per month',
        'Site Overview & Design',
        'Technical & SEO Analysis',
        'AI Visibility Check',
        'Email Support'
      ],
      highlight: false
    },
    {
      id: 'pro' as const,
      name: 'Professional',
      price: '$19',
      priceNote: 'per month',
      icon: Zap,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-400/10',
      description: 'Advanced optimization tools',
      features: [
        '15 Detailed Audits/mo',
        'All Free features',
        'AI Recommendation Engine',
        'Trust & Social Proof',
        'Conversion (CRO) Audit',
        'Local SEO Optimization',
        'Priority Phone Support'
      ],
      highlight: true,
      badge: 'Recommended'
    },
    {
      id: 'enterprise' as const,
      name: 'Enterprise',
      price: '$49',
      priceNote: 'per month',
      icon: Crown,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-400/10',
      description: 'Full competitive edge',
      features: [
        'Unlimited Detailed Audits',
        'All Pro features',
        'Competitor Benchmarking',
        'ROI Estimation roadmap',
        'White-label Reports',
        'API Access (Beta)',
        'Custom Action Plan',
        '90-day SEO Concierge'
      ],
      highlight: false
    }
  ];

  return (
    <div className="bg-brand-bg rounded-[2.5rem] overflow-hidden border border-brand-text/10 shadow-2xl relative max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-brand-text/10 bg-brand-bg/80 backdrop-blur-md sticky top-0 z-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-brand-text mb-1">Professional Upgrades</h1>
              <p className="text-brand-text/60 text-sm font-medium">Unlock dedicated AI Assistants and deep data extraction.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 overflow-y-auto">
        {/* Why Us Section */}
        <div className="pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-brand-text/10 bg-white/5 dark:bg-black/20 hover:border-brand-primary/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-brand-primary" />
            </div>
            <h3 className="text-brand-text text-lg font-bold mb-2">Pinpoint Tech SEO</h3>
            <p className="text-brand-text/50 text-sm">We find the technical leaks that slow down your ranking and visibility.</p>
          </div>
          <div className="p-6 rounded-3xl border border-brand-text/10 bg-white/5 dark:bg-black/20 hover:border-brand-accent/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-brand-accent" />
            </div>
            <h3 className="text-brand-text text-lg font-bold mb-2">Competitor Analysis</h3>
            <p className="text-brand-text/50 text-sm">See exactly how your rivals are winning and outpace them strategically.</p>
          </div>
          <div className="p-6 rounded-3xl border border-brand-text/10 bg-white/5 dark:bg-black/20 hover:border-brand-secondary/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-brand-secondary" />
            </div>
            <h3 className="text-brand-text text-lg font-bold mb-2">Trust Restoration</h3>
            <p className="text-brand-text/50 text-sm">Audit your social proof and credibility markers to skyrocket conversion.</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 ${plan.highlight
                  ? 'bg-brand-accent/5 border border-brand-accent/50 shadow-[0_0_50px_rgba(255,255,255,0.05)] scale-[1.05] z-10'
                  : 'bg-white/5 dark:bg-black/20 border border-brand-text/10 hover:border-brand-text/20'
                  }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-2xl ${plan.highlight ? 'bg-brand-accent/10' : 'bg-brand-primary/10'} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-7 h-7 ${plan.highlight ? 'text-brand-accent' : 'text-brand-primary'}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-brand-text">{plan.name}</h2>
                    <p className="text-brand-text/50 text-xs font-semibold">{plan.description}</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black text-brand-text">{plan.price}</span>
                  <span className="text-brand-text/40 text-sm font-bold">/{plan.priceNote}</span>
                </div>

                <div className="flex-1 space-y-4 mb-10">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full ${plan.highlight ? 'bg-brand-accent/20' : 'bg-brand-primary/20'} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Check className={`w-3 h-3 ${plan.highlight ? 'text-brand-accent' : 'text-brand-primary'}`} />
                      </div>
                      <span className="text-sm text-brand-text/70 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`h-14 rounded-2xl text-base font-black transition-all ${plan.highlight
                    ? 'bg-brand-accent hover:bg-brand-accent/90 text-white shadow-xl shadow-brand-accent/20 active:scale-95'
                    : 'bg-brand-text/10 hover:bg-brand-text/20 text-brand-text border border-brand-text/10 active:scale-95'
                    }`}
                >
                  {plan.id === 'free' ? 'Start Free' : `Choose ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
