function setLanguage(language) {
  const selected = language === 'zh' ? 'zh' : 'en';
  document.documentElement.lang = selected === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-zh]').forEach(element => {
    element.textContent = element.dataset[selected];
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
  try { localStorage.setItem('portfolio-language', selected); } catch {}
}
document.querySelectorAll('[data-lang]').forEach(button => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});
// Default to English on the first visit; retain the visitor's choice thereafter.
let language = new URLSearchParams(window.location.search).get('lang');
if (language !== 'zh' && language !== 'en') {
  try { language = localStorage.getItem('portfolio-language'); } catch {}
}
setLanguage(language);
