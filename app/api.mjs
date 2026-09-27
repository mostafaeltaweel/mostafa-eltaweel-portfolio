let settings;
let session;
let refreshTask;
export async function config() {
  if (!settings) { const res = await fetch(new URL('../config.json', import.meta.url), {cache:'no-store'}); if (!res.ok) throw new Error('تعذر تحميل إعدادات الموقع.'); settings = await res.json(); }
  return settings;
}
export function configured(c) { return Boolean(c.supabaseUrl && c.supabaseKey); }
function remember(value) { session = value; if (value) sessionStorage.setItem('portfolio-session', JSON.stringify(value)); else sessionStorage.removeItem('portfolio-session'); }
export function getSession() { if (session === undefined) { try { session = JSON.parse(sessionStorage.getItem('portfolio-session') || 'null'); } catch { session = null; } } return session; }
async function call(endpoint, {method='GET', body, auth=false, headers={}, raw=false} = {}) {
  const c = await config();
  if (!configured(c)) throw new Error('اربط Supabase أولًا؛ اتبع دليل SETUP-AR.md.');
  const token = auth ? await accessToken() : null;
  const bearer = token || (c.supabaseKey.startsWith('eyJ') ? c.supabaseKey : null);
  const res = await fetch(`${c.supabaseUrl}${endpoint}`, {method, cache:'no-store', signal:AbortSignal.timeout(raw ? 180000 : 20000), headers:{apikey:c.supabaseKey, ...(bearer ? {Authorization:`Bearer ${bearer}`} : {}), ...(!raw ? {'Content-Type':'application/json'} : {}), ...headers}, body:body === undefined ? undefined : raw ? body : JSON.stringify(body)});
  if (!res.ok) {
    let error = {}; try { error = await res.json(); } catch { /* non-JSON response */ }
    throw new Error(error.msg || error.message || error.error_description || `فشل الطلب (${res.status}).`);
  }
  if (res.status === 204) return null;
  const data = await res.text(); return data ? JSON.parse(data) : null;
}
export async function signIn(email, password) {
  const result = await call('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
  remember({...result,expires_at:Date.now() + result.expires_in * 1000});
  try { await ensureAdmin(); } catch (e) { await signOut(); throw e; }
}
export async function accessToken() {
  const s = getSession(); if (!s) throw new Error('سجّل الدخول أولًا.');
  if (s.expires_at > Date.now() + 60000) return s.access_token;
  if (!refreshTask) refreshTask = call('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:s.refresh_token}}).then(result => { remember({...result,expires_at:Date.now()+result.expires_in*1000}); return result.access_token; }).catch(e => { remember(null); throw e; }).finally(() => { refreshTask=null; });
  return refreshTask;
}
export async function signOut() { try { if (getSession()) await call('/auth/v1/logout',{method:'POST',auth:true}); } finally { remember(null); } }
export async function ensureAdmin() { if (await call('/rest/v1/rpc/is_portfolio_admin',{method:'POST',body:{},auth:true}) !== true) throw new Error('هذا الحساب لا يملك صلاحية إدارة الموقع.'); }
export async function loadPortfolio(admin=false) {
  const [projects,site] = await Promise.all([
    call('/rest/v1/portfolio_projects?select=id,data,updated_at&order=id',{auth:admin}),
    call('/rest/v1/portfolio_site?id=eq.main&select=data',{auth:admin})
  ]);
  return {projects:projects.map(row => ({...row.data,id:row.id})), site:site[0]?.data || null, versions:Object.fromEntries(projects.map(row => [row.id,row.updated_at]))};
}
export async function saveProject(project, version) {
  if (version) {
    const rows = await call(`/rest/v1/portfolio_projects?id=eq.${project.id}&updated_at=eq.${encodeURIComponent(version)}`,{method:'PATCH',auth:true,headers:{Prefer:'return=representation'},body:{data:project}});
    if (!rows?.length) throw new Error('المشروع تغيّر في نافذة أخرى. حدّث القائمة قبل الحفظ.');
  } else await call('/rest/v1/portfolio_projects',{method:'POST',auth:true,body:{id:project.id,data:project}});
}
export async function deleteProject(id,version) {
  const rows = await call(`/rest/v1/portfolio_projects?id=eq.${id}&updated_at=eq.${encodeURIComponent(version)}`,{method:'DELETE',auth:true,headers:{Prefer:'return=representation'}});
  if (!rows?.length) throw new Error('المشروع تغيّر. حدّث القائمة قبل الحذف.');
}
export async function saveSite(data) { await call('/rest/v1/portfolio_site?on_conflict=id',{method:'POST',auth:true,headers:{Prefer:'resolution=merge-duplicates'},body:{id:'main',data}}); }
export async function upload(file, kind) {
  const c = await config();
  const imageTypes = ['image/png','image/jpeg','image/webp'];
  const ext = file.name.split('.').pop().toLowerCase();
  const isImage = kind === 'image';
  if (isImage ? !imageTypes.includes(file.type) : !['pdf','pbix','xlsx','zip','mp4'].includes(ext)) throw new Error('نوع الملف غير مدعوم.');
  const max = isImage ? 8 : 45;
  if (file.size > max*1024*1024) throw new Error(`الحد ${max} MB. الملفات الأكبر يمكن إضافتها داخل assets أو عبر رابط خارجي.`);
  const filename = `${crypto.randomUUID()}.${ext}`;
  const mime = isImage ? file.type : 'application/octet-stream';
  await call(`/storage/v1/object/portfolio-media/${filename}`,{method:'POST',auth:true,raw:true,body:file,headers:{'Content-Type':mime,'x-upsert':'false'}});
  return `${c.supabaseUrl}/storage/v1/object/public/portfolio-media/${filename}`;
}
