import assert from 'node:assert/strict';
import {earlyListening,practiceContent} from '../js/practice-data.js';
import {readings} from '../js/readings.js';
import {units,orderedTopics,reviewId} from '../js/curriculum.js';
import {practiceBank,createPracticeSession,dictationCorrect} from '../js/practice-sessions.js';
import {sequence} from '../js/progression.js';
import {unitComplete,unitReport} from '../js/unit-completion.js';
let clips=0;
for(const [topic,texts] of Object.entries(earlyListening)){
 const questions=practiceContent(1,topic).listening;assert.equal(texts.length,5);
 for(const [i,q] of questions.entries()){assert.equal(q.text,texts[i]);assert(q.text.split(/\s+/).length<=10);assert.equal(q.answer,readings[topic].questions[i][1]);assert.equal(q.choices.filter(x=>x===q.answer).length,1);clips++;}
}
for(const course of [1,2])for(const unit of units[course]){
 const order=orderedTopics(unit);assert.equal(order.at(-1),reviewId(unit));
 const constituent=new Set(unit.topics.flatMap(t=>practiceBank(course,t).choose.map(q=>q.text+'|'+q.prompt)));
 for(const q of practiceBank(course,reviewId(unit)).choose)assert(constituent.has(q.text+'|'+q.prompt));
 const p={mastery:{},completionDates:{}};const done=()=>Object.fromEntries(sequence.map(m=>[m,{completed:true,best:100}]));
 for(const t of unit.topics)p.mastery[`${course}:${t}`]=done();assert(!unitComplete(p,course,unit));
 p.mastery[`${course}:${reviewId(unit)}`]=done();assert(unitComplete(p,course,unit));assert(unitReport(p,course,unit,'Test').includes('Mixed Review'));
}
assert(dictationCorrect('Buenos dias profesora',{text:'Buenos días, profesora.'}));assert(!dictationCorrect('Buenos días',{text:'Buenas noches.'}));
assert(practiceContent(2,'ser').listening.every(q=>q.text===readings.ser.text));
assert(createPracticeSession(1,'greetings','record').every(q=>q.text.split(/\s+/).length<=5));
console.log(`PASS: ${clips} targeted clips, answer keys, <=10 words, unit-review containment, all 12 unit gates/reports, early speaking, later listening retained, forgiving positive/negative cases.`);
