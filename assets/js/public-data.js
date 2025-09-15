// Public site dynamic data loader for Notices, Guidance, and Downloads
// Assumes the site is served at /Examination-Department/ and backend is at ./backend
(function(){
  function escapeHtml(str){return String(str||'').replace(/[&<>"']/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));}
  function byId(id){return document.getElementById(id);} 

  async function fetchJson(url){
    const res = await fetch(url, { credentials: 'include' });
    let data=null; try{data=await res.json()}catch(_){ }
    if(!res.ok) throw new Error((data&&data.error)||`Request failed (${res.status})`);
    return data;
  }

  // Home page: render latest notices into #notices .notices-container if present
  async function renderHomeNotices(){
    const wrap = document.querySelector('#notices .notices-container');
    if(!wrap) return;
    try{
      const data = await fetchJson('./backend/api/notices.php');
      const items = (data.items||[]).slice(0,3);
      wrap.innerHTML='';
      items.forEach(n=>{
        const d = new Date(n.noticed_date + 'T00:00:00');
        const dt = d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'2-digit'});
        const div = document.createElement('div');
        div.className='notice';
        div.innerHTML = `
          <div class="notice-date">${escapeHtml(dt)}</div>
          <h3>${escapeHtml(n.title)}</h3>
          <p>${escapeHtml(n.description)}</p>
          ${n.link_url?`<a href="${escapeHtml(n.link_url)}" class="notice-link" target="_blank" rel="noopener">View Details</a>`:''}
        `;
        wrap.appendChild(div);
      });
    }catch(err){ console.error('Failed to load notices', err); }
  }

  // Home page: render guidance highlights into #student-guidance .guidance-container (first 4)
  async function renderHomeGuidance(){
    const wrap = document.querySelector('#student-guidance .guidance-container');
    if(!wrap) return;
    try{
      const data = await fetchJson('./backend/api/guidance.php');
      const items = (data.items||[]).slice(0,4);
      wrap.innerHTML='';
      const icons = ['fa-calendar-alt','fa-clipboard-check','fa-question-circle','fa-file-alt'];
      items.forEach((g,i)=>{
        const div = document.createElement('div');
        div.className='guidance-item';
        const icon = icons[i % icons.length];
        div.innerHTML = `
          <i class="fas ${icon}"></i>
          <h3>${escapeHtml(g.title)}</h3>
          <p>${escapeHtml(g.description)}</p>
        `;
        wrap.appendChild(div);
      });
    }catch(err){ console.error('Failed to load guidance', err); }
  }

  // Downloads pages: expect container .downloads-container and optional #categoryFilter
  async function renderDownloadsPage(){
    const cont = document.querySelector('.downloads-container');
    if(!cont) return;
    const filterSel = document.getElementById('categoryFilter');

    async function loadAndRender(category){
      try{
        const url = category && category !== 'all'
          ? `./backend/api/downloads.php?category=${encodeURIComponent(category)}`
          : './backend/api/downloads.php';
        const data = await fetchJson(url);
        cont.innerHTML = '';
        // Group by category
        const groups = new Map();
        (data.items||[]).forEach(it=>{
          const cat = it.category || 'other';
          if(!groups.has(cat)) groups.set(cat, []);
          groups.get(cat).push(it);
        });
        // Render
        for(const [cat, items] of groups){
          const block = document.createElement('div');
          block.className='download-category';
          const catTitle = cat === 'staff' ? 'For Staff' : cat === 'students' ? 'For Students' : cat === 'exam_hall_schedules' ? 'Exam Hall Schedules' : cat.replace(/_/g,' ');
          block.innerHTML = `
            <div class="category-header"><h2><i class="fas fa-folder"></i> ${escapeHtml(catTitle)}</h2></div>
            <div class="download-items"></div>
          `;
          const itemsWrap = block.querySelector('.download-items');
          items.forEach(it=>{
            const kind = it.file_path ? (it.file_path.toLowerCase().endsWith('.pdf')?'pdf': it.file_path.match(/\.docx?$/i)?'doc': it.file_path.match(/\.xlsx?$/i)?'xls':'file') : (it.link_url ? 'link' : 'file');
            const iconMap = { pdf:'fa-file-pdf', doc:'fa-file-word', xls:'fa-file-excel', link:'fa-link', file:'fa-file' };
            const iconClass = iconMap[kind] || 'fa-file';
            const aHref = it.file_path ? `./${it.file_path}` : it.link_url;
            const itemEl = document.createElement('div');
            itemEl.className='download-item';
            itemEl.dataset.category = cat;
            itemEl.innerHTML = `
              <div class="download-icon ${escapeHtml(kind)}"><i class="fas ${iconClass}"></i></div>
              <div class="download-info">
                <h3>${escapeHtml(it.title)}</h3>
                <p>${escapeHtml(it.description||'')}</p>
              </div>
              <a href="${escapeHtml(aHref)}" class="download-button" target="_blank" rel="noopener"><i class="fas fa-download"></i></a>
            `;
            itemsWrap.appendChild(itemEl);
          });
          cont.appendChild(block);
        }
      }catch(err){ console.error('Failed to load downloads', err); }
    }

    if (filterSel){
      filterSel.addEventListener('change', ()=> loadAndRender(filterSel.value));
    }
    loadAndRender(filterSel ? filterSel.value : 'all');
  }

  document.addEventListener('DOMContentLoaded', function(){
    renderHomeNotices();
    renderHomeGuidance();
    renderDownloadsPage();
  });
})();
