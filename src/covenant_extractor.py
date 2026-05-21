"""
Step 2: Use Claude to extract structured covenant data from credit agreement sections.
"""
import json
import time
from pathlib import Path

from dotenv import load_dotenv

import os
os.environ.pop("ANTHROPIC_AUTH_TOKEN", None)
os.environ.pop("ANTHROPIC_BASE_URL", None)
load_dotenv(Path(__file__).parent.parent / ".env", override=True)

import anthropic

client = anthropic.Anthropic()

EXTRACTION_PROMPT = """You are a credit analyst extracting covenant terms from a leveraged loan credit agreement.

Given the following section from a credit agreement, extract the requested information in structured JSON format.
For EVERY piece of information you extract, include the EXACT quote from the source text that supports it (verbatim, not paraphrased).

Section text:
<section>
{section_text}
</section>

Extract the following and return as JSON:
{extraction_instructions}

Return ONLY valid JSON. No markdown code fences, no explanation, no text before or after the JSON."""

EBITDA_INSTRUCTIONS = """{
  "ebitda_base_definition": "What is Consolidated EBITDA defined as starting from? (e.g., Consolidated Net Income plus...)",
  "ebitda_base_citation": "exact quote from text",
  "addbacks": [
    {
      "category": "name of addback category",
      "description": "what is added back",
      "cap_or_limit": "any cap or percentage limit on this addback, or 'None'",
      "citation": "exact quote from text"
    }
  ],
  "exclusions_or_deductions": [
    {
      "description": "what is excluded or deducted",
      "citation": "exact quote from text"
    }
  ],
  "overall_addback_cap": "any overall cap on total addbacks (e.g., '25% of EBITDA'), or 'None'",
  "overall_addback_cap_citation": "exact quote or 'N/A'"
}"""

LEVERAGE_INSTRUCTIONS = """{
  "ratio_name": "exact name of the ratio (e.g., Consolidated Total Net Leverage Ratio)",
  "ratio_definition": "how the ratio is calculated (numerator / denominator)",
  "ratio_definition_citation": "exact quote from text",
  "covenant_levels": [
    {
      "period": "time period or fiscal quarter",
      "maximum_ratio": "the maximum permitted ratio (e.g., 5.00:1.00)",
      "citation": "exact quote from text"
    }
  ],
  "step_downs": "description of how covenant levels change over time, or 'None'",
  "acquisition_adjustment": "any temporary increase allowed after acquisitions, or 'None'",
  "acquisition_adjustment_citation": "exact quote or 'N/A'"
}"""

RESTRICTED_PAYMENTS_INSTRUCTIONS = """{
  "general_restriction": "is there a general prohibition on restricted payments? describe",
  "general_restriction_citation": "exact quote from text",
  "permitted_baskets": [
    {
      "basket_name": "name or type of permitted basket",
      "conditions": "conditions that must be met to use this basket",
      "dollar_cap": "dollar amount cap if any, or 'None'",
      "leverage_test": "any leverage ratio test required, or 'None'",
      "citation": "exact quote from text"
    }
  ],
  "builder_basket": "is there a cumulative credit / builder basket? describe amount and conditions, or 'None'",
  "builder_basket_citation": "exact quote or 'N/A'"
}"""

INTEREST_COVERAGE_INSTRUCTIONS = """{
  "ratio_name": "exact name (e.g., Interest Coverage Ratio, Fixed Charge Coverage Ratio)",
  "ratio_definition": "how calculated (numerator / denominator)",
  "ratio_definition_citation": "exact quote from text",
  "covenant_levels": [
    {
      "period": "time period",
      "minimum_ratio": "the minimum required ratio",
      "citation": "exact quote from text"
    }
  ]
}"""

SECTION_CONFIG = {
    "ebitda_definition": EBITDA_INSTRUCTIONS,
    "leverage_ratio": LEVERAGE_INSTRUCTIONS,
    "restricted_payments": RESTRICTED_PAYMENTS_INSTRUCTIONS,
    "interest_coverage": INTEREST_COVERAGE_INSTRUCTIONS,
}


def extract_covenant(section_text: str, section_type: str) -> dict:
    instructions = SECTION_CONFIG[section_type]
    prompt = EXTRACTION_PROMPT.format(
        section_text=section_text[:12000],
        extraction_instructions=instructions,
    )

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1].rsplit("```", 1)[0]

    return json.loads(raw)


def process_all():
    parsed_dir = Path(__file__).parent.parent / "data" / "parsed"
    output_dir = Path(__file__).parent.parent / "output" / "extractions"
    output_dir.mkdir(parents=True, exist_ok=True)

    companies = ["netscout", "red_rock_resorts", "fresh_del_monte"]

    for company in companies:
        print(f"\n{'='*60}")
        print(f"Processing: {company}")
        print(f"{'='*60}")

        company_results = {}
        for section_type in SECTION_CONFIG:
            section_file = parsed_dir / f"{company}_{section_type}.txt"
            if not section_file.exists():
                print(f"  {section_type}: skipped (no file)")
                continue

            section_text = section_file.read_text()
            print(f"  {section_type}: extracting ({len(section_text)} chars)...")

            try:
                result = extract_covenant(section_text, section_type)
                company_results[section_type] = result
                print(f"  {section_type}: done")
            except Exception as e:
                print(f"  {section_type}: ERROR - {e}")
                company_results[section_type] = {"error": str(e)}

            time.sleep(1)

        out_path = output_dir / f"{company}.json"
        with open(out_path, "w") as f:
            json.dump(company_results, f, indent=2)
        print(f"  -> saved to {out_path}")


if __name__ == "__main__":
    process_all()
