import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {units,reviewId} from '../js/curriculum.js';
import {cardsFor,extraCards,uniqueCards} from '../js/flashcards-data.js';
import {fresh} from '../js/storage.js';
for(const course of [1,2]){
 const all=cardsFor(course);
 assert(all.length>300);assert.equal(uniqueCards(all).length,all.length);
 assert(!/\bvosotr[oa]s\b/iu.test(JSON.stringify(all)));
 for(const unit of units[course])for(const selection of [reviewId(unit),...unit.topics]){
  const cards=cardsFor(course,selection);assert(cards.length>0,selection);
  assert(cards.every(c=>c.front&&c.back&&c.course===course&&c.unit===unit.id&&c.audio===null));
 }
 const yo=cardsFor(course,'ser').find(c=>c.front==='yo + ser');assert.equal(yo.back,'soy');
}
assert.equal(cardsFor(1,'numbers').length,101);
assert.equal(cardsFor(1,'time').length,144);
assert.equal(cardsFor(2,'ar').find(c=>c.front==='nosotros + hablar').back,'hablamos');
assert.equal(cardsFor(2,'er').find(c=>c.front==='nosotros + comer').back,'comemos');
assert.equal(cardsFor(2,'ir').find(c=>c.front==='nosotros + vivir').back,'vivimos');
assert.equal(cardsFor(1,'adjectives').find(c=>c.front==='La chica es ___. (trabajador)').back,'trabajadora');
extraCards.push({course:1,unit:'s1-u1',topic:'greetings',front:'test <front>',back:'test & back',audio:null});
assert(cardsFor(1,'greetings').some(c=>c.front==='test <front>'));extraCards.pop();
const dom=new JSDOM(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'http://example.test/racha/'}),w=dom.window;
for(const k of ['document','localStorage','window'])globalThis[k]=k==='window'?w:w[k];
globalThis.confirm=()=>true;w.scrollTo=()=>{};
const profile=fresh();profile.xp=700;profile.lastTopic={course:2,topic:'er'};profile.bests={'1:days:quick':90};profile.achievements=['first'];
const original=JSON.stringify(profile);localStorage.setItem('racha-progress-v1',original);
await import('../js/app.js');
const $=s=>document.querySelector(s),click=s=>{assert($(s),s);$(s).click();};
assert(!$('.curriculum'));assert(!$('#choose-flashcards'));assert($('#resume'));
for(const c of [1,2]){
 click(`[data-course="${c}"]`);click('#choose-flashcards');
 for(const u of units[c]){
  click(`[data-fc-unit="${u.id}"]`);
  for(const t of [reviewId(u),...u.topics]){
   click(t.startsWith('unit:')?'#fc-unit-review':`[data-fc-topic="${t}"]`);
   assert.equal($('#fc-count').textContent,`1 / ${cardsFor(c,t).length}`);
   assert($('#fc-known').disabled);click('#fc-card');assert(!$('#fc-known').disabled);
   click('#fc-back');
  }
  click('#fc-back');
 }
 click('#fc-all');assert.equal($('#fc-count').textContent,`1 / 30`);click('#fc-back');click('#fc-back');click('#choose-course');
}
click('[data-course="1"]');click('#choose-flashcards');click('[data-fc-unit="s1-u2"]');click('[data-fc-topic="days"]');
const missed=[];
for(let i=0;i<7;i++){
 if(i<2)missed.push($('#fc-text').textContent);
 click('#fc-card');click(i<2?'#fc-again':'#fc-known');
 if(i===2)click('#fc-shuffle');
}
assert($('.fc-summary').textContent.includes('5 / 7 known'));assert($('.fc-summary').textContent.includes('2 to practice'));
click('#fc-practice');assert.equal($('#fc-count').textContent,'1 / 2');
for(const front of missed){assert.equal($('#fc-text').textContent,front);click('#fc-card');click('#fc-known');}
assert($('.fc-summary').textContent.includes('2 / 2 known'));assert(!$('#fc-practice'));click('#fc-done');
click('[data-fc-topic="days"]');for(let i=0;i<7;i++){click('#fc-card');click('#fc-again');}
assert($('.fc-summary').textContent.includes('0 / 7 known'));click('#fc-practice');assert.equal($('#fc-count').textContent,'1 / 7');
click('.brand');assert(!document.body.classList.contains('flashcard-session'));
assert.equal(localStorage.getItem('racha-progress-v1'),original);assert.equal(localStorage.length,1);
click('#resume');assert($('#arena'));assert.equal($('.eyebrow').textContent.includes('SPANISH 2'),true);
click('#leave');dom.window.close();
console.log('PASS: all Flashcards topics/units/courses, content, deduplication, expansion, reveal, Know it, Again, shuffle, subset rounds, all-known/all-again summaries, clean home, Continue Learning and exact saved-profile isolation.');
