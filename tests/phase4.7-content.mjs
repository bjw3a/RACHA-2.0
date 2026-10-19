import assert from 'node:assert/strict';
import {units,contentTopics,introductoryTopic,orderedTopics,reviewId} from '../js/curriculum.js';
import {englishQuestion,practiceBank,createPracticeSession} from '../js/practice-sessions.js';
import {modes} from '../js/engine.js';
import {sequence} from '../js/progression.js';
import {isCorrect,options} from '../js/data.js';
assert.deepEqual(sequence.map(id=>modes.find(m=>m.id===id).name),['Match-Up','Listen & Choose','Recognition','Listen & Type','Typing','Read & Record','Choose English','Mixed Review']);
let checked=0;
for(const c of [1,2])for(const selection of ['mixed',...units[c].flatMap(u=>orderedTopics(u))]){
 const bank=practiceBank(c,selection);
 for(let i=0;i<100;i++){
  const q=englishQuestion(c,selection),row=bank.words.find(r=>r.text===q.prompt);assert(row);assert.equal(q.answers[0],row.meaning);
  const choices=options(q);assert(choices.length>=3);assert.equal(choices.filter(a=>isCorrect(a,q)).length,1);assert(!isCorrect('incorrectxyz',q));checked++;
 }
 for(let i=0;i<20;i++)for(const item of createPracticeSession(c,selection,'choose')){
  if(introductoryTopic(c,item.topic)){assert(item.meaning);assert(bank.words.some(w=>w.text===item.text));}
 }
}
for(const c of [1,2])for(const u of units[c])assert.equal(orderedTopics(u).at(-1),reviewId(u));
console.log(`PASS: exact requested eight activities, ${checked} English-choice questions across both courses/all reviews, unique accepted choices, taught-only early listening, review-last unit order.`);
