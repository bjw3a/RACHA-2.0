import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {units} from '../js/curriculum.js';
import {cardsFor,cumulativeReview} from '../js/flashcards-data.js';
import {fresh} from '../js/storage.js';
const identity=c=>[c.front,c.back].sort().join('|');
for(const course of [1,2]){
 const before=JSON.stringify(cardsFor(course)),sets=new Set();
 for(let i=0;i<500;i++){
  const cards=cumulativeReview(course),ids=cards.map(identity);
  assert.equal(cards.length,30);assert.equal(new Set(ids).size,30);
  const counts=units[course].map(u=>cards.filter(c=>c.unit===u.id).length);
  assert(counts.every(n=>n>=Math.floor(30/counts.length)&&n<=Math.ceil(30/counts.length)),counts);
  assert(!/vosotr[oa]s/iu.test(JSON.stringify(cards)));sets.add(ids.sort().join('\n'));
 }
 assert(sets.size>490);assert.equal(JSON.stringify(cardsFor(course)),before);
 assert.equal(cardsFor(course).length,course===1?465:406);
}
const greetings=cardsFor(1,'greetings');
assert(greetings.some(c=>c.front==='good evening / good night'&&c.back==='buenas noches'));
const dom=new JSDOM(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'http://example.test/racha/'}),w=dom.window;
for(const k of ['document','localStorage','window'])globalThis[k]=k==='window'?w:w[k];
globalThis.confirm=()=>true;w.scrollTo=()=>{};
const p=fresh();p.xp=770;p.achievements=['first'];p.lastTopic={course:1,topic:'days'};p.bests={'1:days:quick':90};
const original=JSON.stringify(p);localStorage.setItem('racha-progress-v1',original);
await import('../js/app.js');
const $=s=>document.querySelector(s),click=s=>{assert($(s),s);$(s).click();};
function finish(total,miss=2){const fronts=[],missed=[];for(let i=0;i<total;i++){const front=$('#fc-text').textContent;fronts.push(front);if(i<miss)missed.push(front);click('#fc-card');click(i<miss?'#fc-again':'#fc-known');}return {fronts,missed};}
for(const course of [1,2]){
 click(`[data-course="${course}"]`);click('#choose-flashcards');click('#fc-all');assert.equal($('#fc-count').textContent,'1 / 30');
 const first=finish(30);assert.equal($('#fc-practice').textContent,'PRACTICE MISSED CARDS');assert.equal($('#fc-restart').textContent,'NEW 30-CARD REVIEW');
 click('#fc-practice');assert.equal($('#fc-count').textContent,'1 / 2');assert.deepEqual(finish(2,1).fronts,first.missed);
 assert.equal($('#fc-restart').textContent,'NEW 30-CARD REVIEW');click('#fc-restart');assert.equal($('#fc-count').textContent,'1 / 30');
 assert.notDeepEqual(finish(30,0).fronts,first.fronts);assert(!$('#fc-practice'));assert.equal($('#fc-restart').textContent,'NEW 30-CARD REVIEW');
 click('.brand');
}
// START OVER after one or several missed-card rounds restores the whole session.
click('[data-course="1"]');click('#choose-flashcards');click('[data-fc-unit="s1-u1"]');
for(const selector of ['[data-fc-topic="greetings"]','#fc-unit-review']){
 click(selector);const total=Number($('#fc-count').textContent.split(' / ')[1]);const first=finish(total);
 assert.equal($('#fc-restart').textContent,'START OVER');click('#fc-practice');assert.deepEqual(finish(2,1).fronts,first.missed);
 click('#fc-practice');finish(1,0);assert.equal($('#fc-restart').textContent,'START OVER');click('#fc-restart');
 assert.equal($('#fc-count').textContent,`1 / ${total}`);click('#fc-shuffle');assert.deepEqual(finish(total,0).fronts.sort(),first.fronts.sort());click('#fc-done');
}
assert.equal(localStorage.getItem('racha-progress-v1'),original);assert.equal(localStorage.length,1);
dom.window.close();
console.log('PASS: 1,000 balanced/deduplicated/randomized reviews; 465/406-card databases intact; greeting correction; topic/unit Start Over restores full set after repeated missed rounds; cumulative New Review stays cumulative after missed rounds; exact saved-profile isolation.');
