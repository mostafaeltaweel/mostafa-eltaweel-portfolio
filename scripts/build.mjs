import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function required(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label}: enter non-empty text.`);
  return value;
}
function url(value, label) {
  required(value, label);
  if (/^https?:\/\//i.test(value)) { new URL(value); return value; }
  if (/^[a-z][a-z\d+.-]*:|^[/\\]|[?#\\]/i.test(value)) throw new Error(`${label}: use https:// or a relative file path.`);
  const local = path.resolve(root, decodeURIComponent(value));
  if (!local.startsWith(root + path.sep) || !fs.existsSync(local) || !fs.statSync(local).isFile()) {
    throw new Error(`${label}: file does not exist: ${value}`);
  }
  return value;
}
export function renderProject(project, label = 'project') {
  for (const key of ['title','category','description','imageAlt']) required(project[key], `${label}.${key}`);
  url(project.image, `${label}.image`);
  if (!Number.isFinite(project.order)) throw new Error(`${label}.order: enter a number.`);
  for (const key of ['visible','wide','isNew']) if (typeof project[key] !== 'boolean') throw new Error(`${label}.${key}: use true or false.`);
  if (!Array.isArray(project.links)) throw new Error(`${label}.links: use a list.`);
  const links = project.links.map((link, index) => {
    required(link.label, `${label}.links[${index}].label`);
    url(link.url, `${label}.links[${index}].url`);
    if (typeof link.download !== 'boolean') throw new Error(`${label}.links[${index}].download: use true or false.`);
    return `<a href="${escape(link.url)}" ${link.download ? 'download' : 'target="_blank" rel="noopener noreferrer"'} class="project-btn${index === 0 ? ' primary' : ''}">${escape(link.label)}</a>`;
  }).join('\n');
  return `<div class="project-card${project.wide ? ' wide' : ''} reveal${project.isNew ? ' new-project' : ''}">
    <img src="${escape(project.image)}" alt="${escape(project.imageAlt)}" loading="lazy">
    <div class="project-overlay">
      <div class="project-tag">${escape(project.category)}</div>
      <div class="project-name">${escape(project.title)}</div>
      <div class="project-desc">${escape(project.description)}</div>
      <div class="project-links">${links}</div>
    </div>
${project.isNew ? '    <span class="project-new-pill">New</span>' : ''}
  </div>`;
}
export function build() {
  const site = JSON.parse(read('content/site.json'));
  const projects = fs.readdirSync(path.join(root, 'content/projects')).filter(f => f.endsWith('.json')).sort().map(file => {
    const data = JSON.parse(read(`content/projects/${file}`));
    return {data, html:renderProject(data, file)};
  }).filter(project => project.data.visible).sort((a,b) => a.data.order-b.data.order);
  const fields = Object.fromEntries(['specialty','tagline','intro','about','background'].map(key => [key, escape(required(site[key], `site.${key}`))]));
  fields.projects = projects.map(project => project.html).join('\n');
  fields.projectCount = String(projects.length);
  const html = read('templates/index.html').replace(/\{\{(\w+)\}\}/g, (_,key) => {
    if (!(key in fields)) throw new Error(`Unknown template field: ${key}`);
    return fields[key];
  });
  // Copy only public website files into the deployment directory.
  const output = path.join(root, '_site');
  if (path.dirname(output) !== root || path.basename(output) !== '_site') throw new Error('Invalid output directory.');
  fs.rmSync(output, {recursive:true, force:true});
  fs.mkdirSync(output, {recursive:true});
  for (const file of ['style.css','script.js','.nojekyll','assets']) {
    fs.cpSync(path.join(root,file), path.join(output,file), {recursive:true});
  }
  for (const {data} of projects) {
    for (const file of [data.image, ...data.links.map(link => link.url)]) {
      if (/^https?:\/\//i.test(file)) continue;
      const relative = decodeURIComponent(file);
      fs.mkdirSync(path.dirname(path.join(output, relative)), {recursive:true});
      fs.copyFileSync(path.join(root, relative), path.join(output, relative));
    }
  }
  fs.writeFileSync(path.join(output,'index.html'),html);
  fs.writeFileSync(path.join(root,'index.html'),html);
  console.log(`Built ${projects.length} visible projects into _site.`);
  return html;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
