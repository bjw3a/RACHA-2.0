import {chromium} from 'playwright';import {createServer} from 'node:http';import {readFile,mkdir} from 'node:fs/promises';import {fileURLToPath} from 'node:url';import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));const server=createServer(async(req,res)=>{try{let p=new URL(req.url,'http://localhost').pathname;res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':'text/html');res.end(await readFile(root+(p==='/'?'index.html':p.slice(1))));}catch{res.statusCode=404;res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.RACHA_CHROMIUM||undefined,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});const errors=[];
try{const context=await browser.newContext();const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.spoken=[];window.streams=[];Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'es-MX'}],cancel(){},speak:u=>window.spoken.push(u.text)}});window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};const get=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async o=>{const s=await get(o);window.streams.push(s);return s;};});
 await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.click('#sound');
 const enter=async(c,unit,topic)=>{await page.click('.brand');await page.click(`[data-course="${c}"]`);await page.click(`[data-unit="${unit}"]`);await page.click(`[data-topic="${topic}"]`);assert(await page.evaluate(()=>!!(document.querySelector('.optional-practice').compareDocumentPosition(document.querySelector('.next-activity'))&Node.DOCUMENT_POSITION_FOLLOWING)));await page.click('#open-practice');assert.equal(await page.locator('[data-practice]').count(),3);};
 for(const [c,unit,topic] of [[1,'s1-u4','family'],[1,'s1-u1','greetings'],[1,'s1-u2','time'],[1,'s1-u6','adjectives'],[2,'s2-u3','er']]){
  await enter(c,unit,topic);const saved=await page.evaluate(()=>localStorage.getItem('racha-progress-v1'));
  for(const mode of ['choose','type','record']){
   await page.click(`[data-practice="${mode}"]`);
   for(let n=0;n<10;n++){
    assert.equal(await page.locator('#practice-progress').textContent(),`${n+1} / 10`);
    await page.locator('[data-listen]').first().click();const spoken=await page.evaluate(()=>window.spoken.at(-1));assert(spoken);
    if(mode==='record'){assert.equal(await page.locator('#speaking-prompt').textContent(),spoken);}
    else{
     assert(!(await page.locator('#practice-transcript').isVisible()));assert(!(await page.locator('#practice-next').isVisible()));
     if(mode==='choose'){
      const prompt=await page.locator('.question h3').textContent();const correct=await page.evaluate(async({c,topic,spoken,prompt})=>{const {practiceBank}=await import('./js/practice-sessions.js');return practiceBank(c,topic).choose.find(q=>q.text===spoken&&q.prompt===prompt).answer;},{c,topic,spoken,prompt});
      if(n===0){await page.locator('[data-answer]').filter({hasNotText:correct}).first().click();await page.click('#practice-check');assert.equal(await page.locator('#practice-feedback').textContent(),'Try again.');assert(!(await page.locator('#practice-transcript').isVisible()));}
      await page.getByRole('button',{name:correct,exact:true}).click();
     }else{
      if(n===0){await page.fill('#dictation','incorrecto');await page.click('#practice-check');assert.equal(await page.locator('#practice-feedback').textContent(),'Try again.');}
      await page.fill('#dictation',spoken.toUpperCase().replace(/[ÁÉÍÓÚ]/g,c=>({Á:'A',É:'E',Í:'I',Ó:'O',Ú:'U'}[c])).replace(/\s/g,'  '));
     }
     await page.click('#practice-check');assert.equal(await page.locator('#practice-feedback').textContent(),'✓ Correct!');assert(await page.locator('#practice-transcript').isVisible());
    }
    await page.click('#practice-next');
   }
   assert(await page.locator('.practice-finished').isVisible());if(mode!=='record')assert.match(await page.locator('.practice-finished').textContent(),/9 \/ 10 correct on the first try/);
   await page.click('#practice-again');assert.equal(await page.locator('#practice-progress').textContent(),'1 / 10');await page.click('#practice-menu-back');
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('racha-progress-v1')),saved);
 }
 // Real MediaRecorder with synthetic mic; denial and navigation remain non-blocking.
 await page.click('[data-practice="record"]');await page.click('#record');await page.waitForFunction(()=>!document.querySelector('#stop-recording').hidden);await page.waitForTimeout(400);await page.click('#stop-recording');await page.waitForFunction(()=>!document.querySelector('#play-recording').hidden);await page.click('#play-recording');await page.waitForFunction(()=>/Playing|compare/.test(document.querySelector('#practice-status').textContent));await page.click('#record');await page.waitForFunction(()=>!document.querySelector('#stop-recording').hidden);await page.click('#practice-menu-back');assert(await page.evaluate(()=>streams.every(s=>s.getTracks().every(t=>t.readyState==='ended'))));
 await page.click('[data-practice="record"]');await page.evaluate(()=>navigator.mediaDevices.getUserMedia=async()=>{throw Error('denied');});await page.click('#record');await page.waitForFunction(()=>/Microphone unavailable/.test(document.querySelector('#practice-status').textContent));await page.click('#practice-next');await page.evaluate(()=>window.MediaRecorder=undefined);await page.click('#record');assert.match(await page.locator('#practice-status').textContent(),/Microphone unavailable/);await page.click('#practice-menu-back');
 await mkdir('/tmp/racha431-qa',{recursive:true});
 for(const width of [320,390,1366])for(const light of [false,true]){
  await page.setViewportSize({width,height:900});await page.evaluate(v=>document.body.classList.toggle('light',v),light);
  for(const mode of ['menu','choose','type','record']){
   if(mode!=='menu')await page.click(`[data-practice="${mode}"]`);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${light} ${mode}`);
   assert(await page.locator('.practice-shell button:visible').evaluateAll(bs=>bs.every(b=>b.getBoundingClientRect().height>=48)));
   if((width===390||width===1366)&&!light)await page.screenshot({path:`/tmp/racha431-qa/${width}-${mode}.png`,fullPage:true});
   if(mode!=='menu')await page.click('#practice-menu-back');
  }
 }
 await page.click('[data-practice="type"]');await page.click('#sound');await page.locator('[data-listen]').click();assert.match(await page.locator('#practice-status').textContent(),/Sound is off/);await page.click('#sound');await page.locator('[data-listen]').click();await page.locator('[data-listen]').click();await page.click('#practice-back');
 assert.equal(await page.locator('#choose-flashcards').count(),0);const saved=await page.evaluate(()=>localStorage.getItem('racha-progress-v1'));await page.reload();assert.equal(await page.evaluate(()=>localStorage.getItem('racha-progress-v1')),saved);assert.deepEqual(errors,[]);
 console.log('PASS: 15 complete sessions over family/greetings/time/adjectives/Spanish 2; checks/retries/hidden transcripts/first-try scoring/restart/back; real synthetic-mic recording/play/re-record/cleanup; denied/unsupported mic; sound/replay; unchanged storage/reload; 320/390/1366 both themes, 48px targets; no page errors.');await context.close();
}finally{await browser.close();server.close();}
