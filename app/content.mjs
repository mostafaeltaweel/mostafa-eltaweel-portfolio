export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const groups = ['Analytics & BI', 'Applied AI', 'Tools & Automation'];
export const siteFields = {
  specialty: 'المسمى المهني', tagline: 'التخصص والأدوات', intro: 'الجملة التعريفية',
  availability: 'حالة التوفر للعمل', about: 'نبذة عني', background: 'الخلفية الدراسية',
  email: 'البريد الإلكتروني', phone: 'الهاتف بالصيغة الدولية', location: 'الموقع',
  linkedin: 'رابط LinkedIn', github: 'رابط GitHub', resume: 'رابط السيرة الذاتية',
  diploma: 'اسم الدبلومة', diplomaStatus: 'حالة الدبلومة', diplomaDescription: 'وصف الدبلومة',
  trainingSummary: 'ملخص التدريب', portrait: 'رابط الصورة الشخصية'
};
export const text = (value, label, max = 4000) => {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error(`${label}: أدخل نصًا من 1 إلى ${max} حرف.`);
  return value.trim();
};
export function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u0020\\]/.test(value)) throw new Error('الرابط غير صالح. استخدم HTTPS أو مسار ملف بدون مسافات.');
  if (/^https:\/\//i.test(value)) { const u = new URL(value); if (u.username || u.password) throw new Error('لا تضع بيانات دخول في الرابط.'); return value; }
  const decoded = decodeURIComponent(value);
  if (/^[\p{L}\p{N}_][\p{L}\p{N} _./()\-]*$/u.test(decoded) && !decoded.split('/').some(p => p === '..')) return value;
  // Arabic file names are allowed when percent-encoded.
  throw new Error('استخدم رابط HTTPS كاملًا أو مسار ملف داخل الموقع.');
}
export function validateProject(p) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error('بيانات المشروع غير صالحة.');
  text(p.id, 'معرّف المشروع', 80);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id)) throw new Error('معرّف المشروع يقبل حروف إنجليزية صغيرة وأرقام وشرطة فقط.');
  for (const key of ['title','category','description','imageAlt']) text(p[key], key, key === 'description' ? 1500 : 180);
  safeUrl(p.image);
  if (!groups.includes(p.group)) throw new Error('اختر قسم المشروع.');
  if (!Number.isInteger(p.order) || p.order < 0 || p.order > 10000) throw new Error('الترتيب رقم صحيح من 0 إلى 10000.');
  for (const key of ['visible','wide','isNew']) if (typeof p[key] !== 'boolean') throw new Error(`${key}: استخدم true أو false.`);
  for (const key of ['problem','approach','outcome','limitations']) text(p[key], key, 4000);
  if (!Array.isArray(p.links) || p.links.length > 6) throw new Error('أضف حتى 6 روابط.');
  p.links.forEach(l => { text(l.label,'اسم الزر',70); safeUrl(l.url); if (typeof l.download !== 'boolean') throw new Error('نوع الرابط غير صالح.'); });
  return p;
}
export function validateSite(site) {
  for (const key of Object.keys(siteFields)) text(site[key], siteFields[key], 4000);
  if (!/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(site.email)) throw new Error('أدخل بريدًا صالحًا.');
  if (!/^\+[0-9 ()-]{7,24}$/.test(site.phone)) throw new Error('أدخل الهاتف بالصيغة الدولية مثل +201112611898.');
  for (const key of ['linkedin','github','resume','portrait']) safeUrl(site[key]);
  return site;
}
export function renderLinks(links) {
  return links.map((l,i) => `<a class="project-btn${i === 0 ? ' primary' : ''}" href="${escape(safeUrl(l.url))}" ${l.download ? 'download' : 'target="_blank" rel="noopener noreferrer"'}>${escape(l.label)} <span aria-hidden="true">↗</span></a>`).join('');
}
export function renderProject(p) {
  validateProject(p);
  return `<article class="project-card visible${p.wide ? ' wide' : ''}" data-group="${escape(p.group)}" id="project-${p.id}">
    <a class="project-image-link" href="?project=${p.id}#projects" data-case="${p.id}" aria-label="Read ${escape(p.title)} case study"><img src="${escape(p.image)}" alt="${escape(p.imageAlt)}" loading="lazy" width="1330" height="742"></a>
    <div class="project-overlay"><div class="project-tag">${escape(p.category)}</div><h3 class="project-name">${escape(p.title)}</h3><p class="project-desc">${escape(p.description)}</p>
    <div class="project-links"><a class="project-btn primary" data-case="${p.id}" href="?project=${p.id}#projects">Case study <span aria-hidden="true">↗</span></a>${p.links[0] ? renderLinks(p.links.slice(0,1)) : ''}</div></div>
    ${p.isNew ? '<span class="project-new-pill">New work</span>' : ''}</article>`;
}
export function renderCase(p) {
  validateProject(p);
  return `<p class="case-eyebrow">${escape(p.group)} · Portfolio project</p><h2 id="case-title">${escape(p.title)}</h2><p class="case-lead">${escape(p.description)}</p><img class="case-image" src="${escape(p.image)}" alt="${escape(p.imageAlt)}">
    <div class="case-sections">${[['problem','The question'],['approach','My approach'],['outcome','What the work shows'],['limitations','Scope & limitations']].map(([key,label]) => `<section><h3>${label}</h3><p>${escape(p[key])}</p></section>`).join('')}</div><div class="project-links">${renderLinks(p.links)}</div>`;
}
