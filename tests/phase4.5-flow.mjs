import {JSDOM} from 'jsdom';import FakeTimers from '@sinonjs/fake-timers';import fs from 'node:fs';import assert from 'node:assert/strict';
import {generate,isCorrect,application,story} from '../js/data.js';import {practiceBank} from '../js/practice-sessions.js';import {units} from '../js/curriculum.js';import {sequence} from '../js/progression.js';import {fresh} from '../js/storage.js';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
function setup(profile){
 const dom=new JSDOM(html,{url:'https://racha.test',pretendToBeVisual:true}),w=dom.window;for(const k of ['document','localStorage','window'])globalThis[k]=k==='window'?w:w[k];globalThis.confirm=()=>true;w.scrollTo=()=>{};
 Object.defineProperty(globalThis,'navigator',{value:{},configurable:true});w.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};w.speechSynthesis={getVoices:()=>[{lang:'es-MX'}],speak:u=>{w.spoken=u.text;u.onend?.();},cancel(){}};
 profile.sound=true;localStorage.setItem('racha-progress-v1',JSON.stringify(profile));return dom;
}
const $=s=>document.querySelector(s),click=s=>{assert($(s),s);assert(!$(s).disabled,`${s} disabled`);$(s).click();},saved=()=>JSON.parse(localStorage.getItem('racha-progress-v1'));
function enter(c,t){click(`[data-course="${c}"]`);click(`[data-unit="${units[c].find(u=>u.topics.includes(t)).id}"]`);click(`[data-topic="${t}"]`);}
function response(q,ok=true){if($('#typed')){$('#typed').value=ok?q.answers[0]:'incorrectxyz';$('#answer-form').dispatchEvent(new window.Event('submit',{cancelable:true}));}else{const b=[...document.querySelectorAll('.choice')].find(b=>isCorrect(b.lastElementChild.textContent,q)===ok);assert(b);b.click();}click('#next');}
function originals(c,t,m){
 if(m==='match'){for(const b of [...document.querySelectorAll('[data-side="es"]')]){b.click();click(`[data-side="en"][data-pair="${b.dataset.pair}"]`);}return;}
 for(let n=0;n<(['story','streak'].includes(m)?5:10);n++){
  let q;if(m==='story')q=story(c,t).questions.find(q=>q.prompt===$('#prompt').textContent);else if(m==='streak'){const [a,b]=$('#prompt').textContent.split('___');const sentence=story(c,t).text.split(/(?<=[.!?])\s+/u).find(s=>s.startsWith(a)&&s.endsWith(b));assert(sentence);q={answers:[sentence.slice(a.length,sentence.length-b.length)]};}else{
   for(let i=0;i<20000;i++){q=generate(c,t,m==='lives');if(q.prompt===$('#prompt').textContent)break;}assert.equal(q.prompt,$('#prompt').textContent);
  }assert(q);response(q);
 }
}
function audio(c,t,m){
 assert($('.eyebrow').textContent.includes(`LEVEL ${sequence.indexOf(m)+1}`));
 for(let n=0;n<10;n++){
  click('[data-listen]');const spoken=window.spoken;
  if(m==='record'){assert($('#practice-next').disabled);assert(!$('#practice-fallback').hidden);assert(!$('#confirm-practice').disabled);$('#confirm-practice').checked=true;$('#confirm-practice').dispatchEvent(new window.Event('change'));}
  else{if(m==='type')$('#dictation').value=spoken;else{const q=practiceBank(c,t).choose.find(q=>q.text===spoken&&q.prompt===$('.question h3').textContent);[...document.querySelectorAll('[data-answer]')].find(b=>b.textContent===q.answer).click();}click('#practice-check');}click('#practice-next');
 }
}
for(const [c,t] of [[1,'days'],[2,'er']]){
 const dom=setup(fresh()),clock=FakeTimers.install({now:1791464400000});await import(`../js/app.js?fresh=${c}`);enter(c,t);
 assert($('.level-line').textContent.includes('0 / 8'));assert.equal(document.querySelectorAll('.level-map button:disabled').length,7);
 assert.deepEqual([...document.querySelectorAll('.level-map li strong')].map(n=>n.textContent),['1. Match-Up','2. Listen & Choose','3. Recognition','4. Listen & Type','5. Typing','6. Read & Record','7. In Context','8. Story Challenge']);
 click('#play-level');
 for(const [i,m] of sequence.entries()){
  if(['choose','type','record'].includes(m))audio(c,t,m);else originals(c,t,m);
  assert(saved().mastery[`${c}:${t}`][m].completed,m);assert.equal(Object.values(saved().mastery[`${c}:${t}`]).filter(v=>v.completed).length,i+1);
  if(i<7){assert(!$('.completion'));assert(!saved().completionDates[`${c}:${t}`]);}
  if(['choose','type','record'].includes(m)){click('#finish-topic');assert.equal($('#play-level').dataset.mode,sequence[i+1]);assert($('.next-activity .eyebrow').textContent.includes(`LEVEL ${i+2}`));click('#play-level');}
  else if(i<7)click('#next-level');
 }
 assert($('.completion'));assert(saved().completionDates[`${c}:${t}`]);assert.equal($('#games').textContent,'TOPIC COMPLETE ✓');assert(!$('#next-level'));click('#games');assert.equal($('#play-level').dataset.mode,'story');assert($('#play-level').textContent.includes('REPLAY STORY'));assert($('.level-line').textContent.includes('8 / 8'));clock.uninstall();dom.window.close();
}
// Migrated mastery is visible and replayable even when a newly earlier prerequisite is missing.
for(const [label,ids] of [['B',['match','quick']],['C',['match','quick','lives','streak','story']],['D',sequence],['E',['match','choose']]]){
 const p=fresh();p.xp=700;p.achievements=['first'];p.mastery['1:family']=Object.fromEntries(ids.map(m=>[m,{completed:true,best:m==='record'?null:100,completedAt:'2026-10-08T10:00:00Z'}]));if(label==='D')p.completionDates['1:family']='2026-10-08T10:00:00Z';
 const dom=setup(p),clock=FakeTimers.install({now:1791464400000});await import(`../js/app.js?migration=${label}`);enter(1,'family');assert.equal(saved().xp,700);assert.equal(document.querySelectorAll('.level-map .mastered').length,ids.length);
 assert.equal($('#play-level').dataset.mode,label==='D'?'story':label==='E'?'quick':'choose');
 if(label==='B'){click('.level-map [data-mode="quick"]');assert.equal($('.game-top h2').textContent,'Recognition');click('#leave');click('#play-level');audio(1,'family','choose');click('#finish-topic');assert.equal($('#play-level').dataset.mode,'type');assert($('.next-activity .eyebrow').textContent.includes('LEVEL 4'));}
 if(label==='C'){
  click('.level-map [data-mode="story"]');originals(1,'family','story');assert(!$('.completion'));assert(!$('.mastery-result').textContent.includes('All eight'));assert.equal($('#games').textContent,'View levels');click('#next-level');assert($('.eyebrow').textContent.includes('LEVEL 2'));
  click('#practice-back');click('.level-map [data-mode="lives"]');originals(1,'family','lives');click('#next-level');assert($('.eyebrow').textContent.includes('LEVEL 2'));
 }
 if(label==='D'){assert($('.completion'));assert.equal(saved().xp,700);assert.equal(saved().completionDates['1:family'],p.completionDates['1:family']);}
 clock.uninstall();dom.window.close();
}
console.log('PASS: complete fresh 1→8 DOM journeys in Spanish 1 and 2, exact Up Next/replay order, speaking at 6 does not complete topic, Story at 8 does, migrated B–E display/replay, skip mastered Recognition, replaying Story across gaps cannot claim completion, continuation targets earliest gap.');
