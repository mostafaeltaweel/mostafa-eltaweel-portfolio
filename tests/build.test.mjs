import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
test('build, add, hide, delete, missing files and safe connected mode',()=>{
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'portfolio-build-test-'));
  try {
    for(const name of ['scripts','content','templates','app','admin'])fs.cpSync(path.join(root,name),path.join(temp,name),{recursive:true});
    for(const name of ['style.css','portfolio.css','script.js','.nojekyll'])fs.copyFileSync(path.join(root,name),path.join(temp,name));
    const projects=fs.readdirSync(path.join(temp,'content/projects')).map(file=>JSON.parse(fs.readFileSync(path.join(temp,'content/projects',file))));
    const site=JSON.parse(fs.readFileSync(path.join(temp,'content/site.json')));
    for(const value of [site.portrait,site.resume,...projects.flatMap(p=>[p.image,...p.links.map(l=>l.url)])]){if(value.startsWith('https://'))continue;const file=path.join(temp,decodeURIComponent(value));fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,'fixture');}
    const environment={...process.env,PUBLIC_SUPABASE_URL:'',PUBLIC_SUPABASE_ANON_KEY:'',SITE_URL:'https://portfolio.example/'};
    const build=env=>execFileSync(process.execPath,[path.join(temp,'scripts/build.mjs')],{env:{...environment,...env},stdio:'pipe'});
    const html=()=>fs.readFileSync(path.join(temp,'_site/index.html'),'utf8');
    build();assert.equal((html().match(/<article class="project-card/g)||[]).length,7);assert.ok(!html().includes('{{'));
    const file=path.join(temp,'content/projects/financial-fraud.json');const p=JSON.parse(fs.readFileSync(file));
    fs.writeFileSync(file,JSON.stringify({...p,visible:false}));build();assert.equal((html().match(/<article class="project-card/g)||[]).length,6);assert.ok(!html().includes('"id":"financial-fraud"'));
    fs.unlinkSync(file);build();assert.equal((html().match(/<article class="project-card/g)||[]).length,6);
    fs.writeFileSync(file,JSON.stringify({...p,order:0}));build();assert.equal((html().match(/<article class="project-card/g)||[]).length,7);
    const lastGood=html();fs.writeFileSync(file,'{invalid');assert.throws(()=>build());assert.equal(html(),lastGood);
    fs.writeFileSync(file,JSON.stringify({...p,image:'assets/missing.png'}));assert.throws(()=>build());
    fs.writeFileSync(file,JSON.stringify(p));
    assert.throws(()=>build({PUBLIC_SUPABASE_URL:'https://test.supabase.co',PUBLIC_SUPABASE_ANON_KEY:'sb_secret_FORBIDDEN'}));
    build({PUBLIC_SUPABASE_URL:'https://test.supabase.co',PUBLIC_SUPABASE_ANON_KEY:'sb_publishable_example'});
    assert.equal((html().match(/<article class="project-card/g)||[]).length,0);
    assert.ok(!fs.existsSync(path.join(temp,'_site/portfolio-backup.json')));
    assert.ok(!fs.existsSync(path.join(temp,'_site/supabase')));
  } finally {
    if(path.dirname(temp)!==path.resolve(os.tmpdir())||!path.basename(temp).startsWith('portfolio-build-test-'))throw new Error('Unsafe test path');
    fs.rmSync(temp,{recursive:true,force:true});
  }
});
