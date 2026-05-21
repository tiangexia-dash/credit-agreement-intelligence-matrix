"""
Step 1: Parse SEC EDGAR HTML credit agreements into clean text sections.
"""
import re
from bs4 import BeautifulSoup
from pathlib import Path


def html_to_text(html_path: str) -> str:
    with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    for tag in soup(["script", "style", "head"]):
        tag.decompose()

    text = soup.get_text(separator="\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = text.replace("“", '"').replace("”", '"')
    text = text.replace("‘", "'").replace("’", "'")
    text = re.sub(r"\n\s*\n", "\n\n", text)
    text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)
    return text.strip()


def extract_section_last_match(full_text: str, section_pattern: str, max_chars: int = 15000) -> str:
    """Find the LAST substantial match — skips TOC and cross-references."""
    matches = list(re.finditer(section_pattern, full_text, re.IGNORECASE))
    if not matches:
        return ""

    for match in reversed(matches):
        after = full_text[match.end():match.end() + 300]
        if len(after.split()) > 30:
            start = max(0, match.start() - 100)
            return full_text[start : start + max_chars]

    match = matches[-1]
    start = max(0, match.start() - 100)
    return full_text[start : start + max_chars]


def extract_section_substantive(full_text: str, section_pattern: str, max_chars: int = 15000) -> str:
    """Find the match that's followed by the most substantive text (not a TOC entry)."""
    matches = list(re.finditer(section_pattern, full_text, re.IGNORECASE))
    if not matches:
        return ""

    best_match = None
    best_length = 0
    for match in matches:
        after = full_text[match.end():match.end() + 500]
        words = len(after.split())
        if words > best_length:
            best_length = words
            best_match = match

    if best_match:
        start = max(0, best_match.start() - 100)
        return full_text[start : start + max_chars]
    return ""


def extract_key_sections(full_text: str) -> dict[str, str]:
    sections = {}

    sections["ebitda_definition"] = extract_section_substantive(
        full_text,
        r'"\s*Consolidated\s+EBITDA\s*"\s*(means|shall mean)',
        max_chars=10000,
    )

    sections["leverage_ratio"] = extract_section_substantive(
        full_text,
        r"SECTION\s+\d+\.\d+.*?(Leverage|Financial\s+Covenant)|Financial\s+Covenant\s*\.",
        max_chars=10000,
    )
    if not sections["leverage_ratio"]:
        sections["leverage_ratio"] = extract_section_substantive(
            full_text,
            r"(Consolidated\s+)?(Total\s+)?(Net\s+)?Leverage\s+Ratio\s*\.",
            max_chars=8000,
        )

    sections["restricted_payments"] = extract_section_substantive(
        full_text,
        r"\d+\.\d+\.?\s+Restricted\s+Payments.*?\.\s+\(?[a-zA-Z\(]",
        max_chars=12000,
    )
    if not sections["restricted_payments"]:
        sections["restricted_payments"] = extract_section_substantive(
            full_text,
            r"Restricted\s+Payments?\s*\.\s*(Neither|No|The)",
            max_chars=12000,
        )

    sections["interest_coverage"] = extract_section_substantive(
        full_text,
        r"Interest\s+Coverage\s+Ratio|Fixed\s+Charge\s+Coverage",
        max_chars=5000,
    )

    return sections


if __name__ == "__main__":
    data_dir = Path(__file__).parent.parent / "data" / "raw"
    output_dir = Path(__file__).parent.parent / "data" / "parsed"
    output_dir.mkdir(exist_ok=True)

    for htm_file in data_dir.glob("*.htm"):
        print(f"\nProcessing {htm_file.name}...")
        full_text = html_to_text(str(htm_file))
        print(f"  Full text: {len(full_text)} chars")

        sections = extract_key_sections(full_text)
        for name, content in sections.items():
            if content:
                out_path = output_dir / f"{htm_file.stem}_{name}.txt"
                out_path.write_text(content)
                print(f"  {name}: {len(content)} chars -> {out_path.name}")
            else:
                print(f"  {name}: NOT FOUND")
