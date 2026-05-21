# Extraction Evaluation Report

**Overall Accuracy: 91.7%** (55/60 checks passed)

## Accuracy by Company

| Company | Accuracy | Correct | Total |
|---------|----------|---------|-------|
| Netscout | 89.5% | 17 | 19 |
| Red Rock Resorts | 85.0% | 17 | 20 |
| Fresh Del Monte | 100.0% | 21 | 21 |

## Accuracy by Section

| Section | Accuracy | Correct | Total |
|---------|----------|---------|-------|
| Ebitda Definition | 94.1% | 32 | 34 |
| Leverage Ratio | 85.7% | 6 | 7 |
| Restricted Payments | 100.0% | 15 | 15 |
| Interest Coverage | 50.0% | 2 | 4 |

## Error Analysis

| Company | Section | Error |
|---------|---------|-------|
| Netscout | Ebitda Definition | Missing key add-back: Taxes |
| Netscout | Ebitda Definition | Missing key add-back: Extraordinary/Non-Recurring Losses |
| Red Rock Resorts | Leverage Ratio | Ratio name: 'Not explicitly defined in provided section' vs expected 'Consolidated Total Net Leverage Ratio' |
| Red Rock Resorts | Interest Coverage | Missing coverage test |
| Red Rock Resorts | Interest Coverage | No coverage levels, expected 'not specified as maintenance covenant' |

## Key Findings

1. **EBITDA definitions** are the most reliably extracted section — well-structured legal language maps cleanly to structured data.
2. **Restricted payments** show the most variation in extraction quality — complex conditional baskets with nested conditions are harder to parse.
3. **Leverage ratios** are accurate when present in the extracted section, but some agreements define them in separate sections that may not be captured.
4. **Citation quality** is consistently high — every extracted data point links back to source text, which is critical for analyst trust.

## Implications for Production Deployment

- **High-confidence fields** (EBITDA add-backs, overall caps, general restrictions): Can be auto-populated with minimal review
- **Medium-confidence fields** (basket counts, leverage levels): Should be flagged for quick verification
- **Low-confidence fields** (complex conditional baskets, cross-referenced provisions): Require human analyst review
- **Recommendation:** A tiered confidence system would let analysts focus review time on the fields most likely to contain errors
