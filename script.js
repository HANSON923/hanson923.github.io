/* ---------- Language (EN / 中文), carried between pages via ?lang= ---------- */
function setLanguage(language) {
  const lang = language === 'zh' ? 'zh' : 'en';
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.dataset[lang];
    if (text != null) el.textContent = text;
  });
  document.querySelectorAll('[data-en-label]').forEach(el => {
    el.setAttribute('aria-label', lang === 'zh' ? el.dataset.zhLabel : el.dataset.enLabel);
  });
  document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  const t = document.body.dataset[lang === 'zh' ? 'titleZh' : 'titleEn'];
  if (t) document.title = t;
  document.querySelectorAll('a[href]').forEach(a => {
    const url = new URL(a.getAttribute('href'), location.href);
    if (url.origin === location.origin && url.pathname.endsWith('.html')) {
      url.searchParams.set('lang', lang);
      a.href = url.href;
    }
  });
}
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.lang)));
setLanguage(new URLSearchParams(location.search).get('lang'));

/* ---------- Discord: copy username ---------- */
const discord = document.getElementById('discord-copy');
discord?.addEventListener('click', async () => {
  const label = discord.querySelector('span');
  const original = label.textContent;
  try {
    await navigator.clipboard.writeText('hanson923.');
    label.textContent = document.documentElement.lang === 'zh-CN' ? '已复制用户名' : 'Username copied';
  } catch {
    label.textContent = 'hanson923.';
  }
  setTimeout(() => { label.textContent = original; }, 1600);
});

/* ---------- Home: project list previews the game behind it ---------- */
const stage = document.querySelector('.preview');
if (stage) {
  const media = stage.querySelector('.preview-media');
  const show = row => {
    const { preview, video, tint } = row.dataset;
    if (!preview) return;
    document.body.style.setProperty('--tint', tint || '#000');
    media.innerHTML = '';
    if (video && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const v = Object.assign(document.createElement('video'), { src: video, poster: preview, muted: true, loop: true, autoplay: true, playsInline: true });
      media.append(v);
    } else {
      const img = Object.assign(document.createElement('img'), { src: preview, alt: '' });
      media.append(img);
    }
    stage.classList.add('is-on');
    document.body.classList.add('is-previewing');
  };
  const hide = () => { stage.classList.remove('is-on'); document.body.classList.remove('is-previewing'); };
  document.querySelectorAll('.work-row[data-preview]').forEach(row => {
    row.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') show(row); });
    row.addEventListener('pointerleave', hide);
    row.addEventListener('focus', () => show(row));
    row.addEventListener('blur', hide);
  });
}
