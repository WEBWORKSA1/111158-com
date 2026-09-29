/* 111158 — The Prosperity Code · main.js (vanilla, no dependencies) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function toast(msg) { var t = $('#toast'); if (!t) return; t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 3200); }

  /* ---------- Contact routing (owner address is never in the markup) ---------- */
  var _k = ['=02bj5Cbp', 'FWbnBUMhN3', 'ay92diV2d'];
  function inbox() { return atob(_k.join('').split('').reverse().join('')); }
  // Optional: after activating the form relay, replace with the random alias it gives you (keeps the address out of requests too)
  var RELAY_ALIAS = '';
  function relayURL() { return 'https://formsubmit.co/ajax/' + (RELAY_ALIAS || inbox()); }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-mail]');
    if (!a) return;
    e.preventDefault();
    var subj = a.getAttribute('data-mail') || 'Inquiry from 111158.com';
    window.location.href = 'mailto:' + inbox() + '?subject=' + encodeURIComponent(subj);
  });

  /* ---------- Theme ---------- */
  var tt = $('#themeToggle');
  if (tt) tt.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    if (!cur) cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var nx = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nx); store.set('theme', nx);
  });

  /* ---------- Nav ---------- */
  var mt = $('#menuToggle'), nav = $('.main-nav'), header = $('.site-header');
  if (mt) mt.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    mt.setAttribute('aria-expanded', open); mt.textContent = open ? '✕' : '☰';
    if (open) nav.style.top = header.getBoundingClientRect().bottom + 'px';
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('.has-menu > .nav-link').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = b.parentNode, o = p.classList.toggle('open'); b.setAttribute('aria-expanded', o);
    });
  });
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Consent + AdSense ---------- */
  var consent = $('#consent'), c = store.get('consent');
  function loadAds() {
    var m = document.querySelector('meta[name="adsense-client"]');
    if (!m || !m.content) return;
    var s = document.createElement('script'); s.async = true; s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + m.content;
    document.head.appendChild(s);
    $$('[data-ad]').forEach(function (slot) {
      slot.classList.add('live'); slot.innerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-client="' + m.content + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  }
  if (!c && consent) consent.hidden = false;
  if (c === 'all') loadAds();
  $$('[data-consent]').forEach(function (b) {
    b.addEventListener('click', function () { var v = b.getAttribute('data-consent'); store.set('consent', v); consent.hidden = true; if (v === 'all') loadAds(); });
  });

  /* ---------- Slide-in CTA (once per session, after 45% scroll) ---------- */
  var si = $('#slidein');
  if (si && !store.sget('si') && !document.body.classList.contains('no-slidein')) {
    var onS = function () {
      var h = document.documentElement; var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight || 1);
      if (pct > 0.45) { si.hidden = false; store.sset('si', 1); window.removeEventListener('scroll', onS); }
    };
    window.addEventListener('scroll', onS, { passive: true });
    $('.close', si).addEventListener('click', function () { si.hidden = true; });
  }

  /* ---------- Forms (relay, honeypot, time-trap) ---------- */
  var loadedAt = Date.now();
  $$('form[data-form]').forEach(function (f) {
    var hp = document.createElement('input'); hp.type = 'text'; hp.name = '_honey'; hp.className = 'hp'; hp.tabIndex = -1; hp.setAttribute('autocomplete', 'off'); hp.setAttribute('aria-hidden', 'true'); f.appendChild(hp);
    var msg = document.createElement('div'); msg.className = 'form-msg'; msg.setAttribute('role', 'status'); f.appendChild(msg);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.querySelector('.step') && !validateStep(f)) return;
      if (hp.value) return;
      if (Date.now() - loadedAt < 2500) { msg.className = 'form-msg err'; msg.textContent = 'Please take a moment to review, then submit again.'; return; }
      var data = {}; new FormData(f).forEach(function (v, k) { if (k === '_honey') return; data[k] = data[k] ? data[k] + ', ' + v : v; });
      data._subject = '[111158.com] ' + (f.getAttribute('data-form') || 'form') + ' submission';
      data._template = 'table'; data._captcha = 'false';
      data.page = location.href;
      var extra = f.getAttribute('data-extra'); if (extra && window[extra]) data.details = window[extra]();
      var btn = f.querySelector('[type=submit]'); var bt = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }
      fetch(relayURL(), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === 'false' || j.success === false) throw new Error(j.message || 'fail'); }); })
        .then(function () {
          msg.className = 'form-msg ok'; msg.textContent = f.getAttribute('data-success') || 'Thank you! We received your message.';
          f.reset(); if (f.querySelector('.step')) goStep(f, 0);
          toast('✅ Sent — thank you!');
        })
        .catch(function () {
          msg.className = 'form-msg err';
          msg.innerHTML = 'Sorry, the form could not be sent right now. Please <a href="#" data-mail="' + esc(data._subject) + '">email us directly</a>.';
        })
        .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = bt; } });
    });
  });

  /* ---------- Multi-step forms ---------- */
  function goStep(f, i) {
    var steps = $$('.step', f); steps.forEach(function (s, j) { s.classList.toggle('active', j === i); });
    f._step = i; var bar = $('.progress i', f); if (bar) bar.style.width = ((i + 1) / steps.length * 100) + '%';
    var lab = $('[data-steplabel]', f); if (lab) lab.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
  }
  function validateStep(f) {
    var s = $$('.step', f)[f._step || 0]; var ok = true;
    $$('input,select,textarea', s).forEach(function (el) { if (ok && !el.checkValidity()) { el.reportValidity(); ok = false; } });
    return ok;
  }
  $$('form[data-steps]').forEach(function (f) {
    goStep(f, 0);
    $$('[data-next]', f).forEach(function (b) { b.addEventListener('click', function () { if (validateStep(f)) goStep(f, (f._step || 0) + 1); }); });
    $$('[data-prev]', f).forEach(function (b) { b.addEventListener('click', function () { goStep(f, Math.max(0, (f._step || 0) - 1)); }); });
  });
  // prefill service from ?service=
  var qs = new URLSearchParams(location.search);
  if (qs.get('service')) { var r = document.querySelector('input[name="service"][value="' + CSS.escape(qs.get('service')) + '"]'); if (r) r.checked = true; }

  /* ---------- Share ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-share]'); if (!b) return;
    var text = b.getAttribute('data-share-text') || document.title; var url = b.getAttribute('data-share-url') || location.href;
    var net = b.getAttribute('data-share');
    if (net === 'native' && navigator.share) { navigator.share({ title: document.title, text: text, url: url }).catch(function () {}); return; }
    var u = { x: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url),
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
      whatsapp: 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + url),
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url) }[net];
    if (u) { window.open(u, '_blank', 'noopener,width=640,height=560'); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast('🔗 Link copied'); });
  });

  /* ---------- Lite YouTube ---------- */
  $$('.video[data-id]').forEach(function (v) {
    var id = v.getAttribute('data-id');
    v.innerHTML = '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/hqdefault.jpg"><span class="play">▶</span>';
    v.addEventListener('click', function () { v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe>'; });
  });

  /* ================= NUMBER ENGINE ================= */
  var D = {
    '0': { py: 'líng', zh: '零', hz: '灵 / 圆', m: 'Wholeness, a clean start', s: 1 },
    '1': { py: 'yī / yāo', zh: '一', hz: '要 (want / will)', m: 'Ambition, being first, will', s: 1 },
    '2': { py: 'èr', zh: '二', hz: '易 / 双 (easy, pair)', m: 'Good things come in pairs', s: 2 },
    '3': { py: 'sān', zh: '三', hz: '生 (life, growth)', m: 'Growth and vitality', s: 1 },
    '4': { py: 'sì', zh: '四', hz: '死 (death)', m: 'Widely avoided', s: -6 },
    '5': { py: 'wǔ', zh: '五', hz: '我 / 无 (me / none)', m: '"I" — context decides', s: 0 },
    '6': { py: 'liù', zh: '六', hz: '流 / 顺 (flow, smooth)', m: 'Smooth business, things go well', s: 4 },
    '7': { py: 'qī', zh: '七', hz: '起 / 气 (rise / anger)', m: 'Mixed: rising or upset', s: 0 },
    '8': { py: 'bā', zh: '八', hz: '发 (prosper)', m: 'Wealth and prosperity — the luckiest digit', s: 6 },
    '9': { py: 'jiǔ', zh: '九', hz: '久 (long-lasting)', m: 'Longevity, lasting success', s: 4 }
  };
  var COMBOS = [
    ['111158', 10, '要要要要我发', 'I am determined to prosper'], ['5201314', 4, '我爱你一生一世', 'I love you for a lifetime'],
    ['8888', 10, '发发发发', 'Prosperity squared'], ['1688', 8, '一路发发', 'Prosper all the way'], ['6868', 6, '路发路发', 'Prosperity along every road'],
    ['1314', 4, '一生一世', 'For a lifetime'], ['1111', 3, '四个一', 'Four ones — all-in ambition; also Singles’ Day (11.11)'],
    ['3344', 2, '生生世世', 'Forever and ever'], ['5918', 5, '我就要发', 'I am about to prosper'],
    ['888', 8, '发发发', 'Triple prosperity'], ['666', 6, '六六六', 'Awesome; everything flows'], ['999', 5, '久久久', 'Forever lasting'],
    ['168', 8, '一路发', 'Fortune all the way'], ['158', 7, '要我发', 'I will prosper'], ['518', 7, '我要发', 'I want to prosper'],
    ['918', 4, '就要发', 'About to prosper'], ['520', 4, '我爱你', 'I love you'], ['748', -6, '去死吧', 'Go die (very negative)'],
    ['514', -5, '我要死', 'I will die (negative)'], ['250', -4, '二百五', 'A fool (insult)'],
    ['88', 6, '发发', 'Double prosperity; also "bye-bye"'], ['66', 4, '六六大顺', 'Everything goes smoothly'], ['99', 4, '久久', 'Long-lasting'],
    ['58', 4, '我发', 'I prosper'], ['18', 3, '要发', 'Will prosper'], ['28', 3, '易发', 'Easy prosperity (Cantonese favourite)'],
    ['68', 3, '路发', 'Road to wealth'], ['98', 2, '久发', 'Lasting prosperity'], ['16', 2, '一路', 'All the way'],
    ['14', -5, '要死', 'Will die (avoid)'], ['74', -5, '气死', 'Furious (avoid)'], ['54', -5, '我死', 'I die (avoid)'], ['94', -3, '就死', 'Then die (avoid)'],
    ['38', 0, '三八', 'Women’s Day, but also mild slang insult']
  ];
  function analyze(raw) {
    var n = String(raw).replace(/\D/g, '');
    if (!n) return null;
    var sum = 0; var digits = n.split('').map(function (d) { sum += D[d].s; return d; });
    var found = []; var seen = {};
    COMBOS.forEach(function (c) { if (n.indexOf(c[0]) > -1 && !seen[c[0]]) { seen[c[0]] = 1; found.push(c); } });
    // collapse sub-combos contained inside larger positive found combos to avoid double counting noise (keep, but weight smaller)
    var comboSum = found.reduce(function (a, c) { return a + c[1]; }, 0);
    var avg = sum / n.length;
    var fours = (n.match(/4/g) || []).length, eights = (n.match(/8/g) || []).length;
    var score = 50 + avg * 5 + comboSum * 2 - (fours ? 6 : 0) + (n.slice(-1) === '8' ? 4 : 0);
    if (/(\d)\1\1/.test(n) && !/444/.test(n)) score += 4; // repeating runs are prized
    score = Math.max(1, Math.min(99, Math.round(score)));
    var v = score >= 80 ? ['Highly auspicious', 'v-good'] : score >= 62 ? ['Auspicious', 'v-good'] : score >= 45 ? ['Neutral', 'v-mid'] : score >= 30 ? ['Mixed', 'v-mid'] : ['Inauspicious', 'v-bad'];
    return { n: n, digits: digits, combos: found, score: score, verdict: v, fours: fours, eights: eights };
  }
  window.P111158 = { analyze: analyze, D: D, COMBOS: COMBOS };

  function renderAnalysis(a, el) {
    var ring = a.score >= 62 ? 'var(--good)' : a.score >= 30 ? 'var(--mid)' : 'var(--bad)';
    var tips = [];
    if (a.fours) tips.push('Contains ' + a.fours + '× digit 4 (sounds like 死). For a business line or plate, look for an alternative without 4.');
    if (a.eights >= 2) tips.push('Strong 8 presence (发, prosper) — this is a premium-feeling number.');
    if (a.n.slice(-1) === '8') tips.push('Ends in 8 — ending on prosperity is considered especially good.');
    if (!a.combos.length) tips.push('No famous combinations detected. Try adding 8, 6 or 9, or a combo like 168 / 518.');
    var html = '<div class="grid g2" style="align-items:center"><div class="center"><div class="score-ring" style="--p:' + a.score + ';--c:' + ring + '"><div><div><b>' + a.score + '</b><small>/ 100</small></div></div></div>' +
      '<p class="mt2"><span class="verdict ' + a.verdict[1] + '">' + a.verdict[0] + '</span></p></div>' +
      '<div><h3 class="mt0">Reading for <span class="red">' + esc(a.n) + '</span></h3>' + (a.combos.length ? '<div class="list-res">' + a.combos.map(function (c) {
        return '<div class="item"><span><b>' + c[0] + '</b> <span class="zh">' + c[2] + '</span><br><small class="muted">' + esc(c[3]) + '</small></span><span class="pill ' + (c[1] > 0 ? 'v-good' : c[1] < 0 ? 'v-bad' : 'v-mid') + '">' + (c[1] > 0 ? 'Lucky' : c[1] < 0 ? 'Avoid' : 'Mixed') + '</span></div>';
      }).join('') + '</div>' : '<p class="muted">No well-known combinations found.</p>') + '</div></div>' +
      '<div class="digits">' + a.digits.map(function (d) { var x = D[d]; return '<div class="digit ' + (x.s >= 2 ? 'good' : x.s < 0 ? 'bad' : 'mid') + '"><b>' + d + '</b><span class="zh">' + x.zh + '</span><small>' + x.py + '</small><small>' + x.hz + '</small></div>'; }).join('') + '</div>' +
      '<ul class="ticks">' + tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<div class="share"><button class="chip" data-share="native" data-share-text="My number ' + a.n + ' scored ' + a.score + '/100 on the 111158 Prosperity Analyzer">📤 Share</button><button class="chip" data-share="whatsapp" data-share-text="My number ' + a.n + ' scored ' + a.score + '/100 🧧">WhatsApp</button><button class="chip" data-share="x" data-share-text="My number ' + a.n + ' scored ' + a.score + '/100 on the Prosperity Analyzer">X</button><button class="chip" data-share="copy">🔗 Copy link</button></div>';
    el.innerHTML = html; el.classList.add('show');
  }

  var af = $('#analyzerForm');
  if (af) {
    var out = $('#analyzerOut'), inp = $('#numInput');
    var run = function (v) {
      var a = analyze(v); if (!a) { toast('Enter a number with at least one digit'); return; }
      renderAnalysis(a, out);
      $$('[data-share]', out).forEach(function (b) { b.setAttribute('data-share-url', location.origin + location.pathname + '?n=' + a.n); });
      var rf = $('#reportForm'); if (rf) { rf.hidden = false; $('input[name=number]', rf).value = a.n + ' (score ' + a.score + ')'; }
      try { history.replaceState(null, '', '?n=' + a.n); } catch (e) {}
    };
    af.addEventListener('submit', function (e) { e.preventDefault(); run(inp.value); });
    $$('[data-try]').forEach(function (c) { c.addEventListener('click', function () { inp.value = c.getAttribute('data-try'); run(inp.value); }); });
    if (qs.get('n')) { inp.value = qs.get('n'); run(inp.value); }
  }

  /* ---------- Lucky price ---------- */
  var pf = $('#priceForm');
  if (pf) pf.addEventListener('submit', function (e) {
    e.preventDefault();
    var p = parseFloat($('#priceIn').value); var cur = $('#priceCur').value; var out = $('#priceOut');
    if (!(p > 0)) { toast('Enter a price above 0'); return; }
    var P = Math.round(p), len = String(P).length, cands = {};
    var tails = ['8', '88', '888', '68', '168', '188', '288', '388', '518', '588', '688', '868', '998', '958', '158', '128', '138', '198', '66', '666', '99', '999', '28', '58', '98', '18'];
    for (var t = 0; t < tails.length; t++) {
      var tl = tails[t].length; if (tl > len) continue;
      var base = Math.floor(P / Math.pow(10, tl));
      for (var d = -2; d <= 2; d++) {
        var pre = base + d; if (pre < 0) continue;
        var val = parseInt((pre === 0 ? '' : String(pre)) + tails[t], 10);
        if (val > 0 && val >= P * 0.7 && val <= P * 1.3) cands[val] = 1;
      }
    }
    if (P <= 20) [6, 8, 9, 16, 18, 28].forEach(function (v) { cands[v] = 1; });
    var list = Object.keys(cands).map(Number).filter(function (v) { return String(v).indexOf('4') < 0 && !analyze(v).combos.some(function (c) { return c[1] <= 0; }); }).map(function (v) { var a = analyze(v); return { v: v, s: a.score, a: a, d: (v - P) / P }; });
    var below = list.filter(function (x) { return x.v <= P; }).sort(function (a, b) { return (b.s - Math.abs(b.d) * 120) - (a.s - Math.abs(a.d) * 120); }).slice(0, 4);
    var above = list.filter(function (x) { return x.v > P; }).sort(function (a, b) { return (b.s - Math.abs(b.d) * 120) - (a.s - Math.abs(a.d) * 120); }).slice(0, 4);
    var fmt = function (v) { return cur + v.toLocaleString(); };
    var row = function (x) { var c = x.a.combos.slice().sort(function (a, b) { return b[1] - a[1]; })[0]; return '<div class="item"><span><b>' + fmt(x.v) + '</b> <small class="muted">' + (x.d >= 0 ? '+' : '') + (x.d * 100).toFixed(1) + '%</small><br><small class="muted">' + (c ? c[0] + ' · <span class="zh">' + c[2] + '</span> ' + esc(c[3]) : 'Ends on ' + D[String(x.v).slice(-1)].hz) + '</small></span><span class="pill ' + x.a.verdict[1] + '">' + x.s + '</span></div>'; };
    var cur0 = analyze(P);
    out.innerHTML = '<p>Your price <b>' + fmt(P) + '</b> scores <span class="verdict ' + cur0.verdict[1] + '">' + cur0.score + ' · ' + cur0.verdict[0] + '</span></p>' +
      '<div class="grid g2"><div><h3>Round down (conversion-friendly)</h3><div class="list-res">' + (below.map(row).join('') || '<p class="muted">No close option below.</p>') + '</div></div>' +
      '<div><h3>Round up (margin-friendly)</h3><div class="list-res">' + (above.map(row).join('') || '<p class="muted">No close option above.</p>') + '</div></div></div>' +
      (p % 1 ? '<p class="mt2">Tip: for decimal prices, endings like <b>.88</b> or <b>.68</b> carry the same prosperity signal.</p>' : '');
    out.classList.add('show');
  });

  /* ---------- Launch date picker ---------- */
  var df = $('#dateForm');
  if (df) {
    var today = new Date(); var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    $('#dStart').value = iso(today); var e2 = new Date(today); e2.setDate(e2.getDate() + 90); $('#dEnd').value = iso(e2);
    var PREF = { retail: [5, 6], corporate: [2, 3, 4], wedding: [6, 0], online: [1, 2, 3], signing: [1, 2, 3, 4], moving: [6, 0] };
    var DAYN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var lastRes = [];
    df.addEventListener('submit', function (e) {
      e.preventDefault();
      var s = new Date($('#dStart').value + 'T12:00:00'), en = new Date($('#dEnd').value + 'T12:00:00'), type = $('#dType').value;
      if (!(en >= s)) { toast('End date must be after start date'); return; }
      if ((en - s) / 864e5 > 400) { toast('Please choose a range under 13 months'); return; }
      var res = [];
      for (var d = new Date(s); d <= en; d.setDate(d.getDate() + 1)) {
        var day = d.getDate(), mon = d.getMonth() + 1, dstr = String(mon) + String(day), full = iso(d).replace(/-/g, '');
        var sc = analyze(dstr).score * 0.6 + analyze(full).score * 0.4;
        if (/8/.test(String(day))) sc += 8; if (/[69]/.test(String(day))) sc += 4; if (/4/.test(String(day))) sc -= 15; if (mon === 8) sc += 5; if (mon === 4) sc -= 4;
        if (day === mon) sc += 4; // double dates like 8/8, 9/9
        if ((PREF[type] || []).indexOf(d.getDay()) > -1) sc += 8;
        res.push({ d: new Date(d), s: Math.min(99, Math.round(sc)) });
      }
      res.sort(function (a, b) { return b.s - a.s; }); lastRes = res.slice(0, 10);
      $('#dateOut').innerHTML = '<div class="list-res">' + lastRes.map(function (r, i) {
        return '<div class="item"><span><b>#' + (i + 1) + ' · ' + DAYN[r.d.getDay()] + ' ' + r.d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + '</b><br><small class="muted">' + (r.d.getMonth() + 1) + '/' + r.d.getDate() + ' reads ' + String(r.d.getDate()).split('').map(function (x) { return D[x].hz.split(' ')[0]; }).join(' · ') + '</small></span><span class="pill ' + (r.s >= 62 ? 'v-good' : 'v-mid') + '">' + r.s + '</span></div>';
      }).join('') + '</div><p class="mt2"><button class="btn btn-ghost" type="button" id="icsBtn">📅 Add top 3 to calendar (.ics)</button> <a class="btn btn-primary" href="growth-consultation.html?service=launch-date">Get a personalised date reading</a></p>';
      $('#dateOut').classList.add('show');
      $('#icsBtn').addEventListener('click', function () {
        var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//111158//Launch Dates//EN'];
        lastRes.slice(0, 3).forEach(function (r, i) { var ds = iso(r.d).replace(/-/g, ''); lines.push('BEGIN:VEVENT', 'UID:' + ds + '-' + i + '@111158.com', 'DTSTAMP:' + ds + 'T000000Z', 'DTSTART;VALUE=DATE:' + ds, 'SUMMARY:Lucky launch date #' + (i + 1) + ' (score ' + r.s + ')', 'DESCRIPTION:Picked with the 111158 Launch Date Picker', 'END:VEVENT'); });
        lines.push('END:VCALENDAR');
        var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' }); var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'lucky-launch-dates.ics'; document.body.appendChild(a); a.click(); a.remove();
      });
    });
  }

  /* ---------- Zodiac ---------- */
  var ZOD = [
    ['Rat', '鼠', '🐀', [2, 3], [5, 9], 'Blue, gold, green', 'Clever, adaptable, quick-witted'],
    ['Ox', '牛', '🐂', [1, 4], [5, 6], 'White, yellow, green', 'Diligent, dependable, patient'],
    ['Tiger', '虎', '🐅', [1, 3, 4], [6, 7, 8], 'Blue, grey, orange', 'Brave, confident, competitive'],
    ['Rabbit', '兔', '🐇', [3, 4, 6], [1, 7, 8], 'Red, pink, purple, blue', 'Gentle, elegant, responsible'],
    ['Dragon', '龙', '🐉', [1, 6, 7], [3, 8], 'Gold, silver, greyish white', 'Ambitious, energetic, charismatic'],
    ['Snake', '蛇', '🐍', [2, 8, 9], [1, 6, 7], 'Black, red, yellow', 'Wise, intuitive, determined'],
    ['Horse', '马', '🐎', [2, 3, 7], [1, 5, 6], 'Yellow, green', 'Energetic, independent, warm'],
    ['Goat', '羊', '🐐', [2, 7], [6, 8], 'Brown, red, purple', 'Calm, creative, kind'],
    ['Monkey', '猴', '🐒', [4, 9], [2, 7], 'White, blue, gold', 'Sharp, curious, inventive'],
    ['Rooster', '鸡', '🐓', [5, 7, 8], [1, 3, 9], 'Gold, brown, yellow', 'Observant, hard-working, courageous'],
    ['Dog', '狗', '🐕', [3, 4, 9], [1, 6, 7], 'Red, green, purple', 'Loyal, honest, reliable'],
    ['Pig', '猪', '🐖', [2, 5, 8], [1, 7], 'Yellow, grey, brown, gold', 'Generous, compassionate, diligent']
  ];
  var ELEM = [['Wood', '木'], ['Fire', '火'], ['Earth', '土'], ['Metal', '金'], ['Water', '水']];
  function zodiacOf(y) { var i = ((y - 4) % 12 + 12) % 12, st = ((y - 4) % 10 + 10) % 10; return { z: ZOD[i], e: ELEM[Math.floor(st / 2)], yy: st % 2 ? 'Yin' : 'Yang' }; }
  window.P111158.zodiacOf = zodiacOf;
  var zf = $('#zodiacForm');
  if (zf) zf.addEventListener('submit', function (e) {
    e.preventDefault();
    var y = parseInt($('#zYear').value, 10); if (!(y > 1900 && y < 2100)) { toast('Enter a year between 1901 and 2099'); return; }
    if ($('#zEarly').checked) y -= 1;
    var r = zodiacOf(y), z = r.z;
    $('#zodiacOut').innerHTML = '<div class="grid g2" style="align-items:center"><div class="center"><div style="font-size:5rem;line-height:1">' + z[2] + '</div><h2 class="mt0">' + r.e[0] + ' ' + z[0] + ' <span class="zh">' + r.e[1] + z[1] + '</span></h2><p class="muted">' + r.yy + ' · Lunar year ' + y + '</p></div>' +
      '<div><table class="table"><tr><th>Lucky numbers</th><td><b class="red">' + z[3].join(', ') + '</b></td></tr><tr><th>Numbers to avoid</th><td>' + z[4].join(', ') + '</td></tr><tr><th>Lucky colours</th><td>' + z[5] + '</td></tr><tr><th>Traits</th><td>' + z[6] + '</td></tr></table>' +
      '<p><a class="btn btn-ghost" href="number-analyzer.html">Test your phone number →</a></p></div></div>';
    $('#zodiacOut').classList.add('show');
  });

  /* ---------- Red envelope ---------- */
  var RB = { cny_child: [10, 50], cny_relative: [20, 100], cny_employee: [50, 300], cny_parent: [100, 500], wed_friend: [50, 150], wed_colleague: [40, 100], wed_family: [150, 600], birthday: [20, 100], baby: [30, 150], opening: [60, 400], graduation: [30, 150] };
  var FX = { USD: [1, '$'], CAD: [1.38, 'C$'], CNY: [7.1, '¥'], HKD: [7.8, 'HK$'], SGD: [1.3, 'S$'], MYR: [4.3, 'RM'], AUD: [1.5, 'A$'], GBP: [0.76, '£'], EUR: [0.87, '€'], INR: [88, '₹'] };
  var LUCKY = [6, 8, 9, 10, 16, 18, 20, 26, 28, 36, 50, 60, 66, 68, 80, 88, 99, 100, 128, 160, 166, 168, 188, 200, 288, 300, 388, 500, 520, 588, 600, 666, 688, 800, 888, 999, 1000, 1088, 1314, 1688, 1888, 2000, 2888, 3888, 5000, 5200, 5888, 6666, 6888, 8000, 8888, 9999, 10000, 16888, 18888, 28888, 36888, 38888, 52000, 58888, 66666, 68888, 88888];
  var hf = $('#hbForm');
  if (hf) hf.addEventListener('submit', function (e) {
    e.preventDefault();
    var occ = $('#hbOcc').value, fx = FX[$('#hbCur').value], rg = RB[occ];
    var lo = rg[0] * fx[0], hi = rg[1] * fx[0];
    var picks = LUCKY.filter(function (v) { return v >= lo * 0.85 && v <= hi * 1.15; });
    if (occ.indexOf('wed') === 0) picks = picks.filter(function (v) { return v % 2 === 0; });
    if (picks.length > 6) { var step = picks.length / 6, p2 = []; for (var i = 0; i < 6; i++) p2.push(picks[Math.floor(i * step)]); picks = p2; }
    $('#hbOut').innerHTML = '<p>Typical range: <b>' + fx[1] + Math.round(lo).toLocaleString() + '–' + fx[1] + Math.round(hi).toLocaleString() + '</b>. Lucky amounts in that range:</p><div class="chips">' + picks.map(function (v) { var a = analyze(v); return '<span class="chip" title="' + esc(a.combos[0] ? a.combos[0][3] : '') + '"><b>' + fx[1] + v.toLocaleString() + '</b>' + (a.combos[0] ? ' · ' + a.combos[0][2] : '') + '</span>'; }).join('') + '</div>' +
      '<ul class="ticks mt2"><li>Use crisp new notes and avoid any amount containing 4.</li><li>' + (occ.indexOf('wed') === 0 ? 'Weddings: even amounts only — good things come in pairs.' : 'Even amounts are generally preferred; odd amounts are traditionally for funerals (white envelopes).') + '</li><li>Give and receive with both hands; don’t open the envelope in front of the giver.</li></ul>';
    $('#hbOut').classList.add('show');
  });

  /* ---------- Festivals & countdowns ---------- */
  var FEST = [
    ['2026-10-01', 'National Day Golden Week', '国庆节', 'Week-long holiday; peak travel, retail and gifting.', 'commerce'],
    ['2026-11-11', 'Singles’ Day (11.11)', '光棍节', 'The world’s largest online shopping day. Plan pre-sales 3–4 weeks ahead.', 'commerce'],
    ['2026-12-12', '12.12 Shopping Festival', '双十二', 'Year-end e-commerce sale; clearance and gifting.', 'commerce'],
    ['2027-02-06', 'Chinese New Year — Year of the Fire Goat', '春节', 'The biggest holiday of the year: red envelopes, gifts, reunions.', 'culture'],
    ['2027-02-20', 'Lantern Festival', '元宵节', 'Closes the New Year season; lanterns, riddles, tangyuan.', 'culture'],
    ['2027-05-20', '520 Love Day', '520', '"520" sounds like 我爱你 (I love you): jewellery, flowers, gifting.', 'commerce'],
    ['2027-06-09', 'Dragon Boat Festival', '端午节', 'Zongzi, boat races, family gatherings.', 'culture'],
    ['2027-06-18', '618 Mid-Year Shopping Festival', '618', 'Second-largest e-commerce event; electronics and appliances.', 'commerce'],
    ['2027-08-08', 'Qixi — Chinese Valentine’s Day', '七夕', 'Romance gifting peak; luxury and beauty.', 'commerce'],
    ['2027-09-15', 'Mid-Autumn Festival', '中秋节', 'Mooncakes, corporate gifting, family reunions.', 'culture'],
    ['2027-10-01', 'National Day Golden Week', '国庆节', 'Week-long holiday; peak travel and retail.', 'commerce'],
    ['2027-11-11', 'Singles’ Day (11.11)', '光棍节', 'Pre-sales typically open in late October.', 'commerce'],
    ['2027-12-12', '12.12 Shopping Festival', '双十二', 'Year-end sale.', 'commerce'],
    ['2028-01-26', 'Chinese New Year — Year of the Earth Monkey', '春节', 'Plan campaigns 6–8 weeks before.', 'culture']
  ];
  window.P111158.FEST = FEST;
  function cd(el) {
    var t = new Date(el.getAttribute('data-countdown')).getTime();
    var tick = function () {
      var s = Math.max(0, Math.floor((t - Date.now()) / 1000));
      var p = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
      el.innerHTML = ['Days', 'Hours', 'Min', 'Sec'].map(function (l, i) { return '<div><b>' + p[i] + '</b><small>' + l + '</small></div>'; }).join('');
    };
    tick(); setInterval(tick, 1000);
  }
  function upcoming(n, filter) { var now = Date.now() - 864e5; return FEST.filter(function (f) { return new Date(f[0] + 'T00:00:00+08:00').getTime() > now && (!filter || filter === 'all' || f[4] === filter); }).slice(0, n); }
  var fl = $('#festList');
  function drawFest(filter) {
    var M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    fl.innerHTML = upcoming(20, filter).map(function (f) {
      var d = new Date(f[0] + 'T12:00:00');
      return '<div class="card fest"><div class="date-badge"><div>' + d.getDate() + '<small>' + M[d.getMonth()] + ' ' + d.getFullYear() + '</small></div></div><div><h3 class="mt0">' + f[1] + ' <span class="zh muted">' + f[2] + '</span></h3><p>' + f[3] + '</p></div><div class="countdown" data-countdown="' + f[0] + 'T00:00:00+08:00"></div></div>';
    }).join('');
    $$('[data-countdown]', fl).forEach(cd);
  }
  if (fl) {
    drawFest('all');
    $$('[data-fest]').forEach(function (b) { b.addEventListener('click', function () { $$('[data-fest]').forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); drawFest(b.getAttribute('data-fest')); }); });
  }
  var nx = $('#nextFest');
  if (nx) { var f0 = upcoming(1)[0]; if (f0) { nx.querySelector('[data-fname]').textContent = f0[1]; var cdEl = nx.querySelector('.countdown'); cdEl.setAttribute('data-countdown', f0[0] + 'T00:00:00+08:00'); } }
  $$('.countdown[data-countdown]').forEach(function (el) { if (!el.closest('#festList')) cd(el); });

  /* ---------- Number library search ---------- */
  var ls = $('#libSearch');
  if (ls) {
    var cards = $$('[data-lib]');
    var filt = function () {
      var q = ls.value.trim().toLowerCase(), cat = ($('.chip.active[data-cat]') || {}).getAttribute ? $('.chip.active[data-cat]').getAttribute('data-cat') : 'all';
      cards.forEach(function (c) { var okQ = !q || c.textContent.toLowerCase().indexOf(q) > -1; var okC = cat === 'all' || c.getAttribute('data-lib') === cat; c.style.display = okQ && okC ? '' : 'none'; });
    };
    ls.addEventListener('input', filt);
    $$('[data-cat]').forEach(function (b) { b.addEventListener('click', function () { $$('[data-cat]').forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); filt(); }); });
  }

  /* ---------- Hero mini analyzer ---------- */
  var mini = $('#miniForm');
  if (mini) mini.addEventListener('submit', function (e) { e.preventDefault(); var v = $('#miniIn').value.replace(/\D/g, ''); if (!v) { toast('Enter any number'); return; } location.href = 'number-analyzer.html?n=' + v; });
})();
