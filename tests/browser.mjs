// Real Chromium smoke/layout tests; no production build or server dependency.
import {chromium} from 'playwright';import {createServer} from 'node:http';import {readFile,mkdir} from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!pathname.startsWith('/racha/'))throw Error();const file=path.join(root,pathname.slice(7)||'index.html');res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html');res.end(await readFile(file));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/racha/`;
const browser=await chromium.launch({headless:true});let page;const errors=[];
const screens=process.env.RACHA_SCREENSHOTS;if(screens)await mkdir(screens,{recursive:true});
try{
 for(const [width,height] of [[320,568],[390,844],[768,1024],[1366,768]]){
  page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
  await page.goto(url);await page.click('[data-course="1"]');await page.click('#choose-learn');await page.click('[data-unit="s1-u2"]');await page.click('[data-topic="days"]');
  assert.equal(await page.locator('#play-level').getAttribute('data-mode'),'match');const box=await page.locator('#play-level').boundingBox();assert(box.y>=0&&box.y+box.height<=height,`PLAY above fold at ${width}`);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No horizontal overflow at ${width}`);
  assert.equal(await page.locator('.level-map button:disabled').count(),4);
  if(screens)await page.screenshot({path:path.join(screens,`path-${width}.png`),fullPage:true});
  await page.click('#play-level');const ids=await page.locator('[data-side="es"]').evaluateAll(bs=>bs.map(b=>b.dataset.pair));
  for(const id of ids){await page.click(`[data-side="es"][data-pair="${id}"]`);await page.click(`[data-side="en"][data-pair="${id}"]`);}
  assert.equal(await page.locator('.mastery-result>strong').textContent(),'100%');assert(await page.locator('#next-level').isVisible());const nextBox=await page.locator('#next-level').boundingBox();assert(nextBox.y+nextBox.height<=height,`NEXT LEVEL above fold at ${width}`);
  if(screens)await page.screenshot({path:path.join(screens,`result-${width}.png`),fullPage:true});
  await page.reload();await page.click('[data-course="1"]');await page.click('#choose-learn');await page.click('[data-unit="s1-u2"]');await page.click('[data-topic="days"]');assert.equal(await page.locator('#play-level').getAttribute('data-mode'),'quick');
  await page.click('#play-level');assert(await page.locator('#prompt').isVisible());await page.click('.choice');assert(await page.locator('#feedback').isVisible());
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  page.on('dialog',d=>d.accept());await page.click('#leave');await page.click('.brand');await page.click('[data-course="2"]');await page.click('#choose-learn');await page.click('[data-unit="s2-u1"]');await page.click('[data-topic="ser"]');assert.equal(await page.locator('#play-level').getAttribute('data-mode'),'match');
  if(width===320){
   const {units,reviewId}=await import('../js/curriculum.js');
   for(const c of [1,2]){await page.click('.brand');await page.click(`[data-course="${c}"]`);await page.click('#choose-learn');
    for(const unit of units[c]){await page.click(`[data-unit="${unit.id}"]`);
     for(const topic of [reviewId(unit),...unit.topics]){await page.click(`[data-topic="${topic}"]`);const rect=await page.locator('#play-level').boundingBox();assert(rect.y+rect.height<=height,`PLAY visible for ${topic} at 320`);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.click('#change-topic');}
     await page.click('#change-unit');}
    await page.click('#course-review');const rect=await page.locator('#play-level').boundingBox();assert(rect.y+rect.height<=height);}
  }
  await page.click('#theme');assert(await page.locator('body').evaluate(b=>b.classList.contains('light')));
  if(screens)await page.screenshot({path:path.join(screens,`light-${width}.png`),fullPage:true});await page.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS: Chromium at 320×568, 390×844, 768×1024, 1366×768; PLAY above fold, no horizontal overflow, match → next, refresh persistence, question UI, course isolation, light theme, relative subpath assets, no browser/resource errors.');
}finally{await browser.close();server.close();}
