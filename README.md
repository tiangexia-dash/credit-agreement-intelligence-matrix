# Credit Agreement Intelligence Matrix

An AI-powered covenant extraction and cross-agreement benchmarking prototype for leveraged loan credit agreements. Built as a demonstration of how Hebbia's citation-first architecture can transform credit analysis workflows.

## What This Does

Credit analysts at firms like Hayfin Capital, BlackRock, and KKR spend 6-8 hours manually reading 200-400 page credit agreements to extract covenant terms. This prototype automates the extraction in under 2 minutes with full source traceability.

### Pipeline

```
SEC EDGAR HTML Filing
        │
        ▼
┌─────────────────┐
│  1. Parse & Extract  │  extract_text.py — HTML → clean text, regex-based section isolation
│     Key Sections     │  (EBITDA definitions, leverage covenants, restricted payments)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. LLM Extraction   │  covenant_extractor.py — Claude API → structured JSON with citations
│     with Citations   │  (every data point linked to exact source text)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. Cross-Agreement  │  comparison_matrix.py — borrower-friendliness scoring,
│     Comparison       │  side-by-side covenant benchmarking across agreements
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. Evaluation       │  evaluation.py — accuracy measurement against manual
│     Framework        │  ground truth annotations (91.7% overall accuracy)
└─────────────────┘
```

### Sample Agreements Analyzed

| Company | Industry | Filing | Key Characteristics |
|---------|----------|--------|-------------------|
| **NETSCOUT Systems** | Technology | SEC EDGAR | Covenant-lite, 13 EBITDA add-backs capped at 25%, $300M accelerated buyback |
| **Red Rock Resorts** | Gaming/Hospitality | SEC EDGAR | 16 RP baskets, synergy add-backs, $120M/year unrestricted basket |
| **Fresh Del Monte** | Food/Agriculture | SEC EDGAR | Traditional structure, 7 uncapped add-backs, 3.75x maintenance leverage |

## Key Findings

1. **Borrower-Friendliness Spectrum:** Red Rock (6/9) > NETSCOUT (4/9) > Fresh Del Monte (2/9)
2. **EBITDA Add-back Trade-off:** Del Monte has fewer categories (7) but no cap vs. NETSCOUT/Red Rock with more categories (13) but a 25% cap — fundamentally different risk profiles
3. **Extraction Accuracy:** 91.7% overall, with EBITDA definitions (94.1%) being most reliable and interest coverage (50%) being most challenging

## Project Structure

```
hebbia-project/
├── src/
│   ├── extract_text.py          # HTML parsing and section extraction
│   ├── covenant_extractor.py    # LLM-based structured extraction
│   ├── comparison_matrix.py     # Cross-agreement comparison
│   └── evaluation.py            # Accuracy evaluation framework
├── data/
│   ├── raw/                     # SEC EDGAR HTML filings
│   └── parsed/                  # Extracted text sections
├── output/
│   ├── extractions/             # Structured JSON extraction results
│   ├── comparison_matrix.md     # Cross-agreement comparison report
│   ├── comparison_matrix.json   # Structured comparison data
│   └── evaluation/              # Evaluation reports
├── requirements.txt
└── .env                         # API key (not committed)
```

## Setup

```bash
pip install -r requirements.txt
echo "ANTHROPIC_API_KEY=your-key-here" > .env
```

## Run

```bash
# Step 1: Parse SEC filings
python src/extract_text.py

# Step 2: Extract covenants
python src/covenant_extractor.py

# Step 3: Generate comparison matrix
python src/comparison_matrix.py

# Step 4: Run evaluation
python src/evaluation.py
```

## Why This Matters for Hebbia

This prototype demonstrates the AI Strategist workflow: understanding the domain deeply enough to build extraction templates, knowing where AI excels (structured EBITDA definitions) vs. where human review is critical (complex conditional RP baskets), and designing evaluation frameworks that build client trust.

The citation-first approach — every extracted field linked to exact source text — mirrors Hebbia's core architecture and is non-negotiable in financial services where an unsourced insight is a liability.

## Built With

- **Claude API** (Haiku 4.5) for structured extraction
- **BeautifulSoup** for HTML parsing
- **SEC EDGAR** as data source
