// Browser integration against a mocked Supabase API. Does not replace live RLS checks.
const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const site=JSON.parse(fs.readFileSync('content/site.json'));
    let project=JSON.parse(fs.readFileSync('content/projects/financial-fraud.json'));
    let admin=true,conflict=false,loginCount=0,refreshCount=0,uploadCount=0,version='2026-09-27T10:00:00.000Z';
    await page.route('**/config.json',route=>route.fulfill({json:{supabaseUrl:'https://test.supabase.co',supabaseKey:'sb_publishable_test'}}));
    await page.route('https://test.supabase.co/**',async route=>{
      const req=route.request(),url=new URL(req.url()),method=req.method(),body=req.postData();
      const reply=(json,status=200)=>route.fulfill({status,json,headers:{'Access-Control-Allow-Origin':'*'}});
      if(method==='OPTIONS')return route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*','Access-Control-Allow-Methods':'GET,POST,PATCH,DELETE'}});
      if(url.pathname==='/auth/v1/token'){
        if(url.searchParams.get('grant_type')==='password'){loginCount++;assert.equal(JSON.parse(body).email,'owner@example.com');assert.equal(JSON.parse(body).password,'test-password');}
        else refreshCount++;
        return reply({access_token:'test-session',refresh_token:'test-refresh',expires_in:3600,user:{id:'owner'}});
      }
      if(url.pathname==='/auth/v1/logout')return reply({});
      if(url.pathname==='/rest/v1/rpc/is_portfolio_admin')return reply(admin);
      if(url.pathname.startsWith('/storage/v1/object/')){uploadCount++;assert.equal(req.headers().authorization,'Bearer test-session');return reply({Key:'uploaded'});}
      if(url.pathname==='/rest/v1/portfolio_site'){
        if(method==='POST'){Object.assign(site,JSON.parse(body).data);return reply(null,201);}
        return reply([{data:site}]);
      }
      if(url.pathname==='/rest/v1/portfolio_projects'){
        if(method==='GET')return reply(project?[{id:project.id,data:project,updated_at:version}]:[]);
        assert.equal(req.headers().authorization,'Bearer test-session');
        if(method==='PATCH'){if(conflict)return reply([]);project=JSON.parse(body).data;version='2026-09-27T10:00:01.000Z';return reply([{id:project.id,data:project,updated_at:version}]);}
        if(method==='DELETE'){project=null;return reply([{id:'financial-fraud'}]);}
      }
      throw new Error(`Unexpected API: ${method} ${url}`);
    });
    await page.goto('http://127.0.0.1:4173/admin/');
    await page.locator('#login-panel:not([hidden])').waitFor();
    await page.locator('[name=email]').fill('owner@example.com');await page.locator('[name=password]').fill('test-password');
    await page.locator('#login-form button').click();await page.locator('#workspace:not([hidden])').waitFor();assert.equal(loginCount,1);
    await page.locator('#project-form [name=title]').fill('API saved project');await page.locator('#save-project').click();await page.getByText('تم حفظ المشروع ونشره.',{exact:false}).waitFor();assert.equal(project.title,'API saved project');
    conflict=true;await page.locator('#project-form [name=title]').fill('Conflicting update');await page.locator('#save-project').click();await page.getByText('المشروع تغيّر في نافذة أخرى.',{exact:false}).waitFor();assert.equal(project.title,'API saved project');
    conflict=false;page.once('dialog',d=>d.accept());await page.locator('#refresh').click();await page.getByText('البيانات محدثة.',{exact:true}).waitFor();
    await page.evaluate(()=>{const s=JSON.parse(sessionStorage.getItem('portfolio-session'));s.expires_at=0;sessionStorage.setItem('portfolio-session',JSON.stringify(s));});await page.reload();await page.locator('#workspace:not([hidden])').waitFor();assert.equal(refreshCount,1);
    await page.locator('#image-upload').setInputFiles('assets/images/financial-fraud.png');await page.getByText('تم رفع الملف. احفظ النموذج',{exact:false}).waitFor();assert.equal(uploadCount,1);assert.match(await page.locator('[name=image]').inputValue(),/^https:\/\/test.supabase.co\/storage/);
    page.once('dialog',d=>d.accept());await page.locator('#logout').click();await page.locator('#login-panel:not([hidden])').waitFor();
    admin=false;await page.locator('[name=email]').fill('owner@example.com');await page.locator('[name=password]').fill('test-password');await page.locator('#login-form button').click();await page.getByText('هذا الحساب لا يملك صلاحية',{exact:false}).waitFor();assert.equal(await page.locator('#workspace').isVisible(),false);
    await page.goto('http://127.0.0.1:4173/');await page.getByRole('heading',{name:'API saved project',exact:true}).waitFor();assert.equal(await page.locator('.project-card').count(),1);
    assert.deepEqual(errors,[]);console.log('Mock API browser checks passed: login payload, save, conflict, refresh token, upload, logout, non-admin rejection, public refresh.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
