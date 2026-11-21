import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  AlertTriangle,
  FileText,
  Percent,
  Layers,
  Search,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { AnalysisResult, CompetitorAnalysis } from '../types/seo';

interface CompetitorGapCardsProps {
  analysis: AnalysisResult;
}

export const CompetitorGapCards: React.FC<CompetitorGapCardsProps> = ({ analysis }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedRank, setSelectedRank] = useState<number | 'all'>('all');

  const filteredCompetitors = analysis.competitors.filter((c) => {
    const matchesDomain =
      c.domain.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.url.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesRank = selectedRank === 'all' || c.rank === selectedRank;
    return matchesDomain && matchesRank;
  });

  return (
    <div className="bg-white dark:bg-[#5C1F28] rounded-2xl border border-[#E34234]/25 dark:border-[#FF4040]/30 p-5 sm:p-6 shadow-sm transition-all duration-200">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E34234]/15 dark:border-[#FF4040]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#E34234]/15 dark:bg-[#FF4040]/30 text-[#E34234] dark:text-[#FF8080] flex items-center justify-center font-bold text-xs">
              5
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Individual SERP Competitor Gap Breakdowns (Top 7)
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-red-200/80 mt-1">
            Detailed client-side semantic audit for each competitor with specific missed topics and omitted subheadings.
          </p>
        </div>

        {/* Quick Rank Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedRank('all')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedRank === 'all'
                ? 'bg-[#E34234] text-white shadow-xs'
                : 'bg-[#FFF5F5] dark:bg-[#47121A] text-slate-600 dark:text-red-200 hover:text-[#E34234] border border-[#E34234]/20 dark:border-[#FF4040]/25'
            }`}
          >
            All 7
          </button>
          {analysis.competitors.map((c) => (
            <button
              key={c.rank}
              type="button"
              onClick={() => setSelectedRank(c.rank)}
              className={`px-2 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                selectedRank === c.rank
                  ? 'bg-[#E34234] text-white shadow-xs'
                  : 'bg-[#FFF5F5] dark:bg-[#47121A] text-slate-600 dark:text-red-200 hover:text-[#E34234] border border-[#E34234]/20 dark:border-[#FF4040]/25'
              }`}
            >
              #{c.rank}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Competitor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCompetitors.map((comp) => {
          const isRankOne = comp.rank === 1;

          return (
            <div
              key={comp.id}
              className={`rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                isRankOne
                  ? 'bg-gradient-to-br from-white to-[#FFF5F5] dark:from-[#541620] dark:to-[#420E16] border-[#E34234] dark:border-[#FF4040] shadow-sm ring-1 ring-[#E34234]/30'
                  : 'bg-white dark:bg-[#4E151E] border-slate-200 dark:border-[#FF4040]/25 hover:border-[#E34234]/40'
              }`}
            >
              <div>
                {/* Card Top Strip */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-mono font-extrabold ${
                        isRankOne
                          ? 'bg-[#E34234] text-white shadow-xs'
                          : 'bg-[#FFF5F5] dark:bg-[#681E29] text-slate-800 dark:text-red-100 border border-[#E34234]/25 dark:border-[#FF4040]/30'
                      }`}
                    >
                      RANK #{comp.rank}
                    </span>
                    <div className="min-w-0">
                      <span className="font-bold text-sm text-slate-900 dark:text-white block truncate">
                        {comp.domain}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 dark:text-red-300/60 block truncate">
                        {comp.slugPath}
                      </span>
                    </div>
                  </div>

                  {/* Score Pill */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-black text-slate-900 dark:text-white block">
                      {comp.contentScore} <span className="text-[10px] font-normal text-slate-400 dark:text-red-300/70">/ 100</span>
                    </span>
                    <span className="text-[10px] font-semibold text-[#E34234] dark:text-[#FF8080]">
                      Score
                    </span>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-lg bg-[#FFF5F5] dark:bg-[#3B0E15] border border-[#E34234]/15 dark:border-[#FF4040]/20 mb-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-red-300/70 block">
                      Word Count
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">
                      {comp.estimatedWordCount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-red-300/70 block">
                      Keyword Density
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">
                      {comp.semanticDensity}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-red-300/70 block">
                      Headings
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">
                      {comp.h2Count} H2 · {comp.h3Count} H3
                    </span>
                  </div>
                </div>

                {/* MISSED TOPICS SECTION */}
                <div className="mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#E34234] dark:text-[#FF8080] block mb-1.5">
                    Missed Topics (Content Voids):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {comp.missedTopics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-[#50131D] text-slate-700 dark:text-red-100 border border-[#E34234]/25 dark:border-[#FF4040]/30 shadow-2xs"
                      >
                        <XCircle className="w-3 h-3 text-[#E34234] dark:text-[#FF8080] shrink-0" />
                        <span>{topic}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* OMITTED SUBHEADINGS SECTION */}
                <div className="mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-red-200/80 block mb-1.5">
                    Omitted Subheadings in Layout:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-red-100">
                    {comp.omittedSubheadings.map((sub, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#E34234] dark:text-[#FF8080] font-bold">›</span>
                        <span className="leading-snug">{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Weakness Alert Bar */}
              <div className="mt-2 pt-2.5 border-t border-slate-100 dark:border-[#FF4040]/15 flex items-start gap-2 text-[11px] text-slate-600 dark:text-red-200/80">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  <strong className="text-slate-800 dark:text-white font-semibold">Audit Verdict:</strong>{' '}
                  {comp.primaryWeakness}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
