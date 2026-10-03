(() => {
  const search = document.querySelector('#song-search');
  if (!search) return;
  const items = [...document.querySelectorAll('.songs li')];
  const count = document.querySelector('#song-count');
  const empty = document.querySelector('#empty-results');
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
  search.addEventListener('input', () => {
    const query = normalize(search.value);
    let visible = 0;
    items.forEach(item => {
      item.hidden = !normalize(item.querySelector('.song-title').textContent).includes(query);
      if (!item.hidden) visible++;
    });
    document.querySelectorAll('.repertoire-group').forEach(group => {
      group.hidden = !group.querySelector('.songs li:not([hidden])');
    });
    count.textContent = query ? `${visible} de ${items.length} músicas` : `${items.length} músicas`;
    empty.hidden = visible !== 0;
  });
})();
