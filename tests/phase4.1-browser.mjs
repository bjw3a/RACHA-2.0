// Real Chromium smoke/layout tests; no production build or server dependency.
import {chromium} from 'playwright';import {createServer} from 'node:http';import {readFile,mkdir} from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!pathname.startsWith('/racha/'))throw Error();const file=path.join(root,pathname.slice(7)||'index.html');res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html');res.end(await readFile(file));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/racha/`;
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
try {
 for(const [width,height] of [[320,568],[390,844],[1366,768]])for(const course of [1,2]){
  const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.evaluate(async(course)=>{const {fresh}=await import('./js/storage.js');const p=fresh();p.xp=530;p.lastTopic={course,topic:'ser'};p.mastery[`${course}:ser`]=Object.fromEntries(['match','quick','lives'].map(m=>[m,{completed:true,best:100}]));localStorage.setItem('racha-progress-v1',JSON.stringify(p));},course);
  await page.reload();await page.click('#resume');
  for(const light of [false,true]){
   if(light)await page.click('#theme');
   assert(await page.locator('.word-bank').isVisible());assert(await page.locator('#typed').isVisible());
   const prompt=await page.locator('#prompt').boundingBox(),bank=await page.locator('.word-bank').boundingBox(),input=await page.locator('#typed').boundingBox();
   assert(bank.y>=prompt.y+prompt.height&&input.y>=bank.y+bank.height);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.equal(await page.locator('.word-bank button').count(),0);
   for(const li of await page.locator('.word-bank li').all()){const b=await li.boundingBox();assert(b.x>=0&&b.x+b.width<=width);}
  }
  if(process.env.RACHA_SCREENSHOTS){await mkdir(process.env.RACHA_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.RACHA_SCREENSHOTS,`context-${course}-${width}.png`),fullPage:true});}
  await page.fill('#typed','incorrectxyz');await page.click('button[type="submit"]');assert((await page.locator('#feedback').textContent()).includes('Not quite'));await page.click('#next');
  const answer=await page.evaluate(async()=>{const {readings}=await import('./js/readings.js');const [a,b]=document.querySelector('#prompt').textContent.split('___');const s=readings.ser.text.split(/(?<=[.!?])\s+/u).find(s=>s.startsWith(a)&&s.endsWith(b));return s.slice(a.length,s.length-b.length);});
  await page.fill('#typed',answer);await page.click('button[type="submit"]');assert((await page.locator('#feedback').textContent()).includes('¡Correcto!'));
  await page.reload();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('racha-progress-v1')).xp),530);assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS: Spanish 1/2 Chromium desktop and mobile, dark/light themes, bank geometry, no overflow, typing, correct/incorrect answers, refresh persistence.');
}finally{await browser.close();server.close();}
