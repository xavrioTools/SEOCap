import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Layers,
  LineChart,
  HelpCircle,
  ExternalLink,
  Sliders,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { AnalysisResult, LinearMetricType, CompetitorAnalysis } from '../types/seo';

interface LinearGraphComparisonProps {
  analysis: AnalysisResult;
}

export const LinearGraphComparison: React.FC<LinearGraphComparisonProps> = ({ analysis }) => {
  const [activeMetric, setActiveMetric] = useState<LinearMetricType>('urlLength');
  const [showTrendLine, setShowTrendLine] = useState<boolean>(true);

  // Maximum word count and density for relative scaling
  const maxWordCount = Math.max(
    analysis.recommendedTargetWordCount,
    ...analysis.competitors.map((c) => c.estimatedWordCount)
  );

  const maxDensity = Math.max(
    2.5,
    ...analysis.competitors.map((c) => c.semanticDensity)
  );

  // Helper to render SVG Trend Line overlay representing historical density points [Q1, Q2, Q3, Q4]
  const renderTrendSvg = (points: number[], isUp: boolean) => {
    const minVal = Math.min(...points) * 0.9;
    const maxVal = Math.max(...points) * 1.1;
    const range = maxVal - minVal || 1;

    // Map 4 points to SVG coordinates (width: 140, height: 26)
    const width = 140;
    const height = 24;
    const padding = 4;
    const usableHeight = height - padding * 2;

    const coords = points.map((p, idx) => {
      const x = padding + (idx / (points.length - 1)) * (width - padding * 2);
      const y = height - padding - ((p - minVal) / range) * usableHeight;
      return { x, y, val: p };
    });

    const pathD = coords.reduce(
      (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
      ''
    );

    const strokeColor = isUp ? '#10B981' : '#E34234';
    const fillColor = isUp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(227, 66, 52, 0.15)';

    // Area path for gradient background
    const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

    return (
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        aria-label="Historical density trendline"
      >
        <path d={areaD} fill={fillColor} />
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r="2.5"
            fill={strokeColor}
            className="hover:r-3.5 transition-all cursor-pointer"
          >
            <title>{`Q${i + 1}: ${c.val}% semantic density`}</title>
          </circle>
        ))}
      </svg>
    );
  };

  return (
    <div className="bg-white dark:bg-[#5C1F28] rounded-2xl border border-[#E34234]/25 dark:border-[#FF4040]/30 p-5 sm:p-6 shadow-sm transition-all duration-200">
      {/* Header with Metric Switcher and Trend Line Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E34234]/15 dark:border-[#FF4040]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#E34234]/15 dark:bg-[#FF4040]/30 text-[#E34234] dark:text-[#FF8080] flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Linear Progress Bar SERP Comparison
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-red-200/80 mt-1">
            Horizontal linear progress bars proportional to competitor URL structure, content length, and active 'Trend Line' historical overlays.
          </p>
        </div>

        {/* Controls: Metric Switcher and Trendline Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Trend Line Toggle Button */}
          <button
            type="button"
            onClick={() => setShowTrendLine((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              showTrendLine
                ? 'bg-gradient-to-r from-[#E34234] to-[#FF4040] text-white border-transparent shadow-xs'
                : 'bg-[#FFF5F5] dark:bg-[#47121A] text-slate-700 dark:text-red-100 border-[#E34234]/30 dark:border-[#FF4040]/30 hover:bg-[#FFE8E8]'
            }`}
            title="Toggle Historical Density Trend Line Overlay on competitor bars"
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Trend Line Overlay: {showTrendLine ? 'ON' : 'OFF'}</span>
          </button>

          {/* Metric Selector Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#FFF5F5] dark:bg-[#47121A] border border-[#E34234]/20 dark:border-[#FF4040]/25">
            <button
              type="button"
              onClick={() => setActiveMetric('urlLength')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                activeMetric === 'urlLength'
                  ? 'bg-[#E34234] text-white shadow-xs'
                  : 'text-slate-600 dark:text-red-200 hover:text-[#E34234]'
              }`}
            >
              URL Structure Length
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('contentScore')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                activeMetric === 'contentScore'
                  ? 'bg-[#E34234] text-white shadow-xs'
                  : 'text-slate-600 dark:text-red-200 hover:text-[#E34234]'
              }`}
            >
              Content Score
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('wordCount')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                activeMetric === 'wordCount'
                  ? 'bg-[#E34234] text-white shadow-xs'
                  : 'text-slate-600 dark:text-red-200 hover:text-[#E34234]'
              }`}
            >
              Word Count
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('semanticDensity')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                activeMetric === 'semanticDensity'
                  ? 'bg-[#E34234] text-white shadow-xs'
                  : 'text-slate-600 dark:text-red-200 hover:text-[#E34234]'
              }`}
            >
              Semantic Density
            </button>
          </div>
        </div>
      </div>

      {/* Target Pillar Benchmark Bar (Highlighted at top for visual contrast) */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#FFF0F0] to-[#FFE6E6] dark:from-[#6B1B27] dark:to-[#50131D] border-2 border-[#E34234] dark:border-[#FF4040] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#E34234] text-white">
              OPTIMIZED BENCHMARK
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Your Target Content (Pillar Strategy)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono font-bold text-[#E34234] dark:text-[#FF9999]">
            {activeMetric === 'urlLength' && <span>URL Scale: 100% Comprehensive Architecture</span>}
            {activeMetric === 'contentScore' && <span>Score Target: 96 / 100</span>}
            {activeMetric === 'wordCount' && <span>Word Target: {analysis.recommendedTargetWordCount.toLocaleString()} words</span>}
            {activeMetric === 'semanticDensity' && <span>Target Density: 1.85% (Optimal)</span>}
          </div>
        </div>

        {/* Straight Horizontal Linear Progress Bar */}
        <div className="relative w-full h-4 bg-white/80 dark:bg-[#380C13] rounded-full overflow-hidden border border-[#E34234]/30 dark:border-[#FF4040]/40 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#E34234] via-[#FF4040] to-emerald-500 transition-all duration-500 ease-out shadow-xs"
            style={{ width: '98%' }}
          />
        </div>

        {/* Target Trendline Sub-Strip */}
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-600 dark:text-red-200/80">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              Projected Content Velocity: +28% (Aggressive continuous entity expansion)
            </span>
          </div>
          <span className="font-bold text-[#E34234] dark:text-[#FF8080]">
            Target SERP Moat
          </span>
        </div>
      </div>

      {/* Competitors Horizontal Straight Bars with Trend Line Overlay */}
      <div className="space-y-4">
        {analysis.competitors.map((comp) => {
          let barPercent = 0;
          let metricLabel = '';

          if (activeMetric === 'urlLength') {
            // Proportional to competitor URL string length
            barPercent = comp.proportionalBarWidth;
            metricLabel = `${comp.urlLength} chars (${comp.proportionalBarWidth}% scale)`;
          } else if (activeMetric === 'contentScore') {
            barPercent = comp.contentScore;
            metricLabel = `${comp.contentScore} / 100 Score`;
          } else if (activeMetric === 'wordCount') {
            barPercent = Math.min(100, Math.round((comp.estimatedWordCount / maxWordCount) * 100));
            metricLabel = `${comp.estimatedWordCount.toLocaleString()} words`;
          } else {
            barPercent = Math.min(100, Math.round((comp.semanticDensity / maxDensity) * 100));
            metricLabel = `${comp.semanticDensity}% Density`;
          }

          const isRankOne = comp.rank === 1;
          const isUp = comp.trendDirection === 'increasing';

          return (
            <div
              key={comp.id}
              className="p-3.5 sm:p-4 rounded-xl border transition-all duration-150 bg-white dark:bg-[#4E151E] border-[#E34234]/15 dark:border-[#FF4040]/25 hover:border-[#E34234]/40 dark:hover:border-[#FF4040]/50"
            >
              {/* Row Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isRankOne
                        ? 'bg-[#E34234] text-white shadow-xs'
                        : 'bg-[#FFF5F5] dark:bg-[#681E29] text-slate-700 dark:text-red-100 border border-[#E34234]/20 dark:border-[#FF4040]/25'
                    }`}
                  >
                    #{comp.rank}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                    {comp.domain}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-[#FFF5F5] dark:bg-[#3D0F16] text-[#E34234] dark:text-[#FF9999] border border-[#E34234]/20 dark:border-[#FF4040]/30 hidden sm:inline">
                    URL: {comp.urlLength} chars
                  </span>
                </div>

                {/* Right Value Labels */}
                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">
                    {metricLabel}
                  </span>
                </div>
              </div>

              {/* Linear Horizontal Bar Container with Embedded Trend Line Overlay */}
              <div className="relative">
                {/* Horizontal Straight Progress Bar */}
                <div className="w-full h-3.5 bg-slate-100 dark:bg-[#380C13] rounded-full overflow-hidden border border-[#E34234]/15 dark:border-[#FF4040]/25">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isRankOne
                        ? 'bg-gradient-to-r from-[#E34234] to-[#FF4040]'
                        : 'bg-gradient-to-r from-[#E34234]/85 to-[#FF4040]/85 dark:from-[#E34234] dark:to-[#FF6B6B]'
                    }`}
                    style={{ width: `${barPercent}%` }}
                  />
                </div>
              </div>

              {/* Trend Line Overlay Section (Visible when showTrendLine is true) */}
              {showTrendLine && (
                <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 dark:border-[#FF4040]/20 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FFF9F9] dark:bg-[#3A0F16] p-2.5 rounded-lg">
                  {/* Trend Indicator & Delta Badge */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1 rounded-md shrink-0 ${
                        isUp
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-[#E34234] dark:bg-rose-950/80 dark:text-red-300'
                      }`}
                    >
                      {isUp ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Trend: {isUp ? 'Increasing Content Length' : 'Decreasing / Content Decay'}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded ${
                            isUp
                              ? 'bg-emerald-500 text-white'
                              : 'bg-[#E34234] text-white'
                          }`}
                        >
                          {isUp ? `+${comp.trendDeltaPercent}%` : `${comp.trendDeltaPercent}%`}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-red-200/70 block">
                        {comp.trendSummary}
                      </span>
                    </div>
                  </div>

                  {/* SVG Historical Density Points Sparkline */}
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <div className="text-right">
                      <span className="text-[9px] font-mono uppercase text-slate-400 dark:text-red-300/60 block">
                        Historical Density (Q1-Q4)
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-slate-700 dark:text-red-100">
                        {comp.historicalDensityPoints[0]}% → {comp.historicalDensityPoints[3]}%
                      </span>
                    </div>

                    <div className="p-1 rounded bg-white dark:bg-[#28070D] border border-slate-200 dark:border-[#FF4040]/30 shadow-2xs">
                      {renderTrendSvg(comp.historicalDensityPoints, isUp)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary SERP Bar footer */}
      <div className="mt-5 pt-4 border-t border-[#E34234]/15 dark:border-[#FF4040]/20 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-red-200/80">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            Competitors Analyzed:{' '}
            <strong className="font-mono text-slate-900 dark:text-white">
              {analysis.competitors.length} sites
            </strong>
          </div>
          <div>
            Avg Content Length:{' '}
            <strong className="font-mono text-slate-900 dark:text-white">
              {analysis.averageWordCount.toLocaleString()} words
            </strong>
          </div>
          <div>
            Avg Score:{' '}
            <strong className="font-mono text-slate-900 dark:text-white">
              {analysis.averageContentScore}/100
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#E34234] dark:text-[#FF8080]">
          <Clock className="w-3.5 h-3.5" />
          <span>Historical density tracking: Active 4-Quarter Horizon</span>
        </div>
      </div>
    </div>
  );
};
