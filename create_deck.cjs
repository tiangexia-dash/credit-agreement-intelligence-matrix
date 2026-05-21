const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageBreak, PageNumber,
} = require("docx");
const fs = require("fs");

const PRIMARY = "1F4E79";
const ACCENT = "2E75B6";
const LIGHT_BG = "F2F7FB";
const DARK_TEXT = "333333";
const WHITE = "FFFFFF";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: PRIMARY, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: WHITE, font: "Arial", size: 18 })],
    })],
  });
}

function dataCell(text, width, shade = false) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: shade ? { fill: LIGHT_BG, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({ text, font: "Arial", size: 17, color: DARK_TEXT })],
    })],
  });
}

function boldDataCell(text, width, shade = false) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: shade ? { fill: LIGHT_BG, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, font: "Arial", size: 17, color: DARK_TEXT })],
    })],
  });
}

function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 300, after: 200 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 28, color: PRIMARY })],
  });
}

function subTitle(text) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 22, color: ACCENT })],
  });
}

function bodyText(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: DARK_TEXT })],
  });
}

function bulletPoint(text) {
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 360 },
    children: [new TextRun({ text: "• " + text, font: "Arial", size: 20, color: DARK_TEXT })],
  });
}

function accentBar() {
  return new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 1 } },
    children: [],
  });
}

function keyInsight(text) {
  return new Paragraph({
    spacing: { before: 150, after: 150 },
    indent: { left: 240 },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 8 } },
    children: [new TextRun({ text, font: "Arial", size: 19, italics: true, color: "555555" })],
  });
}

// ===== PAGE 1: TITLE =====
const page1 = [
  new Paragraph({ spacing: { before: 2400 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Credit Agreement Intelligence Matrix", font: "Arial", size: 40, bold: true, color: PRIMARY })],
  }),
  new Paragraph({ spacing: { after: 200 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "AI-Powered Covenant Extraction & Cross-Agreement Benchmarking", font: "Arial", size: 24, color: ACCENT })],
  }),
  new Paragraph({ spacing: { after: 400 } }),
  accentBar(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: "A Prototype for Hebbia AI Strategist", font: "Arial", size: 22, color: DARK_TEXT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: "Tiange Xia | May 2026", font: "Arial", size: 20, color: "666666" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "3 SEC EDGAR Credit Agreements | 4-Layer Pipeline | 91.7% Extraction Accuracy", font: "Arial", size: 18, color: "888888" })],
  }),
];

// ===== PAGE 2: PROBLEM & WORKFLOW PAIN =====
const page2 = [
  new Paragraph({ children: [new PageBreak()] }),
  sectionTitle("1. The Problem: Manual Covenant Extraction"),
  accentBar(),
  bodyText("Credit analysts at top-tier firms spend 6-8 hours per agreement manually extracting covenant terms from 200-400 page leveraged loan documents. This is the single most time-intensive workflow in credit analysis."),
  subTitle("Current Workflow Pain Points"),
  bulletPoint("EBITDA definitions span 2-5 pages with 7-13 add-back categories, each with unique conditions and caps"),
  bulletPoint("Restricted payments sections contain 6-16 permitted baskets with nested conditional logic"),
  bulletPoint("Cross-agreement comparison requires re-reading multiple documents to benchmark terms"),
  bulletPoint("No standardized framework means different analysts extract different data points"),
  bulletPoint("Manual process is error-prone: missed add-backs or miscounted baskets directly impact credit decisions"),
  subTitle("Why This Matters for Hebbia's Clients"),
  bodyText("Firms like BlackRock, KKR, and Carlyle manage portfolios of hundreds of credit agreements. Every new issuance or secondary trade requires rapid covenant comparison against existing holdings. The current manual approach doesn't scale."),
  keyInsight("Key Insight: Covenant extraction is where Hebbia's citation-first architecture has the most impact — an analyst needs to trust the output before making a credit decision, and trust requires traceability to the source document."),
];

// ===== PAGE 3: SOLUTION ARCHITECTURE =====
const page3 = [
  new Paragraph({ children: [new PageBreak()] }),
  sectionTitle("2. Solution: 4-Layer Extraction Pipeline"),
  accentBar(),
  bodyText("This prototype demonstrates an end-to-end workflow from raw SEC EDGAR filings to structured, comparable covenant data with full source citations."),
  new Paragraph({ spacing: { before: 200, after: 200 } }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1800, 3000, 4560],
    rows: [
      new TableRow({ children: [headerCell("Layer", 1800), headerCell("Component", 3000), headerCell("Output", 4560)] }),
      new TableRow({ children: [boldDataCell("Layer 1", 1800), dataCell("HTML Parsing & Section Extraction", 3000), dataCell("Clean text sections (EBITDA, leverage, RP, coverage)", 4560)] }),
      new TableRow({ children: [boldDataCell("Layer 2", 1800, true), dataCell("LLM Extraction with Citations", 3000, true), dataCell("Structured JSON with exact source quotes", 4560, true)] }),
      new TableRow({ children: [boldDataCell("Layer 3", 1800), dataCell("Cross-Agreement Comparison", 3000), dataCell("Borrower-friendliness scoring, side-by-side matrix", 4560)] }),
      new TableRow({ children: [boldDataCell("Layer 4", 1800, true), dataCell("Evaluation Framework", 3000, true), dataCell("Accuracy metrics, error pattern analysis", 4560, true)] }),
    ],
  }),
  subTitle("Technical Approach"),
  bulletPoint("BeautifulSoup for HTML parsing with regex-based section isolation (handles TOC disambiguation)"),
  bulletPoint("Claude API (Haiku 4.5) with domain-specific extraction prompts per section type"),
  bulletPoint("Every extracted field requires a verbatim citation from the source text"),
  bulletPoint("Borrower-friendliness scoring algorithm across 9 weighted dimensions"),
  keyInsight("Design Principle: The pipeline mirrors how an experienced analyst reads an agreement — first identify the relevant sections, then extract structured data, then compare across agreements."),
];

// ===== PAGE 4: EXTRACTION RESULTS =====
const page4 = [
  new Paragraph({ children: [new PageBreak()] }),
  sectionTitle("3. Extraction Results: Three Agreement Comparison"),
  accentBar(),
  subTitle("Borrower-Friendliness Score"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({ children: [headerCell("NETSCOUT (Tech)", 3120), headerCell("Red Rock (Gaming)", 3120), headerCell("Fresh Del Monte (Food)", 3120)] }),
      new TableRow({ children: [
        dataCell("4/9 — Moderately Borrower-Friendly", 3120),
        dataCell("6/9 — Highly Borrower-Friendly", 3120),
        dataCell("2/9 — Lender-Friendly", 3120),
      ] }),
    ],
  }),
  subTitle("EBITDA Definition Comparison"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2340, 2340, 2340, 2340],
    rows: [
      new TableRow({ children: [headerCell("Dimension", 2340), headerCell("NETSCOUT", 2340), headerCell("Red Rock", 2340), headerCell("Del Monte", 2340)] }),
      new TableRow({ children: [boldDataCell("Add-back Categories", 2340), dataCell("13", 2340), dataCell("13", 2340), dataCell("7", 2340)] }),
      new TableRow({ children: [boldDataCell("Overall Cap", 2340, true), dataCell("25% (pro forma + restructuring)", 2340, true), dataCell("25% (cost savings only)", 2340, true), dataCell("None", 2340, true)] }),
      new TableRow({ children: [boldDataCell("Synergy Add-back", 2340), dataCell("No", 2340), dataCell("Yes", 2340), dataCell("No", 2340)] }),
      new TableRow({ children: [boldDataCell("Covenant Type", 2340, true), dataCell("Incurrence (cov-lite)", 2340, true), dataCell("Maintenance", 2340, true), dataCell("Maintenance", 2340, true)] }),
      new TableRow({ children: [boldDataCell("RP Baskets", 2340), dataCell("10", 2340), dataCell("16", 2340), dataCell("6", 2340)] }),
      new TableRow({ children: [boldDataCell("Coverage Test", 2340, true), dataCell("None", 2340, true), dataCell("Defined, no min", 2340, true), dataCell(">= 2.25x quarterly", 2340, true)] }),
    ],
  }),
  keyInsight("Key Finding: Del Monte has fewer but uncapped add-backs, while NETSCOUT has more add-back categories but caps them at 25%. This is a classic trade-off — Del Monte's lenders accepted fewer restrictions on what counts as EBITDA, but got a tighter leverage ratio (3.75x maintenance vs. NETSCOUT's 3.50x incurrence-only test)."),
];

// ===== PAGE 5: EVALUATION =====
const page5 = [
  new Paragraph({ children: [new PageBreak()] }),
  sectionTitle("4. Evaluation: Accuracy & Error Analysis"),
  accentBar(),
  subTitle("Overall Accuracy: 91.7%"),
  bodyText("Evaluated against manually annotated ground truth across 60 verification checks."),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 2080, 2080, 2080],
    rows: [
      new TableRow({ children: [headerCell("Section", 3120), headerCell("Accuracy", 2080), headerCell("Correct", 2080), headerCell("Total", 2080)] }),
      new TableRow({ children: [boldDataCell("EBITDA Definition", 3120), dataCell("94.1%", 2080), dataCell("32", 2080), dataCell("34", 2080)] }),
      new TableRow({ children: [boldDataCell("Leverage Ratio", 3120, true), dataCell("85.7%", 2080, true), dataCell("6", 2080, true), dataCell("7", 2080, true)] }),
      new TableRow({ children: [boldDataCell("Restricted Payments", 3120), dataCell("100%", 2080), dataCell("15", 2080), dataCell("15", 2080)] }),
      new TableRow({ children: [boldDataCell("Interest Coverage", 3120, true), dataCell("50%", 2080, true), dataCell("2", 2080, true), dataCell("4", 2080, true)] }),
    ],
  }),
  subTitle("Error Pattern Analysis"),
  bulletPoint("EBITDA definitions: Most reliably extracted — well-structured legal language maps cleanly to structured data"),
  bulletPoint("Restricted payments: 100% accuracy on basket counting, leverage tests, and builder basket identification"),
  bulletPoint("Leverage ratios: Accurate when present, but some agreements define ratios in separate sections not captured by initial extraction"),
  bulletPoint("Interest coverage: Lowest accuracy — coverage tests are sometimes defined in financial covenant sections rather than standalone"),
  subTitle("Confidence Tiers for Production"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2340, 3510, 3510],
    rows: [
      new TableRow({ children: [headerCell("Confidence", 2340), headerCell("Fields", 3510), headerCell("Recommendation", 3510)] }),
      new TableRow({ children: [boldDataCell("High", 2340), dataCell("EBITDA add-backs, caps, general restrictions", 3510), dataCell("Auto-populate with minimal review", 3510)] }),
      new TableRow({ children: [boldDataCell("Medium", 2340, true), dataCell("Basket counts, leverage levels, builder baskets", 3510, true), dataCell("Flag for quick verification", 3510, true)] }),
      new TableRow({ children: [boldDataCell("Low", 2340), dataCell("Complex conditional baskets, cross-references", 3510), dataCell("Route to human analyst review", 3510)] }),
    ],
  }),
];

// ===== PAGE 6: IMPLICATIONS =====
const page6 = [
  new Paragraph({ children: [new PageBreak()] }),
  sectionTitle("5. Implications for Hebbia"),
  accentBar(),
  subTitle("What This Prototype Demonstrates"),
  bulletPoint("Speed: 3 agreements analyzed in < 2 minutes vs. 6-8 hours per agreement manually"),
  bulletPoint("Consistency: Every agreement analyzed against the same framework, enabling true apples-to-apples comparison"),
  bulletPoint("Traceability: Every extracted field linked to exact source text — the foundation of analyst trust"),
  bulletPoint("Insight Discovery: Automated comparison reveals non-obvious patterns (the add-back cap vs. category count trade-off)"),
  subTitle("How I'd Deploy This for a Hebbia Client"),
  bodyText("1. Map the analyst's existing workflow — what are they doing manually, where are the bottlenecks, what decisions depend on the output."),
  bodyText("2. Configure extraction templates to match their priorities — a credit fund prioritizes EBITDA add-backs and leverage; a CLO manager prioritizes coverage tests and RP baskets."),
  bodyText("3. Build confidence tiers — auto-populate high-confidence fields, flag medium for quick review, route low-confidence to human analysts."),
  bodyText("4. Measure and iterate — track accuracy over time, identify new error patterns, expand extraction coverage."),
  subTitle("The AI Strategist Role"),
  keyInsight("I see the AI Strategist role as the bridge between what the technology can do and what the analyst actually needs. My job is to understand the workflow deeply enough to know where AI adds value and where it doesn't — and to design the deployment around that understanding."),
  new Paragraph({ spacing: { before: 300 } }),
  bodyText("The reason citation-first matters in credit is that a sourced insight is actionable, but an unsourced insight is a liability. That's what separates Hebbia from generic AI tools."),
  new Paragraph({ spacing: { before: 400 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: ACCENT, space: 8 } },
    children: [new TextRun({ text: "Tiange Xia  |  tiange.xia@columbia.edu  |  GitHub: github.com/xiatiange2003", font: "Arial", size: 18, color: "888888" })],
  }),
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1200, right: 1440, bottom: 1200, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "Credit Agreement Intelligence Matrix", font: "Arial", size: 16, color: "AAAAAA" })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", font: "Arial", size: 16, color: "AAAAAA" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "AAAAAA" }),
          ],
        })],
      }),
    },
    children: [...page1, ...page2, ...page3, ...page4, ...page5, ...page6],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/Users/chococontainer/hebbia-project/deck.docx", buffer);
  console.log(`Created deck.docx (${buffer.length} bytes)`);
});
