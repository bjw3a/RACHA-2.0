import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {application,topics,isCorrect} from '../js/data.js';
import {units,reviewId} from '../js/curriculum.js';
import {fresh} from '../js/storage.js';
import {sequence} from '../js/progression.js';
assert.deepEqual(sequence,['match','quick','lives','streak','story']);
for(const course of [1,2])for(const topic of [...Object.keys(topics[course]),...units[course].map(reviewId)])for(let i=0;i<50;i++){
 const r=application(course,topic);
 assert.equal(new Set(r.wordBank.map(w=>w.normalize('NFC').toLocaleLowerCase('es'))).size,r.wordBank.length);
 for(const q of r.questions){assert(r.wordBank.some(w=>isCorrect(w,q)));assert(isCorrect(q.answers[0],q));assert(!isCorrect('incorrectxyz',q));}
 assert(r.wordBank.every(w=>r.questions.some(q=>q.answers[0]===w)));
}
for(const course of [1,2]){
 const dom=new JSDOM(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'http://example.test/racha/'}),w=dom.window;
 for(const k of ['document','localStorage','window'])globalThis[k]=k==='window'?w:w[k];
 globalThis.confirm=()=>true;w.scrollTo=()=>{};
 const profile=fresh();profile.xp=530;profile.achievements=['first'];profile.bests={'2:ser:quick':100};profile.lastTopic={course,topic:'ser'};profile.lastTopics[course]={course,topic:'ser'};
 profile.mastery[`${course}:ser`]=Object.fromEntries(sequence.slice(0,3).map(m=>[m,{completed:true,best:100,completedAt:'2026-09-24'}]));
 localStorage.setItem('racha-progress-v1',JSON.stringify(profile));
 await import(`../js/app.js?course=${course}`);
 const $=s=>document.querySelector(s);
 $('#resume').click();
 assert.equal($('#prompt').nextElementSibling.className,'word-bank');assert.equal($('.word-bank').nextElementSibling.id,'answer-form');
 assert(!$('.reading'));assert.equal($('.word-bank').querySelectorAll('button,input,[tabindex]').length,0);
 assert($('#typed'));assert.equal(JSON.parse(localStorage.getItem('racha-progress-v1')).xp,530);
 assert.deepEqual(JSON.parse(localStorage.getItem('racha-progress-v1')),profile);
 const bank=[...document.querySelectorAll('.word-bank-words li')].map(n=>n.textContent);
 $('#typed').value='incorrectxyz';$('#answer-form').dispatchEvent(new w.Event('submit',{cancelable:true}));assert($('#feedback').textContent.includes('Not quite'));
 $('#next').click();
 const {readings}=await import('../js/readings.js');const [a,b]=$('#prompt').textContent.split('___');const sentence=readings.ser.text.split(/(?<=[.!?])\s+/u).find(s=>s.startsWith(a)&&s.endsWith(b));const answer=sentence.slice(a.length,sentence.length-b.length);
 assert(bank.some(v=>isCorrect(v,{answers:[answer]})));
 $('#typed').value=answer;$('#answer-form').dispatchEvent(new w.Event('submit',{cancelable:true}));assert($('#feedback').textContent.includes('¡Correcto!'));
 $('#leave').click();dom.window.close();
}
console.log('PASS: both courses, bank placement, non-clickable chips, deduplication, all-topic answer coverage, typed correct/incorrect responses, unchanged saved profile.');
