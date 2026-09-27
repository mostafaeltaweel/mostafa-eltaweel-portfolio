import {escape,groups,siteFields,validateProject,validateSite,renderCase} from '../app/content.mjs';
import * as api from '../app/api.mjs';
const $ = selector => document.querySelector(selector);
const form = $('#project-form');
const profileForm = $('#profile-form');
const demo = new URL(location.href).searchParams.get('demo') === '1';
let data={projects:[],site:null,versions:{}};
let selected=null,dirty=false,profileDirty=false,busy=false;
const notice = (message,error=false) => { $('#notice').textContent=(demo?'وضع تجربة محلي — التغييرات لن تُنشر للزوار.\n':'')+message; $('#notice').className=`notice${error?' error':demo?' demo':''}`; };
const unsaved = () => (!dirty && !profileDirty) || confirm('هناك تعديلات لم تُحفظ. هل تريد تركها؟');
function field(name) { return form.elements.namedItem(name); }
function fresh() { return {id:'',title:'',category:'',description:'',image:'',imageAlt:'',group:groups[0],order:Math.min(10000,Math.max(0,...data.projects.map(p=>p.order))+10),visible:false,wide:true,isNew:true,problem:'',approach:'',outcome:'',limitations:'',links:[]}; }
function linkRow(link={label:'',url:'',download:false}) {
  const row=document.createElement('div'); row.className='link-row';
  row.innerHTML=`<div class="fields-two"><label>اسم الزر<input class="link-label" value="${escape(link.label)}" maxlength="70" required dir="auto"></label><label>الرابط<input class="link-url" value="${escape(link.url)}" required dir="ltr"></label></div><label class="link-download"><input type="checkbox" class="link-download-check" ${link.download?'checked':''}> تنزيل ملف</label><button type="button" class="remove-link">إزالة الرابط</button>`;
  row.querySelector('button').addEventListener('click',()=>{row.remove();markDirty();}); $('#links-list').append(row);
}
function markDirty() { dirty=true; $('#save-state').textContent='تعديلات غير محفوظة'; }
function setProject(project) {
  selected=data.projects.some(p=>p.id===project.id)?project.id:null;
  form.reset();
  for(const [key,value] of Object.entries(project)) {const input=field(key); if(input) {if(input.type==='checkbox') input.checked=value; else input.value=value;}}
  field('id').readOnly=Boolean(selected);
  $('#links-list').replaceChildren(); project.links.forEach(linkRow);
  $('#editor-title').textContent=project.title||'إضافة مشروع';
  $('#editor-state').textContent=selected?(project.visible?'مشروع منشور':'مشروع مخفي'):'مشروع جديد';
  $('#delete-project').hidden=!selected;
  dirty=false; $('#save-state').textContent=''; updateSaveLabel(); renderList();
}
function updateSaveLabel(){ $('#save-project').textContent=field('visible').checked?'حفظ ونشر للجميع':'حفظ كمشروع مخفي'; }
function readProject() {
  const p=fresh();
  for(const key of Object.keys(p)){const input=field(key);if(input)p[key]=input.type==='checkbox'?input.checked:input.type==='number'?Number(input.value):input.value.trim();}
  p.links=[...document.querySelectorAll('.link-row')].map(row=>({label:row.querySelector('.link-label').value.trim(),url:row.querySelector('.link-url').value.trim(),download:row.querySelector('.link-download-check').checked}));
  return validateProject(p);
}
function renderList() {
  const query=$('#search').value.toLocaleLowerCase();
  const list=$('#project-list'); list.replaceChildren();
  const projects=data.projects.filter(p=>p.title.toLocaleLowerCase().includes(query)).sort((a,b)=>a.order-b.order);
  projects.forEach(p=>{ const b=document.createElement('button');b.type='button';b.className=`project-row${p.id===selected?' selected':''}`;b.innerHTML=`<strong dir="auto">${escape(p.title)}</strong><small>${p.visible?'● منشور':'○ مخفي'} · الترتيب ${p.order}</small>`;b.addEventListener('click',()=>{if(busy||!unsaved())return;profileDirty=false;populateProfile();setProject(p);});list.append(b); });
  if(!projects.length)list.innerHTML='<p class="muted">لا توجد مشاريع مطابقة.</p>';
  $('#published-count').textContent=data.projects.filter(p=>p.visible).length;
  $('#draft-count').textContent=data.projects.filter(p=>!p.visible).length;
}
function populateProfile() {
  const container=$('#profile-fields');container.replaceChildren();
  for(const [key,label] of Object.entries(siteFields)) {
    const long=['intro','about','background','diplomaDescription','trainingSummary'].includes(key);
    const wrapper=document.createElement('label');if(long)wrapper.className='full';wrapper.textContent=label;
    const input=document.createElement(long?'textarea':'input');input.name=key;input.required=true;input.maxLength=4000;input.dir=['email','phone','linkedin','github','resume','portrait'].includes(key)?'ltr':'auto';if(long)input.rows=3;if(key==='email')input.type='email';input.value=data.site?.[key]||'';wrapper.append(input);container.append(wrapper);
  }
  profileDirty=false;
}
async function refresh(keep=selected) {
  if(!demo) data=await api.loadPortfolio(true);
  data.projects.forEach(validateProject);if(data.site)validateSite(data.site);
  populateProfile();setProject(data.projects.find(p=>p.id===keep)||data.projects.sort((a,b)=>a.order-b.order)[0]||fresh());
}
async function run(task) {
  if(busy)return;busy=true;
  // Keep the form stable during uploads and saves.
  const disabled=[...document.querySelectorAll('button,input,textarea,select')].map(el=>[el,el.disabled]);disabled.forEach(([el])=>el.disabled=true);
  try{await task();}catch(error){notice(error.message,true);}finally{disabled.forEach(([el,value])=>el.disabled=value);busy=false;}
}
form.addEventListener('input',()=>{markDirty();updateSaveLabel();});
profileForm.addEventListener('input',()=>profileDirty=true);
$('#search').addEventListener('input',renderList);
$('#new-project').addEventListener('click',()=>{if(unsaved()){populateProfile();setProject(fresh());field('title').focus();}});
$('#add-link').addEventListener('click',()=>{if(document.querySelectorAll('.link-row').length>=6){notice('الحد الأقصى 6 روابط.',true);return;}linkRow();markDirty();});
form.addEventListener('submit',e=>{e.preventDefault();run(async()=>{
  const p=readProject();
  if(demo){if(!selected&&data.projects.some(x=>x.id===p.id))throw new Error('هذا المعرّف مستخدم.');data.projects=[...data.projects.filter(x=>x.id!==p.id),p];}
  else await api.saveProject(p,selected?data.versions[selected]:null);
  dirty=false;await refresh(p.id);notice(p.visible?'تم حفظ المشروع ونشره. افتح الموقع لمعاينة النتيجة.':'تم حفظ المشروع كمخفي عن الزوار.');
});});
$('#delete-project').addEventListener('click',()=>{if(!selected||!confirm('حذف هذا المشروع من الموقع؟ يمكنك إخفاؤه بدلًا من الحذف.'))return;run(async()=>{const id=selected;if(demo)data.projects=data.projects.filter(p=>p.id!==id);else await api.deleteProject(id,data.versions[id]);dirty=false;selected=null;await refresh(null);notice('تم حذف المشروع. الملفات المرفوعة تظل محفوظة.');});});
$('#preview').addEventListener('click',()=>{try{const p=readProject();$('#preview-content').innerHTML=renderCase(p);$('#preview-content').querySelectorAll('[src],[href]').forEach(el=>{const attr=el.hasAttribute('src')?'src':'href';const value=el.getAttribute(attr);if(!value.startsWith('https://'))el.setAttribute(attr,new URL(value,new URL('../',location.href)).href);});$('#preview-dialog').showModal();}catch(e){notice(e.message,true);}});
$('#preview-dialog .dialog-close').addEventListener('click',()=>$('#preview-dialog').close());
profileForm.addEventListener('submit',e=>{e.preventDefault();const values=Object.fromEntries(new FormData(profileForm));run(async()=>{const site=validateSite(values);if(!demo)await api.saveSite(site);data.site=site;profileDirty=false;notice('تم حفظ ونشر بياناتك.');});});
async function uploadFile(input,kind,callback) {
  const file=input.files[0];if(!file)return;
  await run(async()=>{if(demo)throw new Error('رفع الملفات متاح بعد ربط Supabase. في التجربة استخدم رابط صورة موجودة.');notice('جارٍ رفع الملف…');const url=await api.upload(file,kind);callback(url);notice('تم رفع الملف. احفظ النموذج لتحديث الموقع.');});input.value='';
}
$('#image-upload').addEventListener('change',e=>uploadFile(e.target,'image',url=>{field('image').value=url;markDirty();}));
$('#file-upload').addEventListener('change',e=>{if(document.querySelectorAll('.link-row').length>=6){notice('احذف رابطًا قبل رفع مرفق جديد.',true);e.target.value='';return;}uploadFile(e.target,'file',url=>{linkRow({label:'Download project',url,download:true});markDirty();});});
$('#resume-upload').addEventListener('change',e=>{if(e.target.files[0]&&!e.target.files[0].name.toLowerCase().endsWith('.pdf')){notice('اختر ملف PDF للسيرة الذاتية.',true);e.target.value='';return;}uploadFile(e.target,'file',url=>{profileForm.elements.namedItem('resume').value=url;profileDirty=true;});});
function tab(name) { if(!unsaved())return;dirty=false;profileDirty=false;populateProfile();setProject(data.projects.find(p=>p.id===selected)||fresh());for(const section of ['projects','profile']){$(`#${section}-panel`).hidden=section!==name;$(`#${section}-tab`).classList.toggle('active',section===name);$(`#${section}-tab`).setAttribute('aria-pressed',String(section===name));} }
$('#projects-tab').addEventListener('click',()=>tab('projects'));$('#profile-tab').addEventListener('click',()=>tab('profile'));
$('#refresh').addEventListener('click',()=>{if(unsaved())run(async()=>{await refresh();notice('البيانات محدثة.');});});
$('#export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),site:data.site,projects:data.projects},null,2)],{type:'application/json'});const link=document.createElement('a');const url=URL.createObjectURL(blob);link.href=url;link.download=`portfolio-backup-${new Date().toISOString().slice(0,10)}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notice('تم تنزيل بيانات المشاريع والملف الشخصي. النسخة تحتوي على روابط الوسائط؛ احتفظ بالملفات نفسها أيضًا.');});
$('#login-form').addEventListener('submit',e=>{e.preventDefault();const values=new FormData(e.target);run(async()=>{await api.signIn(values.get('email'),values.get('password'));e.target.reset();await enter();});});
$('#logout').addEventListener('click',()=>{if(!unsaved())return;run(async()=>{await api.signOut();location.reload();});});
window.addEventListener('beforeunload',e=>{if(dirty||profileDirty){e.preventDefault();e.returnValue='';}});
async function enter(){await refresh();$('#login-panel').hidden=true;$('#workspace').hidden=false;$('#logout').hidden=demo;notice('اختر مشروعًا للتعديل أو أضف عملًا جديدًا.');}
try {
  if(demo){const response=await fetch('../portfolio-backup.json');if(!response.ok)throw new Error('شغّل البناء أولًا لتجربة النسخة المحلية.');const seed=await response.json();data={projects:seed.projects,site:seed.site,versions:{}};await enter();}
  else if(!api.configured(await api.config())){$('#setup').hidden=false;notice('الموقع يعمل بالنسخة المحفوظة. إدارة المحتوى تحتاج ربط Supabase.');}
  else if(api.getSession()){try{await api.ensureAdmin();await enter();}catch(e){$('#login-panel').hidden=false;notice(e.message,true);}}
  else{$('#login-panel').hidden=false;notice('سجّل الدخول بحساب الأدمن.');}
} catch(e){notice(e.message,true);}
