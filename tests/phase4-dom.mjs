import {JSDOM} from 'jsdom';import FakeTimers from '@sinonjs/fake-timers';import fs from 'node:fs';import assert from 'node:assert/strict';
import {generate,isCorrect} from '../js/data.js';import {readings} from '../js/readings.js';import {units,reviewId} from '../js/curriculum.js';import {sequence} from '../js/progression.js';
const dom=new JSDOM(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'http://example.test/racha/'}),w=dom.window;
for(const k of ['document','localStorage','window'])globalThis[k]=k==='window'?w:w[k];globalThis.confirm=()=>true;w.scrollTo=()=>{};
const clock=FakeTimers.install({now:1000000}),$=s=>document.querySelector(s),click=s=>{assert($(s),'Missing '+s);$(s).click();};
const saved=()=>JSON.parse(localStorage.getItem('racha-progress-v1'));
localStorage.setItem('racha-progress-v1',JSON.stringify({xp:500,bestStreak:9,correct:25,games:3,bests:{'1:days:quick':90,'2:mixed:story':100},achievements:['first']}));
await import('../js/app.js');
function choose(t,c=1){click('.brand');click(`[data-course="${c}"]`);click('#choose-learn');click(`[data-unit="${units[c].find(u=>u.topics.includes(t)).id}"]`);click(`[data-topic="${t}"]`);}
function solve(ok=true,t='days',c=1){const prompt=$('#prompt').textContent;let q;for(let i=0;i<20000;i++){q=generate(c,t);if(q.prompt===prompt)break;}assert.equal(q.prompt,prompt);respond(q,ok);}
function respond(q,ok=true){if($('#typed')){$('#typed').value=ok?q.answers[0]:'wrong';$('#answer-form').dispatchEvent(new w.Event('submit',{cancelable:true}));}else{const b=[...document.querySelectorAll('.choice')].find(b=>isCorrect(b.lastElementChild.textContent,q)===ok);assert(b);b.click();}assert($('#next'));}
function match(wrong=0){const es=[...document.querySelectorAll('[data-side="es"]')];for(let i=0;i<wrong;i++){es[i].click();[...document.querySelectorAll('[data-side="en"]')].find(b=>b.dataset.pair!==es[i].dataset.pair).click();}for(const b of es){b.click();click(`[data-side="en"][data-pair="${b.dataset.pair}"]`);}assert($('.result'));}
choose('days');assert.equal($('#play-level').dataset.mode,'match');assert.equal(document.querySelectorAll('.level-map button:disabled').length,4);
click('#play-level');match(2);assert($('.mastery-result').textContent.includes('66.6%'));assert(!$('#next-level'));assert(!saved().mastery['1:days'].match.completed);
click('#again');match(1);assert($('.mastery-result').textContent.includes('83.3%'));assert($('#next-level'));assert(saved().mastery['1:days'].match.completed);
click('#next-level');for(let i=0;i<10;i++){solve(i<7);click('#next');}assert($('.mastery-result').textContent.includes('70%'));assert(!$('#next-level'));
click('#again');for(let i=0;i<10;i++){solve(i<8);click('#next');}assert($('.mastery-result').textContent.includes('80%'));assert($('#next-level'));assert.equal(saved().bests['1:days:quick'],90);

click('#next-level');for(let i=0;i<10;i++){assert($('#typed'));solve(i<8);click('#next');}assert($('#next-level'));
click('#next-level');for(let i=0;i<5;i++){const prompt=$('#prompt').textContent;const sentence=readings.days.text.split(/(?<=[.!?])\s+/u).find(s=>{const [a,b]=prompt.split('___');return s.startsWith(a)&&s.endsWith(b);});assert(sentence);const [a,b]=prompt.split('___');const value=sentence.slice(a.length,sentence.length-b.length);respond({answers:[value]});click('#next');}
click('#next-level');for(let i=0;i<5;i++){const row=readings.days.questions.find(r=>r[0]===$('#prompt').textContent);respond({answers:[row[1]]});click('#next');}
assert($('.completion').textContent.includes('Status: Complete'));assert(saved().completionDates['1:days']);
click('#copy-completion');await Promise.resolve();assert(!$('#copy-fallback').hidden);assert($('#copy-fallback').value.includes('Spanish 1'));
click('#games');assert($('.path-shell').textContent.includes('5 / 5'));
click('.brand');assert($('#resume'));click('#resume');assert($('.completion'));
for(const c of [1,2])for(const u of units[c])for(const t of u.topics){choose(t,c);assert($('#play-level'));}
click('.brand');click('#resume');assert($('.completion'));
assert(saved().xp>=500);assert.equal(saved().bests['2:mixed:story'],100);
clock.uninstall();dom.window.close();console.log('PASS: DOM end-to-end matching failures/retries, recognition, typing, context, story, completion copy fallback, resume, all topics/courses and saved records.');
