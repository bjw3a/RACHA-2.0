import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {units,reviewId} from '../js/curriculum.js';
import {sequence} from '../js/progression.js';
import {fresh,load} from '../js/storage.js';
import {unitComplete,unitReport,completionMailto,unitCompletionView,bindUnitCompletion} from '../js/unit-completion.js';
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
 const report=unitReport(p,course,unit,'María & José');assert(report.includes('Student: María & José'));assert(report.includes('Unit Performance (best mastery):'));assert(report.includes('80%'));assert(report.includes(new Date('2026-09-28T12:04:00Z').toLocaleString()));
 const link=completionMailto('teacher@example.test',course,unit,'María & José',report),u=new URL(link);
 assert.equal(decodeURIComponent(u.pathname),'teacher@example.test');assert.equal(u.searchParams.get('body'),report);assert.equal(u.searchParams.get('subject'),`RACHA COMPLETION | Spanish ${course} | ${unit.name} | María & José`);
}
const p=fresh(),unit=units[1][4];p.xp=730;p.bests={'1:days:quick':90};p.achievements=['first'];p.lastTopic={course:2,topic:'ar'};
p.lastTopics={1:{course:1,topic:'days'},2:{course:2,topic:'ar'}};
p.mastery['1:pronouns']=completed();p.mastery['1:ser']=completed();p.mastery['1:ser'].story.completed=false;
localStorage.setItem('racha-progress-v1',JSON.stringify(p));await import('../js/app.js');
for(const c of [1,2]){
 click('.brand');click(`[data-course="${c}"]`);click('#choose-learn');assert.equal(document.querySelectorAll('[data-course]').length,0);assert.equal(document.querySelectorAll('[data-unit]').length,units[c].length);assert([...document.querySelectorAll('[data-unit]')].every(b=>b.dataset.unit.startsWith(`s${c}-`)));assert(!$('.unit-meta'));assert(!$('.study-navigation'));
 click('#resume');assert($('.eyebrow').textContent.includes(`SPANISH ${c}`));
}
click('.brand');click('[data-course="1"]');click('#choose-learn');click('[data-unit="s1-u5"]');assert(!$('#send-unit-completion'));click('[data-topic="pronouns"]');assert($('.completion'));assert(!$('#send-unit-completion'));click('#change-topic');click('[data-topic="ser"]');assert(!$('#send-unit-completion'));click('#play-level');
const {readings}=await import('../js/readings.js');for(let i=0;i<5;i++){const row=readings.ser.questions.find(r=>r[0]===$('#prompt').textContent);[...document.querySelectorAll('.choice')].find(b=>b.lastElementChild.textContent===row[1]).click();click('#next');}
assert($('#send-unit-completion'));assert($('#send-unit-completion').disabled);assert($('.unit-completion').textContent.includes('UNIT COMPLETE!'));
click('#copy-unit-completion');assert($('#unit-completion-status').textContent.includes('Enter your name'));$('#unit-student-name').value='María & José';click('#copy-unit-completion');await new Promise(r=>setImmediate(r));assert(!$('#unit-copy-fallback').hidden);assert($('#unit-copy-fallback').value.includes('Student: María & José'));assert.equal(localStorage.getItem('racha-student-name-v1'),'María & José');
click('#games');assert.equal($('#unit-student-name').value,'María & José');$('#unit-student-name').value='Ana';$('#unit-student-name').dispatchEvent(new w.Event('change'));assert.equal(localStorage.getItem('racha-student-name-v1'),'Ana');
let clipboard;Object.defineProperty(globalThis,'navigator',{value:{clipboard:{writeText:async text=>{clipboard=text;}}},configurable:true});click('#copy-unit-completion');await new Promise(r=>setImmediate(r));assert.equal($('#unit-completion-status').textContent,'Completion copied ✓');assert.equal(clipboard,unitReport(load(),1,unit,'Ana'));
const saved=load();assert(saved.xp>=730);assert.equal(saved.bests['1:days:quick'],90);assert(saved.achievements.includes('first'));assert(saved.mastery['1:ser'].story.completed);assert.deepEqual(saved.lastTopics[2],{course:2,topic:'ar'});
// Exercise the configured email UI without adding a real email to production.
let source=fs.readFileSync(new URL('../js/unit-completion.js',import.meta.url),'utf8').replace("import {TEACHER_EMAIL} from './config.js';","const TEACHER_EMAIL='teacher@example.test';");source=source.replace(/from '(\.\/[^']+)'/g,(_,rel)=>`from '${new URL(rel,new URL('../js/unit-completion.js',import.meta.url)).href}'`);
const configured=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const container=$('#main');container.innerHTML=configured.unitCompletionView(saved,1,unit);configured.bindUnitCompletion(container,saved,1,unit);globalThis.window={location:{href:''}};click('#send-unit-completion');const sent=new URL(window.location.href);assert.equal(sent.searchParams.get('body'),clipboard);assert($('#unit-completion-status').textContent.includes('Press Send'));assert.equal(JSON.parse(localStorage.getItem('racha-progress-v1')).xp,saved.xp);
// Old data with no timestamps is not assigned a fabricated completion date.
for(const t of unit.topics){delete saved.completionDates[`1:${t}`];for(const m of sequence)delete saved.mastery[`1:${t}`][m].completedAt;}
assert(unitReport(saved,1,unit,'Ana').includes('Previously completed — date unavailable'));
await new Promise(r=>setTimeout(r,3600));dom.window.close();console.log('PASS: all 12 units require every topic/activity; optional mixed review cannot unlock reports; course-specific resume; final activity unlocks unit report; actual scores/dates; names saved/changed; mailto encoding and configured click; clipboard and fallback; existing progress and optional submission.');
