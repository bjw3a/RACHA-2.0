import {chromium} from 'playwright';import {createServer} from 'node:http';import {readFile,mkdir} from 'node:fs/promises';import {fileURLToPath} from 'node:url';import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));const server=createServer(async(req,res)=>{try{const p=new URL(req.url,'http://localhost').pathname;res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':'text/html');res.end(await readFile(root+(p==='/'?'index.html':p.slice(1))));}catch{res.statusCode=404;res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.RACHA_CHROMIUM||undefined,args:['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});const errors=[];
try{
 const context=await browser.newContext();const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.spoken=[];window.streams=[];
  Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'es-MX'}],cancel(){},speak:u=>{window.spoken.push(u.text);u.onend?.();}}});window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
  const get=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async o=>{const s=await get(o);window.streams.push(s);return s;};
  if(!localStorage.getItem('racha-progress-v1'))localStorage.setItem('racha-progress-v1',JSON.stringify({xp:570,achievements:['first'],sound:true,mastery:{'1:family':Object.fromEntries(['match','quick','lives','streak','story'].map(m=>[m,{best:100,completed:true,completedAt:'2026-10-07'}]))}}));
 });
 await page.goto(`http://127.0.0.1:${server.address().port}/`);
 const enter=async()=>{await page.click('.brand');await page.click('[data-course="1"]');await page.click('[data-unit="s1-u4"]');await page.click('[data-topic="family"]');assert.equal(await page.locator('#open-practice').count(),0);assert.equal(await page.locator('.level-map li').count(),8);};
 async function listening(mode,wrong=0){
  for(let n=0;n<10;n++){
   await page.click('[data-listen]');const spoken=await page.evaluate(()=>window.spoken.at(-1));
   if(mode==='choose'){
    const prompt=await page.locator('.question h3').textContent();const correct=await page.evaluate(async({spoken,prompt})=>{const {practiceBank}=await import('./js/practice-sessions.js');return practiceBank(1,'family').choose.find(q=>q.text===spoken&&q.prompt===prompt).answer;},{spoken,prompt});
    const buttons=page.locator('[data-answer]');for(let i=0;i<await buttons.count();i++)if(((await buttons.nth(i).textContent())===correct)===(n>=wrong)){await buttons.nth(i).click();break;}
   }else await page.fill('#dictation',n<wrong?'incorrecto':spoken);
   await page.click('#practice-check');assert(await page.locator('#practice-check').isDisabled());await page.click('#practice-next');
  }assert.match(await page.locator('.practice-finished').textContent(),new RegExp(`${10-wrong} / 10 correct`));
 }
 await enter();assert.match(await page.locator('.level-line').textContent(),/5 \/ 8/);await page.click('#play-level');await listening('choose',3);assert.match(await page.locator('#practice-title').textContent(),/Keep practicing/);await page.click('#practice-again');await listening('choose',2);await page.click('#finish-topic');assert.equal(await page.locator('#play-level').getAttribute('data-mode'),'type');await page.click('#play-level');await listening('type',2);await page.click('#finish-topic');assert.equal(await page.locator('#play-level').getAttribute('data-mode'),'record');await page.click('#play-level');
 // Real Chromium MediaRecorder / Audio with a synthetic microphone, not a stub.
 for(let n=0;n<10;n++){
  assert(await page.locator('#practice-next').isDisabled());await page.click('[data-listen]');await page.click('#record');await page.waitForFunction(()=>!document.querySelector('#record-indicator').hidden);await page.waitForTimeout(180);await page.click('#stop-recording');await page.waitForFunction(()=>!document.querySelector('#play-recording').hidden);assert(await page.locator('#practice-next').isDisabled());await page.click('#play-recording');await page.waitForFunction(()=>!document.querySelector('#practice-next').disabled);await page.click('#practice-next');
 }
 assert.match(await page.locator('#practice-title').textContent(),/Topic complete/);await page.click('#finish-topic');assert.match(await page.locator('details.completion').textContent(),/Read & Record: Completed/);assert(await page.locator('#send-unit-completion').isVisible());await page.fill('#unit-student-name','Ana & José');await page.click('#copy-unit-completion');await page.waitForFunction(()=>/cop/i.test(document.querySelector('#unit-completion-status').textContent));
 const saved=await page.evaluate(()=>localStorage.getItem('racha-progress-v1'));await page.reload();assert.equal(await page.evaluate(()=>localStorage.getItem('racha-progress-v1')),saved);await enter();assert.match(await page.locator('.level-line').textContent(),/8 \/ 8/);const xp=await page.evaluate(()=>JSON.parse(localStorage.getItem('racha-progress-v1')).xp);
 await page.locator('.level-map summary').click();await page.click('.level-map [data-mode="record"]');await page.evaluate(()=>navigator.mediaDevices.getUserMedia=async()=>{throw Error('denied');});await page.click('#record');await page.waitForFunction(()=>!document.querySelector('#practice-fallback').hidden);
 for(let n=0;n<10;n++){assert(await page.locator('#confirm-practice').isDisabled());assert(await page.locator('#practice-next').isDisabled());await page.click('[data-listen]');await page.check('#confirm-practice');await page.click('#practice-next');}
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('racha-progress-v1')).xp),xp);await page.click('#finish-topic');
 const out=process.env.RACHA_QA_DIR||'/tmp/racha44-qa';await mkdir(out,{recursive:true});
 for(const width of [320,390,768,1366])for(const light of [false,true]){
  await page.setViewportSize({width,height:900});await page.evaluate(v=>document.body.classList.toggle('light',v),light);await enter();await page.locator('.level-map summary').click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`path overflow ${width}`);
  if(width===390||width===1366)await page.screenshot({path:`${out}/${width}-${light?'light':'dark'}-path.png`,fullPage:true});
  for(const mode of ['choose','type','record']){
   await page.click(`.level-map [data-mode="${mode}"]`);if(mode==='record'){await page.click('#record');await page.waitForFunction(()=>!document.querySelector('#practice-fallback').hidden);}
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${light} ${mode}`);assert(await page.locator('.practice-shell button:visible').evaluateAll(bs=>bs.every(b=>b.getBoundingClientRect().height>=48)));
   if(width===390||width===1366)await page.screenshot({path:`${out}/${width}-${light?'light':'dark'}-${mode}.png`,fullPage:true});
   await page.click('#practice-back');await page.locator('.level-map summary').click();
  }
 }
 await page.click('.level-map [data-mode="type"]');await page.click('#sound');await page.click('[data-listen]');assert.match(await page.locator('#practice-status').textContent(),/Sound is off/);await page.click('#sound');await page.click('[data-listen]');await page.click('[data-listen]');await page.click('#practice-back');assert.equal(await page.locator('#choose-flashcards').count(),0);assert(await page.evaluate(()=>streams.every(s=>s.getTracks().every(t=>t.readyState==='ended'))));assert.deepEqual(errors,[]);
 console.log('PASS: Chromium 70/80% listening scores and unlocks, real synthetic-mic recording/playback on 10 prompts, denied-mic completion, replay XP, reload, summaries/copy, sound/replay, private cleanup, four widths/both themes/48px targets, no page errors.');await context.close();
}finally{await browser.close();server.close();}
