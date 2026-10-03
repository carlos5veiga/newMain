(() => {
  // When a lyric file is provided, offer the same download action as other materials.
  document.querySelectorAll('.lyric-panel a[href]:not([download])').forEach(link => {
    const url = new URL(link.href, document.baseURI);
    if (url.origin !== location.origin || !/\.(pdf|txt|docx?|odt)$/i.test(url.pathname)) return;
    if ([...link.parentElement.querySelectorAll('a[download]')].some(item => item.href === link.href)) return;
    const download = document.createElement('a');
    download.className = 'download-link';
    download.href = link.href;
    download.download = decodeURIComponent(url.pathname.split('/').pop());
    download.textContent = '↓ Baixar letra';
    download.setAttribute('aria-label', `Baixar letra: ${link.textContent.trim()}`);
    const actions = document.createElement('span');
    actions.className = 'score-actions';
    actions.append(download);
    link.after(actions);
  });
  const players = [...document.querySelectorAll('.voice-player audio')];
  document.querySelectorAll('[data-repeat]').forEach(control => {
    const player = document.getElementById(control.dataset.repeat);
    if (!player) return;
    player.loop = control.checked;
    control.addEventListener('change', () => { player.loop = control.checked; });
  });
  players.forEach(player => {
    player.addEventListener('play', () => {
      players.forEach(other => { if (other !== player) other.pause(); });
    });
    const message = player.closest('.voice-player').querySelector('.audio-error');
    player.addEventListener('error', () => { message.hidden = false; });
    player.addEventListener('loadeddata', () => { message.hidden = true; });
  });
})();
