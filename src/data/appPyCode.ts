export const APP_PY_SOURCE_CODE = `import io
import re
import time
from urllib.parse import urlparse, parse_qs, unquote

import streamlit as st
from ddgs import DDGS
from pypdf import PdfReader
from docx import Document

st.set_page_config(
    page_title="Direct Employer AI Job Search",
    page_icon="🔎",
    layout="wide",
)

st.title("🔎 Direct Employer Job Search Agent")
st.caption(
    "Upload your CV. Find employer career pages and direct job postings "
    "in Vietnam and worldwide."
)

# Exclude common third-party recruitment sites.
# Add more domains here as needed.
BLOCKED_DOMAINS = {
    "linkedin.com",
    "indeed.com",
    "glassdoor.com",
    "monster.com",
    "ziprecruiter.com",
    "careerbuilder.com",
    "jooble.org",
    "jobstreet.com",
    "vietnamworks.com",
    "topcv.vn",
    "vieclam24h.vn",
    "timviecnhanh.com",
    "robertwalters.com",
    "michaelpage.com",
    "hays.com",
    "randstad.com",
    "manpower.com",
    "adecco.com",
    "recruit.net",
}

JOB_TERMS = [
    "engineer", "technician", "developer", "analyst",
    "manager", "designer", "accountant", "operator",
    "researcher", "consultant", "specialist", "supervisor",
    "sales", "marketing", "data", "software", "mechanical",
    "electrical", "construction", "production", "quality",
    "logistics", "supply chain", "project", "AI",
]

def extract_text(uploaded_file):
    """Read the uploaded CV locally; do not upload it to a search engine."""
    name = uploaded_file.name.lower()
    raw = uploaded_file.getvalue()

    if name.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(raw))
        return "\\n".join(page.extract_text() or "" for page in reader.pages)

    if name.endswith(".docx"):
        doc = Document(io.BytesIO(raw))
        parts = [p.text for p in doc.paragraphs]
        for table in doc.tables:
            for row in table.rows:
                parts.append(" ".join(cell.text for cell in row.cells))
        return "\\n".join(parts)

    if name.endswith(".txt"):
        return raw.decode("utf-8", errors="replace")

    raise ValueError("Please upload a PDF, DOCX or TXT file.")

def extract_keywords(cv_text, extra_keywords):
    text = cv_text.lower()
    found = []

    for term in JOB_TERMS:
        if re.search(r"\\b" + re.escape(term.lower()) + r"\\b", text):
            found.append(term)

    # Include user-provided keywords, which can be more precise
    # than automatically extracted keywords.
    for term in extra_keywords.split(","):
        term = term.strip()
        if term and term.lower() not in [x.lower() for x in found]:
            found.append(term)

    return found[:15]

def get_domain(url):
    try:
        return (urlparse(url).hostname or "").lower().removeprefix("www.")
    except Exception:
        return ""

def is_blocked(url):
    domain = get_domain(url)
    return any(
        domain == blocked or domain.endswith("." + blocked)
        for blocked in BLOCKED_DOMAINS
    )

def make_google_url(query):
    from urllib.parse import quote_plus
    return f"https://www.google.com/search?q={quote_plus(query)}"

def make_searches(role, location, skills, domains):
    # Common expressions used in public job advertisements.
    phrases = {
        "Vietnamese - recruitment": [
            '"cần tuyển"',
            '"đang tuyển dụng"',
            '"tuyển gấp"',
            '"tuyển nhân viên"',
            '"tìm nhân sự"',
            '"tìm ứng viên"',
            '"thông báo tuyển dụng"',
            '"việc làm"',
            '"cơ hội việc làm"',
            '"tuyển dụng nhân sự"',
            '"cần người làm"',
            '"tuyển kỹ thuật viên"',
        ],
        "English - recruitment": [
            '"we are hiring"',
            '"now hiring"',
            '"actively recruiting"',
            '"job opening"',
            '"career opportunities"',
            '"vacancy"',
            '"vacancies"',
            '"looking for candidates"',
            '"recruitment"',
            '"staff wanted"',
            '"join our team"',
            '"open position"',
        ],
    }

    skill_text = " ".join(skills[:6])
    searches = []

    # Google search results may include public indexed pages,
    # but do not expose other users' private browser histories.
    for label, terms in phrases.items():
        for phrase in terms:
            query = (
                f'{phrase} "{role}" {location} '
                f'{skill_text} '
                f'(careers OR jobs OR tuyển dụng)'
            )
            searches.append(
                (f"{label}: {phrase}", make_google_url(query))
            )

    # Prioritize official employer domains supplied by the user.
    for raw_domain in domains:
        domain = raw_domain.strip().lower()
        domain = re.sub(r"^https?://", "", domain)
        domain = domain.split("/")[0]

        if domain and "." in domain and " " not in domain:
            query = (
                f'site:{domain} "{role}" '
                f'(jobs OR careers OR tuyển dụng OR vacancy)'
            )
            searches.append(
                (f"Employer website: {domain}",
                 make_google_url(query))
            )

    # Add broader role + skills searches.
    searches.append((
        "Similar jobs - broad search",
        make_google_url(
            f'"{role}" ({skill_text}) '
            f'(hiring OR recruitment OR "cần tuyển" OR "tuyển gấp") '
            f'{location}'
        ),
    ))

    return searches

def search_direct_jobs(keywords, region, max_results):
    results = []
    seen = set()

    region_query = {
        "Vietnam": '(Vietnam OR "Ho Chi Minh City" OR Hanoi OR Da Nang)',
        "Worldwide": '(global OR international OR worldwide)',
        "Both": '(Vietnam OR Hanoi OR "Ho Chi Minh City" OR global)',
    }[region]

    # Focus on company-owned career pages and employer job postings.
    query_templates = [
        '("{keyword}") (careers OR jobs OR vacancies) {region}',
        '("{keyword}") ("join our team" OR "open positions") {region}',
        '("{keyword}") ("career opportunities") {region}',
    ]

    with DDGS() as ddgs:
        for keyword in keywords[:6]:
            for template in query_templates:
                query = template.format(
                    keyword=keyword,
                    region=region_query,
                )

                try:
                    hits = ddgs.text(
                        query,
                        max_results=max_results,
                    )

                    for hit in hits:
                        url = hit.get("href", "")
                        title = hit.get("title", "")
                        snippet = hit.get("body", "")

                        if not url.startswith(("http://", "https://")):
                            continue
                        if is_blocked(url):
                            continue
                        if url in seen:
                            continue

                        seen.add(url)
                        results.append({
                            "title": title,
                            "url": url,
                            "domain": get_domain(url),
                            "snippet": snippet,
                            "keyword": keyword,
                            "region": region,
                            "checked_at": time.strftime(
                                "%Y-%m-%d %H:%M UTC",
                                time.gmtime(),
                            ),
                        })

                        if len(results) >= 100:
                            return results

                    time.sleep(0.3)

                except Exception as exc:
                    st.warning(
                        f"Search issue for '{keyword}': {exc}"
                    )

    return results

with st.sidebar:
    st.header("Search settings")

    region = st.selectbox(
        "Target market",
        ["Both", "Vietnam", "Worldwide"],
    )

    extra_keywords = st.text_input(
        "Skills or job titles, comma-separated",
        placeholder="Python, AutoCAD, project engineer",
    )

    employer_domains = st.text_area(
        "Employer websites to prioritize (comma or newline separated)",
        placeholder="fpt.com, viettel.com.vn, vinfastauto.com",
        help="Target direct employer career portals and skip recruitment aggregators."
    )

    max_results = st.slider(
        "Results per search query",
        min_value=5,
        max_value=20,
        value=10,
    )

    st.caption(
        "Search results are leads, not verified vacancies. "
        "Confirm the job on the employer's own website."
    )

cv_file = st.file_uploader(
    "Upload your CV",
    type=["pdf", "docx", "txt"],
)

if cv_file:
    try:
        cv_text = extract_text(cv_file)

        if not cv_text.strip():
            st.error(
                "No readable text was found. "
                "For a scanned PDF, use OCR first."
            )
            st.stop()

        keywords = extract_keywords(cv_text, extra_keywords)

        st.subheader("CV analysis")
        st.write(f"Characters extracted: {len(cv_text):,}")

        if keywords:
            st.write("Detected search keywords:", ", ".join(keywords))

            # Direct recruitment search phrases generator (Google & Direct Employer Sites)
            role_hint = keywords[0] if keywords else "Chuyên viên"
            location_hint = "Việt Nam" if region != "Worldwide" else "global"
            domain_list = [d.strip() for d in re.split(r"[,\\n]+", employer_domains) if d.strip()]

            with st.expander("🔗 Direct Employer Google Search Queries (Vietnamese & English Phrases)", expanded=False):
                direct_searches = make_searches(role_hint, location_hint, keywords, domain_list)
                st.caption(f"Generated {len(direct_searches)} direct recruitment search query URLs:")
                for label, url in direct_searches[:15]:
                    st.markdown(f"- **{label}:** [Open Google Search ↗]({url})")
        else:
            st.warning(
                "No keywords detected. Enter skills or job titles "
                "in the sidebar."
            )

        if st.button("Search direct employers", type="primary"):
            if not keywords:
                st.error(
                    "Enter at least one skill or job title "
                    "in the sidebar."
                )
            else:
                with st.spinner(
                    "Searching public web results..."
                ):
                    results = search_direct_jobs(
                        keywords,
                        region,
                        max_results,
                    )

                st.session_state["job_results"] = results

                if not results:
                    st.warning(
                        "No results found. Try broader keywords "
                        "or another target market."
                    )

    except Exception as exc:
        st.error(f"Could not read the CV: {exc}")

results = st.session_state.get("job_results", [])

if results:
    st.subheader(f"Search results: {len(results)}")

    for item in results:
        st.markdown(f"### {item['title'] or 'Untitled result'}")
        st.write(f"**Website:** {item['domain']}")
        st.write(f"**Matched keyword:** {item['keyword']}")
        st.write(item["snippet"])
        st.markdown(f"[Open original result]({item['url']})")
        st.divider()

    import pandas as pd

    export_data = [
        {
            "Job or page title": x["title"],
            "Website domain": x["domain"],
            "URL": x["url"],
            "Matched keyword": x["keyword"],
            "Search market": x["region"],
            "Search timestamp": x["checked_at"],
            "Search snippet": x["snippet"],
        }
        for x in results
    ]

    csv_data = pd.DataFrame(export_data).to_csv(
        index=False
    ).encode("utf-8-sig")

    st.download_button(
        "Download search results as CSV",
        data=csv_data,
        file_name="direct_employer_jobs.csv",
        mime="text/csv",
    )

st.caption(
    "Privacy: CV text is processed by this application. "
    "Only search keywords are sent to the search provider. "
    "Search queries and results may be processed by that provider."
)
`;

