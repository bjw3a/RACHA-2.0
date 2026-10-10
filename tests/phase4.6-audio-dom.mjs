import {JSDOM} from 'jsdom';import fs from 'node:fs';import assert from 'node:assert/strict';
import {practiceBank} from '../js/practice-sessions.js';import {sequence} from '../js/progression.js';
import {load} from '../js/storage.js';
const dom=new JSDOM(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'https://racha.test',pretendToBeVisual:true}),w=dom.window;
for(const k of ['document','localStorage','window'])globalThis[k]=k==='window'?w:w[k];w.scrollTo=()=>{};globalThis.confirm=()=>true;
const spoken=[],streams=[],players=[];
w.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};w.speechSynthesis={getVoices:()=>[{lang:'es-MX'}],speak:u=>{spoken.push(u);u.onend?.();},cancel(){}};
Object.defineProperty(globalThis,'navigator',{value:{mediaDevices:{getUserMedia:async()=>{const track={readyState:'live',stop(){this.readyState='ended';}};streams.push(track);return {getTracks:()=>[track]};}}},configurable:true});
class Recorder{static isTypeSupported(){return true;}constructor(){this.state='inactive';this.mimeType='audio/webm';}start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['sound'])});queueMicrotask(()=>this.onstop?.());}}w.MediaRecorder=Recorder;
globalThis.Audio=class{constructor(){players.push(this);}pause(){}async play(){}};
const cases=[[1,'s1-u4','family'],[1,'s1-u1','greetings'],[1,'s1-u2','time'],[1,'s1-u6','adjectives'],[2,'s2-u3','er']];
// Resolve curriculum ids rather than assuming unit placement.
const {units}=await import('../js/curriculum.js');for(const row of cases)row[1]=units[row[0]].find(u=>u.topics.includes(row[2])).id;
const mastery=Object.fromEntries(cases.map(([c,u,t])=>[`${c}:${t}`,Object.fromEntries(['match','quick','lives','streak','story'].map(m=>[m,{completed:true,best:100,completedAt:'2026-10-07'}]))]));
localStorage.setItem('racha-progress-v1',JSON.stringify({xp:570,correct:50,games:5,achievements:['first'],sound:true,bests:{'1:days:quick':90},mastery}));
await import('../js/app.js');const $=s=>document.querySelector(s),click=s=>{assert($(s),s);assert(!$(s).disabled,s+' disabled');$(s).click();};const tick=async()=>{await Promise.resolve();await Promise.resolve();};
function enter(c,u,t){click('.brand');click(`[data-course="${c}"]`);click(`[data-unit="${u}"]`);click(`[data-topic="${t}"]`);assert(!$('#open-practice'));assert.equal(document.querySelectorAll('.level-map li').length,8);}
async function session(c,t,mode,wrong=0){
 for(let n=0;n<10;n++){
  assert($('.eyebrow').textContent.includes(`LEVEL ${{choose:4,type:5,record:6}[mode]}`));assert.equal($('#practice-progress').textContent,`${n+1} / 10`);click('[data-listen]');const text=spoken.at(-1).text;
  if(mode==='record'){
   assert($('#practice-next').disabled);assert.equal($('#speaking-prompt').textContent,text);
   click('#record');await tick();assert(!$('#record-indicator').hidden);click('#stop-recording');await tick();assert($('#practice-next').disabled);
   click('#play-recording');await tick();assert($('#practice-next').disabled,'wait for playback to end');players.at(-1).onended();assert(!$('#practice-next').disabled);
   if(n===0){click('#record');await tick();assert($('#practice-next').disabled,'re-record invalidates prior playback');click('#stop-recording');await tick();click('#play-recording');await tick();players.at(-1).onended();}
  }else{
   assert($('#practice-transcript').hidden);assert($('#practice-next').hidden);
   if(mode==='choose'){
    const q=practiceBank(c,t).choose.find(q=>q.text===text&&q.prompt===$('.question h3').textContent);assert(q);
    const choices=[...document.querySelectorAll('[data-answer]')];choices.find(b=>(b.textContent===q.answer)===(n>=wrong)).click();
   }else $('#dictation').value=n<wrong?'incorrecto':text.toUpperCase().replace(/[ÁÉÍÓÚ]/g,c=>({Á:'A',É:'E',Í:'I',Ó:'O',Ú:'U'}[c]));
   click('#practice-check');assert(!$('#practice-next').hidden);assert($('#practice-check').disabled);assert(!$('#practice-transcript').hidden);
  }click('#practice-next');
 }
 assert($('.practice-finished'));if(mode!=='record')assert($('.practice-finished').textContent.includes(`${10-wrong} / 10 correct`));
}
for(const [c,u,t] of cases){
 enter(c,u,t);assert($('.level-line').textContent.includes('5 / 8'));assert.equal($('#play-level').dataset.mode,'choose');click('#play-level');
 await session(c,t,'choose',3);assert(!load().mastery[`${c}:${t}`].choose.completed);click('#practice-again');await session(c,t,'choose',2);
 click('#finish-topic');assert.equal($('#play-level').dataset.mode,'type');assert.equal(document.querySelectorAll('.level-map button:disabled').length,1);click('#play-level');
 await session(c,t,'type',2);click('#finish-topic');assert.equal($('#play-level').dataset.mode,'record');click('#play-level');await session(c,t,'record');
 assert.equal($('#practice-title').textContent,'Topic complete!');click('#finish-topic');assert($('.completion'));assert($('details.completion').textContent.includes('Read & Record: Completed (practice; no pronunciation grade)'));assert(!$('details.completion').textContent.includes('null%'));
 click('#copy-completion');await tick();assert($('#copy-fallback').value.includes('Listen & Choose: 80%'));
 assert($('.level-line').textContent.includes('8 / 8'));assert.equal(load().mastery[`${c}:${t}`].record.best,null);
}
const [c,u,t]=cases[0];enter(c,u,t);const xp=load().xp;
click('[data-mode="record"]');navigator.mediaDevices.getUserMedia=async()=>{throw Error('denied');};
for(let n=0;n<10;n++){
 assert($('#practice-next').disabled);if(n===0){click('#record');await tick();}
 assert(!$('#practice-fallback').hidden);assert($('#confirm-practice').disabled);click('[data-listen]');assert(!$('#confirm-practice').disabled);assert($('#practice-next').disabled);$('#confirm-practice').checked=true;$('#confirm-practice').dispatchEvent(new w.Event('change'));click('#practice-next');
}
assert.equal(load().xp,xp);click('#finish-topic');click('[data-mode="record"]');w.MediaRecorder=undefined;click('#record');await tick();assert(!$('#practice-fallback').hidden);
click('#sound');click('[data-listen]');assert($('#practice-status').textContent.includes('Sound is off'));assert($('#confirm-practice').disabled);click('#sound');
w.speechSynthesis.getVoices=()=>[];click('[data-listen]');assert(!$('#confirm-practice').disabled);assert($('#fallback-instruction').textContent.startsWith('Read the Spanish'));assert($('#practice-next').disabled);$('#confirm-practice').checked=true;$('#confirm-practice').dispatchEvent(new w.Event('change'));click('#practice-next');assert($('#practice-next').disabled);click('#practice-back');
click('[data-mode="type"]');click('#theme');assert(document.body.classList.contains('light'));click('#theme');assert(!document.body.classList.contains('light'));click('#practice-back');assert(!$('#choose-flashcards'));
assert(streams.every(t=>t.readyState==='ended'));assert.equal(load().bests['1:days:quick'],90);assert(load().xp>=570);assert.equal(new Set(load().achievements).size,load().achievements.length);
console.log('PASS: 20 integrated sessions across family/greetings/time/adjectives/Spanish 2; failed then passed listening; 4→5→6 with saved original levels; per-prompt recording/playback/re-record gates; denied/missing mic; sound off; missing voice; explicit fallback; private cleanup; summaries/copy/replay XP; both themes.');dom.window.close();
