# 111158.com — The Prosperity Code

**要要要要我发 ("I am determined to prosper")**: a static, GitHub Pages–hosted hub of Chinese prosperity-number tools, guides and lead generation for businesses.

- `RESEARCH.md`: cultural and economic research, the business decision and the competitor audit
- `BUILD-PROMPT.md`: phase-wise build prompt (Phases 0–8)

## Stack
Jekyll (native to GitHub Pages, no plugins) with one layout (`_layouts/default.html`), one stylesheet and one vanilla JS file. There is no build step and it runs on the free plan.

## Configure (`_config.yml`)
| Key | What |
|---|---|
| `adsense_client` | Your `ca-pub-…` ID. Ads load after cookie consent. Also update `ads.txt`. |
| `youtube_channel`, `featured_videos` | Your channel URL and video IDs (lite embeds) |
| `donate.paypal/kofi/buymeacoffee` | Payment links shown on /support.html |
| `interest_url` | Top-banner link (web.works/contact) |

## Forms
Every form posts to a form relay (FormSubmit AJAX). The destination address is **never in the HTML**. It is assembled at runtime from an obfuscated value in `assets/js/main.js`.
1. Submit any form once on the live site. The relay sends a one-time **activation email** to the owner inbox. Click it.
2. Optional hardening: the relay then provides a random alias. Paste it into `RELAY_ALIAS` in `main.js` so the address is never used in requests either.

## Hosting
GitHub Pages builds the Jekyll site straight from the branch. One-time setup: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)` → Save**. The site goes live at https://webworksa1.github.io/111158-com/ in about a minute.

### Custom domain (111158.com)
1. DNS: `A` records to 185.199.108.153, .109.153, .110.153, .111.153, plus `CNAME www` pointing to `webworksa1.github.io`
2. In `_config.yml` set `url: "https://111158.com"` and `baseurl: ""`
3. In Settings → Pages, set the custom domain to `111158.com` and enable **Enforce HTTPS**

© 2026 111158.com. All rights reserved. See `legal.html`.
