import {renderProject,renderCase,validateSite,validateProject,safeUrl} from './content.mjs';
import {config,configured,loadPortfolio} from './api.mjs';
let portfolio = JSON.parse(document.querySelector('#portfolio-seed').textContent);
let filter = 'all';
let opener;
const dialog = document.querySelector('#case-dialog');
const status = document.querySelector('#portfolio-status');
const grid = document.querySelector('.projects-grid');
function applySite(site) {
  validateSite(site);
  document.querySelectorAll('[data-field]').forEach(el => { if (el.dataset.field in site) el.textContent = site[el.dataset.field]; });
  document.querySelectorAll('[data-url]').forEach(el => el.href = safeUrl(site[el.dataset.url]));
  document.querySelectorAll('[data-image]').forEach(el => el.src = safeUrl(site[el.dataset.image]));
  document.querySelectorAll('[data-contact]').forEach(el => { const key = el.dataset.contact; el.href = `${key === 'email' ? 'mailto' : 'tel'}:${site[key]}`; });
  document.querySelector('#contact-form').action = `mailto:${site.email}`;
}
function render() {
  const visible = portfolio.projects.filter(p => p.visible).sort((a,b) => a.order-b.order || a.id.localeCompare(b.id));
  grid.innerHTML = visible.filter(p => filter === 'all' || p.group === filter).map(renderProject).join('') || '<p class="empty-projects">No published projects in this category yet.</p>';
  const counter = document.querySelector('#project-count');
  counter.dataset.target = visible.length; counter.textContent = visible.length;
}
function openCase(id, push=false) {
  const project = portfolio.projects.find(p => p.id === id && p.visible);
  if (!project) return;
  opener = document.activeElement;
  document.querySelector('#case-content').innerHTML = renderCase(project);
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
  if (push) { const url = new URL(location.href); url.searchParams.set('project',id); history.pushState({},'',url); }
}
document.addEventListener('click', e => {
  const link = e.target.closest('[data-case]');
  if (!link || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault(); openCase(link.dataset.case,true);
});
document.querySelectorAll('[data-project-filter]').forEach(button => button.addEventListener('click',() => {
  filter=button.dataset.projectFilter;
  document.querySelectorAll('[data-project-filter]').forEach(b => { b.classList.toggle('active',b===button); b.setAttribute('aria-pressed',String(b===button)); });
  render();
}));
dialog.querySelector('.dialog-close').addEventListener('click',() => dialog.close());
dialog.addEventListener('click',e => { if (e.target === dialog) { const r=dialog.getBoundingClientRect(); if (e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) dialog.close(); } });
dialog.addEventListener('close',() => { document.body.classList.remove('modal-open'); const url=new URL(location.href); url.searchParams.delete('project'); history.replaceState({},'',url); opener?.focus(); });
window.addEventListener('popstate',() => { const id=new URL(location.href).searchParams.get('project'); if(id) openCase(id); else if(dialog.open) dialog.close(); });
async function refresh() {
  try {
    if (!configured(await config())) return;
    const fresh = await loadPortfolio();
    fresh.projects.forEach(validateProject);
    if (fresh.site) validateSite(fresh.site);
    portfolio = {projects:fresh.projects,site:fresh.site || portfolio.site};
    applySite(portfolio.site); render(); status.hidden=true;
    if (dialog.open) {
      const id=new URL(location.href).searchParams.get('project');
      if (portfolio.projects.some(p => p.id===id && p.visible)) openCase(id); else dialog.close();
    }
  } catch {
    status.hidden=false; status.textContent='Live projects could not be loaded. Please refresh to try again, or contact me using the links below.';
    if (!portfolio.projects.length) grid.innerHTML='';
  }
}
await refresh();
const id=new URL(location.href).searchParams.get('project'); if(id) openCase(id);
document.addEventListener('visibilitychange',() => { if(document.visibilityState==='visible') refresh(); });
