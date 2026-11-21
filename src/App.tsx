import React, { useState, useEffect, useTransition } from 'react';
import { Navbar } from './components/Navbar';
import { DualInputPanel } from './components/DualInputPanel';
import { LinearGraphComparison } from './components/LinearGraphComparison';
import { PredictiveRankingEngine } from './components/PredictiveRankingEngine';
import { ContentBriefGenerator } from './components/ContentBriefGenerator';
import { CompetitorGapCards } from './components/CompetitorGapCards';
import {
  runAutonomousSeoAnalysis,
  calculateRankingProbability,
  BENCHMARK_SAMPLES
} from './utils/semanticEngine';
import {
  generateSeoBriefCsv,
  downloadCsvFile,
  generateMarkdownBrief
} from './utils/csvExport';
import { AnalysisResult } from './types/seo';
import { Sparkles, TrendingUp, Layers, CheckCircle2, ShieldCheck, Cpu, Wand2 } from 'lucide-react';

export default function App() {
  // Theme state: Day (Solid #FFFFFF) vs Night (Deep Crimson #DC143C / Rich Wine #722F37)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('seo_engine_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync theme with HTML document element and body classes
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add('dark');
      body.classList.remove('bg-white', 'text-slate-900');
      // Night mode constraint: Rich Wine Red #722F37 / Deep Crimson #DC143C, NO pure black!
      body.classList.add('bg-[#722F37]', 'text-white');
      localStorage.setItem('seo_engine_theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('bg-[#722F37]', 'text-white');
      // Day mode constraint: Solid White #FFFFFF body
      body.classList.add('bg-white', 'text-slate-900');
      localStorage.setItem('seo_engine_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Initial Benchmark sample dataset: Coffee & Espresso (never needs manual URLs!)
  const defaultSample = BENCHMARK_SAMPLES[0];
  const [keyword, setKeyword] = useState<string>(defaultSample.keyword);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true);
  const [manualUrlsText, setManualUrlsText] = useState<string>('');

  // Core Dynamic In-Memory Analysis State
  const [analysis, setAnalysis] = useState<AnalysisResult>(() => {
    return runAutonomousSeoAnalysis(defaultSample.keyword);
  });

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Run Real-Time Competitor Content Gap Analyzer
  const handleAnalyze = () => {
    if (!keyword.trim()) return;
    setIsAnalyzing(true);

    const manualUrls = !isAutoMode && manualUrlsText.trim()
      ? manualUrlsText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0)
      : undefined;

    setTimeout(() => {
      startTransition(() => {
        const result = runAutonomousSeoAnalysis(keyword, manualUrls);
        setAnalysis(result);
        setIsAnalyzing(false);
      });
    }, 200);
  };

  // Instant Niche Switcher (Loads topic, auto-finds Google competitors, updates all 7 sites & metrics)
  const handleSelectNiche = (presetKeyword: string) => {
    setKeyword(presetKeyword);
    setIsAutoMode(true);
    setManualUrlsText('');
    setIsAnalyzing(true);

    setTimeout(() => {
      startTransition(() => {
        const result = runAutonomousSeoAnalysis(presetKeyword);
        setAnalysis(result);
        setIsAnalyzing(false);
      });
    }, 180);
  };

  // Interactive Checklist Toggles for Predictive Math Engine
  const handleToggleLsiKeyword = (id: string) => {
    setAnalysis((prev) => ({
      ...prev,
      dynamicLsiKeywords: prev.dynamicLsiKeywords.map((kw) =>
        kw.id === id ? { ...kw, adopted: !kw.adopted } : kw
      )
    }));
  };

  const handleToggleSubheading = (id: string) => {
    setAnalysis((prev) => ({
      ...prev,
      missedSubheadings: prev.missedSubheadings.map((sub) =>
        sub.id === id ? { ...sub, adopted: !sub.adopted } : sub
      )
    }));
  };

  const handleToggleFaq = (id: string) => {
    setAnalysis((prev) => ({
      ...prev,
      coreFaqs: prev.coreFaqs.map((faq) =>
        faq.id === id ? { ...faq, adopted: !faq.adopted } : faq
      )
    }));
  };

  const handleAdoptAll = () => {
    setAnalysis((prev) => ({
      ...prev,
      dynamicLsiKeywords: prev.dynamicLsiKeywords.map((kw) => ({ ...kw, adopted: true })),
      missedSubheadings: prev.missedSubheadings.map((sub) => ({ ...sub, adopted: true })),
      coreFaqs: prev.coreFaqs.map((faq) => ({ ...faq, adopted: true }))
    }));
  };

  const handleResetAdoptions = () => {
    setAnalysis((prev) => ({
      ...prev,
      dynamicLsiKeywords: prev.dynamicLsiKeywords.map((kw, i) => ({ ...kw, adopted: i < 1 })),
      missedSubheadings: prev.missedSubheadings.map((sub, i) => ({ ...sub, adopted: i === 0 })),
      coreFaqs: prev.coreFaqs.map((faq) => ({ ...faq, adopted: false }))
    }));
  };

  // Download SEO Content Brief (.CSV)
  const handleDownloadCsv = () => {
    const predictive = calculateRankingProbability(
      analysis.baseRankingProbability,
      analysis.dynamicLsiKeywords,
      analysis.missedSubheadings,
      analysis.coreFaqs,
      analysis.averageContentScore
    );
    const csvContent = generateSeoBriefCsv(analysis, predictive);
    const safeName = analysis.targetKeyword.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    downloadCsvFile(csvContent, `${safeName}-seo-content-brief.csv`);
  };

  // Copy Markdown Brief
  const handleCopyMarkdown = () => {
    const predictive = calculateRankingProbability(
      analysis.baseRankingProbability,
      analysis.dynamicLsiKeywords,
      analysis.missedSubheadings,
      analysis.coreFaqs,
      analysis.averageContentScore
    );
    const markdown = generateMarkdownBrief(analysis, predictive);
    navigator.clipboard.writeText(markdown).then(() => {
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2200);
    });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Synchronized Header with Day/Night toggle & CSV Download */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onLoadPreset={handleSelectNiche}
        onDownloadCsv={handleDownloadCsv}
        onCopyMarkdown={handleCopyMarkdown}
        copiedMarkdown={copiedMarkdown}
        targetKeyword={analysis.targetKeyword}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Metric Overview Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#5C1F28] border border-[#E34234]/25 dark:border-[#FF4040]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFF5F5] dark:bg-[#47121A] text-[#E34234] dark:text-[#FF8080] border border-[#E34234]/25 dark:border-[#FF4040]/30">
                <Wand2 className="w-3.5 h-3.5" />
                Zero-URL Input Mode Active
              </span>
              <span className="text-xs text-slate-400 dark:text-red-300/70 hidden sm:inline">
                Analyzed at: {analysis.timestamp}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              SERP Gap Audit: <span className="text-[#E34234] dark:text-[#FF8080]">"{analysis.targetKeyword}"</span>
            </h1>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-[#FFF5F5] dark:bg-[#47121A] border border-[#E34234]/20 dark:border-[#FF4040]/25">
              <span className="text-slate-500 dark:text-red-300/70 block text-[10px]">Google Top Competitors</span>
              <strong className="font-mono text-slate-900 dark:text-white text-sm">
                {analysis.competitors.length} Auto-Discovered
              </strong>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-[#FFF5F5] dark:bg-[#47121A] border border-[#E34234]/20 dark:border-[#FF4040]/25">
              <span className="text-slate-500 dark:text-red-300/70 block text-[10px]">Pillar Word Target</span>
              <strong className="font-mono text-[#E34234] dark:text-[#FF8080] text-sm">
                {analysis.recommendedTargetWordCount.toLocaleString()} words
              </strong>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-[#FFF5F5] dark:bg-[#47121A] border border-[#E34234]/20 dark:border-[#FF4040]/25">
              <span className="text-slate-500 dark:text-red-300/70 block text-[10px]">SERP Difficulty</span>
              <strong className="font-mono text-slate-900 dark:text-white text-sm">
                {analysis.serpDifficulty}
              </strong>
            </div>
          </div>
        </div>

        {/* 1. DUAL INPUT PANEL (Zero-URL requirement, auto-discovers top 7 Google URLs) */}
        <section id="input-section">
          <DualInputPanel
            keyword={keyword}
            onKeywordChange={setKeyword}
            competitors={analysis.competitors}
            manualUrlsText={manualUrlsText}
            onManualUrlsChange={setManualUrlsText}
            isAutoMode={isAutoMode}
            onToggleAutoMode={setIsAutoMode}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            onSelectNicheChip={handleSelectNiche}
          />
        </section>

        {/* 3. LINEAR GRAPH COMPARISON (NO ROUND GRAPHS, with Trend Line Overlay) */}
        <section id="linear-graph-section">
          <LinearGraphComparison analysis={analysis} />
        </section>

        {/* 4. PREDICTIVE RANKING IMPACT ENGINE */}
        <section id="predictive-ranking-section">
          <PredictiveRankingEngine
            analysis={analysis}
            onAdoptAll={handleAdoptAll}
            onResetAdoptions={handleResetAdoptions}
          />
        </section>

        {/* 5. CONTENT BRIEF GENERATOR (5 LSI, 4 Subheadings, 3 FAQs, CSV Download) */}
        <section id="content-brief-section">
          <ContentBriefGenerator
            analysis={analysis}
            onToggleLsiKeyword={handleToggleLsiKeyword}
            onToggleSubheading={handleToggleSubheading}
            onToggleFaq={handleToggleFaq}
            onDownloadCsv={handleDownloadCsv}
            onCopyMarkdown={handleCopyMarkdown}
            copiedMarkdown={copiedMarkdown}
          />
        </section>

        {/* 2. REAL-TIME COMPETITOR CONTENT GAP ANALYZER (Top 7 Details) */}
        <section id="competitor-cards-section">
          <CompetitorGapCards analysis={analysis} />
        </section>
      </main>

      {/* High-Contrast Footer obeying Day (#FFFFFF) and Night (Crimson/Wine) guidelines */}
      <footer className="mt-12 border-t border-[#E34234]/20 dark:border-[#FF4040]/30 bg-white dark:bg-[#5C1F28] py-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-red-200/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              SEO Content Gap &amp; Competitor Analysis Engine · Auto-Google SERP Competitor Discovery
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Niche Specific Entities</span>
            <span aria-hidden="true">·</span>
            <span>Zero URL Entry Required</span>
            <span aria-hidden="true">·</span>
            <span>Dynamic Mathematical Probability</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
