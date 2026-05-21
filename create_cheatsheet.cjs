const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerBorder = { style: BorderStyle.SINGLE, size: 1, color: "1F4E79" };
const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };
const headerShading = { fill: "1F4E79", type: ShadingType.CLEAR };
const altShading = { fill: "F2F7FB", type: ShadingType.CLEAR };

function headerCell(text, width) {
  return new TableCell({
    borders: headerBorders, width: { size: width, type: WidthType.DXA },
    shading: headerShading, margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, font: "Arial", size: 18, color: "FFFFFF" })] })]
  });
}
function cell(text, width, opts = {}) {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const p of parts) {
    if (p.startsWith("**") && p.endsWith("**")) {
      runs.push(new TextRun({ text: p.slice(2, -2), bold: true, font: "Arial", size: 18, color: "333333" }));
    } else {
      runs.push(new TextRun({ text: p, font: "Arial", size: 18, color: "333333" }));
    }
  }
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: opts.shaded ? altShading : undefined, margins: cellMargins,
    children: [new Paragraph({ children: runs })]
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 32, color: "1F4E79" })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 26, color: "2E75B6" })] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 22, color: "333333" })] });
}
function para(text, opts = {}) {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const p of parts) {
    if (p.startsWith("**") && p.endsWith("**")) {
      runs.push(new TextRun({ text: p.slice(2, -2), bold: true, font: "Arial", size: 20, color: "333333" }));
    } else {
      runs.push(new TextRun({ text: p, font: "Arial", size: 20, color: "333333", ...(opts.italic ? { italics: true } : {}) }));
    }
  }
  return new Paragraph({ spacing: { after: 120 }, children: runs, ...(opts.indent ? { indent: { left: 360 } } : {}) });
}
function bullet(text, ref = "bullets") {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const p of parts) {
    if (p.startsWith("**") && p.endsWith("**")) {
      runs.push(new TextRun({ text: p.slice(2, -2), bold: true, font: "Arial", size: 20, color: "333333" }));
    } else {
      runs.push(new TextRun({ text: p, font: "Arial", size: 20, color: "333333" }));
    }
  }
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 60 }, children: runs });
}
function quote(text) {
  return new Paragraph({
    indent: { left: 480, right: 480 }, spacing: { before: 120, after: 120 },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 8 } },
    children: [new TextRun({ text, font: "Arial", size: 19, italics: true, color: "444444" })]
  });
}
function interviewQ(q) {
  return new Paragraph({ spacing: { before: 240, after: 80 },
    children: [new TextRun({ text: q, bold: true, font: "Arial", size: 21, color: "1F4E79" })] });
}
function interviewA(text) {
  return new Paragraph({ spacing: { after: 160 }, indent: { left: 240 },
    children: [
      new TextRun({ text: "Your answer: ", bold: true, font: "Arial", size: 19, color: "2E75B6" }),
      new TextRun({ text, font: "Arial", size: 19, color: "333333" })
    ]
  });
}

function makeTable(headers, rows, colWidths) {
  const tw = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: tw, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({ children: headers.map((h, i) => headerCell(h, colWidths[i])) }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((c, ci) => cell(c, colWidths[ci], { shaded: ri % 2 === 1 }))
      }))
    ]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1F4E79" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: "333333" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79", space: 4 } },
        children: [new TextRun({ text: "Credit Agreement Cheat Sheet  |  Hebbia AI Strategist Interview", font: "Arial", size: 16, color: "999999" })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", font: "Arial", size: 16, color: "999999" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" })]
      })] })
    },
    children: [
      // ===== TITLE =====
      new Paragraph({ spacing: { after: 80 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Credit Agreement Terminology", font: "Arial", size: 44, bold: true, color: "1F4E79" })] }),
      new Paragraph({ spacing: { after: 40 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Cheat Sheet", font: "Arial", size: 44, bold: true, color: "1F4E79" })] }),
      new Paragraph({ spacing: { after: 300 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "For Hebbia AI Strategist Interview with Stephan Montes", font: "Arial", size: 22, color: "666666" })] }),

      // ===== PART 1 =====
      h1("Part 1: Core Concepts (必须烂熟于心)"),

      h2("What is a Credit Agreement?"),
      para("借款人（Borrower）和一组银行（Lenders）之间的合同。银行借钱给公司，公司承诺遵守一系列规则（covenants）。如果违反规则，银行有权要求立即还款。"),
      para("**类比：** 像房贷合同，但借款人是公司，贷款金额是几亿美元，合同有 200-400 页。"),

      h2("Leveraged Loan（杠杆贷款）"),
      para("给高负债公司的贷款，通常用于："),
      bullet("**LBO (Leveraged Buyout):** PE 基金收购公司时的融资"),
      bullet("**M&A:** 公司并购时的融资"),
      bullet("**Refinancing:** 借新债还旧债"),
      para("利率比普通贷款高，因为风险更大。通常是 SOFR + 200-500bps。"),

      h2("Key Parties（关键角色）"),
      makeTable(
        ["角色", "是谁", "做什么"],
        [
          ["**Borrower**", "借钱的公司", "遵守 covenants，按时还钱"],
          ["**Administrative Agent**", "通常是 JPMorgan, BofA 等大行", "代表所有 lenders 管理贷款"],
          ["**Lenders / Syndicate**", "一群银行和机构投资者", "实际出钱的一方"],
          ["**Guarantors**", "Borrower 的子公司", "为贷款提供担保"],
          ["**Sponsor**", "PE 基金（如 KKR, Carlyle）", "Borrower 背后的股东"],
        ],
        [2400, 3400, 3840]
      ),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART 2 =====
      h1("Part 2: Financial Covenants（财务契约）"),

      h2("Consolidated EBITDA（合并调整后 EBITDA）"),
      para("**定义：** Consolidated Net Income（净利润）+ 一系列调整项（add-backs）"),
      para("**为什么重要：** 几乎所有 financial covenants 都基于 EBITDA 计算。EBITDA 的定义直接决定公司是否 comply。"),
      h3("EBITDA Add-backs（加回项）— 这是最关键的部分"),
      makeTable(
        ["Add-back", "什么意思", "为什么加回", "为什么有争议"],
        [
          ["**Interest expense**", "利息费用", "EBITDA 的 \"I\"", "标准项，无争议"],
          ["**Taxes**", "税费", "EBITDA 的 \"T\"", "标准项，无争议"],
          ["**D&A**", "折旧摊销", "EBITDA 的 \"DA\"", "标准项，无争议"],
          ["**Stock-based comp**", "股权激励费用", "非现金支出", "可能金额很大"],
          ["**Non-cash charges**", "其他非现金费用", "不影响现金流", "定义模糊，容易滥用"],
          ["**Restructuring costs**", "重组费用", "一次性费用", "\"一次性\"可能每年都有"],
          ["**Transaction costs**", "交易相关费用", "并购/融资的一次性费用", "金额可能很大"],
          ["**Pro forma adjustments**", "并购后的模拟调整", "反映收购后的完整业绩", "最容易被夸大"],
          ["**Cost savings (synergies)**", "预期节约的成本", "还没实现的节约", "**最危险的 add-back**"],
        ],
        [2200, 2200, 2200, 3040]
      ),

      para(""),
      para("**关键数字：Add-back Cap**"),
      bullet("很多协议限制 add-backs 总额不超过 EBITDA 的 **15-25%**"),
      bullet("有些\"covenant-lite\"协议没有 cap — 这对 lenders 很不利"),
      quote("The aggressiveness of EBITDA add-backs, especially uncapped synergy adjustments, is one of the most scrutinized areas in credit analysis."),

      h2("Leverage Ratio（杠杆率）"),
      para("**公式：** Total Debt / Consolidated EBITDA"),
      makeTable(
        ["类型", "公式", "特点"],
        [
          ["**Consolidated Leverage Ratio**", "Total Debt / EBITDA", "最基础"],
          ["**Consolidated Net Leverage Ratio**", "(Total Debt - Cash) / EBITDA", "扣除现金，对 borrower 更有利"],
          ["**Secured Net Leverage Ratio**", "Secured Debt / EBITDA", "只看有担保的债"],
          ["**Total Net Leverage Ratio**", "(Total Debt - Cash) / EBITDA", "同 Net Leverage"],
        ],
        [3200, 3600, 2840]
      ),
      para(""),
      para("**Covenant Level 是什么？**"),
      bullet("合同规定 leverage ratio 不能超过某个数字（如 4.50x）"),
      bullet("**Step-down：** 随时间变严格（如第一年 5.00x，第二年 4.75x，第三年 4.50x）"),
      bullet("**Acquisition adjustment：** 做了大收购后，允许临时放宽（如从 4.50x 提高到 5.00x）"),
      quote("The leverage covenant is the single most important metric in credit analysis. When I built my extraction prototype, I focused on capturing not just the ratio level but the step-down schedule and acquisition adjustments, because those details determine the real constraint on the borrower."),

      h2("Interest Coverage Ratio（利息覆盖率）"),
      para("**公式：** EBITDA / Interest Expense"),
      bullet("2.00x = EBITDA 是利息的 2 倍（勉强够）"),
      bullet("3.00x+ = 比较健康"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART 3 =====
      h1("Part 3: Restricted Payments（受限支付）"),

      h2("什么是 Restricted Payment？"),
      para("公司把钱\"流出\"给股东的任何行为："),
      bullet("**Dividends（分红）**"),
      bullet("**Share buybacks（回购股票）**"),
      bullet("**Payments to affiliates（向关联方付款）**"),
      bullet("**Prepayment of junior debt（提前偿还次级债）**"),

      h2("为什么 Lenders 在意？"),
      para("因为每一块钱付给股东，就少一块钱还债。Lenders 想确保公司先还债，再分钱。"),

      h2("Permitted Baskets（允许的例外）"),
      makeTable(
        ["Basket 类型", "含义", "典型条件"],
        [
          ["**General basket**", "固定金额的自由额度", "up to $50M per year"],
          ["**Leverage-based basket**", "满足杠杆率条件后可支付", "if leverage < 3.50x"],
          ["**Builder basket**", "累积的可用额度", "基于历史净利润累积"],
          ["**Tax distributions**", "给股东交税的钱", "通常无限制"],
          ["**De minimis basket**", "小额豁免", "up to $5M"],
        ],
        [3200, 3200, 3240]
      ),

      h2("Builder Basket（累积篮子）— 最复杂也最重要"),
      para("一个公式化的累积额度，通常基于："),
      bullet("起始金额（如 $50M）"),
      bullet("加上：累积的 Consolidated Net Income 的 50%"),
      bullet("加上：新股权融资所得"),
      bullet("减去：已经用掉的额度"),
      quote("The builder basket is where the negotiation really happens between sponsors and lenders. A PE fund wants maximum flexibility to extract cash; lenders want to keep it in the business."),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART 4 =====
      h1("Part 4: Borrower-Friendly vs. Lender-Friendly"),
      makeTable(
        ["条款", "Lender-Friendly (Tight)", "Borrower-Friendly (Loose)"],
        [
          ["**EBITDA add-backs**", "有 cap (15-20%)", "无 cap, unlimited synergies"],
          ["**Leverage covenant**", "低倍数 (3.50x), 有 step-down", "高倍数 (5.00x+), 无 step-down"],
          ["**Acquisition adj.**", "无 / 仅 0.25x 增量", "0.50x-1.00x 增量，持续 4+ 季度"],
          ["**RP baskets**", "小额度, 严格 leverage test", "大额度, 宽松 test"],
          ["**Builder basket**", "小起始额 + 低累积比例", "大起始额 + 高累积比例"],
          ["**Covenant-lite**", "有 maintenance covenants", "只有 incurrence covenants"],
        ],
        [2600, 3400, 3640]
      ),
      para(""),
      para("**关键术语：**"),
      bullet("**Maintenance covenant：** 每个季度末自动测试。不达标就违约。对 lender 有利。"),
      bullet("**Incurrence covenant：** 只在借款人做特定行为时才测试。对 borrower 有利。"),
      bullet("**Covenant-lite / Cov-lite：** 没有 maintenance covenants。近年越来越普遍，是 lenders 的痛点。"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART 5 =====
      h1("Part 5: 你项目中三家公司的关键数据"),

      h2("NETSCOUT Systems (Technology)"),
      bullet("**EBITDA add-backs:** 13 categories, capped at 25% of EBITDA"),
      bullet("**Leverage:** Total Net Leverage Ratio, tested at 3.50x for payments"),
      bullet("**RP:** 10 permitted baskets, unlimited payments if leverage < 3.50x"),
      bullet("**Coverage:** None (covenant-lite on this dimension)"),

      h2("Red Rock Resorts (Gaming/Hospitality)"),
      bullet("**EBITDA add-backs:** 13 categories, capped at 25% of EBITDA"),
      bullet("**Leverage:** Consolidated Total Net Leverage Ratio"),
      bullet("**RP:** 16 permitted baskets with Available Amount builder basket"),
      bullet("**Coverage:** Interest Coverage Ratio required"),

      h2("Fresh Del Monte Produce (Food/Agriculture)"),
      bullet("**EBITDA add-backs:** 7 categories, no cap (more borrower-friendly)"),
      bullet("**Leverage:** Consolidated Leverage Ratio, max 3.75x (with 4.25x acquisition buffer)"),
      bullet("**RP:** 6 permitted baskets with builder basket"),
      bullet("**Coverage:** Consolidated Interest Coverage Ratio >= 2.25x"),

      para(""),
      para("**面试时的 insight：**"),
      quote("Fresh Del Monte has fewer but uncapped add-backs, while NETSCOUT has more add-back categories but caps them at 25%. This is a classic trade-off: Del Monte’s lenders accepted fewer restrictions on what counts as EBITDA, but got a tighter leverage ratio (3.75x vs NETSCOUT’s 3.50x test only on payments). It shows how credit agreements are negotiated as a package."),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART 6 =====
      h1("Part 6: Stephan 可能追问的 10 个问题"),

      interviewQ("Q1: \"What's an EBITDA add-back and why does it matter?\""),
      interviewA("An add-back adjusts the EBITDA calculation by adding non-recurring or non-cash items back to net income. It matters because almost every covenant is measured against EBITDA — a more aggressive add-back definition inflates the denominator, making leverage look lower and giving the borrower more room. In my prototype, I found that NETSCOUT had 13 add-back categories capped at 25%, while Fresh Del Monte had only 7 but uncapped — two very different risk profiles."),

      interviewQ("Q2: \"Why did you choose credit agreements specifically?\""),
      interviewA("Because covenant extraction is one of the most time-intensive workflows in credit analysis, and it’s where Hebbia’s citation-first approach has the most impact. An analyst manually reading a 300-page agreement might spend a full day just mapping the EBITDA definition. My prototype shows this can be done in seconds with full source traceability."),

      interviewQ("Q3: \"How accurate is your extraction?\""),
      interviewA("I built an evaluation framework to measure this. I manually annotated the ground truth for each agreement and compared the LLM output. The extraction is highly accurate on well-structured clauses like leverage ratios, but struggles more with complex conditional language in restricted payments baskets. This is exactly the kind of insight an AI Strategist needs — knowing where to trust the AI and where human review is still critical."),

      interviewQ("Q4: \"What's the difference between maintenance and incurrence covenants?\""),
      interviewA("Maintenance covenants are tested every quarter automatically — if you breach, you’re in default. Incurrence covenants are only tested when the borrower takes a specific action, like taking on new debt or making a restricted payment. The trend in the leveraged loan market has been toward cov-lite structures that replace maintenance with incurrence, which gives borrowers more flexibility but reduces lenders’ early warning system."),

      interviewQ("Q5: \"How would you deploy this for a Hebbia client?\""),
      interviewA("I’d start by mapping the analyst’s existing workflow — what are they doing manually today, where are the bottlenecks, and what decisions depend on the output. Then I’d configure the extraction to match their specific priorities. A credit fund might care most about EBITDA add-backs and leverage, while a CLO manager might prioritize coverage tests and restricted payments. The key is not just building the tool, but designing the workflow around it."),

      interviewQ("Q6: \"What's a builder basket?\""),
      interviewA("It’s a cumulative allowance for restricted payments that grows over time, typically starting from a fixed amount and increasing based on a percentage of retained net income and equity proceeds. It’s one of the most negotiated provisions because it directly controls how much cash the PE sponsor can extract from the business."),

      interviewQ("Q7: \"Why does the EBITDA definition vary so much across agreements?\""),
      interviewA("Because it’s the product of negotiation. Each deal has different economics, different sponsors, and different lender syndicates. A strong sponsor like KKR can push for broader add-backs. A weaker borrower might accept tighter definitions to get better pricing. This is exactly why cross-agreement comparison is valuable — it tells you what’s market and what’s off-market."),

      interviewQ("Q8: \"What's Hebbia's advantage over just using ChatGPT for this?\""),
      interviewA("Three things: citation-first architecture, multi-document synthesis, and enterprise-grade trust. A general LLM might give you a plausible-sounding answer about a covenant, but without pinpointing the exact clause and page number. Hebbia’s value is that every output is traceable back to the source — which is non-negotiable in finance. My prototype mimics this by requiring exact citations for every extracted field."),

      interviewQ("Q9: \"What surprised you building this?\""),
      interviewA("How much the restricted payments sections vary in structure across agreements. EBITDA definitions follow a fairly standard pattern — net income plus add-backs. But restricted payments can have anywhere from 6 to 16 baskets, with completely different conditions and thresholds. This means the extraction prompt needs to be much more flexible for RP sections, and it’s where human review adds the most value."),

      interviewQ("Q10: \"Where would this approach fail?\""),
      interviewA("On heavily amended agreements where you need to read the amendment alongside the original to understand the current terms. Also on bespoke structures — some credit agreements have unique provisions that don’t fit standard extraction templates. An AI Strategist needs to know these boundaries and design workflows that route edge cases to human analysts rather than trying to automate everything."),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART 7 =====
      h1("Part 7: 3 Sentences That Will Impress Stephan"),

      para(""),
      h3("On your project:"),
      quote("I built this not to replace what Hebbia does, but to show how I think about deploying AI workflows for credit teams — from document ingestion through structured extraction to cross-agreement benchmarking, with citations at every step."),

      h3("On your role:"),
      quote("I see the AI Strategist role as the bridge between what the technology can do and what the analyst actually needs. My job is to understand the workflow deeply enough to know where AI adds value and where it doesn’t."),

      h3("On Hebbia’s edge:"),
      quote("The reason citation-first matters in credit is that a sourced insight is actionable, but an unsourced insight is a liability. That’s what separates Hebbia from generic AI tools."),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/Users/chococontainer/hebbia-project/cheat_sheet.docx", buffer);
  console.log("Created cheat_sheet.docx (" + buffer.length + " bytes)");
});
