import assert from 'node:assert/strict';
import {fresh,load,save,settlePractice,KEY} from '../js/storage.js';
import {sequence,levelState,canPlay,assess} from '../js/progression.js';
import {unitReport,unitComplete,completionMailto} from '../js/unit-completion.js';
import {units} from '../js/curriculum.js';
const store=new Map();globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
const oldLevels=n=>Object.fromEntries(sequence.slice(0,n).map((m,i)=>[m,{completed:true,best:80+i*5,completedAt:'2026-10-07T12:00:00Z'}]));
const round=(mode,correct=8)=>({course:1,topic:'days',mode,completed:true,promptCount:10,attempts:10,correct,practiced:10});
assert.deepEqual(sequence,['match','quick','lives','streak','story','choose','type','record']);
for(const n of [0,2,5]){
 const old={...fresh(),xp:570,games:5,correct:50,bestStreak:9,achievements:['first','speed'],bests:{'1:days:quick':90},xpBests:{'1:days:quick':145},mastery:{'1:days':oldLevels(n)},completionDates:n===5?{'1:days':'2026-10-07T12:00:00Z'}:{},lastTopic:{course:1,topic:'days'}};
 save(old);const p=load();assert.deepEqual(p.mastery,old.mastery);assert.equal(p.xp,570);assert.deepEqual(p.achievements,old.achievements);assert.deepEqual(p.xpBests,old.xpBests);assert.deepEqual(p.bests,old.bests);assert.equal(levelState(p,1,'days').count,n);assert.equal(levelState(p,1,'days').next,n);assert(!levelState(p,1,'days').complete);assert.equal(p.completionDates['1:days'],undefined);
 for(let i=0;i<8;i++)assert.equal(canPlay(p,1,'days',sequence[i]),i<=n);
 save(p);assert.deepEqual(load(),p);save(load());assert.deepEqual(load(),p);
}
let p=load(),failed=round('choose',7);assert(!settlePractice(p,failed).mastery.passed);assert(!canPlay(p,1,'days','type'));
let pass=round('choose');const reward=settlePractice(p,pass);assert(reward.mastery.passed);assert(canPlay(p,1,'days','type'));assert(!canPlay(p,1,'days','record'));const xp=p.xp,gameCount=p.games;assert.equal(settlePractice(p,pass),reward);assert.equal(p.xp,xp);assert.equal(p.games,gameCount);assert.equal(settlePractice(p,round('choose')).xp,0);
assert(!settlePractice(p,round('type',7)).mastery.passed);assert(!canPlay(p,1,'days','record'));assert(settlePractice(p,round('type')).mastery.passed);
const early=round('record');early.practiced=9;assert(!assess(early).passed);assert(!settlePractice(p,early).mastery.passed);assert(!levelState(p,1,'days').complete);
const recording=round('record');assert(settlePractice(p,recording).mastery.passed);assert(levelState(p,1,'days').complete);assert.equal(p.mastery['1:days'].record.best,null);assert(p.completionDates['1:days']);assert.equal(settlePractice(p,round('record')).xp,0);assert.equal(new Set(p.achievements).size,p.achievements.length);assert.deepEqual(load(),p);
// Reload and replay do not fabricate a speaking score or replace the completion timestamp.
const date=p.completionDates['1:days'];p=load();assert.equal(settlePractice(p,round('record')).xp,0);assert.equal(p.completionDates['1:days'],date);
for(const course of [1,2])for(const unit of units[course]){
 const profile=fresh();for(const topic of unit.topics)profile.mastery[`${course}:${topic}`]=oldLevels(5);
 assert(!unitComplete(profile,course,unit));assert.equal(unitReport(profile,course,unit,'Ana'),null);
 for(const topic of unit.topics){for(const [i,m] of sequence.slice(5).entries())profile.mastery[`${course}:${topic}`][m]={completed:true,best:m==='record'?null:80,completedAt:`2026-10-08T12:0${i}:00Z`};}
 assert(unitComplete(profile,course,unit));const report=unitReport(profile,course,unit,'Ana & José');assert(report.includes('Listen & Choose: 80%'));assert(report.includes('Listen & Type: 80%'));assert(report.includes('Read & Record: Completed (practice; no pronunciation grade)'));assert(!report.includes('null%'));const url=new URL(completionMailto('teacher@example.test',course,unit,'Ana & José',report));assert.equal(url.searchParams.get('body'),report);
 for(const topic of unit.topics)for(const m of sequence){profile.mastery[`${course}:${topic}`][m].completed=false;assert(!unitComplete(profile,course,unit));profile.mastery[`${course}:${topic}`][m].completed=true;}
}
console.log('PASS: realistic 0/5, 2/5, 5/5 migration; idempotence; XP/history retained; 70/80% boundaries; sequential unlocks; speaking completion/null score; reward deduplication; reload; all units/reports/mailto.');
