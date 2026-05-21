# Credit Agreement Terminology Cheat Sheet
## For Hebbia AI Strategist Interview with Stephan Montes

---

## Part 1: Core Concepts (必须烂熟于心)

### What is a Credit Agreement?
借款人（Borrower）和一组银行（Lenders）之间的合同。银行借钱给公司，公司承诺遵守一系列规则（covenants）。如果违反规则，银行有权要求立即还款。

**类比：** 像房贷合同，但借款人是公司，贷款金额是几亿美元，合同有 200-400 页。

### Leveraged Loan（杠杆贷款）
给高负债公司的贷款，通常用于：
- **LBO (Leveraged Buyout):** PE 基金收购公司时的融资
- **M&A:** 公司并购时的融资
- **Refinancing:** 借新债还旧债

利率比普通贷款高，因为风险更大。通常是 SOFR + 200-500bps。

### Key Parties（关键角色）
| 角色 | 是谁 | 做什么 |
|------|------|--------|
| **Borrower** | 借钱的公司 | 遵守 covenants，按时还钱 |
| **Administrative Agent** | 通常是 JPMorgan, BofA 等大行 | 代表所有 lenders 管理贷款 |
| **Lenders / Syndicate** | 一群银行和机构投资者 | 实际出钱的一方 |
| **Guarantors** | Borrower 的子公司 | 为贷款提供担保 |
| **Sponsor** | PE 基金（如 KKR, Carlyle） | Borrower 背后的股东 |

---

## Part 2: Financial Covenants（财务契约 — 你项目的核心）

### Consolidated EBITDA（合并调整后 EBITDA）
**定义：** Consolidated Net Income（净利润）+ 一系列调整项（add-backs）

**为什么重要：** 几乎所有 financial covenants 都基于 EBITDA 计算。EBITDA 的定义直接决定公司是否 comply。

**EBITDA Add-backs（加回项）— 这是最关键的部分：**

| Add-back | 什么意思 | 为什么加回 | 为什么有争议 |
|----------|---------|-----------|-------------|
| **Interest expense** | 利息费用 | EBITDA 的 "I" | 标准项，无争议 |
| **Taxes** | 税费 | EBITDA 的 "T" | 标准项，无争议 |
| **D&A** | 折旧摊销 | EBITDA 的 "DA" | 标准项，无争议 |
| **Stock-based comp** | 股权激励费用 | 非现金支出 | 可能金额很大 |
| **Non-cash charges** | 其他非现金费用 | 不影响现金流 | 定义模糊，容易滥用 |
| **Restructuring costs** | 重组费用 | 一次性费用 | "一次性"可能每年都有 |
| **Transaction costs** | 交易相关费用 | 并购/融资的一次性费用 | 金额可能很大 |
| **Pro forma adjustments** | 并购后的模拟调整 | 反映收购后的完整业绩 | 最容易被夸大 |
| **Cost savings (synergies)** | 预期节约的成本 | 还没实现的"计划中"节约 | **最危险的 add-back** — 公司可以声称未来会省钱 |

**关键数字：Add-back Cap**
- 很多协议限制 add-backs 总额不超过 EBITDA 的 **15-25%**
- 有些"covenant-lite"协议没有 cap — 这对 lenders 很不利
- **面试时可以说：** "The aggressiveness of EBITDA add-backs, especially uncapped synergy adjustments, is one of the most scrutinized areas in credit analysis."

### Leverage Ratio（杠杆率）
**公式：** Total Debt / Consolidated EBITDA

**常见类型：**
| 类型 | 公式 | 特点 |
|------|------|------|
| **Consolidated Leverage Ratio** | Total Debt / EBITDA | 最基础 |
| **Consolidated Net Leverage Ratio** | (Total Debt - Cash) / EBITDA | 扣除现金，对 borrower 更有利 |
| **Secured Net Leverage Ratio** | Secured Debt / EBITDA | 只看有担保的债 |
| **Total Net Leverage Ratio** | (Total Debt - Cash) / EBITDA | 同 Net Leverage |

**Covenant Level 是什么？**
- 合同规定 leverage ratio 不能超过某个数字（如 4.50x）
- **Step-down：** 随时间变严格（如第一年 5.00x，第二年 4.75x，第三年 4.50x）
- **Acquisition adjustment：** 做了大收购后，允许临时放宽（如从 4.50x 临时提高到 5.00x，持续 4 个季度）

**面试时可以说：** "The leverage covenant is the single most important metric in credit analysis. When I built my extraction prototype, I focused on capturing not just the ratio level but the step-down schedule and acquisition adjustments, because those details determine the real constraint on the borrower."

### Interest Coverage Ratio（利息覆盖率）
**公式：** EBITDA / Interest Expense

**含义：** 公司的 EBITDA 是利息支出的几倍。数字越高越安全。
- 2.00x = EBITDA 是利息的 2 倍（勉强够）
- 3.00x+ = 比较健康

### Fixed Charge Coverage Ratio（固定费用覆盖率）
类似 Interest Coverage，但分母包含更多固定支出（本金偿还、租赁等）。

---

## Part 3: Restricted Payments（受限支付 — Stephan 在 Hayfin 最关心的）

### 什么是 Restricted Payment？
公司把钱"流出"给股东的任何行为：
- **Dividends（分红）**
- **Share buybacks（回购股票）**
- **Payments to affiliates（向关联方付款）**
- **Prepayment of junior debt（提前偿还次级债）**

### 为什么 Lenders 在意？
因为每一块钱付给股东，就少一块钱还债。Lenders 想确保公司先还债，再分钱。

### Permitted Baskets（允许的例外）
合同通常禁止所有 Restricted Payments，但有一系列"篮子"（baskets）允许有限的支付：

| Basket 类型 | 含义 | 典型条件 |
|-------------|------|---------|
| **General basket** | 固定金额的自由额度 | 如 "up to $50M per year" |
| **Leverage-based basket** | 满足杠杆率条件后可支付 | 如 "if leverage < 3.50x" |
| **Builder basket / Available Amount** | 累积的可用额度 | 基于历史净利润累积 |
| **Tax distributions** | 给股东交税的钱 | 通常无限制 |
| **De minimis basket** | 小额豁免 | 如 "up to $5M" |

### Builder Basket（累积篮子）— 最复杂也最重要
一个公式化的累积额度，通常基于：
- 起始金额（如 $50M）
- 加上：累积的 Consolidated Net Income 的 50%
- 加上：新股权融资所得
- 减去：已经用掉的额度

**面试时可以说：** "The builder basket is where the negotiation really happens between sponsors and lenders. A PE fund wants maximum flexibility to extract cash; lenders want to keep it in the business. The size and conditions of the builder basket tell you a lot about the overall borrower-friendliness of the deal."

---

## Part 4: Borrower-Friendly vs. Lender-Friendly（你的项目 Layer 2 的核心框架）

| 条款 | Lender-Friendly (Tight) | Borrower-Friendly (Loose) |
|------|------------------------|--------------------------|
| **EBITDA add-backs** | 有 cap (15-20%), 限制 synergy add-backs | 无 cap, 允许 unlimited synergies |
| **Leverage covenant** | 低倍数 (3.50x), 有 step-down | 高倍数 (5.00x+), 无 step-down |
| **Acquisition adjustment** | 无 / 仅 0.25x 增量 | 0.50x-1.00x 增量，持续 4+ 季度 |
| **RP baskets** | 小额度, 严格 leverage test | 大额度, 宽松 test |
| **Builder basket** | 小起始额 + 低累积比例 | 大起始额 + 高累积比例 |
| **Covenant-lite** | 有 maintenance covenants（每季度测试） | 只有 incurrence covenants（只在特定事件时测试） |

**关键术语：**
- **Maintenance covenant：** 每个季度末自动测试。如果不达标，就违约。对 lender 有利。
- **Incurrence covenant：** 只在借款人做特定行为时才测试（如借新债、做收购）。对 borrower 有利。
- **Covenant-lite / Cov-lite：** 没有 maintenance covenants 的贷款。近年越来越普遍，是 lenders 的痛点。

---

## Part 5: 你项目中三家公司的关键数据（面试时信手拈来）

### NETSCOUT Systems (Technology)
- **EBITDA add-backs:** 13 categories, capped at 25% of EBITDA
- **Leverage:** Total Net Leverage Ratio, tested at 3.50x for payments
- **RP:** 10 permitted baskets, unlimited payments if leverage < 3.50x
- **Coverage:** None (covenant-lite on this dimension)

### Red Rock Resorts (Gaming/Hospitality)
- **EBITDA add-backs:** 13 categories, capped at 25% of EBITDA
- **Leverage:** Consolidated Total Net Leverage Ratio
- **RP:** 16 permitted baskets with Available Amount builder basket
- **Coverage:** Interest Coverage Ratio required

### Fresh Del Monte Produce (Food/Agriculture)
- **EBITDA add-backs:** 7 categories, no cap (more borrower-friendly)
- **Leverage:** Consolidated Leverage Ratio, max 3.75x (with 4.25x acquisition buffer)
- **RP:** 6 permitted baskets with builder basket
- **Coverage:** Consolidated Interest Coverage Ratio >= 2.25x

**面试时的 insight：**
> "Fresh Del Monte has fewer but uncapped add-backs, while NETSCOUT has more add-back categories but caps them at 25%. This is a classic trade-off: Del Monte's lenders accepted fewer restrictions on what counts as EBITDA, but got a tighter leverage ratio (3.75x vs NETSCOUT's 3.50x test only on payments). It shows how credit agreements are negotiated as a package."

---

## Part 6: Stephan 可能追问的 10 个问题 + 你的回答

### Q1: "What's an EBITDA add-back and why does it matter?"
**你的回答：** "An add-back adjusts the EBITDA calculation by adding non-recurring or non-cash items back to net income. It matters because almost every covenant is measured against EBITDA — a more aggressive add-back definition inflates the denominator, making leverage look lower and giving the borrower more room. In my prototype, I found that NETSCOUT had 13 add-back categories capped at 25%, while Fresh Del Monte had only 7 but uncapped — two very different risk profiles."

### Q2: "Why did you choose credit agreements specifically?"
**你的回答：** "Because covenant extraction is one of the most time-intensive workflows in credit analysis, and it's where Hebbia's citation-first approach has the most impact. An analyst manually reading a 300-page agreement might spend a full day just mapping the EBITDA definition. My prototype shows this can be done in seconds with full source traceability."

### Q3: "How accurate is your extraction?"
**你的回答：** "I built an evaluation framework to measure this. I manually annotated the ground truth for each agreement and compared the LLM output. The extraction is highly accurate on well-structured clauses like leverage ratios, but struggles more with complex conditional language in restricted payments baskets. This is exactly the kind of insight an AI Strategist needs — knowing where to trust the AI and where human review is still critical."

### Q4: "What's the difference between maintenance and incurrence covenants?"
**你的回答：** "Maintenance covenants are tested every quarter automatically — if you breach, you're in default. Incurrence covenants are only tested when the borrower takes a specific action, like taking on new debt or making a restricted payment. The trend in the leveraged loan market has been toward cov-lite structures that replace maintenance with incurrence, which gives borrowers more flexibility but reduces lenders' early warning system."

### Q5: "How would you deploy this for a Hebbia client?"
**你的回答：** "I'd start by mapping the analyst's existing workflow — what are they doing manually today, where are the bottlenecks, and what decisions depend on the output. Then I'd configure the extraction to match their specific priorities. A credit fund might care most about EBITDA add-backs and leverage, while a CLO manager might prioritize coverage tests and restricted payments. The key is not just building the tool, but designing the workflow around it."

### Q6: "What's a builder basket?"
**你的回答：** "It's a cumulative allowance for restricted payments that grows over time, typically starting from a fixed amount and increasing based on a percentage of retained net income and equity proceeds. It's one of the most negotiated provisions because it directly controls how much cash the PE sponsor can extract from the business."

### Q7: "Why does the EBITDA definition vary so much across agreements?"
**你的回答：** "Because it's the product of negotiation. Each deal has different economics, different sponsors, and different lender syndicates. A strong sponsor like KKR can push for broader add-backs. A weaker borrower might accept tighter definitions to get better pricing. This is exactly why cross-agreement comparison is valuable — it tells you what's market and what's off-market."

### Q8: "What's Hebbia's advantage over just using ChatGPT for this?"
**你的回答：** "Three things: citation-first architecture, multi-document synthesis, and enterprise-grade trust. A general LLM might give you a plausible-sounding answer about a covenant, but without pinpointing the exact clause and page number. Hebbia's value is that every output is traceable back to the source — which is non-negotiable in finance. My prototype mimics this by requiring exact citations for every extracted field."

### Q9: "What surprised you building this?"
**你的回答：** "How much the restricted payments sections vary in structure across agreements. EBITDA definitions follow a fairly standard pattern — net income plus add-backs. But restricted payments can have anywhere from 6 to 16 baskets, with completely different conditions and thresholds. This means the extraction prompt needs to be much more flexible for RP sections, and it's where human review adds the most value."

### Q10: "Where would this approach fail?"
**你的回答：** "On heavily amended agreements where you need to read the amendment alongside the original to understand the current terms. Also on bespoke structures — some credit agreements have unique provisions that don't fit standard extraction templates. An AI Strategist needs to know these boundaries and design workflows that route edge cases to human analysts rather than trying to automate everything."

---

## Part 7: 3 Sentences That Will Impress Stephan

1. **On your project:** "I built this not to replace what Hebbia does, but to show how I think about deploying AI workflows for credit teams — from document ingestion through structured extraction to cross-agreement benchmarking, with citations at every step."

2. **On your role:** "I see the AI Strategist role as the bridge between what the technology can do and what the analyst actually needs. My job is to understand the workflow deeply enough to know where AI adds value and where it doesn't."

3. **On Hebbia's edge:** "The reason citation-first matters in credit is that a sourced insight is actionable, but an unsourced insight is a liability. That's what separates Hebbia from generic AI tools."
