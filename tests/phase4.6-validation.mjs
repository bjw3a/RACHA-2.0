import assert from 'node:assert/strict';
import {isCorrect,normalize,answersMatch,matchBank} from '../js/data.js';
import {dictationCorrect,createPracticeSession} from '../js/practice-sessions.js';
import {units,reviewId,orderedTopics,continueLabel} from '../js/curriculum.js';
for(const [expected,values] of [
 ['Buenos días, profesora.',['Buenos dias profesora','buenos días profesora','¡Buenos días, profesora!',' Buenos   días profesora! ','“BUENOS DIAS, PROFESORA.”','Buenos di\u0301as profesora']],
 ['¿Cómo estás?',['Como estas','cómo estás','COMO ESTAS','  ¿Cómo   estás?!  ']],
 ['I don’t like to run.',['I don\'t like to run','I don‘t like to run','I DONT LIKE TO RUN']]
])for(const value of values){assert(isCorrect(value,{answers:[expected]}));assert(dictationCorrect(value,{text:expected}));}
for(const [correct,wrong] of [['Estoy bien','Estoy mal'],['Yo soy','Ellos son'],['Tengo quince años','Tengo cinco años'],['Tengo quince años','Tengo quince anos'],['No me gusta bailar','Me gusta bailar'],['hasta mañana','hastamañana'],['Me llamo Ana','Ana llamo me'],['1:30','130'],['quince','cinco']]){
 assert(!isCorrect(wrong,{answers:[correct]}));assert(!dictationCorrect(wrong,{text:correct}));
}
assert(answersMatch('adios',['adiós']));assert(!answersMatch('adios',['adiós'],{accentsRequired:true}));assert(!answersMatch('!!!',['']));
assert(isCorrect('violeta',{answers:['morado','violeta']}));assert(!isCorrect('rojo',{answers:['morado','violeta']}));
for(const unit of units[1].slice(0,3))for(const topic of [...unit.topics,reviewId(unit)])for(const mode of ['type','record'])for(let i=0;i<30;i++){
 const session=createPracticeSession(1,topic,mode);assert.equal(session.length,10);
 for(const item of session){assert(item.text.trim().split(/\s+/).length<=5,item.text);assert(!/Ana dice|Luis presenta|Al salir|se llama/.test(item.text),item.text);
 const taught=matchBank(1,item.topic).some(([text])=>normalize(text)===normalize(item.text)||item.answers?.some(a=>normalize(a)===normalize(text)));
 // Digital times include all minute increments already taught by generated Typing questions.
 assert(taught||item.topic==='time',item.text);
 }
}
for(const c of [1,2])for(const u of units[c])assert.deepEqual(orderedTopics(u),[...u.topics,reviewId(u)]);
assert.equal(continueLabel(1,'greetings'),'Continue');assert.equal(continueLabel(1,'colors'),'Continuar');assert.equal(continueLabel(2,'er'),'Continuar');
console.log('PASS: punctuation/case/Unicode/whitespace variants, explicit alternatives, strict accents opt-in, meaningful errors rejected; 1–5-word beginner sessions and taught vocabulary across Units 1–3; stable review-last IDs and gradual Continue labels.');
