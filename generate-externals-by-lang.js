// generate-externals-by-lang.js
// أحدث نسخة: يولّد/يحدّث صفحات HTML للمقالات مع صفحة عرض محسّنة بصريًا.
// Usage:
//   node generate-externals-by-lang.js
//   node generate-externals-by-lang.js --force
//   node generate-externals-by-lang.js --backup

const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const i18nDir = path.join(projectRoot, 'src', 'assets', 'i18n');
const mediaAssetsDir = path.join(projectRoot, 'src', 'assets', 'media');
const outBase = path.join(projectRoot, 'src', 'assets', 'external');

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const BACKUP = args.includes('--backup');

function loadI18nFiles() {
  if (!fs.existsSync(i18nDir)) {
    console.error('i18n folder not found:', i18nDir);
    process.exit(1);
  }
  const files = fs.readdirSync(i18nDir).filter(f => f.endsWith('.json'));
  const locales = {};
  files.forEach(f => {
    const lang = path.basename(f, '.json');
    try {
      const raw = fs.readFileSync(path.join(i18nDir, f), 'utf8');
      locales[lang] = JSON.parse(raw);
    } catch (e) {
      console.error('Failed parse', f, e.message);
    }
  });
  return locales;
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Enhanced page template:
 * - responsive container
 * - readable typography
 * - limited image max-width (not huge)
 * - RTL support based on language
 * - simple breadcrumb / back button
 */
function pageTemplate({ lang, title, imgPath, date, bodyHtml }) {
  const dir = ['ar','he','fa','ur'].includes(lang) ? 'rtl' : 'ltr';
  // Use a safe webfont stack; you can add other font imports if desired
  return `<!doctype html>
<html lang="${escapeHtml(lang)}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="robots" content="index,follow" />
<style>
  /* Reset-ish */
  html,body{margin:0;padding:0}
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Naskh Arabic", "Helvetica Neue", Arial, "Noto Sans", system-ui, sans-serif;
    background: linear-gradient(180deg, #f6f9fc 0%, #ffffff 100%);
    color: #0b2240;
    line-height: 1.65;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    padding: 28px;
  }
  .wrap { max-width: 920px; margin: 0 auto; }
  .card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(10,30,60,0.06);
    padding: 26px;
    border: 1px solid rgba(15,40,70,0.04);
  }
  .breadcrumb {
    display:flex;
    gap:12px;
    align-items:center;
    margin-bottom:12px;
    font-size:14px;
    color:#475569;
  }
  .back-btn {
    display:inline-block;
    padding:8px 12px;
    border-radius:8px;
    background:#eef6ff;
    color:#0b5ed7;
    text-decoration:none;
    font-weight:700;
    border:1px solid rgba(11,94,215,0.08);
  }
  h1 {
    margin: 6px 0 8px 0;
    font-size: clamp(20px, 3.6vw, 30px);
    line-height:1.12;
    color:#05223a;
    font-weight:800;
  }
  .meta {
    color:#60748a;
    font-size:14px;
    margin-bottom:14px;
  }

  /* Image */
  .hero-img {
    display:block;
    margin: 14px auto 22px auto;
    width:100%;
    max-width:450px; /* ← هنا صغّرنا الصورة */
    height:auto;
    border-radius:14px;
    object-fit:cover;
    box-shadow: 0 6px 18px rgba(10,30,60,0.08);
}


  /* Article content */
  article { color:#243b4a; font-size:16px; }
  article p { margin: 14px 0; white-space: pre-wrap; }
  article p.lead { font-size:18px; color:#334155; margin-top:0; }

  /* Readability helpers */
  .content-body { max-width:820px; margin: 0; }
  .share { margin-top: 20px; display:flex; gap:10px; flex-wrap:wrap; }
  .share a {
    display:inline-flex; align-items:center; gap:8px; padding:8px 12px;
    border-radius:8px; text-decoration:none; font-weight:700; font-size:14px;
    background:#f1f5f9; color:#0b2240; border:1px solid rgba(11,94,215,0.04);
  }

  /* responsive */
  @media (max-width: 880px) {
    .wrap { padding: 0 12px; }
    .hero-img { max-width:100%; }
  }

  /* Print improvements */
  @media print {
    body { background: #fff; color:#000; padding: 12px; }
    .card { box-shadow:none; border:none; }
    .back-btn, .share { display:none; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="breadcrumb">
<a class="back-btn" href="/" onclick="(function(e){
  e.preventDefault();
  try {
    // 1) if there is history
    if (window.history && window.history.length > 1) { window.history.back(); return; }
    // 2) if referrer from same origin
    if (document.referrer) {
      try {
        var ref = new URL(document.referrer);
        if (ref.origin === location.origin) { location.href = document.referrer; return; }
      } catch(err){}
    }
    // 3) if opened from window.opener, focus/close
    if (window.opener && !window.opener.closed) { window.opener.focus(); window.close(); return; }
    // 4) fallback: go to home
    location.href = '/';
  } catch(e){ location.href = '/'; }
})(event);">&larr; العودة</a>

<div style="flex:1"></div>
        <div class="meta">${escapeHtml(date)} — هيئة الإعلام</div>
      </div>

      <header>
        <h1>${escapeHtml(title)}</h1>
      </header>

      ${imgPath ? `<img src="${escapeHtml(imgPath)}" alt="${escapeHtml(title)}" class="hero-img" />` : ''}

      <section class="content-body">
        <article>
          ${bodyHtml}
        </article>

        <div class="share" aria-hidden="true">
          <a href="#" onclick="navigator.clipboard?.writeText(location.href); alert('تم نسخ رابط الصفحة'); return false;">نسخ الرابط</a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href),'_blank'); return false;">مشاركة على فيسبوك</a>
          <a href="https://twitter.com/intent/tweet?url=" onclick="window.open('https://twitter.com/intent/tweet?url='+encodeURIComponent(location.href),'_blank'); return false;">تغريد</a>
        </div>
      </section>
    </div>
  </div>
</body>
</html>`;
}

function bodyToHtml(bodyText) {
  if (!bodyText) return '';
  // Keep paragraph structure: split on double newlines OR single newlines if not large blocks
  const parts = bodyText.split(/\r?\n\r?\n/).map(p => p.trim()).filter(Boolean);
  return parts.map((p, idx) => `<p${idx===0 ? ' class="lead"' : ''}>${escapeHtml(p).replace(/\n/g,'<br/>')}</p>`).join('\n');
}

function gatherSlugs(locales) {
  const slugs = new Set();
  Object.values(locales).forEach(loc => {
    if (loc && loc.articles) Object.keys(loc.articles).forEach(s => slugs.add(s));
  });
  return Array.from(slugs);
}

function readExistingFilesForLang(lang) {
  const dir = path.join(outBase, lang);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => path.basename(f, '.html'));
}

function main() {
  const locales = loadI18nFiles();
  const allLangs = Object.keys(locales);
  if (!allLangs.length) {
    console.error('No i18n locales found in', i18nDir);
    process.exit(1);
  }

  ensureDir(outBase);

  const slugs = gatherSlugs(locales);
  if (!slugs.length) {
    console.error('No article slugs found in i18n files.');
    process.exit(1);
  }

  console.log('Locales detected:', allLangs.join(', '));
  console.log('Article slugs detected:', slugs.join(', '));
  console.log('Force overwrite:', FORCE ? 'yes' : 'no', ' Backup:', BACKUP ? 'yes' : 'no');

  allLangs.forEach(lang => {
    const langData = locales[lang] || {};
    const outDir = path.join(outBase, lang);
    ensureDir(outDir);

    const existing = new Set(readExistingFilesForLang(lang));

    slugs.forEach(slug => {
      const art = langData.articles && langData.articles[slug];
      if (!art) {
        if (existing.has(slug)) {
          console.log(`[preserve] ${lang}/${slug}.html (exists) — article missing in ${lang} i18n, preserved`);
        } else {
          console.log(`[skip] ${lang}/${slug}.html — no translation in ${lang} and no existing file`);
        }
        return;
      }

      const title = art.title || slug;
      const bodyText = art.body || '';
      const bodyHtml = bodyToHtml(bodyText);

      let imgPath = null;
      const png = path.join(mediaAssetsDir, `${slug}.png`);
      const jpg = path.join(mediaAssetsDir, `${slug}.jpg`);
      if (fs.existsSync(png)) imgPath = `/assets/media/${slug}.png`;
      else if (fs.existsSync(jpg)) imgPath = `/assets/media/${slug}.jpg`;

      const html = pageTemplate({
        lang,
        title,
        imgPath,
        date: (langData.media && langData.media.date) ? langData.media.date : '—',
        bodyHtml
      });

      const outFile = path.join(outDir, `${slug}.html`);
      if (fs.existsSync(outFile)) {
        const old = fs.readFileSync(outFile, 'utf8');
        if (old === html && !FORCE) {
          console.log(`[unchanged] ${lang}/${slug}.html`);
        } else {
          if (BACKUP) {
            const bak = outFile + '.bak';
            fs.writeFileSync(bak, old, 'utf8');
            console.log(`[backup] ${lang}/${slug}.html -> ${path.basename(bak)}`);
          }
          fs.writeFileSync(outFile, html, 'utf8');
          console.log(`[updated] ${lang}/${slug}.html`);
        }
      } else {
        fs.writeFileSync(outFile, html, 'utf8');
        console.log(`[created] ${lang}/${slug}.html`);
      }
    });

    const otherFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.html') && !slugs.includes(path.basename(f, '.html')));
    if (otherFiles.length) {
      console.log(`[note] ${lang} has additional files preserved: ${otherFiles.join(', ')}`);
    }
  });

  console.log('Done. Generated/updated pages under', outBase);
}

main();
