import {chromium} from 'playwright';import {createServer} from 'node:http';import {readFile,mkdir} from 'node:fs/promises';import {fileURLToPath} from 'node:url';import assert from 'node:assert/strict';
import {units,orderedTopics} from '../js/curriculum.js';import {sequence} from '../js/progression.js';
const root=fileURLToPath(new URL('../',import.meta.url));const server=createServer(async(req,res)=>{try{const p=new URL(req.url,'http://localhost').pathname;res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':'text/html');res.end(await readFile(root+(p==='/'?'index.html':p.slice(1))));}catch{res.statusCode=404;res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.RACHA_CHROMIUM||undefined,args:['--no-sandbox','--disable-gpu']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());await page.goto(`http://127.0.0.1:${server.address().port}`);
 for(const c of [1,2])for(const u of units[c]){await page.click('.brand');await page.click(`[data-course="${c}"]`);await page.click(`[data-unit="${u.id}"]`);assert.deepEqual(await page.locator('[data-topic]').evaluateAll(bs=>bs.map(b=>b.dataset.topic)),orderedTopics(u));const boxes=await page.locator('[data-topic]').evaluateAll(bs=>bs.map(b=>({top:b.offsetTop,left:b.offsetLeft})));assert(boxes.at(-1).top>=boxes[0].top);}
 const done=Object.fromEntries(sequence.map(m=>[m,{completed:true,best:m==='record'?null:100}]));
 const seed=async mastery=>{await page.evaluate(m=>localStorage.setItem('racha-progress-v1',JSON.stringify({mastery:m,xp:123,achievements:['first']})),mastery);await page.reload();};
 const enter=async t=>{await page.click('.brand');await page.click('[data-course="1"]');await page.click('[data-unit="s1-u1"]');await page.click(`[data-topic="${t}"]`);};
 await seed({'1:greetings':done});await enter('greetings');await page.click('#next-topic');assert.equal(await page.locator('.game-top h2').textContent(),'Match-Up');assert.match(await page.locator('.eyebrow').first().textContent(),/Introductions/);
 await seed({'1:greetings':done,'1:introductions':done});await enter('introductions');assert.equal(await page.locator('#send-unit-completion').count(),0);await page.click('#next-topic');assert.match(await page.locator('.eyebrow').first().textContent(),/Mixed review/);
 await seed({'1:greetings':done,'1:introductions':done,'1:unit:s1-u1':done});await enter('unit:s1-u1');assert.equal(await page.locator('#next-topic').count(),0);assert(await page.locator('#copy-unit-completion').isVisible());assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('racha-progress-v1')).xp),123);
 await mkdir('/tmp/racha471-qa',{recursive:true});
 await seed({'1:greetings':done,'2:ser':done});
 for(const c of [1,2])for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[1366,768]])for(const light of [false,true])for(const mode of sequence){
  await page.click('.brand');await page.click(`[data-course="${c}"]`);await page.click(`[data-unit="s${c}-u1"]`);await page.click(`[data-topic="${c===1?'greetings':'ser'}"]`);await page.setViewportSize({width,height});await page.evaluate(v=>document.body.classList.toggle('light',v),light);await page.locator('.level-map summary').click();await page.click(`.level-map [data-mode="${mode}"]`);await page.waitForTimeout(60);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`horizontal overflow ${width}/${mode}`);
  if(width===1366&&mode!=='story')assert(await page.locator('.question').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}),`question fit ${mode}`);
  if(mode==='record'){assert.equal(await page.locator('[data-listen]').count(),1);assert(await page.locator('#practice-next').isDisabled());}
  if(!light)await page.screenshot({path:`/tmp/racha471-qa/${c}-${width}-${mode}.png`});
 }
 assert.deepEqual(errors,[]);console.log('PASS: rendered topic order all 12 units; Next Topic/Review/Unit Complete; preserved XP; eight activities at 320/375/390/430/1366 widths in both themes; question fit except scrollable Story; single Hear Spanish; no browser errors.');
}finally{await browser.close();server.close();}
