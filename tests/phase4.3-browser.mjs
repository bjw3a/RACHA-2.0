import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const server=createServer(async(req,res)=>{try{const file=root+new URL(req.url,'http://localhost').pathname.slice(1);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(await readFile(file.endsWith('/')?file+'index.html':file));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/`;
const browser=await chromium.launch({headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
const errors=[];
try{
 const ctx=await browser.newContext();const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.spoken=[];window.cancelled=0;window.streams=[];
  Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'en-US'},{lang:'es-ES'},{lang:'es-MX'}],speak:u=>window.spoken.push({text:u.text,lang:u.lang,rate:u.rate}),cancel:()=>window.cancelled++}});
  window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
  const get=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async opts=>{const s=await get(opts);window.streams.push(s);return s;};
 });
 const enter=async(c=1,t='introductions')=>{await page.click('.brand');await page.click(`[data-course="${c}"]`);await page.click(`[data-unit="s${c}-u1"]`);await page.click(`[data-topic="${t}"]`);await page.click('#open-practice');};
 await page.goto(url);await enter();assert.equal(await page.locator('#choose-flashcards').count(),0);
 await page.locator('[data-listen]').first().click();assert.match(await page.locator('#practice-status').textContent(),/Sound is off/);
 await page.click('#sound');await page.locator('[data-listen]').first().click();assert.equal(await page.evaluate(()=>spoken.at(-1).lang),'es-MX');
 await page.locator('[data-listen]').first().click();assert.equal(await page.evaluate(()=>spoken.length),2);
 await page.click('#sound');assert.match(await page.locator('#practice-sound').textContent(),/Sound is off/);await page.click('#sound');
 const saved=await page.evaluate(()=>localStorage.getItem('racha-progress-v1'));
 await page.click('#record');await page.waitForFunction(()=>!document.querySelector('#stop-recording').disabled);
 await page.waitForTimeout(400);await page.click('#stop-recording');await page.waitForFunction(()=>!document.querySelector('#play-recording').disabled);
 assert(await page.evaluate(()=>streams.every(s=>s.getTracks().every(t=>t.readyState==='ended'))));
 await page.click('#play-recording');await page.waitForFunction(()=>document.querySelector('#practice-status').textContent.includes('Playing')||document.querySelector('#practice-status').textContent.includes('compare'));
 await page.click('#record');await page.waitForFunction(()=>!document.querySelector('#stop-recording').disabled);await page.click('#practice-next');
 assert(await page.evaluate(()=>streams.every(s=>s.getTracks().every(t=>t.readyState==='ended'))));assert(await page.locator('#play-recording').isDisabled());
 await page.click('#record');await page.waitForFunction(()=>!document.querySelector('#stop-recording').disabled);await page.click('.brand');assert(await page.evaluate(()=>streams.every(s=>s.getTracks().every(t=>t.readyState==='ended'))));
 await enter();await page.click('[data-practice="listening"]');assert(!(await page.locator('details p').isVisible()));await page.locator('[data-listen]').click();assert(await page.evaluate(()=>spoken.at(-1).text.length>30));
 const q=await page.locator('.question h3').textContent();const correct=await page.evaluate(async q=>{const {readings}=await import('./js/readings.js');return readings.introductions.questions.find(r=>r[0]===q)[1];},q);
 await page.getByRole('button',{name:correct,exact:true}).click();assert.match(await page.locator('#listening-feedback').textContent(),/Correct/);
 await page.locator('summary').click();assert(await page.locator('details p').isVisible());
 await mkdir('/tmp/racha-qa',{recursive:true});
 for(const width of [320,390,1366])for(const mode of ['sentences','vocabulary','listening']){
  await page.setViewportSize({width,height:900});await page.click(`[data-practice="${mode}"]`);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${mode} overflow`);
  assert(await page.locator('.practice-shell button').evaluateAll(bs=>bs.every(b=>b.getBoundingClientRect().height>=48)));
  if(mode==='sentences')await page.screenshot({path:`/tmp/racha-qa/practice-${width}.png`,fullPage:true});
 }
 assert.equal(await page.evaluate(()=>localStorage.getItem('racha-progress-v1')),saved);await page.reload();assert.equal(await page.evaluate(()=>localStorage.getItem('racha-progress-v1')),saved);
 await enter(2,'ser');assert(await page.locator('[lang="es"]').count());
 await page.evaluate(()=>navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError');});await page.click('#record');await page.waitForFunction(()=>document.querySelector('#practice-status').textContent.includes('Microphone unavailable'));await page.locator('[data-listen]').first().click();assert.match(await page.locator('#practice-status').textContent(),/Listening/);
 await page.evaluate(()=>window.MediaRecorder=undefined);await page.click('#record');assert.match(await page.locator('#practice-status').textContent(),/Microphone unavailable/);
 await page.click('#practice-back');await page.evaluate(()=>window.speechSynthesis.getVoices=()=>[]);await page.click('#open-practice');await page.locator('[data-listen]').first().click();assert.match(await page.locator('#practice-status').textContent(),/No Spanish voice/);
 await page.evaluate(()=>window.SpeechSynthesisUtterance=undefined);await page.locator('[data-listen]').first().click();assert.match(await page.locator('#practice-status').textContent(),/unavailable/);
 await page.click('#practice-back');await page.click('#play-level');for(const b of await page.locator('[data-side="es"]').all()){const id=await b.getAttribute('data-pair');await b.click();await page.click(`[data-side="en"][data-pair="${id}"]`);}assert(await page.locator('.mastery-result').isVisible());assert.match(await page.locator('.mastery-result').textContent(),/100%/);
 assert.deepEqual(errors,[]);console.log('PASS: Chromium real MediaRecorder with synthetic mic, stop/play/re-record/Next/home cleanup; Spanish speech API wiring (mock voice); sound control; hidden transcript and listening answers; both courses; denied/unsupported fallbacks; mobile/desktop 48px controls; unchanged practice progress; reload; existing mastery activity; no page errors.');
 await ctx.close();
}finally{await browser.close();server.close();}
