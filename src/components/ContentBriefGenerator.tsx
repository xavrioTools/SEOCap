import React, { useState } from 'react';
import {
  FileSpreadsheet,
  KeyRound,
  Heading,
  HelpCircle,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Tag,
  ShieldCheck,
  CheckSquare,
  Square,
  FileCheck
} from 'lucide-react';
import { AnalysisResult } from '../types/seo';

interface ContentBriefGeneratorProps {
  analysis: AnalysisResult;
  onToggleLsiKeyword: (id: string) => void;
  onToggleSubheading: (id: string) => void;
  onToggleFaq: (id: string) => void;
  onDownloadCsv: () => void;
  onCopyMarkdown: () => void;
  copiedMarkdown: boolean;
}

export const ContentBriefGenerator: React.FC<ContentBriefGeneratorProps> = ({
  analysis,
  onToggleLsiKeyword,
  onToggleSubheading,
  onToggleFaq,
  onDownloadCsv,
  onCopyMarkdown,
  copiedMarkdown,
}) => {
  // Expanded FAQ state
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(
    analysis.coreFaqs[0]?.id || null
  );

  return (
    <div className="bg-white dark:bg-[#5C1F28] rounded-2xl border border-[#E34234]/25 dark:border-[#FF4040]/30 p-5 sm:p-6 shadow-sm transition-all duration-200">
      {/* Header with Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#E34234]/15 dark:border-[#FF4040]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#E34234]/15 dark:bg-[#FF4040]/30 text-[#E34234] dark:text-[#FF8080] flex items-center justify-center font-bold text-xs">
              4
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Generated SEO Content Brief
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-red-200/80 mt-1">
            Dynamic high-intent LSI keywords, strategic missed subheadings, and Google-compliant FAQ pairs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E34234]/30 dark:border-[#FF4040]/30 text-slate-700 dark:text-white bg-white dark:bg-[#47121A] hover:bg-[#FFF5F5] dark:hover:bg-[#601923] transition-all cursor-pointer"
            title="Copy as Markdown outline"
          >
            {copiedMarkdown ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#E34234] dark:text-[#FF8080]" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onDownloadCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#E34234] hover:bg-[#FF4040] shadow-md shadow-[#E34234]/25 transition-all cursor-pointer active:scale-95"
            title="Export full brief with CSV structure"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Download SEO Content Brief (.CSV)</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* SUBSECTION 1: Dynamic Keywords to Add (5) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#FFF5F5] dark:bg-[#47121A] text-[#E34234] dark:text-[#FF8080] flex items-center justify-center">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                1. Dynamic Keywords to Add (5 High-Intent LSI Terms)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-red-200/70">
              Click checkbox to mark covered in draft
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {analysis.dynamicLsiKeywords.map((kw) => (
              <div
                key={kw.id}
                onClick={() => onToggleLsiKeyword(kw.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  kw.adopted
                    ? 'bg-gradient-to-br from-[#FFF5F5] to-white dark:from-[#4E151E] dark:to-[#421017] border-[#E34234] dark:border-[#FF4040] shadow-xs ring-1 ring-[#E34234]/30'
                    : 'bg-white dark:bg-[#47121A] border-slate-200 dark:border-[#FF4040]/25 hover:border-[#E34234]/40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    className="mt-0.5 text-[#E34234] dark:text-[#FF8080] shrink-0"
                    aria-label={`Toggle adoption for keyword ${kw.keyword}`}
                  >
                    {kw.adopted ? (
                      <CheckSquare className="w-4 h-4 fill-[#E34234] text-white dark:fill-[#FF4040]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 dark:text-red-300/60" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {kw.keyword}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[#FFF5F5] dark:bg-[#340A10] text-[#E34234] dark:text-[#FF9999] border border-[#E34234]/20 dark:border-[#FF4040]/25">
                        {kw.searchIntent}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-red-200/70">
                        Rel: {kw.relevanceScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-[#FF4040]/15 flex items-center justify-between text-[10px] text-slate-500 dark:text-red-200/70">
                  <span>Target Density:</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-red-100">
                    {kw.recommendedDensity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBSECTION 2: Missed Subheadings to Inject (4) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#FFF5F5] dark:bg-[#47121A] text-[#E34234] dark:text-[#FF8080] flex items-center justify-center">
                <Heading className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                2. Missed Subheadings to Inject (4 Strategic H2/H3 Layout Additions)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-red-200/70">
              Identified from competitor layout omissions
            </span>
          </div>

          <div className="space-y-2.5">
            {analysis.missedSubheadings.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onToggleSubheading(sub.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  sub.adopted
                    ? 'bg-gradient-to-r from-[#FFF5F5] to-white dark:from-[#4E151E] dark:to-[#421017] border-[#E34234] dark:border-[#FF4040] shadow-xs ring-1 ring-[#E34234]/30'
                    : 'bg-white dark:bg-[#47121A] border-slate-200 dark:border-[#FF4040]/25 hover:border-[#E34234]/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    className="mt-0.5 text-[#E34234] dark:text-[#FF8080] shrink-0"
                    aria-label={`Toggle subheading ${sub.title}`}
                  >
                    {sub.adopted ? (
                      <CheckSquare className="w-4 h-4 fill-[#E34234] text-white dark:fill-[#FF4040]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 dark:text-red-300/60" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#E34234] text-white">
                        {sub.tag}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {sub.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-red-200/80 mt-1">
                      <strong className="text-slate-700 dark:text-red-100 font-semibold">Strategic Intent:</strong> {sub.intentGoal}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pl-7 sm:pl-0">
                  <span className="text-[11px] px-2 py-0.5 rounded-md font-mono font-semibold bg-[#FFF5F5] dark:bg-[#340A10] text-[#E34234] dark:text-[#FF8080] border border-[#E34234]/20 dark:border-[#FF4040]/30">
                    Missing in {sub.competitorsLacking}/7 Competitors
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBSECTION 3: Core FAQs to Include (3) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#FFF5F5] dark:bg-[#47121A] text-[#E34234] dark:text-[#FF8080] flex items-center justify-center">
                <HelpCircle className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                3. Core FAQs to Include (3 Rich Snippet Intent Pairs)
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Google Schema.org Ready
            </span>
          </div>

          <div className="space-y-3">
            {analysis.coreFaqs.map((faq, index) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border transition-all ${
                    faq.adopted
                      ? 'border-[#E34234] dark:border-[#FF4040] bg-white dark:bg-[#4E151E]'
                      : 'border-slate-200 dark:border-[#FF4040]/25 bg-white dark:bg-[#47121A]'
                  }`}
                >
                  {/* FAQ Header */}
                  <div className="p-3.5 sm:p-4 flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => onToggleFaq(faq.id)}
                        className="text-[#E34234] dark:text-[#FF8080] shrink-0"
                        aria-label={`Toggle adoption for FAQ ${index + 1}`}
                      >
                        {faq.adopted ? (
                          <CheckSquare className="w-4 h-4 fill-[#E34234] text-white dark:fill-[#FF4040]" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 dark:text-red-300/60" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#E34234] dark:text-[#FF8080]">
                            Q{index + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                            {faq.question}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-red-300/70 block mt-0.5">
                          Search Intent: {faq.searchIntent}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                        aria-label={isExpanded ? 'Collapse answer' : 'Expand answer'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#E34234] dark:text-[#FF8080]" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* FAQ Answer Body */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-[#FF4040]/15">
                      <div className="p-3 rounded-lg bg-[#FFF5F5] dark:bg-[#380C13] border border-[#E34234]/20 dark:border-[#FF4040]/30 text-xs sm:text-sm text-slate-800 dark:text-red-100 leading-relaxed font-sans">
                        <strong className="text-[#E34234] dark:text-[#FF8080] font-semibold block mb-1">
                          Authoritative Answer (Direct Rich Snippet Target):
                        </strong>
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
