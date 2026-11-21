import React from 'react';
import {
  TrendingUp,
  Zap,
  Target,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  Info,
  CheckCheck,
  RotateCcw
} from 'lucide-react';
import { AnalysisResult } from '../types/seo';
import { calculateRankingProbability } from '../utils/semanticEngine';

interface PredictiveRankingEngineProps {
  analysis: AnalysisResult;
  onAdoptAll: () => void;
  onResetAdoptions: () => void;
}

export const PredictiveRankingEngine: React.FC<PredictiveRankingEngineProps> = ({
  analysis,
  onAdoptAll,
  onResetAdoptions,
}) => {
  const predictive = calculateRankingProbability(
    analysis.baseRankingProbability,
    analysis.dynamicLsiKeywords,
    analysis.missedSubheadings,
    analysis.coreFaqs,
    analysis.averageContentScore
  );

  const totalPossibleItems =
    analysis.dynamicLsiKeywords.length +
    analysis.missedSubheadings.length +
    analysis.coreFaqs.length;

  const currentAdoptedCount =
    analysis.dynamicLsiKeywords.filter((k) => k.adopted).length +
    analysis.missedSubheadings.filter((s) => s.adopted).length +
    analysis.coreFaqs.filter((f) => f.adopted).length;

  const isAllAdopted = currentAdoptedCount === totalPossibleItems;

  return (
    <div className="bg-white dark:bg-[#5C1F28] rounded-2xl border-2 border-[#E34234]/30 dark:border-[#FF4040]/40 p-5 sm:p-6 shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E34234]/15 dark:border-[#FF4040]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#E34234] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              3
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Predictive Ranking Impact Engine
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-red-200/80 mt-1">
            Dynamic client-side mathematical projection. Adjusts automatically as you adopt missing LSI keywords, subheadings, and FAQs.
          </p>
        </div>

        {/* Quick Bulk Toggles */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onAdoptAll}
            disabled={isAllAdopted}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isAllAdopted
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 opacity-80 cursor-default'
                : 'bg-[#FFF5F5] dark:bg-[#47121A] text-[#E34234] dark:text-[#FFB3B3] hover:bg-[#FFE8E8] dark:hover:bg-[#601923] border border-[#E34234]/30 dark:border-[#FF4040]/30'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5 text-[#E34234] dark:text-[#FF8080]" />
            <span>Adopt All Recommendations</span>
          </button>

          <button
            type="button"
            onClick={onResetAdoptions}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#47121A] transition-colors"
            title="Reset interactive checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Probability Display Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#FFF5F5] via-[#FFF0F0] to-[#FFE8E8] dark:from-[#4E151E] dark:via-[#421017] dark:to-[#380C13] border border-[#E34234]/30 dark:border-[#FF4040]/35 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Probability Metric */}
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#E34234] dark:text-[#FF8080] flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current stroke-none" />
              Ranking Upgrade Probability
            </span>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                +{predictive.totalProbability}%
              </span>
              <span className="text-sm sm:text-base font-bold text-[#E34234] dark:text-[#FF8080]">
                Chance of Outranking SERP #1
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-red-200/80 pt-1">
              Currently addressing <strong className="font-mono text-slate-900 dark:text-white">{currentAdoptedCount} of {totalPossibleItems}</strong> identified content gaps across keywords, subheadings, and FAQs.
            </p>
          </div>

          {/* Projected Position Badge */}
          <div className="flex flex-col sm:items-end justify-center p-4 rounded-xl bg-white dark:bg-[#5C1F28] border border-[#E34234]/20 dark:border-[#FF4040]/30 shadow-xs shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-red-300/70">
              Projected SERP Outcome
            </span>
            <div className="text-sm sm:text-base font-extrabold text-[#E34234] dark:text-[#FF8080] mt-0.5 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>{predictive.projectedPosition}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-red-200/70">
              <span>Authority Grade:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {predictive.confidenceGrade}
              </span>
            </div>
          </div>
        </div>

        {/* Straight Horizontal Probability Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-600 dark:text-red-200 mb-1.5">
            <span>0% Baseline</span>
            <span className="text-[#E34234] dark:text-[#FF8080] font-bold">
              +{predictive.totalProbability}% Projected Reach
            </span>
            <span>100% Guaranteed Moat</span>
          </div>
          <div className="w-full h-4 bg-white dark:bg-[#2A070D] rounded-full overflow-hidden border border-[#E34234]/30 dark:border-[#FF4040]/40 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E34234] via-[#FF4040] to-emerald-500 transition-all duration-300 ease-out shadow-xs"
              style={{ width: `${predictive.totalProbability}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Formula Breakdown Metric Chips */}
      <div>
        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 dark:text-red-200/70 block mb-2.5">
          Dynamic Mathematical Contribution Breakdown:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Base SERP Gap */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#47121A] border border-[#E34234]/20 dark:border-[#FF4040]/30 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-red-300/70">
              Formula Base (30% + Modifiers + URLs)
            </div>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              +{analysis.baseRankingProbability}%
            </div>
            <div className="text-[10px] text-slate-400 dark:text-red-300/60 mt-1 font-mono">
              30% + {analysis.modifierCount}m({analysis.modifierCount * 5}%) + {analysis.competitorCount}u({analysis.competitorCount * 4}%) {analysis.randomFactor >= 0 ? `+${analysis.randomFactor}%` : `${analysis.randomFactor}%`}
            </div>
          </div>

          {/* LSI Impact */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#47121A] border border-[#E34234]/20 dark:border-[#FF4040]/30 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-red-300/70 flex items-center justify-between">
              <span>LSI Keywords</span>
              <span className="text-[10px] font-mono text-[#E34234] dark:text-[#FF8080]">
                {analysis.dynamicLsiKeywords.filter((k) => k.adopted).length}/5
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-[#E34234] dark:text-[#FF8080] mt-0.5">
              +{predictive.lsiImpact}%
            </div>
            <div className="text-[10px] text-slate-400 dark:text-red-300/60 mt-1">
              +4.8% per adopted LSI
            </div>
          </div>

          {/* Subheadings Impact */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#47121A] border border-[#E34234]/20 dark:border-[#FF4040]/30 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-red-300/70 flex items-center justify-between">
              <span>Missed Subheadings</span>
              <span className="text-[10px] font-mono text-[#E34234] dark:text-[#FF8080]">
                {analysis.missedSubheadings.filter((s) => s.adopted).length}/4
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-[#E34234] dark:text-[#FF8080] mt-0.5">
              +{predictive.subheadingImpact}%
            </div>
            <div className="text-[10px] text-slate-400 dark:text-red-300/60 mt-1">
              +5.5% per strategic H2/H3
            </div>
          </div>

          {/* FAQ Authority Impact */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#47121A] border border-[#E34234]/20 dark:border-[#FF4040]/30 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-red-300/70 flex items-center justify-between">
              <span>FAQ Rich Snippets</span>
              <span className="text-[10px] font-mono text-[#E34234] dark:text-[#FF8080]">
                {analysis.coreFaqs.filter((f) => f.adopted).length}/3
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-[#E34234] dark:text-[#FF8080] mt-0.5">
              +{predictive.faqImpact}%
            </div>
            <div className="text-[10px] text-slate-400 dark:text-red-300/60 mt-1">
              +4.2% per FAQ schema pair
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
