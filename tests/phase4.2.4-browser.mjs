// Run with: node tests/phase4.2.3-browser.mjs (Playwright Chromium installed).
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const server=createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname;if(!pathname.startsWith('/racha/'))throw Error();const file=path.join(root,pathname.slice(7)||'index.html');res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html');res.end(await readFile(file));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}/racha/`,dir=await mkdtemp(path.join(tmpdir(),'racha-persist-'));
const options={headless:true,...(process.env.RACHA_CHROMIUM?{executablePath:process.env.RACHA_CHROMIUM,args:['--no-sandbox']}:{}),viewport:{width:390,height:844}};
let context;const errors=[];
const open=async()=>{context=await chromium.launchPersistentContext(dir,options);const page=context.pages()[0];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url());});await page.goto(url);return page;};
const choose=async(page,c)=>{await page.click(`[data-course="${c}"]`);assert.equal(await page.locator('#choose-flashcards').count(),0);};
try{
 let page=await open();
 for(const c of [1,2]){
  await choose(page,c);assert.equal(await page.locator('.unit-completed').count(),0);await page.click('.brand');
 }
 await page.evaluate(async()=>{
  const {fresh,KEY}=await import('./js/storage.js'),{units}=await import('./js/curriculum.js'),{sequence}=await import('./js/progression.js');const p=fresh();p.xp=730;p.achievements=['first'];
  for(const c of [1,2])for(const [i,u] of units[c].entries()){
   for(const t of u.topics)p.mastery[`${c}:${t}`]=Object.fromEntries(sequence.map(m=>[m,{best:80,completed:true,completedAt:'2026-09-28T12:00:00Z'}]));
   if(i%2)p.mastery[`${c}:${u.topics[0]}`][sequence[4]].completed=false;
  }localStorage.setItem(KEY,JSON.stringify(p));
 });
 const saved=await page.evaluate(()=>localStorage.getItem('racha-progress-v1'));
 await page.reload();
 for(const c of [1,2]){
  await choose(page,c);
  const expected=await page.evaluate(async c=>{const {load}=await import('./js/storage.js'),{units}=await import('./js/curriculum.js'),{unitComplete}=await import('./js/unit-completion.js');return units[c].filter(u=>unitComplete(load(),c,u)).map(u=>u.id);},c);
  const actual=()=>page.locator('.unit-card:has(.unit-completed)').evaluateAll(bs=>bs.map(b=>b.dataset.unit));
  assert.deepEqual(await actual(),expected);
  for(const width of [320,390,1366]){await page.setViewportSize({width,height:844});for(const light of [false,true]){await page.evaluate(light=>document.body.classList.toggle('light',light),light);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}}
  if(process.env.RACHA_SCREENSHOTS)await page.screenshot({path:`${process.env.RACHA_SCREENSHOTS}/units-${c}.png`,fullPage:true,animations:'disabled'});
  await page.click(`[data-unit="s${c}-u1"]`);assert(await page.locator('#send-unit-completion').isEnabled());
  await page.click('#change-unit');assert.deepEqual(await actual(),expected);
  await page.reload();await choose(page,c);assert.deepEqual(await actual(),expected);await page.click('.brand');
 }
 assert.equal(await page.evaluate(()=>localStorage.getItem('racha-progress-v1')),saved);
 await context.close();page=await open();
 for(const c of [1,2]){await choose(page,c);assert(await page.locator(`[data-unit="s${c}-u1"] .unit-completed`).isVisible());assert.equal(await page.locator(`[data-unit="s${c}-u2"] .unit-completed`).count(),0);await page.click('.brand');}
 assert.equal(await page.evaluate(()=>localStorage.getItem('racha-progress-v1')),saved);assert.deepEqual(errors,[]);
 console.log('PASS: both courses, every unit matches existing unitComplete, incomplete units unmarked, 80% completed units marked, navigation, refresh, full browser restart with persistent storage, unchanged saved progress, configured email button, subdirectory hosting, mobile/desktop and both themes.');
}finally{if(context)await context.close();server.close();await rm(dir,{recursive:true,force:true});}
