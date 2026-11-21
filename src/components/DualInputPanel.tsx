import React, { useState } from 'react';
import {
  Search,
  Globe,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Wand2
} from 'lucide-react';
import { extractDomainAndPath, BENCHMARK_SAMPLES } from '../utils/semanticEngine';
import { CompetitorAnalysis } from '../types/seo';

interface DualInputPanelProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  competitors: CompetitorAnalysis[];
  manualUrlsText: string;
  onManualUrlsChange: (val: string) => void;
  isAutoMode: boolean;
  onToggleAutoMode: (auto: boolean) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onSelectNicheChip: (presetKeyword: string) => void;
}

export const DualInputPanel: React.FC<DualInputPanelProps> = ({
  keyword,
  onKeywordChange,
  competitors,
  manualUrlsText,
  onManualUrlsChange,
  isAutoMode,
  onToggleAutoMode,
  onAnalyze,
  isAnalyzing,
  onSelectNicheChip,
}) => {
  const [showManualOverride, setShowManualOverride] = useState<boolean>(false);

  // Active Enter keypress listener on the primary keyword input
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAnalyze();
    }
  };

  return (
    <div className="bg-white dark:bg-[#5C1F28] rounded-2xl border border-[#E34234]/25 dark:border-[#FF4040]/30 p-5 sm:p-6 shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E34234]/15 dark:border-[#FF4040]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#E34234] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              1
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Target Keyword &amp; Auto-SERP Competitor Discovery
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-red-200/80 mt-1">
            Simply enter your target topic or keyword. The engine <strong>automatically discovers the top 7 Google competitor URLs</strong> for your niche—no manual link pasting needed.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Auto-Google SERP Crawler Active</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* INPUT 1: Target Keyword / Topic Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="target-keyword-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-red-100 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-[#E34234] dark:text-[#FF8080]" />
              Target Keyword / Topic Title <span className="text-[#E34234]">*</span>
            </label>
            <span className="text-[11px] text-slate-500 dark:text-red-300/70 font-mono">
              Press Enter ↵ to auto-find competitors
            </span>
          </div>

          <div className="relative">
            <input
              id="target-keyword-input"
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder="e.g. best espresso machine for beginners, how to train for a marathon..."
              className="w-full px-4 py-3 rounded-xl border text-sm font-semibold transition-all outline-none bg-white dark:bg-[#47121A] text-slate-900 dark:text-white border-[#E34234]/30 dark:border-[#FF4040]/40 focus:border-[#E34234] focus:ring-2 focus:ring-[#E34234]/20 dark:focus:ring-[#FF4040]/30 placeholder:text-slate-400 dark:placeholder:text-red-300/50 shadow-inner"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => onKeywordChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-[#E34234] dark:hover:text-white cursor-pointer px-2 py-1"
                title="Clear keyword"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Niche Inspiration Quick Chips */}
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 dark:text-red-200/70 block mb-2">
            Try Any Niche (Competitors, Gaps &amp; Metrics Adapt 100% to Each Subject):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {BENCHMARK_SAMPLES.map((preset, idx) => {
              const isActive = keyword.toLowerCase() === preset.keyword.toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectNicheChip(preset.keyword)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#E34234] text-white border-transparent shadow-xs font-bold'
                      : 'bg-[#FFF5F5] dark:bg-[#47121A] text-slate-700 dark:text-red-100 hover:bg-[#FFE8E8] dark:hover:bg-[#601923] border-[#E34234]/20 dark:border-[#FF4040]/25'
                  }`}
                >
                  {preset.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* AUTO-DISCOVERED TOP 7 GOOGLE COMPETITOR URLS DISPLAY */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#FFF9F9] to-white dark:from-[#49121B] dark:to-[#3E0E16] border border-[#E34234]/25 dark:border-[#FF4040]/30 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#E34234]/15 dark:border-[#FF4040]/20">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#E34234] dark:text-[#FF8080]" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Auto-Discovered Top 7 Google SERP Competitors ({competitors.length})
              </h3>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-500 dark:text-red-200/70 hidden sm:inline">
                Niche matched:
              </span>
              <span className="font-mono font-bold text-[#E34234] dark:text-[#FF8080] bg-[#FFF0F0] dark:bg-[#340A10] px-2 py-0.5 rounded border border-[#E34234]/20">
                100% Niche Specific
              </span>
            </div>
          </div>

          {/* List of 7 Competitor URLs with clickable link and domain authority preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {competitors.slice(0, 7).map((comp) => (
              <div
                key={comp.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#541620] border border-slate-200 dark:border-[#FF4040]/25 hover:border-[#E34234]/40 transition-all text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] bg-[#FFF5F5] dark:bg-[#3D0F16] text-[#E34234] dark:text-[#FF8080] border border-[#E34234]/20 shrink-0">
                    #{comp.rank}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white block truncate">
                      {comp.domain}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-red-300/70 block truncate">
                      {comp.slugPath}
                    </span>
                  </div>
                </div>

                <a
                  href={comp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded text-slate-400 hover:text-[#E34234] dark:hover:text-white transition-colors shrink-0"
                  title={`Open competitor page: ${comp.url}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          {/* Optional manual override toggle */}
          <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-red-300/70">
            <span>Discovered automatically based on Google SERP ranking authority.</span>
            <button
              type="button"
              onClick={() => setShowManualOverride((prev) => !prev)}
              className="inline-flex items-center gap-1 font-semibold text-[#E34234] dark:text-[#FF8080] hover:underline cursor-pointer"
            >
              <span>{showManualOverride ? 'Hide Custom URL Override' : 'Custom URL Override (Advanced)'}</span>
              {showManualOverride ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Collapsible Manual URL Override Area (for power users who want to paste custom URLs) */}
          {showManualOverride && (
            <div className="mt-3 pt-3 border-t border-[#E34234]/20 dark:border-[#FF4040]/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 dark:text-red-100">
                  Paste Custom Competitor URLs (1 per line):
                </span>
                <button
                  type="button"
                  onClick={() => onToggleAutoMode(true)}
                  className="text-[10px] text-[#E34234] dark:text-[#FF9999] hover:underline font-bold"
                >
                  Reset to Auto-Google Discovery
                </button>
              </div>
              <textarea
                rows={4}
                value={manualUrlsText}
                onChange={(e) => {
                  onManualUrlsChange(e.target.value);
                  onToggleAutoMode(false);
                }}
                placeholder="Paste up to 7 custom links if you wish to override the auto-discovered Google SERP..."
                className="w-full px-3 py-2 rounded-lg border text-xs font-mono bg-white dark:bg-[#340A10] text-slate-900 dark:text-white border-slate-300 dark:border-[#FF4040]/30 outline-none"
              />
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing || !keyword.trim()}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
              isAnalyzing || !keyword.trim()
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-[#E34234] via-[#FF4040] to-[#E34234] hover:shadow-lg hover:shadow-[#E34234]/30 active:scale-[0.99]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Auto-Fetching Google Competitors &amp; Computing Niche Gaps...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Auto-Find Top 7 Google Competitors &amp; Analyze Gaps</span>
                <span className="text-[11px] font-normal opacity-85 hidden sm:inline ml-1">
                  (Press Enter ↵)
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
