import assert from 'node:assert/strict';
import {generate,isCorrect,timeAnswers,number,topics,normalize} from '../js/data.js';
let cases=0;
for(let h=1;h<=12;h++)for(let m=0;m<60;m++){
 const q={answers:timeAnswers(h,m),time:true};
 for(const model of q.answers){
  const short=model.replace(/^(Son las|Es la) /,'');
  for(const v of [model,short,model.replace(/ y /,' '),short.replace(/ y /,' ')]){
   assert(isCorrect(v,q),v);assert(isCorrect('  '+v.toUpperCase().replaceAll(' ','   ')+'  ',q));cases+=2;
  }
 }
 assert(!isCorrect(timeAnswers(h===12?1:h+1,m)[0],q));
 assert(!isCorrect(timeAnswers(h,(m+5)%60)[0],q));
 if(h===1)assert(!isCorrect('Son las una'+(m?' y '+number(m):''),q));
}
for(const c of [1,2])for(const t of Object.keys(topics[c]))for(let i=0;i<300;i++){
 const q=generate(c,t,true);assert(q.lang==='es'||q.numeric,`${c} ${t}: ${q.prompt}`);assert(isCorrect(q.answers[0],q));
}
let q;for(let i=0;i<100000;i++){q=generate(1,'numbers',true);if(q.numeric&&q.prompt==='cuarenta y tres')break;}
assert.equal(q.prompt,'cuarenta y tres');assert(isCorrect('43',q));assert(!isCorrect('forty-three',q));
assert.equal(normalize('MIÉRCOLES'),'miercoles');assert.notEqual(normalize('año'),normalize('ano'));
assert(!isCorrect('seis treinta',{answers:['Son las seis y treinta']}));
console.log(`PASS: ${cases} time variants across all 720 hour/minute combinations, wrong times rejected, una agreement, both-course typing audit, numeric 43, accents and ñ.`);
