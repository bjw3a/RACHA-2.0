import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {fresh,KEY} from '../js/storage.js';
import {units} from '../js/curriculum.js';
import {sequence} from '../js/progression.js';
import {unitComplete} from '../js/unit-completion.js';
const dom=new JSDOM(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'http://example.test/racha/'}),w=dom.window;
for(const k of ['document','localStorage','window'])globalThis[k]=k==='window'?w:w[k];
globalThis.confirm=()=>true;w.scrollTo=()=>{};
const p=fresh();p.xp=730;p.achievements=['first'];
for(const c of [1,2])for(const [i,u] of units[c].entries()){
 for(const t of u.topics)p.mastery[`${c}:${t}`]=Object.fromEntries(sequence.map(m=>[m,{best:80,completed:true}]));
 if(i%2)p.mastery[`${c}:${u.topics[0]}`].story.completed=false;
}
localStorage.setItem(KEY,JSON.stringify(p));const saved=localStorage.getItem(KEY);
await import('../js/app.js');
const $=s=>document.querySelector(s),click=s=>{assert($(s),s);$(s).click();};
for(const c of [1,2]){
 click(`[data-course="${c}"]`);assert(!$('#choose-flashcards'));assert(!$('#choose-learn'));
 assert.deepEqual([...document.querySelectorAll('.unit-card:has(.unit-completed)')].map(b=>b.dataset.unit),units[c].filter(u=>unitComplete(p,c,u)).map(u=>u.id));
 click('#study-choice');assert($('[data-course="1"]'));
}
assert.equal(localStorage.getItem(KEY),saved);
click('[data-course="1"]');click(`[data-unit="${units[1].find(u=>u.topics.includes('numbers')).id}"]`);click('[data-topic="numbers"]');
const random=Math.random;Math.random=()=>.99;click('[data-mode="lives"]');Math.random=random;
assert.equal($('.question .eyebrow').textContent,'TYPE THE NUMBER.');assert.equal($('#prompt').textContent,'noventa y nueve');
$('#typed').value='99';$('#answer-form').dispatchEvent(new w.Event('submit',{cancelable:true}));assert($('#feedback').textContent.includes('¡Correcto!'));
click('.brand');dom.window.close();console.log('PASS: direct navigation, hidden Flashcards, exact completion indicators, unchanged storage during navigation, numeric instruction and submitted digits.');
