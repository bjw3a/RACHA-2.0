import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const server=createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname;if(!pathname.startsWith('/racha/'))throw Error();const file=path.join(root,pathname.slice(7)||'index.html');res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html');res.end(await readFile(file));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/racha/`;
const browser=await chromium.launch({headless:true});const errors=[];
const screens=process.env.RACHA_SCREENSHOTS;if(screens)await mkdir(screens,{recursive:true});
try{
 for(const [width,height] of [[320,568],[390,844],[1366,768]])for(const c of [1,2]){
  const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  await page.goto(url);await page.click(`[data-course="${c}"]`);await page.click('#choose-learn');
  assert.equal(await page.locator('[data-course]').count(),0);assert.equal(await page.locator('.unit-meta').count(),0);
  assert(await page.locator('h2').first().textContent()===`Spanish ${c}`);
  if(screens)await page.screenshot({path:path.join(screens,`learn-${c}-${width}.png`),fullPage:true});
  await page.click('#resume');assert(await page.locator('#unit-title').isVisible());
  await page.evaluate(async c=>{const {fresh}=await import('./js/storage.js');const {units}=await import('./js/curriculum.js');const {sequence}=await import('./js/progression.js');const p=fresh();p.xp=550;for(const t of units[c][0].topics){p.mastery[`${c}:${t}`]=Object.fromEntries(sequence.map(m=>[m,{best:100,completed:true,completedAt:'2026-09-28T12:00:00Z'}]));p.completionDates[`${c}:${t}`]='2026-09-28T12:00:00Z';}localStorage.setItem('racha-progress-v1',JSON.stringify(p));},c);
  await page.reload();await page.click(`[data-course="${c}"]`);await page.click('#choose-learn');await page.click(`[data-unit="s${c}-u1"]`);
  assert(await page.locator('#unit-complete-title').isVisible());assert(await page.locator('#send-unit-completion').isDisabled());
  await page.fill('#unit-student-name','María López');await page.click('#copy-unit-completion');
  await page.waitForFunction(()=>document.querySelector('#unit-completion-status').textContent.length>0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('racha-student-name-v1')),'María López');
  for(const light of [false,true]){
   if(light)await page.click('#theme');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(screens)await page.screenshot({path:path.join(screens,`completion-${c}-${width}-${light?'light':'dark'}.png`),fullPage:true});
  }
  await page.reload();await page.click(`[data-course="${c}"]`);await page.click('#choose-learn');await page.click(`[data-unit="s${c}-u1"]`);assert.equal(await page.inputValue('#unit-student-name'),'María López');
  await page.fill('#unit-student-name','Ana');await page.locator('#unit-student-name').blur();assert.equal(await page.evaluate(()=>localStorage.getItem('racha-student-name-v1')),'Ana');
  // Completion reporting does not gate learning or change XP.
  const topic=c===1?'greetings':'ser';await page.click(`[data-topic="${topic}"]`);await page.click('#play-level');assert(await page.locator('#prompt').isVisible());assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('racha-progress-v1')).xp),550);
  await page.click('.brand');await page.click(`[data-course="${c}"]`);await page.click('#choose-flashcards');await page.click('#fc-all');
  assert((await page.locator('#fc-known').textContent()).includes('NEXT CARD'));assert(await page.locator('#fc-known').isDisabled());await page.click('#fc-card');await page.click('#fc-known');assert.equal(await page.locator('#fc-count').textContent(),'2 / 30');
  for(const selector of ['#fc-known','#fc-again']){const b=await page.locator(selector).boundingBox();assert(b.y+b.height<=height);assert(b.height>=44);assert(b.x+b.width<=width);}
  if(screens)await page.screenshot({path:path.join(screens,`next-card-${c}-${width}.png`),fullPage:true});
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS: Phase 4.2.2 real Chromium, both courses at 320/390/1366px, Learn screen isolation, report layout in both themes, name reload/edit, copy, optional submission, Next Card above fold and advance.');
}finally{await browser.close();server.close();}
