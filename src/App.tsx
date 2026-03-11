import { useState, useEffect } from 'react';
import {
  Shield,
  Globe,
  Zap,
  Layout,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Search,
  Target,
  Megaphone,
  Sun,
  Moon,
  Download,
  Loader2,
  RefreshCw,
  Copy
} from 'lucide-react';
import { useUser, useAuth, UserButton, SignInButton } from '@clerk/react';
import { supabase } from './lib/supabase';
import { AuditService } from './services/AuditService';
import { Pricing } from './components/Pricing';
import { ScannerEffect } from './components/ScannerEffect';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export type AppState = 'IDLE' | 'DASHBOARD' | 'SCANNING' | 'COMPLETED';

export interface GoogleAd {
  headline: string;
  description: string;
  type: 'search' | 'display';
  sitelinks?: string[];
}

export interface AuditSection {
  id: string;
  title: string;
  score: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  summary: string;
  details: string[];
  recommendations: string[];
}

export interface AuditData {
  id: string;
  url: string;
  date: string;
  status: 'completed' | 'in-progress' | 'failed';
  plan: 'free' | 'pro' | 'enterprise';
  score: number;
  identifiedNiche?: string;
  aiPerception?: string;
  executiveBrief?: string;
  quickWins?: string[];
  trafficGain?: string;
  leadIncrease?: string;
  revenueProjection?: string;
  sections: AuditSection[];
  keywords?: string[];
  ads?: GoogleAd[];
  campaignStrategy?: string[];
  targetAudience?: string[];
}

function App() {
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [currentUrl, setCurrentUrl] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<AuditData | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditData[]>([]);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAssistant, setShowAssistant] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('English');
  const [isExporting, setIsExporting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const SUPPORTED_LANGUAGES = ['English', 'Spanish', 'Mandarin', 'Hindi', 'French', 'Arabic', 'Русский'];

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Set default state based on auth
  useEffect(() => {
    if (isLoaded && isSignedIn && appState === 'IDLE') {
      setAppState('DASHBOARD');
    } else if (isLoaded && !isSignedIn && appState === 'DASHBOARD') {
      setAppState('IDLE');
    }
  }, [isSignedIn, isLoaded]);

  // Load history
  useEffect(() => {
    const loadHistory = async () => {
      if (isSignedIn && user) {
        try {
          const { data, error } = await supabase
            .from('audits')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          if (data) {
            setAuditHistory(data.map(item => ({ ...item.data, id: item.id, date: item.created_at })));
          }
        } catch (e) {
          console.error("Supabase fetch failed", e);
        }
      } else {
        const savedHistory = localStorage.getItem('web-optimizer-history');
        if (savedHistory) setAuditHistory(JSON.parse(savedHistory));
      }
    };
    loadHistory();
  }, [user, isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) localStorage.setItem('web-optimizer-history', JSON.stringify(auditHistory));
  }, [auditHistory, isSignedIn]);

  const handleAuditSubmit = async (url: string, tab = 'overview') => {
    let targetUrl = url.trim();
    if (!targetUrl) return;

    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }
    setCurrentUrl(targetUrl);
    setAuditError(null);
    setAppState('SCANNING');

    try {
      const html = await AuditService.fetchWebsiteContent(targetUrl);
      const auditResult = await AuditService.analyzeWebsite(targetUrl, html, selectedPlan, language);

      if (isSignedIn && user) {
        try {
          await supabase.from('audits').insert({
            user_id: user.id,
            url: auditResult.url,
            plan: auditResult.plan,
            score: auditResult.score,
            data: auditResult
          });
        } catch (e) {
          console.error("Cloud Error:", e);
        }
      }

      setAuditHistory(prev => [auditResult, ...prev]);
      setSelectedAudit(auditResult);
      setActiveTab(tab);
      setAppState('COMPLETED');
    } catch (error: any) {
      console.error("Audit failed:", error);
      setAuditError(error.message || "Protocol Failure: Neural Engine Offline.");
      setAppState('IDLE');
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-emerald-500';
      case 'good': return 'bg-blue-500';
      case 'needs-improvement': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // ============= IDLE SCREEN / LANDING PAGE =============
  const renderIdle = () => {
    return (
      <div className="flex-1 flex flex-col bg-brand-bg transition-colors duration-500 overflow-y-auto">
        
        {/* HERO SECTION */}
        <div className="flex flex-col items-center justify-center px-4 py-20 lg:py-32 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-primary/10 via-brand-bg to-brand-bg text-center relative overflow-hidden">
          
          <div className="absolute top-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

          <div className="relative z-10 max-w-5xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] animate-pulse mx-auto">
              <Zap size={14} /> AI-Powered Growth Engine
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-brand-text tracking-tighter leading-[0.9]">
              REVEAL THE HIDDEN <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">REVENUE</span> IN YOUR WEBSITE
            </h1>
            
            <p className="text-brand-text/60 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
              Stop wasting money on blind marketing. Deploy our Neural Engine to instantly deconstruct your SEO architecture and generate high-converting Ads.
            </p>

            {/* MAIN CTA / SCANNER */}
            <div className="w-full max-w-3xl glass-morphism rounded-[2rem] p-4 sm:p-6 shadow-[0_0_50px_rgba(228,35,1,0.1)] border border-brand-primary/10 relative group bg-white/5 dark:bg-black/20 backdrop-blur-3xl mx-auto mt-12">
              <div className="absolute inset-0 bg-brand-primary/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
              <form onSubmit={(e) => { e.preventDefault(); handleAuditSubmit(currentUrl); }} className="relative flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-text/40 group-focus-within:text-brand-primary transition-colors" size={24} />
                  <input
                    id="main-url-input"
                    type="text"
                    placeholder="Enter Website URL (e.g. apple.com)"
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    className="w-full bg-black/10 dark:bg-black/40 border-2 border-transparent focus:border-brand-primary/30 rounded-2xl pl-16 pr-6 py-4 sm:py-5 text-brand-text text-lg focus:outline-none transition-all placeholder:font-bold placeholder:text-brand-text/30"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/90 text-brand-bg px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-sm sm:text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-brand-primary/20 tracking-wide uppercase"
                >
                  Run Free Audit <ArrowRight size={20} />
                </button>
              </form>
              {auditError && (
                <div className="mt-4 text-brand-primary text-sm font-bold flex items-start gap-2 px-2 animate-in fade-in duration-300 bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 text-left">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" /> 
                  <p className="whitespace-pre-line">
                    {auditError}
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs font-bold text-brand-text/40 uppercase tracking-widest mt-6">Takes 30 seconds • No credit card required</p>

            <div className="pt-10 flex flex-wrap justify-center gap-4 sm:gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight">Forbes</span>
                <span className="font-sans text-xl sm:text-2xl font-black tracking-tighter">TechCrunch</span>
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest">WIRED</span>
                <span className="font-sans text-xl sm:text-2xl font-bold italic tracking-tight">Bloomberg</span>
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 border-t border-brand-text/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-brand-text uppercase tracking-tight mb-4">Why Top Agencies Use Us</h2>
            <p className="text-brand-text/50 font-medium text-lg max-w-2xl mx-auto">We replace three full-time marketing roles with one Deep Audit Protocol. Gain unfair advantages over your competitors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand-bg border border-brand-text/10 rounded-3xl p-8 hover:border-brand-primary/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search size={28} className="text-brand-primary" />
              </div>
              <h3 className="text-xl font-black text-brand-text tracking-tight mb-3">Deep SEO Architecture</h3>
              <p className="text-brand-text/60 leading-relaxed font-medium">Instantly discover missing keywords, broken backlink strategies, and get an exact checklist of what to fix to hit Page 1 on Google.</p>
            </div>

            <div className="bg-brand-bg border border-brand-text/10 rounded-3xl p-8 hover:border-brand-accent/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Megaphone size={28} className="text-brand-accent" />
              </div>
              <h3 className="text-xl font-black text-brand-text tracking-tight mb-3">AI-Driven Ad Copy</h3>
              <p className="text-brand-text/60 leading-relaxed font-medium">Our Neural Engine drafts top-tier Google Search Ads with highly targeted headlines and sitelinks designed for maximum CTR and lower CPC.</p>
            </div>

            <div className="bg-brand-bg border border-brand-text/10 rounded-3xl p-8 hover:border-brand-secondary/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Download size={28} className="text-brand-secondary" />
              </div>
              <h3 className="text-xl font-black text-brand-text tracking-tight mb-3">White-Label PDF Reports</h3>
              <p className="text-brand-text/60 leading-relaxed font-medium">Export the entire audit in a beautiful, presentation-ready PDF in one click. Perfect to send to clients or stakeholders.</p>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h2 className="text-4xl sm:text-6xl font-black text-brand-text tracking-tighter mb-8">READY TO DOMINATE?</h2>
          <button
            onClick={() => document.getElementById('main-url-input')?.focus()}
            className="bg-brand-primary hover:bg-brand-primary/90 text-brand-bg px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-widest inline-flex items-center gap-3"
          >
            Start Free Scan <ArrowRight size={24} />
          </button>
        </div>

      </div>
    );
  };

  // ============= SCANNING SCREEN =============
  const renderScanning = () => (
    <div className="flex-1 flex items-center justify-center p-6 min-h-screen bg-brand-bg transition-colors duration-500">
      <ScannerEffect url={currentUrl} />
    </div>
  );

  // ============= COMPLETED SCREEN (AI Studio Design) =============

  const handleExportPDF = async () => {
    if (!selectedAudit) return;
    setIsExporting(true);
    const prevTab = activeTab;
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const tabs = ['overview', 'ads', 'keywords', 'action'];
      let isFirstPage = true;

      for (const tab of tabs) {
        setActiveTab(tab);
        await new Promise(r => setTimeout(r, 200));
        const element = document.getElementById('report-content');
        if (!element) continue;
        const canvas = await html2canvas(element, { scale: 1.25, useCORS: true, backgroundColor: document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#ffffff' });
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (!isFirstPage) pdf.addPage();
        isFirstPage = false;

        let heightLeft = pdfHeight;
        let position = 0;
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save(`WebOptimizer_Audit_${new URL(selectedAudit.url).hostname}.pdf`);
      setActiveTab(prevTab);
    } catch (e) {
      console.error(e);
      setActiveTab(prevTab);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRegenerateAds = async () => {
    if (!selectedAudit || isRegenerating) return;
    setIsRegenerating(true);
    try {
      const html = await AuditService.fetchWebsiteContent(selectedAudit.url);
      const result = await AuditService.analyzeWebsite(selectedAudit.url, html, selectedAudit.plan as 'free' | 'pro' | 'enterprise', language);
      setSelectedAudit(prev => prev ? { ...prev, ads: result.ads, campaignStrategy: result.campaignStrategy, keywords: result.keywords } : prev);
    } catch (e) {
      console.error('Regeneration failed:', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleConnectGoogleAds = async () => {
    try {
      // In development, this points to our Vercel functions locally. In prod, to the actual URL.
      const apiUrl = import.meta.env.DEV ? 'http://localhost:5173/api/ads/auth-url' : '/api/ads/auth-url';
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Failed to connect Google Ads", err);
      alert("Failed to connect to Google Ads API. Check backend.");
    }
  };

  const handleLanguageChange = async (newLang: string) => {
    setLanguage(newLang);
    if (selectedAudit && appState === 'COMPLETED') {
      setIsTranslating(true);
      try {
        const html = await AuditService.fetchWebsiteContent(selectedAudit.url);
        const result = await AuditService.analyzeWebsite(selectedAudit.url, html, selectedAudit.plan as 'free' | 'pro' | 'enterprise', newLang);
        setSelectedAudit(result);
        setAuditHistory(prev => [result, ...prev.slice(1)]);
      } catch (e) {
        console.error('Language re-scan failed:', e);
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const renderCompleted = () => {
    const audit = selectedAudit;
    if (!audit) return null;
    const hostname = new URL(audit.url || 'https://example.com').hostname;
    const scoreColorBg = audit.score >= 80 ? 'bg-brand-accent/20 border-brand-accent/30' :
      audit.score >= 50 ? 'bg-brand-secondary/20 border-brand-secondary/30' : 'bg-brand-primary/10 border-brand-primary/30';
    const scoreColor = audit.score >= 80 ? 'rgb(var(--brand-accent))' : audit.score >= 50 ? 'rgb(var(--brand-secondary))' : 'rgb(var(--brand-primary))';

    const sidebarItems = [
      { id: 'overview', label: 'Full Overview', icon: <Layout size={16} /> },
      { id: 'ads', label: 'Ad Campaigns', icon: <Megaphone size={16} /> },
      { id: 'keywords', label: 'Organic SEO', icon: <Search size={16} /> },
      { id: 'action', label: 'Action Plan', icon: <Zap size={16} /> }
    ];

    return (
      <div className="flex-1 flex flex-col bg-brand-bg text-brand-text transition-colors duration-500">
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-brand-text/10 bg-brand-bg/90 backdrop-blur-xl">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center">
              <Zap size={18} className="text-brand-primary" />
            </div>
            <div>
              <h1 className="text-[10px] sm:text-sm font-black text-brand-text uppercase tracking-widest flex items-center gap-1 sm:gap-2">
                Web Optimizer <span className="text-brand-primary text-[8px] sm:text-[10px] hidden sm:inline">PRO</span>
              </h1>
              <span className="text-[7px] sm:text-[9px] font-black text-brand-accent uppercase tracking-[0.3em] hidden sm:block">Deep Audit Protocol V2.0</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 ml-auto justify-end">
            <button onClick={() => setAppState(isSignedIn ? 'DASHBOARD' : 'IDLE')} className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-brand-text/10 hover:bg-brand-text/5 transition-all text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-brand-text">
              <span className="hidden sm:inline">New Scan</span>
              <span className="sm:hidden">New</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-brand-secondary/30 bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary/20 transition-all font-black text-[8px] sm:text-[10px] uppercase tracking-widest shadow-glass disabled:opacity-50 flex-shrink-0"
            >
              {isExporting ? <AlertCircle size={12} className="animate-spin" /> : <Download size={12} />}
              <span className="hidden sm:inline">PDF</span>
            </button>
            <div className="flex items-center gap-1 flex-shrink-0">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/20 transition-all font-black text-[8px] sm:text-[10px] uppercase tracking-widest pl-2 pr-4 sm:pl-3 sm:pr-6 py-1.5 sm:py-2 rounded-xl focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang} value={lang} className="bg-brand-bg text-brand-text">
                    {lang.substring(0, 3).toUpperCase()} <span className="hidden sm:inline">{lang}</span>
                  </option>
                ))}
              </select>
            </div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-xl border border-brand-primary/30 text-brand-text transition-all hover:bg-brand-primary/10 flex-shrink-0">
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
            </button>
            <button onClick={() => setShowAssistant(!showAssistant)} className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/20 transition-all font-black text-[8px] sm:text-[10px] uppercase tracking-widest flex-shrink-0 shadow-glass">
              <MessageSquare size={12} /> <span className="hidden sm:inline">Assistant</span>
            </button>
          </div>
        </header>

        <div className="flex flex-1 relative items-start flex-col md:flex-row">
          {isTranslating && (
            <div className="absolute inset-0 z-40 bg-brand-bg/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <Loader2 size={48} className="animate-spin text-brand-primary mb-4" />
              <h2 className="text-xl font-black text-brand-text uppercase tracking-widest mb-2">Translating Protocol</h2>
              <p className="text-sm text-brand-text/60 font-medium">Re-calculating data logic for {language}...</p>
            </div>
          )}

          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-brand-text/10 p-4 md:p-5 flex-shrink-0 bg-brand-bg flex flex-col gap-4 sticky top-[61px] md:top-[73px] z-30 max-h-[40vh] md:max-h-none md:h-[calc(100vh-73px)] overflow-y-auto">
            {/* Mobile Swipe Container for the side items to save vertical space */}
            <div className="md:contents flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-2 md:pb-0 items-center">

              <div className={`flex-shrink-0 snap-start w-[240px] md:w-full rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center shadow-lg relative overflow-hidden bg-brand-bg border transition-all ${audit.score >= 80 ? 'border-brand-accent/30 shadow-brand-accent/10' : audit.score >= 50 ? 'border-brand-secondary/30 shadow-brand-secondary/10' : 'border-brand-primary/30 shadow-brand-primary/10'}`}>
                <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${scoreColorBg}`}></div>

                <p className="text-[10px] font-black text-brand-text/60 uppercase tracking-widest mb-2 z-10 text-center">Health Score</p>

                <div className="relative w-20 h-20 md:w-28 md:h-28 z-10 mb-4 flex-shrink-0 overflow-visible">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90 origin-center filter drop-shadow-md overflow-visible">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-brand-text/10" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke={scoreColor}
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (audit.score / 100) * 251.2}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black text-brand-text tracking-tighter">{audit.score}</span>
                  </div>
                </div>

                <div className="w-full flex items-center justify-center gap-1.5 px-2 py-1 bg-brand-text/[0.03] border border-brand-text/10 rounded-lg z-10 max-w-full overflow-hidden">
                  <Globe size={10} className="text-brand-primary flex-shrink-0" />
                  <span className="text-[9px] md:text-[10px] font-bold font-mono text-brand-text truncate" title={hostname}>{hostname}</span>
                </div>
              </div>

              <div className="flex md:flex-col gap-2 flex-shrink-0 snap-start self-start">
                <div className="flex md:flex-col gap-2">
                  {sidebarItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 md:w-full px-3 py-2 md:py-3.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === item.id ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30 shadow-[0_0_20px_rgba(228,35,1,0.1)]' : 'text-brand-text/60 hover:bg-brand-text/5 hover:text-brand-text border border-transparent'}`}
                    >
                      {item.icon} <span className="mr-2 md:mr-0">{item.label}</span>
                      {activeTab === item.id && <ChevronRight size={14} className="hidden md:block ml-auto text-brand-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block border-t border-brand-primary/20 pt-6 mt-4">
              <h4 className="text-[10px] font-black text-brand-text/40 uppercase tracking-[0.3em] mb-4 pl-2">Audit Modules</h4>
              <div className="space-y-1">
                {audit.sections.map(s => (
                  <button key={s.id} onClick={() => setActiveTab(s.id)} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === s.id ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20' : 'text-brand-text/50 hover:bg-brand-text/5 hover:text-brand-text/80'}`}>
                    <span className="truncate max-w-[150px]">{s.title}</span>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 shadow-[0_0_10px_currentColor] ${getStatusDot(s.status)}`} />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main id="report-content" className="flex-1 p-4 md:p-6 lg:p-10 w-full max-w-[1400px] overflow-hidden min-h-[50vh]">
            <div className="flex flex-col gap-6 md:gap-10">
              {/* Display Domain at top on PDF Export to ensure context matches pages */}
              <div className="pdf-only hidden text-left mb-6 font-bold font-mono text-brand-primary">Audit Target: {hostname}</div>

              {activeTab === 'overview' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-3xl border border-brand-text/10 bg-brand-bg shadow-sm flex flex-col justify-center p-6">
                      <p className="text-[9px] font-black text-brand-accent uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><TrendingUp size={14} /> Est. Traffic Gain</p>
                      <p className="text-xl font-black text-brand-text tracking-tight">{audit.trafficGain || '+25% Organic Traffic'}</p>
                    </div>
                    <div className="rounded-3xl border border-brand-text/10 bg-brand-bg shadow-sm flex flex-col justify-center p-6">
                      <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Target size={14} /> Est. Lead Increase</p>
                      <p className="text-xl font-black text-brand-text tracking-tight">{audit.leadIncrease || '1.5x Monthly Leads'}</p>
                    </div>
                    <div className="rounded-3xl border border-brand-text/10 bg-brand-bg shadow-sm flex flex-col justify-center p-6">
                      <p className="text-[9px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Zap size={14} /> Revenue Projection</p>
                      <p className="text-xl font-black text-brand-text tracking-tight">{audit.revenueProjection || '$5k-15k/mo potential'}</p>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-brand-primary/20 bg-brand-primary/5 p-8 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none transition-all duration-700 group-hover:bg-brand-primary/20"></div>
                    {audit.identifiedNiche && (
                      <div className="mb-6 flex flex-wrap items-center gap-4 relative z-10">
                        <span className="text-[10px] font-black text-brand-bg bg-brand-primary uppercase tracking-[0.2em] px-4 py-2 rounded-full">Identified Niche</span>
                        <span className="text-sm font-black text-brand-text tracking-wide">{audit.identifiedNiche}</span>
                      </div>
                    )}
                    {audit.aiPerception && (
                      <div className="relative z-10">
                        <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] flex items-center gap-2 mb-3"><Sparkles size={14} /> Neural Perception Matrix</p>
                        <p className="text-lg text-brand-text/80 italic leading-relaxed font-medium">"{audit.aiPerception}"</p>
                      </div>
                    )}
                  </div>

                  {audit.targetAudience && audit.targetAudience.length > 0 && (
                    <div className="rounded-3xl border border-brand-accent/20 bg-brand-bg p-8 shadow-sm group hover:border-brand-accent/40 transition-all">
                      <h3 className="text-sm font-black text-brand-accent uppercase tracking-widest mb-6 border-b border-brand-accent/10 pb-4 flex items-center gap-3"><Target size={18} /> Deep Audience Architecture</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {audit.targetAudience.map((aud, i) => {
                          const [title, ...desc] = aud.split(':');
                          return (
                            <div key={i} className="bg-brand-accent/5 p-5 rounded-2xl border border-brand-accent/10">
                              <span className="text-[10px] font-black uppercase text-brand-accent tracking-[0.2em] mb-2 block">{title}</span>
                              <p className="text-sm font-medium text-brand-text/70">{desc.join(':').trim()}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {audit.executiveBrief && (
                      <div className="rounded-3xl border border-brand-text/10 bg-brand-bg p-8 shadow-sm relative overflow-hidden group hover:border-brand-primary/30 transition-all">
                        <h3 className="text-sm font-black text-brand-text uppercase tracking-[0.2em] flex items-center gap-3 mb-6"><ChevronRight size={18} className="text-brand-primary" /> Executive Brief</h3>
                        <p className="text-sm text-brand-text/70 leading-relaxed font-medium">{audit.executiveBrief}</p>
                      </div>
                    )}
                    {audit.quickWins && audit.quickWins.length > 0 && (
                      <div className="rounded-3xl border border-brand-accent/20 bg-brand-accent/5 p-8 shadow-sm relative overflow-hidden group hover:bg-brand-accent/10 transition-all">
                        <h3 className="text-sm font-black text-brand-accent uppercase tracking-[0.2em] flex items-center gap-3 mb-6"><Sparkles size={18} /> Priority Quick Wins</h3>
                        <ol className="space-y-4">
                          {audit.quickWins.map((win, i) => (
                            <li key={i} className="flex items-start gap-4">
                              <span className="w-8 h-8 rounded-xl border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                              <span className="text-sm text-brand-text/80 leading-relaxed font-medium pt-1.5">{win}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* TAB CONTENT (Replaces the entire array) */}
              {(activeTab === 'overview' || audit.sections.find(s => s.id === activeTab)) && (
                <div className="space-y-8">
                  {(activeTab === 'overview' ? audit.sections : audit.sections.filter(s => s.id === activeTab)).map(section => (
                    <div key={section.id} className="rounded-3xl border border-brand-text/10 bg-brand-bg p-8 shadow-sm group hover:border-brand-primary/20 transition-all">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex items-center gap-4 flex-1">
                          <h3 className="text-xl font-black text-brand-text tracking-wide">{section.title}</h3>
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${section.status === 'excellent' ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/30' : section.status === 'good' ? 'bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30' : section.status === 'needs-improvement' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30' : 'bg-brand-primary/30 text-brand-primary border border-brand-primary/50'}`}>{section.status.replace('-', ' ')}</span>
                        </div>
                        <div className="text-right flex items-end gap-1">
                          <span className="text-4xl font-black text-brand-text">{section.score}</span>
                          <span className="text-brand-text/30 text-xs font-black tracking-widest uppercase mb-1">/100</span>
                        </div>
                      </div>
                      <p className="text-sm text-brand-text/60 italic mb-8 border-l-2 border-brand-primary/30 pl-4">{section.summary}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-[10px] font-black text-brand-text/50 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Search size={14} className="text-brand-text/40" /> Findings</h4>
                          <ul className="space-y-3">
                            {section.details.map((d, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-brand-text/70 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/70 mt-1.5 flex-shrink-0" />{d}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Zap size={14} /> Recommendations</h4>
                          <div className="space-y-3">
                            {section.recommendations.map((r, i) => (
                              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-brand-accent/5 border border-brand-accent/10 hover:bg-brand-accent/10 transition-colors">
                                <CheckCircle2 size={16} className="text-brand-accent mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-brand-text/80 font-medium">{r}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* AD CAMPAIGNS TAB */}
              {activeTab === 'ads' && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-brand-text flex items-center gap-3 tracking-wide"><Megaphone size={24} className="text-brand-primary" /> Google Ads Generator</h2>
                      <p className="text-sm text-brand-text/60 mt-1">Create high-CTR headlines and descriptions instantly.</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleConnectGoogleAds}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#4285F4]/30 bg-[#4285F4]/10 text-[#4285F4] font-black text-xs uppercase tracking-widest hover:bg-[#4285F4]/20 transition-all shadow-lg"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Connect Google Ads
                      </button>
                      <button
                        onClick={handleRegenerateAds}
                        disabled={isRegenerating}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-black text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-brand-primary/20"
                      >
                        {isRegenerating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} Regenerate
                      </button>
                    </div>
                  </div>

                  {isRegenerating ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 size={32} className="animate-spin text-brand-primary" />
                      <p className="text-sm text-brand-text/50 font-medium">Analyzing search intent and drafting copy...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT: Search Ad Preview + Generated Assets */}
                        <div className="space-y-6">
                          <div className="rounded-3xl border border-brand-text/10 bg-brand-bg p-8 shadow-sm">
                            <h3 className="text-[10px] font-black text-brand-text/40 uppercase tracking-[0.2em] mb-6">Search Ad Preview</h3>
                            <div className="space-y-6">
                              {(audit.ads || []).filter((a: any) => a.type === 'search').slice(0, 1).map((ad: any, i: number) => (
                                <div key={i} className="space-y-3 bg-[#ffffff] dark:bg-[#202124] p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                  <p className="text-xs text-gray-500 font-bold flex items-center gap-2"><span className="font-black text-black dark:text-white">Ad</span> · {hostname}</p>
                                  <p className="text-[#1a0dab] dark:text-[#8ab4f8] font-normal text-xl hover:underline cursor-pointer font-sans">{ad.headline}</p>
                                  <p className="text-[14px] text-[#4d5156] dark:text-[#bdc1c6] font-sans leading-relaxed">{ad.description}</p>
                                  {ad.sitelinks && ad.sitelinks.length > 0 && (
                                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                      {ad.sitelinks.map((link: string, idx: number) => (
                                        <p key={idx} className="text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer text-sm">{link}</p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Generated Assets */}
                          <div className="rounded-3xl border border-brand-text/10 bg-brand-bg p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-sm font-black text-brand-text uppercase tracking-widest">Generated Assets</h3>
                              <button
                                onClick={() => {
                                  const data = JSON.stringify({ headlines: (audit.ads || []).map((a: any) => a.headline), descriptions: (audit.ads || []).map((a: any) => a.description), keywords: audit.keywords, strategy: audit.campaignStrategy }, null, 2);
                                  navigator.clipboard.writeText(data);
                                }}
                                className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-widest hover:text-brand-primary/80 transition"
                              >
                                <Copy size={14} /> Copy JSON
                              </button>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-3">Headlines</h4>
                                <div className="space-y-2">
                                  {(audit.ads || []).map((ad: any, i: number) => (
                                    <div key={i} className="px-4 py-2.5 rounded-xl border border-brand-text/10 text-sm text-brand-text font-medium bg-brand-text/[0.02]"><span className="select-all">{ad.headline}</span></div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-3">Descriptions</h4>
                                <div className="space-y-2">
                                  {(audit.ads || []).map((ad: any, i: number) => (
                                    <div key={i} className="px-4 py-2.5 rounded-xl border border-brand-text/10 text-sm text-brand-text/80 italic bg-brand-text/[0.02]"><span className="select-all">"{ad.description}"</span></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: Targeting Keywords + Campaign Strategy */}
                        <div className="space-y-6">
                          <div className="rounded-3xl border border-brand-primary/20 bg-brand-primary/5 p-8 shadow-sm">
                            <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-6">Targeting Keywords</h3>
                            <div className="flex flex-wrap gap-3">
                              {(audit.keywords || []).slice(0, 12).map((kw: string, i: number) => (
                                <span key={i} className="px-4 py-2 rounded-xl border border-brand-primary/30 text-sm font-bold text-brand-text bg-brand-bg hover:bg-brand-primary/10 transition-colors cursor-pointer select-all">[{kw}]</span>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-3xl border border-brand-text/10 bg-brand-bg p-8 shadow-sm">
                            <h3 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] mb-6">Campaign Strategy</h3>
                            <ul className="space-y-4">
                              {(audit.campaignStrategy || []).map((strat: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                  <CheckCircle2 size={16} className="text-brand-accent mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-brand-text/80 font-medium leading-relaxed">{strat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {audit.targetAudience && audit.targetAudience.length > 0 && (
                            <div className="rounded-3xl border border-brand-secondary/20 bg-brand-secondary/5 p-8 shadow-sm">
                              <h3 className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Target size={14} /> Target Audience</h3>
                              <div className="space-y-4">
                                {audit.targetAudience.map((aud: string, i: number) => {
                                  const [title, ...desc] = aud.split(':');
                                  return (
                                    <div key={i} className="bg-brand-bg p-4 rounded-2xl border border-brand-secondary/10">
                                      <span className="text-[10px] font-black uppercase text-brand-secondary tracking-[0.2em] mb-1 block">{title}</span>
                                      <p className="text-sm text-brand-text/70 font-medium">{desc.join(':').trim()}</p>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ORGANIC SEO TAB */}
              {activeTab === 'keywords' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-brand-text flex items-center gap-3 tracking-wide"><Search size={24} className="text-brand-primary" /> Organic SEO Strategy</h2>
                      <p className="text-sm text-brand-text/60 mt-1">Keywords, search phrases, and implementation guide for your website.</p>
                    </div>
                  </div>

                  {/* Keywords for Implementation */}
                  <div className="rounded-3xl border border-brand-primary/20 bg-brand-primary/5 p-8 shadow-sm">
                    <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest mb-2 flex items-center gap-2"><Target size={16} /> Keywords for Website Implementation</h3>
                    <p className="text-xs text-brand-text/50 mb-6">Copy these keywords into your meta tags, headings, alt-text, and content body for maximum SEO impact.</p>
                    <div className="flex flex-wrap gap-3">
                      {(audit.keywords || []).slice(0, 10).map((kw: string, i: number) => (
                        <span key={i} className="px-4 py-2 rounded-xl border border-brand-primary/30 bg-brand-bg text-sm font-bold text-brand-text hover:bg-brand-primary/10 transition-colors cursor-pointer select-all">{kw}</span>
                      ))}
                    </div>
                  </div>

                  {/* User Search Queries / Key Phrases */}
                  <div className="rounded-3xl border border-brand-accent/20 bg-brand-accent/5 p-8 shadow-sm">
                    <h3 className="text-sm font-black text-brand-accent uppercase tracking-widest mb-2 flex items-center gap-2"><Search size={16} /> User Search Queries / Key Phrases</h3>
                    <p className="text-xs text-brand-text/50 mb-6">These are the long-tail phrases users actually type into Google. Use these in blog posts, FAQ sections, and landing pages.</p>
                    <div className="space-y-3">
                      {(audit.keywords || []).slice(10, 20).map((kw: string, i: number) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-3 rounded-xl border border-brand-accent/10 bg-brand-bg hover:bg-brand-accent/5 transition-colors">
                          <Search size={14} className="text-brand-accent flex-shrink-0" />
                          <span className="text-sm font-bold text-brand-text select-all">"{kw}"</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SEO Implementation Checklist */}
                  <div className="rounded-3xl border border-brand-text/10 bg-brand-bg p-8 shadow-sm">
                    <h3 className="text-sm font-black text-brand-text uppercase tracking-widest mb-6 flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-accent" /> SEO Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'Add primary keyword to page Title Tag',
                        'Include keyword in H1 heading',
                        'Add 2-3 keywords in H2/H3 subheadings',
                        'Use keywords in first 100 words of body',
                        'Add keywords to image alt-text attributes',
                        'Write meta description with key phrases',
                        'Create internal links with keyword anchors',
                        'Add FAQ section with long-tail questions'
                      ].map((task, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-brand-text/5 bg-brand-text/[0.02]">
                          <CheckCircle2 size={16} className="text-brand-text/30 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-brand-text/70 font-medium">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Backlink Architecture */}
                  <div className="rounded-3xl border border-brand-text/10 bg-brand-bg p-8 shadow-sm">
                    <h3 className="text-sm font-black text-brand-text uppercase tracking-widest mb-6">Backlink Architecture</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-brand-accent/5 border border-brand-accent/10">
                        <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-2">Primary Domains</h4>
                        <p className="text-sm text-brand-text/70">Focus outreach on niche-specific blogs with DR 50+. Guest posting and link insertions in guide articles are recommended.</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-brand-secondary/5 border border-brand-secondary/10">
                        <h4 className="text-[10px] font-black text-brand-secondary uppercase tracking-widest mb-2">Anchor Text Ratios</h4>
                        <ul className="text-sm text-brand-text/70 space-y-1">
                          <li>• <span className="font-bold text-brand-text">50%</span> Branded</li>
                          <li>• <span className="font-bold text-brand-text">20%</span> Exact Match</li>
                          <li>• <span className="font-bold text-brand-text">20%</span> Partial Match</li>
                          <li>• <span className="font-bold text-brand-text">10%</span> Naked URLs</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION PLAN TAB */}
              {activeTab === 'action' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-brand-text flex items-center gap-3 tracking-wide"><Zap size={24} className="text-brand-primary" /> Phase-Based Action Plan</h2>
                      <p className="text-sm text-brand-text/60 mt-1">Structured execution roadmap for exponential growth.</p>
                    </div>
                  </div>

                  <div className="space-y-8 relative">
                    <div className="absolute left-4 lg:left-8 top-12 bottom-12 w-[3px] bg-gradient-to-b from-brand-primary/50 via-brand-accent/50 to-brand-secondary/50 rounded-full" />

                    {[
                      {
                        title: "Phase 1: Foundation (Days 1-14)",
                        color: "brand-primary",
                        icon: <Shield size={20} />,
                        tasks: ["Fix technical SEO errors (404s, speed)", "Implement correct heading hierarchy (H1-H3)", "Setup Google Search Console & Analytics"]
                      },
                      {
                        title: "Phase 2: Content Injection (Days 15-30)",
                        color: "brand-accent",
                        icon: <Sparkles size={20} />,
                        tasks: ["Optimize existing pages for target keywords", "Publish 5 foundational pillar articles", "Improve internal linking structure"]
                      },
                      {
                        title: "Phase 3: Amplification (Days 31-90)",
                        color: "brand-secondary",
                        icon: <TrendingUp size={20} />,
                        tasks: ["Launch Google Search Ads campaign", "Begin targeted backlink outreach", "A/B test landing page conversions"]
                      }
                    ].map((phase, idx) => (
                      <div key={idx} className="relative pl-16 lg:pl-28">
                        <div className={`absolute left-0 lg:left-[14px] top-6 w-10 h-10 rounded-full bg-${phase.color}/20 border-2 border-${phase.color} flex items-center justify-center text-${phase.color} shadow-lg z-10`}>
                          {phase.icon}
                        </div>
                        <div className="rounded-3xl border border-brand-text/10 bg-brand-bg p-8 shadow-sm group hover:border-brand-text/20 transition-all">
                          <h3 className={`text-sm font-black text-${phase.color} uppercase tracking-widest mb-6`}>{phase.title}</h3>
                          <ul className="space-y-3">
                            {phase.tasks.map((task, tidx) => (
                              <li key={tidx} className="flex items-start gap-4">
                                <CheckCircle2 size={18} className={`text-brand-text/30 mt-0.5 flex-shrink-0`} />
                                <span className="text-sm text-brand-text/80 font-medium leading-relaxed">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </main>

          {/* ASSISTANT UI */}
          {showAssistant && (
            <aside className="w-full md:w-96 border-t md:border-t-0 md:border-l border-brand-text/10 bg-brand-bg flex-shrink-0 sticky bottom-0 md:top-[73px] md:h-[calc(100vh-73px)] h-[50vh] flex flex-col shadow-2xl z-40">
              <div className="flex md:hidden justify-between items-center p-3 border-b border-brand-text/10 bg-brand-text/[0.02]">
                <span className="text-xs font-black uppercase tracking-widest text-brand-text">AI Assistant</span>
                <button onClick={() => setShowAssistant(false)} className="text-brand-primary font-bold">Close X</button>
              </div>
              <ChatInterface auditData={selectedAudit} />
            </aside>
          )}
        </div>
      </div >
    );
  };

  return (
    <div className="min-h-screen bg-brand-bg transition-colors duration-500 flex flex-col font-sans selection:bg-brand-primary/30">
      {/* Universal Header — only shown on IDLE/SCANNING */}
      {appState !== 'COMPLETED' && (
        <header className="fixed top-0 left-0 right-0 z-[60] px-8 py-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center backdrop-blur-xl">
              <Zap size={20} className="text-brand-primary" />
            </div>
            <span className="text-sm font-black text-brand-text uppercase tracking-[0.3em]">WebOptimizer <span className="text-brand-primary text-[10px]">Pro</span></span>
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="flex items-center gap-1">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/20 transition-all font-black text-[10px] uppercase tracking-widest pl-3 pr-6 py-2 rounded-xl focus:outline-none cursor-pointer bg-brand-bg/50 backdrop-blur-sm shadow-glass"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang} value={lang} className="bg-brand-bg text-brand-text">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex items-center justify-center w-9 h-9 rounded-xl border border-brand-primary/30 text-brand-text transition-all hover:bg-brand-primary/10 hover:scale-105 shadow-glass bg-brand-bg/50 backdrop-blur-sm">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            {isSignedIn ? (
              <div className="glass-morphism px-3 py-1.5 rounded-xl flex items-center gap-3">
                <span className="text-[10px] font-black text-brand-text/60 uppercase tracking-widest hidden md:block">Protocol Master</span>
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-lg" } }} />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="glass-morphism bg-white/5 dark:bg-black/20 px-6 py-2 rounded-xl text-xs font-black text-brand-text hover:bg-brand-text/5 transition-all uppercase tracking-widest border border-brand-primary/20">
                  Sync Neural Hub
                </button>
              </SignInButton>
            )}
          </div>
        </header>
      )}

      {isPricingOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-6xl relative animate-in fade-in zoom-in-95 duration-500">
            <Pricing
              onBack={() => setIsPricingOpen(false)}
              onSelectPlan={(plan) => {
                setSelectedPlan(plan);
                setIsPricingOpen(false);
              }}
            />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col relative min-h-screen overflow-x-hidden">
        {appState === 'IDLE' && renderIdle()}
        {appState === 'DASHBOARD' && (
          <Dashboard 
            auditHistory={auditHistory} 
            onSelectAudit={(audit) => {
              setSelectedAudit(audit);
              setActiveTab('overview');
              setAppState('COMPLETED');
            }}
            onNewScan={() => setAppState('IDLE')}
            onUpgrade={() => setIsPricingOpen(true)}
            plan={selectedPlan.toUpperCase()}
          />
        )}
        {appState === 'SCANNING' && renderScanning()}
        {appState === 'COMPLETED' && renderCompleted()}
      </main>

      {/* Global Toast / Status — only on IDLE/SCANNING */}
      {appState !== 'COMPLETED' && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="glass-morphism bg-white/5 dark:bg-black/20 px-4 py-2 rounded-full border border-brand-text/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[10px] font-black text-brand-text uppercase tracking-widest">System Ready</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;