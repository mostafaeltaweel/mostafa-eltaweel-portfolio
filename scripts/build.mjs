import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {escape, renderProject, validateProject, validateSite} from '../app/content.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const json = value => JSON.stringify(value).replace(/</g,'\\u003c');
function localPath(value) {
  if (/^https:\/\//i.test(value)) return null;
  const file = path.resolve(root,decodeURIComponent(value));
  if (!file.startsWith(root+path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`Missing local file: ${value}`);
  let current = root;
  for (const part of path.relative(root,file).split(path.sep)) { if (!fs.readdirSync(current).includes(part)) throw new Error(`File-name case mismatch: ${value}`); current = path.join(current,part); }
  return file;
}
export function build() {
  const site = validateSite(JSON.parse(read('content/site.json')));
  const all = fs.readdirSync(path.join(root,'content/projects')).filter(f => f.endsWith('.json')).sort().map(file => {
    const project = validateProject(JSON.parse(read(`content/projects/${file}`)));
    if (`${project.id}.json` !== file) throw new Error(`Project id must match filename: ${file}`);
    return project;
  });
  const projects = all.filter(p => p.visible).sort((a,b) => a.order-b.order || a.id.localeCompare(b.id));
  const files = [site.resume,site.portrait,...projects.flatMap(p => [p.image,...p.links.map(l => l.url)])].map(localPath).filter(Boolean);
  const supabaseUrl = (process.env.PUBLIC_SUPABASE_URL || '').replace(/\/$/,'');
  const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';
  if (Boolean(supabaseUrl) !== Boolean(supabaseKey)) throw new Error('Set both PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.');
  if (supabaseUrl && !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(supabaseUrl)) throw new Error('Use the Supabase project HTTPS URL.');
  if (supabaseKey && !supabaseKey.startsWith('sb_publishable_')) {
    let role; try { role = JSON.parse(Buffer.from(supabaseKey.split('.')[1],'base64url').toString()).role; } catch { /* invalid key */ }
    if (role !== 'anon') throw new Error('Only a public publishable/anon key is allowed. Never use a service_role or secret key.');
  }
  const siteUrl = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/` : 'https://mostafaeltaweel.github.io/mostafa-eltaweel-portfolio/');
  if (new URL(siteUrl).protocol !== 'https:') throw new Error('SITE_URL must use HTTPS.');
  // Once connected, do not expose an old project snapshot after an admin hides a project.
  const publicProjects = supabaseUrl ? [] : projects;
  const cards = supabaseUrl ? '<p class="empty-projects">Loading published projects…</p><noscript>Enable JavaScript to view the current projects.</noscript>' : projects.map(renderProject).join('\n');
  const fields = {...Object.fromEntries(Object.entries(site).map(([key,value]) => [key,escape(value)])),projects:cards,projectCount:publicProjects.length,siteUrl:escape(siteUrl),shareImage:escape(new URL('assets/images/financial-fraud.png',siteUrl.endsWith('/') ? siteUrl : siteUrl+'/').href),seed:json({site,projects:publicProjects})};
  const html = read('templates/index.html').replace(/\{\{(\w+)\}\}/g,(_,key) => { if (!(key in fields)) throw new Error(`Unknown field: ${key}`); return fields[key]; });
  const output = path.resolve(root,'_site');
  if (path.dirname(output) !== root || path.basename(output) !== '_site') throw new Error('Invalid output directory');
  fs.rmSync(output,{recursive:true,force:true});
  fs.mkdirSync(output,{recursive:true});
  for (const file of ['style.css','portfolio.css','script.js','.nojekyll','assets','app','admin']) fs.cpSync(path.join(root,file),path.join(output,file),{recursive:true});
  for (const file of files) { const dest = path.join(output,path.relative(root,file)); fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.copyFileSync(file,dest); }
  const config = JSON.stringify({supabaseUrl,supabaseKey},null,2);
  fs.writeFileSync(path.join(output,'config.json'),config);
  if (!supabaseUrl) fs.writeFileSync(path.join(output,'portfolio-backup.json'),json({version:1,site,projects}));
  fs.writeFileSync(path.join(output,'index.html'),html);
  fs.writeFileSync(path.join(root,'index.html'),html);
  fs.writeFileSync(path.join(root,'config.json'),config);
  fs.writeFileSync(path.join(output,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /admin/\n`);
  const literal = value => `'${JSON.stringify(value).replaceAll("'","''")}'::jsonb`;
  fs.mkdirSync(path.join(root,'supabase'),{recursive:true});
  const seedSql = `-- Run AFTER schema.sql. Existing content is never overwritten.\nINSERT INTO public.portfolio_site (id,data) VALUES ('main',${literal(site)}) ON CONFLICT DO NOTHING;\n` + all.map(p => `INSERT INTO public.portfolio_projects (id,data) VALUES ('${p.id}',${literal(p)}) ON CONFLICT DO NOTHING;`).join('\n');
  fs.writeFileSync(path.join(root,'supabase/seed.sql'),seedSql+'\n');
  console.log(`Built ${projects.length} public projects. Admin backend: ${supabaseUrl ? 'configured' : 'not connected (public snapshot available)'}.`);
  return html;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
