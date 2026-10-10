import assert from 'node:assert/strict';
import {practiceBank,createPracticeSession,dictationCorrect} from '../js/practice-sessions.js';
import {units,reviewId,contentTopics} from '../js/curriculum.js';
import {normalize,matchBank} from '../js/data.js';
for(const c of [1,2])for(const selection of ['mixed',...units[c].flatMap(u=>[reviewId(u),...u.topics])]){
 const allowed=contentTopics(c,selection),bank=practiceBank(c,selection);
 for(const q of bank.choose){assert(allowed.includes(q.topic));assert.equal(q.choices.filter(v=>v===q.answer).length,1);assert.equal(new Set(q.choices.map(normalize)).size,q.choices.length);assert(q.choices.length>=3&&q.choices.length<=4);
 if(q.meaning){const row=matchBank(c,q.topic).find(r=>normalize(r[0])===normalize(q.text));if(row)assert.equal(q.choices.filter(v=>[...row.slice(1),q.meaning].map(normalize).includes(normalize(v))).length,1);}}
 for(const mode of ['choose','type','record'])for(let i=0;i<20;i++){
  const session=createPracticeSession(c,selection,mode);assert.equal(session.length,10,`${c} ${selection} ${mode}`);
  for(const q of session){assert(allowed.includes(q.topic));assert(!/vosotros|___/.test(q.text));assert(dictationCorrect(q.text,q));assert(!dictationCorrect(q.text+' incorrecto',q));}
  if(mode!=='choose'){const unique=new Set(session.map(q=>normalize(q.text))).size;assert(unique>=Math.min(10,bank.words.length));for(let j=1;j<session.length;j++)assert.notEqual(session[j].text,session[j-1].text);}
 }
}
for(const value of [' SOY DE MEXICO! ','soy   de méxico','¿Soy de México?'])assert(dictationCorrect(value,{text:'Soy de México.'}));
assert(!dictationCorrect('Tengo quince anos',{text:'Tengo quince años.'}));assert(!dictationCorrect('Mi hermano es alta',{text:'Mi hermano es alto.'}));assert(!dictationCorrect('Me gusta bailar',{text:'No me gusta bailar.'}));
console.log('PASS: all topics/units/course reviews; 20 randomized ten-item sessions per mode/selection; topic containment, choice uniqueness and synonyms, spaced repetition only for small dictation/record banks, accent/case/space/punctuation tolerance, ñ/grammar/negation rejection.');
