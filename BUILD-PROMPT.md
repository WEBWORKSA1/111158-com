# Phase-wise build prompt: 111158.com, "The Prosperity Code"

Use these prompts in order with any capable AI coding agent. Each phase is self-contained and ends with acceptance checks.

---

## Phase 0: Global rules (paste first, keep in context)

> You are building **111158.com**, a static, free-to-host (GitHub Pages) prosperity-numbers and business-luck hub. The reading of the number is 要要要要我发, "I am determined to prosper". Stack: Jekyll (GitHub Pages native, no plugins), one layout, one CSS file and one vanilla JS file, with no build step.
>
> **Non-negotiable rules**
> 1. **Top banner on every page**: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership", linked to `https://web.works/contact`.
> 2. **One owner email for all forms and contact.** It must never appear in HTML, text, meta or the repo in plain form. Store it obfuscated (reversed and chunked base64) in JS. Assemble it only at submit or click time. Forms go to a form relay (FormSubmit AJAX). Email links are `data-mail` anchors that build the mailto link on click.
> 3. No trademarks as branding. Use "Singles' Day (11.11)" only as a description, never "Double 11/双十一". Add no 58.com references. All copy is original.
> 4. Mobile-first, meeting WCAG AA contrast, with light and dark themes and Lighthouse scores of at least 90.
> 5. All internal links are relative, so the site works on `*.github.io/111158-com/` and on the custom domain.

## Phase 1: Foundation and design system
- `_config.yml` holds the title, url, baseurl, `adsense_client`, `youtube_channel` and `donate_links` (PayPal, Ko-fi, Buy Me a Coffee), each editable in one place.
- `_layouts/default.html` contains the top interest banner, a sticky header with a mega-nav (Tools · Numbers · Business · Festivals · Videos · Community), a theme toggle, a mobile drawer, and a footer with 4 columns, a newsletter form, and legal and trademark links. It also has the cookie/consent bar, SEO meta, Open Graph and JSON-LD.
- Palette: imperial red `#C8102E`, gold `#D4A017`, ink `#14110F`, rice paper `#FBF7F0`. Fonts: Inter plus Noto Serif SC for the Chinese glyphs.
- Components: hero, cards, stat tiles, chips, verdict badges (green/amber/red), FAQ accordion, tabs, countdown, a labelled ad slot, share bar, toast.
**Accept when:** every page shows the banner, no horizontal scroll at 360px, and the theme persists.

## Phase 2: Interactive tools (the traffic engine)
1. **Prosperity Number Analyzer**: takes any phone, plate, price, address or domain number. It shows digit-by-digit pinyin and homophones, detected combos (168, 158, 518, 58, 88, 888, 520, 1314, 14, 74, 250, 1111…), and a 0–100 score with a verdict. It also has a share button and "email me the full report" (lead capture), and reads a `?n=` URL parameter.
2. **Lucky Price Calculator**: enter a price and get the nearest prosperity prices (…8, …88, 168, 518, 888) above and below it, with the margin impact.
3. **Launch Date Picker**: choose a business type and a date range. It returns the 10 best dates, scored on digit symbolism, weekday and the avoidance of 4, and exports to calendar (.ics).
4. **Zodiac Lucky Numbers**: enter a birth year and get the animal, element, and lucky and unlucky numbers, colours and directions.
5. **Red Envelope (Hongbao) Calculator**: choose the occasion and relationship to get suggested amounts, with no 4s and preferring even and 8-heavy figures.
6. **Shopping-Festival Countdown Calendar**: covers Chinese New Year, Lantern, 520, 618, Qixi, Mid-Autumn, 11.11 and 12.12, with live countdowns and a planning checklist.
**Accept when:** every tool works offline in JS, results appear in under 100 ms, there is an ad slot below each result, and the cultural and entertainment disclaimer is present.

## Phase 3: Content hubs (SEO)
- The Meaning of 111158 (pillar page).
- The Number Meanings library: 0–9 plus more than 40 combos, with search and filter.
- Lucky Numbers for Business (pricing, naming, phone and plate strategy).
- Chinese New Year hub.
- Guides index plus 4 launch articles: the 11.11 numbers playbook, prosperity pricing, the economics of lucky phone numbers and plates, and why Chinese buyers love numeric domains.
- Each page gets a Quick Answer box, a table of contents, FAQ schema, a byline, an updated date, related tools and 2–3 in-content ad slots at most.

## Phase 4: Lead generation (the revenue engine)
- `/growth-consultation`: a **multi-step form** in 3 steps (goal, then business details and budget, then contact) with a progress bar. It offers these services: Chinese-market campaign (CNY/11.11), lucky brand and product naming, launch date selection, vanity number/plate/domain sourcing, and a website or domain partnership. Add a trust strip, a "what you get" list, a FAQ and a response-time promise.
- Lead magnets: "email me my full analyzer report", the Festival Planner, and the newsletter (segmented by interest).
- Exit-intent / scroll-depth slide-in CTA, shown once per session.
**Accept when:** submissions reach the owner inbox through the relay, the success state shows, and there is a honeypot plus a time-trap against spam.

## Phase 5: Monetization and community
- **AdSense**: auto-loaded only when `adsense_client` is set. Slots are labelled "Advertisement" and there are none inside tool inputs. Add `ads.txt`.
- **Videos**: a YouTube hub with topic playlists, lite embeds (click to load) and a subscribe CTA.
- **Support/Donate**: tiers (Supporter, Patron, Founding Sponsor) and the use of funds (operations, promotions, marketing, hiring, contest prizes). A pledge form, buttons for the configured payment links, and a supporter wall.
- **Contests**: "The 111158 Prosperity Challenge", with a prize table, entry form, bonus entries for referral share links, official rules and a winners list.
- **Careers / Talent**: open roles (writer, video editor, SEO, bilingual translator, community manager, ad sales) and an application form.
- **Advertise / Sponsor**: audience, placements, a rate-card request form and the interest banner link.
**Accept when:** every form routes to the relay and the email appears nowhere in the rendered source.

## Phase 6: Trust, legal and compliance
- About, Contact, FAQ, Privacy (AdSense cookies, GDPR/CCPA), Terms, and a **Legal page covering the trademark and copyright disclosure and the disclaimer**. Add a cookie consent bar and a 404 page.
**Accept when:** the footer links all legal pages and the consent choice persists.

## Phase 7: SEO, performance and launch
- `sitemap.xml`, `robots.txt`, canonical tags, Open Graph, JSON-LD (WebSite, Organization, FAQPage, WebApplication for the tools), `manifest.webmanifest` and an SVG favicon.
- GitHub Pages: deploy from the `main` branch root (native Jekyll build, free plan). The custom domain gets a `CNAME` only after DNS is pointed.
- QA: test at 360, 768 and 1280 px, test every tool, grep the repo for the owner email (expect 0 hits), and check links.

## Phase 8: Expansion roadmap
- A Chinese (简体) language version under `/zh/`.
- A premium PDF report and membership (ad-free).
- A UGC Q&A board and an embeddable analyzer widget for other sites (backlinks).
- A number marketplace listing partner inventory (phones, plates, domains).
- Programmatic pages: `/number/NNNN` meaning pages for the top 1,000 searched numbers.
