import React from 'react';
import {
  Search,
  Sun,
  Moon,
  Download,
  Copy,
  Check,
  TrendingUp,
  Sparkles,
  Layers
} from 'lucide-react';
import { BENCHMARK_SAMPLES } from '../utils/semanticEngine';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onLoadPreset: (keyword: string) => void;
  onDownloadCsv: () => void;
  onCopyMarkdown: () => void;
  copiedMarkdown: boolean;
  targetKeyword: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  onToggleTheme,
  onLoadPreset,
  onDownloadCsv,
  onCopyMarkdown,
  copiedMarkdown,
  targetKeyword,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-200 border-[#E34234]/20 dark:border-[#FF4040]/30 bg-white/95 dark:bg-[#5C1F28]/95 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E34234] to-[#FF4040] flex items-center justify-center text-white shadow-md shadow-[#E34234]/25 shrink-0">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                SERPGap<span className="text-[#E34234] dark:text-[#FF6B6B]">Engine</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#E34234]/10 text-[#E34234] dark:bg-[#FF4040]/25 dark:text-red-200 border border-[#E34234]/20 dark:border-[#FF4040]/30">
                PRO 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-red-200/70 hidden md:block">
              Auto-Google Competitor Discovery &amp; Niche Gap Analyzer
            </p>
          </div>
        </div>

        {/* Preset Benchmark Quick Select */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-red-200/80 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E34234] dark:text-[#FF8080]" />
            Niches:
          </span>
          <div className="flex items-center gap-1.5">
            {BENCHMARK_SAMPLES.slice(0, 4).map((preset, idx) => {
              const isActive = targetKeyword.toLowerCase() === preset.keyword.toLowerCase();
              return (
                <button
                  key={idx}
                  onClick={() => onLoadPreset(preset.keyword)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E34234] text-white shadow-xs font-bold'
                      : 'bg-[#FFF5F5] dark:bg-[#4E151E] text-slate-700 dark:text-red-100 hover:bg-[#FFE8E8] dark:hover:bg-[#681E29] border border-[#E34234]/20 dark:border-[#FF4040]/20'
                  }`}
                  title={`Analyze niche: ${preset.title}`}
                >
                  {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Copy Markdown Brief */}
          <button
            onClick={onCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-[#E34234]/30 dark:border-[#FF4040]/40 text-slate-700 dark:text-white bg-white dark:bg-[#4E151E] hover:bg-[#FFF5F5] dark:hover:bg-[#681E29]"
            title="Copy Markdown Brief to clipboard"
          >
            {copiedMarkdown ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#E34234] dark:text-[#FF8080]" />
                <span className="hidden sm:inline">Copy Brief</span>
              </>
            )}
          </button>

          {/* Download CSV Button */}
          <button
            onClick={onDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all bg-[#E34234] hover:bg-[#FF4040] shadow-sm shadow-[#E34234]/30 active:scale-95"
            title="Download structured SEO Content Brief as .CSV"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Download Brief (.CSV)</span>
            <span className="sm:hidden">CSV</span>
          </button>

          {/* Theme Toggle (Day / Night) */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg border transition-all text-slate-700 dark:text-white border-[#E34234]/30 dark:border-[#FF4040]/40 bg-white dark:bg-[#4E151E] hover:bg-[#FFF5F5] dark:hover:bg-[#681E29]"
            aria-label="Toggle Day and Night mode"
            title={isDark ? 'Switch to Day (Light) Mode' : 'Switch to Night (Crimson/Wine) Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[#FFB3B3] hover:text-white transition-colors" />
            ) : (
              <Moon className="w-4 h-4 text-[#E34234] hover:text-[#FF4040] transition-colors" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
