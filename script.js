function setLanguage(language) {
  const selected = language === 'zh' ? 'zh' : 'en';
  document.documentElement.lang = selected === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-zh]').forEach(element => {
    element.textContent = element.dataset[selected];
    if (selected === 'zh' && element.id === 'title' && element.textContent.includes('&')) {
      const parts = element.textContent.split('&');
      const ampersand = document.createElement('span');
      ampersand.className = 'title-ampersand';
      ampersand.textContent = '&';
      element.replaceChildren(parts[0], ampersand, parts.slice(1).join('&'));
    }
  });
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === selected));
  });
  const titles = {
    games: { en: 'Games', zh: '游戏' },
    music: { en: 'Music', zh: '音乐' },
    home: { en: 'Games & Music', zh: '游戏与音乐' }
  };
  const page = document.body.dataset.page || 'home';
  document.title = 'Yuhan Chen — ' + titles[page][selected];
  // Carry the language between pages, including local file previews.
  document.querySelectorAll('a[href]').forEach(link => {
    const target = new URL(link.getAttribute('href'), window.location.href);
    if (target.pathname.endsWith('.html') && target.origin === window.location.origin) {
      target.searchParams.set('lang', selected);
      link.href = target.href;
    }
  });
}
document.querySelectorAll('[data-lang]').forEach(button => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});
// Direct visits default to English; internal links carry the chosen language.
const language = new URLSearchParams(window.location.search).get('lang');
setLanguage(language);

const discordCopy = document.getElementById('discord-copy');
let copyToastTimer;
let copyToastClearTimer;
discordCopy?.addEventListener('click', async () => {
  const status = document.getElementById('discord-status');
  clearTimeout(copyToastTimer);
  clearTimeout(copyToastClearTimer);
  try {
    await navigator.clipboard.writeText('hanson923.');
    status.textContent = 'Username copied';
  } catch {
    status.textContent = 'Could not copy username. Please try again.';
  }
  status.classList.add('is-visible');
  copyToastTimer = setTimeout(() => {
    status.classList.remove('is-visible');
    const fadeDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;
    copyToastClearTimer = setTimeout(() => {
      status.textContent = '';
    }, fadeDuration);
  }, 1000);
});
