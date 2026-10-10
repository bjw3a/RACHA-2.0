import assert from 'node:assert/strict';
import {fresh,load,save,settle,settlePractice} from '../js/storage.js';
import {sequence,levelState,canPlay,assess} from '../js/progression.js';
import {start,answer} from '../js/engine.js';
import {units} from '../js/curriculum.js';
import {unitComplete,unitReport} from '../js/unit-completion.js';
const oldOrder=['match','quick','lives','streak','story','choose','type','record'];
assert.deepEqual(sequence,['match','quick','lives','choose','type','record','streak','story']);
let value=null;globalThis.localStorage={getItem:()=>value,setItem:(_,v)=>value=v};
const levels=ids=>Object.fromEntries(ids.map(m=>[m,{completed:true,best:m==='record'?null:100,completedAt:'2026-10-08T10:00:00Z'}]));
function profile(course,topic,ids){const p=fresh();p.xp=1540;p.games=23;p.correct=185;p.bestStreak=10;p.achievements=['first','perfect','ten','century'];p.bests={[`${course}:${topic}:quick`]:100};p.xpBests=Object.fromEntries(ids.map(m=>[`${course}:${topic}:${m}`,m==='record'?100:165]));p.mastery[`${course}:${topic}`]=levels(ids);p.lastTopic={course,topic};p.lastTopics[course]={course,topic};if(ids.length===8)p.completionDates[`${course}:${topic}`]='2026-10-08T10:00:00Z';return p;}
function game(course,topic,mode,correct=10){if(['choose','type','record'].includes(mode))return {course,topic,mode,completed:true,promptCount:10,attempts:10,correct,practiced:10};const g=start(course,topic,mode);if(mode==='match'){g.assessedPairs=6;g.firstPairCorrect=6;}else{for(let i=0;i<(['streak','story'].includes(mode)?5:10);i++)answer(g,true);}g.completed=true;g.elapsed=2;return g;}
const reward=(p,g)=>['choose','type','record'].includes(g.mode)?settlePractice(p,g):settle(p,g);
const examples=[['A',[],0],['B',['match','quick'],2],['C',oldOrder.slice(0,5),3],['D',oldOrder,-1],['E',['match','choose'],1]];
for(const course of [1,2])for(const [name,ids,next] of examples){
 const topic=course===1?'family':'er',p=profile(course,topic,ids);save(p);const loaded=load();assert.deepEqual(loaded,p,`Example ${name}: preserve profile`);assert.equal(levelState(loaded,course,topic).next,next);assert.equal(levelState(loaded,course,topic).count,ids.length);
 for(const m of sequence)assert.equal(canPlay(loaded,course,topic,m),ids.includes(m)||m===sequence[next]);
 for(let i=0;i<3;i++){save(loaded);assert.deepEqual(load(),loaded);}
 const earned=loaded.xp,achievements=[...loaded.achievements];if(name==='D'){
  for(const m of ['choose','type','record'])assert.equal(reward(loaded,game(course,topic,m)).xp,0);
  assert.equal(loaded.xp,earned);assert.deepEqual(loaded.achievements,achievements);assert.equal(loaded.completionDates[`${course}:${topic}`],p.completionDates[`${course}:${topic}`]);
 }
 if(name==='B'||name==='C'){
  if(name==='B')assert(reward(loaded,game(course,topic,'lives')).mastery.passed);
  assert(!reward(loaded,game(course,topic,'choose',7)).mastery.passed);assert.equal(levelState(loaded,course,topic).next,3);
  const g=game(course,topic,'choose',8);assert(reward(loaded,g).mastery.passed);assert.equal(levelState(loaded,course,topic).next,4);assert.equal(sequence[4],'type');const xp=loaded.xp;reward(loaded,g);assert.equal(loaded.xp,xp);
  assert(loaded.mastery[`${course}:${topic}`].quick.completed);assert.equal(reward(loaded,game(course,topic,'choose',8)).xp,0);
 }
}
// Every possible mixture of completed IDs: only the earliest missing level and replays are playable.
for(let mask=0;mask<256;mask++){
 const ids=oldOrder.filter((_,i)=>mask&(1<<i)),p=profile(1,'family',ids);save(p);const q=load();assert.deepEqual(q,p);const state=levelState(q,1,'family');
 for(const m of sequence)assert.equal(canPlay(q,1,'family',m),ids.includes(m)||m===sequence[state.next]);
 const before=structuredClone(q.mastery['1:family']);
 if(state.next!==-1){const m=sequence[state.next];assert(reward(q,game(1,'family',m)).mastery.passed);for(const id of ids)assert.deepEqual(q.mastery['1:family'][id],before[id]);assert.equal(sequence[levelState(q,1,'family').next],sequence.find(id=>!q.mastery['1:family'][id]?.completed));}
}
// A fresh student completes speaking at Level 6, but still needs both final challenges.
for(const course of [1,2]){
 const p=fresh(),topic=course===1?'family':'er';for(const [i,m] of sequence.entries()){
  assert.equal(levelState(p,course,topic).next,i);const g=game(course,topic,m);assert(reward(p,g).mastery.passed);assert.equal(levelState(p,course,topic).complete,i===7);save(p);assert.deepEqual(load(),p);
  if(m==='record'){assert.equal(p.mastery[`${course}:${topic}`][m].best,null);assert(!p.completionDates[`${course}:${topic}`]);}
 }
 const unit=units[course].find(u=>u.topics.includes(topic));assert(unitComplete(p,course,unit));const report=unitReport(p,course,unit,'Ana');const ordered=['Match-Up:','Recognition:','Typing:','Listen & Choose:','Listen & Type:','Read & Record:','In Context:','Story Challenge:'];for(let i=1;i<ordered.length;i++)assert(report.indexOf(ordered[i])>report.indexOf(ordered[i-1]));assert(report.includes('Read & Record: Completed (practice; no pronunciation grade)'));
}
assert(!assess({...game(1,'family','record'),practiced:9}).passed);
console.log('PASS: Phase 4.6 order, migration A–E in both courses, all 256 mastery combinations, stable IDs/full-profile preservation, idempotence, earliest-missing progression, replay access, no duplicate XP/badges, score thresholds, speaking at 6, story at 8, reload and ordered reports.');
