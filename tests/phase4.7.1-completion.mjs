import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {units,reviewId} from '../js/curriculum.js';
import {sequence} from '../js/progression.js';
import {fresh,load} from '../js/storage.js';
import {unitComplete,unitReport,unitCompletionView,bindUnitCompletion} from '../js/unit-completion.js';
const dom=new JSDOM(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'http://example.test/racha/'}),w=dom.window;
for(const k of ['document','localStorage','window'])globalThis[k]=k==='window'?w:w[k];
globalThis.confirm=()=>true;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
const $=s=>document.querySelector(s),click=s=>{assert($(s),s);$(s).click();};
const completed=()=>Object.fromEntries(sequence.map((m,i)=>[m,{completed:true,best:80+i*5,completedAt:`2026-09-28T12:0${i}:00.000Z`}]));
for(const course of [1,2])for(const unit of units[course]){
 const p=fresh();assert(!unitComplete(p,course,unit));p.mastery[`${course}:${reviewId(unit)}`]=completed();assert(!unitComplete(p,course,unit));
 for(const t of unit.topics)p.mastery[`${course}:${t}`]=completed();
 assert(unitComplete(p,course,unit));assert(!unitComplete(p,course===1?2:1,unit));
 for(const t of unit.topics)for(const m of sequence){p.mastery[`${course}:${t}`][m].completed=false;assert(!unitComplete(p,course,unit));assert.equal(unitReport(p,course,unit,'Ana'),null);p.mastery[`${course}:${t}`][m].completed=true;}
 const report=unitReport(p,course,unit,'María & José');assert(report.includes('Name: María & José'));assert(report.includes('Unit Performance (best mastery):'));assert(report.includes('80%'));assert(report.includes(new Date('2026-09-28T12:07:00Z').toLocaleString()));

}
const p=fresh(),unit=units[1][4];p.xp=730;p.bests={'1:days:quick':90};p.achievements=['first'];p.lastTopic={course:2,topic:'ar'};
p.lastTopics={1:{course:1,topic:'days'},2:{course:2,topic:'ar'}};
p.mastery['1:unit:s1-u5']=completed();p.mastery['1:pronouns']=completed();p.mastery['1:ser']=completed();p.mastery['1:ser'].story.completed=false;
localStorage.setItem('racha-progress-v1',JSON.stringify(p));await import('../js/app.js');
for(const c of [1,2]){
 click('.brand');click(`[data-course="${c}"]`);assert.equal(document.querySelectorAll('[data-course]').length,0);assert.equal(document.querySelectorAll('[data-unit]').length,units[c].length);assert([...document.querySelectorAll('[data-unit]')].every(b=>b.dataset.unit.startsWith(`s${c}-`)));assert(!$('.unit-meta'));assert(!$('.study-navigation'));
 click('#resume');assert($('.eyebrow').textContent.includes(`SPANISH ${c}`));
}
click('.brand');click('[data-course="1"]');click('[data-unit="s1-u5"]');assert(!$('#send-unit-completion'));click('[data-topic="pronouns"]');assert($('.completion'));assert(!$('#send-unit-completion'));click('#change-topic');click('[data-topic="ser"]');assert(!$('#send-unit-completion'));click('#play-level');
const {readings}=await import('../js/readings.js');for(let i=0;i<5;i++){const row=readings.ser.questions.find(r=>r[0]===$('#prompt').textContent);[...document.querySelectorAll('.choice')].find(b=>b.lastElementChild.textContent===row[1]).click();click('#next');}
assert(!$('#send-unit-completion'));assert($('#copy-unit-completion'));assert($('.unit-completion').textContent.includes('UNIT COMPLETE!'));
click('#copy-unit-completion');await new Promise(r=>setImmediate(r));assert(!$('#unit-copy-fallback').hidden);$('#unit-student-name').value='María & José';click('#copy-unit-completion');await new Promise(r=>setImmediate(r));assert(!$('#unit-copy-fallback').hidden);assert($('#unit-copy-fallback').value.includes('Name: María & José'));assert.equal(localStorage.getItem('racha-student-name-v1'),'María & José');
click('#games');assert.equal($('#unit-student-name').value,'María & José');$('#unit-student-name').value='Ana';$('#unit-student-name').dispatchEvent(new w.Event('change'));assert.equal(localStorage.getItem('racha-student-name-v1'),'Ana');
let clipboard;Object.defineProperty(globalThis,'navigator',{value:{clipboard:{writeText:async text=>{clipboard=text;}}},configurable:true});click('#copy-unit-completion');await new Promise(r=>setImmediate(r));assert.equal($('#unit-completion-status').textContent,'Completion copied ✓');assert.equal(clipboard,unitReport(load(),1,unit,'Ana'));
const saved=load();assert(saved.xp>=730);assert.equal(saved.bests['1:days:quick'],90);assert(saved.achievements.includes('first'));assert(saved.mastery['1:ser'].story.completed);assert.deepEqual(saved.lastTopics[2],{course:2,topic:'ar'});
assert(!document.querySelector('[href^="mailto:"]'));
// Old data with no timestamps is not assigned a fabricated completion date.
for(const t of unit.topics){delete saved.completionDates[`1:${t}`];for(const m of sequence)delete saved.mastery[`1:${t}`][m].completedAt;}
assert(unitReport(saved,1,unit,'Ana').includes('Previously completed — date unavailable'));
await new Promise(r=>setTimeout(r,3600));dom.window.close();console.log('PASS: all 12 units require every topic/activity; mixed review alone cannot unlock reports; course-specific resume; final activity unlocks unit report; actual scores/dates; names saved/changed; generic copy-only report; optional name; clipboard and fallback; existing progress and optional submission.');
