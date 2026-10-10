import FakeTimers from '@sinonjs/fake-timers';
import {JSDOM} from 'jsdom';import fs from 'node:fs';import assert from 'node:assert/strict';
import {units,orderedTopics} from '../js/curriculum.js';import {sequence} from '../js/progression.js';import {fresh} from '../js/storage.js';
const dom=new JSDOM(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'https://racha.test',pretendToBeVisual:true}),w=dom.window;
for(const k of ['window','document','localStorage'])globalThis[k]=k==='window'?w:w[k];w.scrollTo=()=>{};globalThis.confirm=()=>true;
Object.defineProperty(globalThis,'navigator',{value:{},configurable:true});w.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};w.speechSynthesis={getVoices:()=>[{lang:'es-MX'}],speak:u=>{w.spoken=u.text;u.onend?.();},cancel(){}};
const clock=FakeTimers.install();
const p=fresh();p.sound=true;p.mastery['1:days']=Object.fromEntries(['match','quick','lives','choose'].map(m=>[m,{completed:true,best:100}]));p.mastery['1:greetings']=Object.fromEntries(sequence.map(m=>[m,{completed:true,best:m==='record'?null:100}]));localStorage.setItem('racha-progress-v1',JSON.stringify(p));
await import('../js/app.js');const $=s=>document.querySelector(s),click=s=>{assert($(s),s);$(s).click();};
for(const c of [1,2])for(const unit of units[c]){click('.brand');click(`[data-course="${c}"]`);click(`[data-unit="${unit.id}"]`);assert.deepEqual([...document.querySelectorAll('[data-topic]')].map(b=>b.dataset.topic),orderedTopics(unit));}
click('.brand');click('[data-course="1"]');click('[data-unit="s1-u1"]');click('[data-topic="greetings"]');assert($('.learning-reference').textContent.includes('Buenos días, profesora.'));
click('[data-mode="match"]');for(const b of [...document.querySelectorAll('[data-side="es"]')]){b.click();click(`[data-side="en"][data-pair="${b.dataset.pair}"]`);}assert($('.result'));assert(!/XP level|total XP|seconds|ARCADE RESULT|XP rewards/.test($('.result').textContent));assert.equal($('.mastery-result strong').textContent,'6 / 6');assert($('.result').textContent.includes('Best streak'));assert($('.record'));
click('#games');click('[data-mode="type"]');for(let i=0;i<10;i++){click('[data-listen]');$('#dictation').value=w.spoken.toUpperCase().replace(/[.,!?¿¡]/g,'');click('#practice-check');assert($('#practice-feedback').textContent.includes('¡Correcto!'));click('#practice-next');}
assert(!/XP/.test($('.practice-finished').textContent));assert($('#practice-again'));assert($('#finish-topic'));
click('#finish-topic');click('#change-topic');click('[data-topic="introductions"]');
assert($('.learning-reference').open);click('#play-level');for(const b of [...document.querySelectorAll('[data-side="es"]')]){b.click();click(`[data-side="en"][data-pair="${b.dataset.pair}"]`);}click('#next-level');assert.equal($('.game-top h2').textContent,'Recognition');
click('#leave');click('.brand');click('[data-course="1"]');click('[data-unit="s1-u2"]');click('[data-topic="days"]');click('#play-level');
for(let i=0;i<10;i++){click('[data-listen]');$('#dictation').value=w.spoken;click('#practice-check');click('#practice-next');}
assert($('#practice-next-level'));click('#practice-next-level');assert.equal($('#practice-title').textContent,'Read & Record');click('#practice-back');clock.uninstall();dom.window.close();console.log('PASS: review-last DOM order in every unit, beginner reference, concise classic/audio results, personal best/streak, Spanish feedback, direct Next Level.');
