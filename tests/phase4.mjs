import assert from 'node:assert/strict';
import {topics,generate,options,isCorrect,normalize,matchPairs,application,story} from '../js/data.js';
import {sequence,assess,canPlay,levelState} from '../js/progression.js';
import {fresh,load,save,settle} from '../js/storage.js';
import {start,answer} from '../js/engine.js';
import {units,reviewId} from '../js/curriculum.js';
let value=null;globalThis.localStorage={getItem:()=>value,setItem:(_,v)=>value=v};
for(const course of [1,2])for(const topic of [...Object.keys(topics[course]),...units[course].map(reviewId)]){
 for(let i=0;i<100;i++){const q=generate(course,topic);assert(!/vosotr|sois|estudiáis|undefined/.test(JSON.stringify(q)));assert(isCorrect(q.answers[0],q));assert.equal(options(q).filter(v=>isCorrect(v,q)).length,1);}
 assert.equal(matchPairs(course,topic).length,6);
 const a=application(course,topic);assert.equal(a.questions.length,5);for(const q of a.questions){assert(q.prompt.includes('___'));assert(a.text.includes(q.answers[0]));assert(isCorrect(q.answers[0],q));}
}
for(const v of ['¿De dónde eres?','De dónde eres?','de dónde eres','De donde eres','De dónde eres'])assert(isCorrect(v,{answers:['¿De dónde eres?']}));
assert(isCorrect('where are you from',{answers:['Where are you from?']}));assert(!isCorrect('soy',{answers:['es']}));assert.notEqual(normalize('año'),normalize('ano'));
const p=fresh();for(const mode of sequence){assert(canPlay(p,1,'days',mode));const g=start(1,'days',mode);if(mode==='match'){g.assessedPairs=6;g.firstPairCorrect=5;}else{const n=mode==='streak'||mode==='story'?5:10;for(let i=0;i<n;i++)answer(g,i<n*.8);}
 g.completed=true;assert(assess(g).passed);settle(p,g);
}assert(levelState(load(),1,'days').complete);assert(load().completionDates['1:days']);
const low=start(1,'days','lives');for(let i=0;i<10;i++)answer(low,i<7);assert(!assess(low).passed);
p.xp=456;p.bests['1:days:speed']=95;p.achievements.push('speed');p.lastTopic={course:1,topic:'days'};save(p);const old=load();assert.equal(old.xp,456);assert.equal(old.bests['1:days:speed'],95);assert(old.achievements.includes('speed'));assert.equal(old.lastTopic.topic,'days');
console.log('PASS: all topics and unit reviews, five-step mastery, 80% boundary, saved progress, certificates dates, normalization, distractors and Latin American forms.');
