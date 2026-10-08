import {JSDOM} from 'jsdom';import fs from 'node:fs';import assert from 'node:assert/strict';
import {practiceBank} from '../js/practice-sessions.js';
const dom=new JSDOM(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'https://racha.test',pretendToBeVisual:true}),w=dom.window;
for(const k of ['document','localStorage','window'])globalThis[k]=k==='window'?w:w[k];w.scrollTo=()=>{};globalThis.confirm=()=>true;
const spoken=[],streams=[];w.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};w.speechSynthesis={getVoices:()=>[{lang:'es-MX'}],speak:u=>spoken.push(u.text),cancel(){}};
Object.defineProperty(globalThis,'navigator',{value:{mediaDevices:{getUserMedia:async()=>{const track={readyState:'live',stop(){this.readyState='ended';}};streams.push(track);return {getTracks:()=>[track]};}}},configurable:true});
class Recorder{static isTypeSupported(){return true;}constructor(){this.state='inactive';this.mimeType='audio/webm';}start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['sound'])});queueMicrotask(()=>this.onstop?.());}}w.MediaRecorder=Recorder;globalThis.Audio=class{pause(){}async play(){}};
localStorage.setItem('racha-progress-v1',JSON.stringify({xp:570,correct:50,games:5,achievements:['first'],sound:true,bests:{'1:days:quick':90},mastery:{'1:days':{match:{completed:true,best:100}}}}));
await import('../js/app.js');const $=s=>document.querySelector(s),click=s=>{assert($(s),s);assert(!$(s).disabled,s+' disabled');$(s).click();};const tick=async()=>{await Promise.resolve();await Promise.resolve();};
for(const [c,u,t] of [[1,'s1-u4','family'],[1,'s1-u1','greetings'],[1,'s1-u2','time'],[1,'s1-u6','adjectives'],[2,'s2-u3','er']]){
 click('.brand');click(`[data-course="${c}"]`);click(`[data-unit="${u}"]`);click(`[data-topic="${t}"]`);assert($('.optional-practice').compareDocumentPosition($('.next-activity'))&w.Node.DOCUMENT_POSITION_FOLLOWING);click('#open-practice');assert.equal(document.querySelectorAll('[data-practice]').length,3);const saved=localStorage.getItem('racha-progress-v1');
 for(const mode of ['choose','type','record']){
  click(`[data-practice="${mode}"]`);
  for(let n=0;n<10;n++){
   assert.equal($('#practice-progress').textContent,`${n+1} / 10`);click('[data-listen]');const text=spoken.at(-1);assert(text);
   if(mode==='record'){assert.equal($('#speaking-prompt').textContent,text);}else{
    assert($('#practice-transcript').hidden);assert.equal($('#practice-transcript').textContent,'');assert($('#practice-next').hidden);
    if(mode==='choose'){
     const q=practiceBank(c,t).choose.find(q=>q.text===text&&q.prompt===$('.question h3').textContent);assert(q);
     const choices=[...document.querySelectorAll('[data-answer]')];if(n===0){choices.find(b=>b.textContent!==q.answer).click();click('#practice-check');assert.equal($('#practice-feedback').textContent,'Try again.');assert($('#practice-transcript').hidden);}
     choices.find(b=>b.textContent===q.answer).click();
    }else{
     if(n===0){$('#dictation').value='incorrecto';click('#practice-check');assert.equal($('#practice-feedback').textContent,'Try again.');}
     $('#dictation').value=text.toUpperCase().replace(/[ÁÉÍÓÚ]/g,c=>({Á:'A',É:'E',Í:'I',Ó:'O',Ú:'U'}[c])).replace(/\s/g,'  ');
    }
    click('#practice-check');assert.equal($('#practice-feedback').textContent,'✓ Correct!');assert(!$('#practice-transcript').hidden);assert(!$('#practice-next').hidden);
   }click('#practice-next');
  }
  assert($('.practice-finished'));if(mode!=='record')assert($('.practice-finished').textContent.includes('9 / 10 correct on the first try'));
  click('#practice-again');assert.equal($('#practice-progress').textContent,'1 / 10');click('#practice-menu-back');
 }assert.equal(localStorage.getItem('racha-progress-v1'),saved);
}
click('[data-practice="record"]');assert($('#stop-recording').hidden);click('#record');await tick();assert(!$('#record-indicator').hidden);assert(!$('#stop-recording').hidden);click('#stop-recording');await tick();assert(!$('#play-recording').hidden);assert($('#stop-recording').hidden);click('#play-recording');await tick();assert($('#practice-status').textContent.includes('Playing'));click('#record');await tick();click('#practice-menu-back');assert(streams.every(t=>t.readyState==='ended'));
click('[data-practice="record"]');navigator.mediaDevices.getUserMedia=async()=>{throw Error('denied');};click('#record');await tick();assert($('#practice-status').textContent.includes('Microphone unavailable'));click('[data-listen]');click('#practice-next');w.MediaRecorder=undefined;click('#record');await tick();assert($('#practice-status').textContent.includes('Microphone unavailable'));click('#practice-back');assert($('#play-level'));
click('#open-practice');click('[data-practice="type"]');click('#sound');click('[data-listen]');assert($('#practice-status').textContent.includes('Sound is off'));click('#sound');click('[data-listen]');const count=spoken.length;click('[data-listen]');assert.equal(spoken.length,count+1);click('#theme');assert(document.body.classList.contains('light'));click('#theme');assert(!document.body.classList.contains('light'));click('#practice-back');assert.equal(document.querySelectorAll('#choose-flashcards').length,0);
console.log('PASS: 15 complete DOM sessions across five diverse topics, placement/menu, retries/check/next, hidden transcript, normalization, first-try score, restart/back, no storage mutation, mock recording/playback/re-record/navigation cleanup, denied/unsupported mic, replay, sound, themes, disabled Flashcards.');dom.window.close();
