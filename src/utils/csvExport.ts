import { AnalysisResult } from '../types/seo';

// Helper to sanitize CSV field
function escapeCsv(val: string | number | boolean | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  // If contains quotes, commas, newlines, wrap in quotes and double internal quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function generateSeoBriefCsv(
  analysis: AnalysisResult,
  predictiveScore: {
    totalProbability: number;
    projectedPosition: string;
    confidenceGrade: string;
  }
): string {
  const rows: string[] = [];

  // 1. EXECUTIVE SUMMARY SECTION
  rows.push(['# SEO CONTENT BRIEF & SERP COMPETITOR AUDIT'].map(escapeCsv).join(','));
  rows.push(['Generated At', new Date().toISOString()].map(escapeCsv).join(','));
  rows.push(['Target Keyword', analysis.targetKeyword].map(escapeCsv).join(','));
  rows.push(['Recommended Word Count', `${analysis.recommendedTargetWordCount} words`].map(escapeCsv).join(','));
  rows.push(['Ranking Upgrade Probability', `+${predictiveScore.totalProbability}% Chance of Outranking`].map(escapeCsv).join(','));
  rows.push(['Projected SERP Position', predictiveScore.projectedPosition].map(escapeCsv).join(','));
  rows.push(['SERP Difficulty', analysis.serpDifficulty].map(escapeCsv).join(','));
  rows.push(['Average Competitor Word Count', `${analysis.averageWordCount} words`].map(escapeCsv).join(','));
  rows.push(['Average Competitor Content Score', `${analysis.averageContentScore}/100`].map(escapeCsv).join(','));
  rows.push('');

  // 2. DYNAMIC LSI KEYWORDS TO ADD
  rows.push(['=== 1. DYNAMIC HIGH-INTENT LSI KEYWORDS TO ADD ==='].map(escapeCsv).join(','));
  rows.push(['LSI Keyword', 'Search Intent', 'Relevance Score', 'Target Density (Occurrences)', 'Draft Adoption Status'].map(escapeCsv).join(','));
  analysis.dynamicLsiKeywords.forEach((kw) => {
    rows.push([
      kw.keyword,
      kw.searchIntent,
      `${kw.relevanceScore}/100`,
      kw.recommendedDensity,
      kw.adopted ? 'Covered in Draft' : 'Pending Injection'
    ].map(escapeCsv).join(','));
  });
  rows.push('');

  // 3. MISSED SUBHEADINGS TO INJECT
  rows.push(['=== 2. STRATEGIC MISSED SUBHEADINGS TO INJECT ==='].map(escapeCsv).join(','));
  rows.push(['Tag', 'Subheading Title', 'Search Intent Goal', 'Competitors Missing This', 'Adoption Status'].map(escapeCsv).join(','));
  analysis.missedSubheadings.forEach((sub) => {
    rows.push([
      sub.tag,
      sub.title,
      sub.intentGoal,
      `${sub.competitorsLacking}/7 Competitors`,
      sub.adopted ? 'Injected in Outline' : 'Recommended'
    ].map(escapeCsv).join(','));
  });
  rows.push('');

  // 4. CORE FAQs TO INCLUDE
  rows.push(['=== 3. CORE FAQs FOR GOOGLE RICH SNIPPET PAIRS ==='].map(escapeCsv).join(','));
  rows.push(['Question', 'Answer', 'Intent Classification', 'Schema Ready', 'Status'].map(escapeCsv).join(','));
  analysis.coreFaqs.forEach((faq) => {
    rows.push([
      faq.question,
      faq.answer,
      faq.searchIntent,
      faq.schemaValid ? 'Valid FAQPage JSON-LD' : 'Draft',
      faq.adopted ? 'Included in FAQ Section' : 'Pending'
    ].map(escapeCsv).join(','));
  });
  rows.push('');

  // 5. TOP 7 COMPETITOR SERP AUDIT MATRIX
  rows.push(['=== 4. TOP 7 COMPETITOR SERP AUDIT MATRIX ==='].map(escapeCsv).join(','));
  rows.push([
    'SERP Rank',
    'Competitor URL',
    'Domain',
    'Content Score',
    'Semantic Density',
    'Word Count',
    'Structural Depth',
    'Missed Topics (Content Gaps)',
    'Primary Weakness'
  ].map(escapeCsv).join(','));

  analysis.competitors.forEach((c) => {
    rows.push([
      `Rank #${c.rank}`,
      c.url,
      c.domain,
      `${c.contentScore}/100`,
      `${c.semanticDensity}%`,
      c.estimatedWordCount,
      c.structuralDepth,
      c.missedTopics.join('; '),
      c.primaryWeakness
    ].map(escapeCsv).join(','));
  });

  return '\uFEFF' + rows.join('\r\n');
}

// Download CSV file directly to user device
export function downloadCsvFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate Markdown format for easy copy to Notion / Google Docs
export function generateMarkdownBrief(
  analysis: AnalysisResult,
  predictiveScore: {
    totalProbability: number;
    projectedPosition: string;
  }
): string {
  return `# SEO Content Brief: ${analysis.targetKeyword.toUpperCase()}

> **Target Optimization Benchmark**: ${analysis.recommendedTargetWordCount} words | **Ranking Probability**: +${predictiveScore.totalProbability}% | **Expected Rank**: ${predictiveScore.projectedPosition}

---

## 1. Dynamic LSI Keywords to Add (5)
${analysis.dynamicLsiKeywords
  .map(
    (kw) =>
      `- [${kw.adopted ? 'x' : ' '}] **${kw.keyword}** — *Intent:* ${kw.searchIntent} | *Target Density:* ${kw.recommendedDensity} (Relevance: ${kw.relevanceScore}%)`
  )
  .join('\n')}

---

## 2. Strategic Missed Subheadings (4)
${analysis.missedSubheadings
  .map(
    (sub) =>
      `### ${sub.tag}: ${sub.title}
*Status:* ${sub.adopted ? '✅ Adopted' : '⏳ Actionable'} | *Competitors Missing:* ${sub.competitorsLacking}/7
*Strategic Intent:* ${sub.intentGoal}`
  )
  .join('\n\n')}

---

## 3. Core FAQs for Rich Snippets (3)
${analysis.coreFaqs
  .map(
    (faq, i) =>
      `**Q${i + 1}: ${faq.question}**  
*A:* ${faq.answer}  
*(Intent: ${faq.searchIntent} | Google Schema.org FAQPage Ready)*`
  )
  .join('\n\n')}

---

## 4. Competitor SERP Benchmarks (Top 7)
| Rank | Domain | Score | Words | Density | Primary Weakness |
|---|---|---|---|---|---|
${analysis.competitors
  .map(
    (c) =>
      `| #${c.rank} | ${c.domain} | ${c.contentScore}/100 | ${c.estimatedWordCount} | ${c.semanticDensity}% | ${c.primaryWeakness} |`
  )
  .join('\n')}
`;
}
