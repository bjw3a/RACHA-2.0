import {recordMastery,sequence,levelState,progressKey} from './progression.js';
export const KEY='racha-progress-v1';
const clean=n=>Number.isFinite(n)&&n>=0?Math.floor(n):0;
export function fresh(){return {xp:0,bestStreak:0,correct:0,games:0,bests:{},mastery:{},xpBests:{},achievements:[],sound:false,light:false,lastTopic:null,lastTopics:{},completionDates:{}};}
export function load(){try{const d=JSON.parse(localStorage.getItem(KEY));if(!d||typeof d!=='object')return fresh();const s=fresh();for(const k of ['xp','bestStreak','correct','games'])s[k]=clean(d[k]);for(const k of ['sound','light'])s[k]=d[k]===true;if(d.bests&&typeof d.bests==='object')for(const [k,v] of Object.entries(d.bests))if(Number.isFinite(v)&&v>=0)s.bests[k]=v;s.achievements=Array.isArray(d.achievements)?d.achievements.filter(v=>typeof v==='string'):[];if(d.mastery&&typeof d.mastery==='object')for(const [key,levels] of Object.entries(d.mastery)){
 if(!/^[12]:/.test(key)||!levels||typeof levels!=='object')continue;
 s.mastery[key]={};
 for(const mode of [...sequence,'speed','minute']){const v=levels[mode];if(!v||typeof v!=='object'){continue;}
 const best=Number.isFinite(v.best)?Math.max(0,Math.min(100,v.best)):0;
 const completed=v.completed===true&&best>=80;
 s.mastery[key][mode]={best,completed,completedAt:typeof v.completedAt==='string'?v.completedAt:null};}
 }
 if(d.xpBests&&typeof d.xpBests==='object')for(const [key,value] of Object.entries(d.xpBests))if(/^[12]:/.test(key))s.xpBests[key]=clean(value);
 if(d.lastTopic && [1,2].includes(d.lastTopic.course) && typeof d.lastTopic.topic==='string')s.lastTopic=d.lastTopic;
 if(d.lastTopics&&typeof d.lastTopics==='object')for(const c of [1,2]){const last=d.lastTopics[c];if(last?.course===c&&typeof last.topic==='string')s.lastTopics[c]=last;}
 if(d.completionDates&&typeof d.completionDates==='object')s.completionDates=d.completionDates;
 return s;}catch{return fresh();}}
export function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));return true;}catch{return false;}}
export const badges=[['first','First finish','Complete a game.'],['fire','On fire','Reach a streak of 5.'],['perfect','Perfecto','Finish Recognition or a story at 100.'],['speed','Speedster','Legacy timed-round achievement.'],['ten','Practice makes progress','Finish 10 games.'],['century','Century club','Answer 100 correctly.']];
export function settle(s,g){if(g.reward)return g.reward;s.games++;s.correct+=g.correct;s.bestStreak=Math.max(s.bestStreak,g.bestStreak);const key=`${g.course}:${g.topic}:${g.mode}`,metric=g.mode==='match'?g.elapsed:g.mode==='streak'?g.bestStreak:['minute','lives'].includes(g.mode)?g.points:g.score;const record=s.bests[key]===undefined||(g.mode==='match'?metric<s.bests[key]:metric>s.bests[key]);if(record)s.bests[key]=metric;const potential=g.xp+20+(record?25:0);s.xpBests ||= {};const xp=Math.max(0,potential-(s.xpBests[key]||0));s.xpBests[key]=Math.max(s.xpBests[key]||0,potential);s.xp+=xp;const wasComplete=levelState(s,g.course,g.topic).complete;const mastery=recordMastery(s,g);if(!wasComplete&&levelState(s,g.course,g.topic).complete){const k=progressKey(g.course,g.topic);s.completionDates ||= {};s.completionDates[k] ||= new Date().toISOString();}const eligible=[g.completed&&'first',g.bestStreak>=5&&'fire',['quick','story'].includes(g.mode)&&g.score===100&&'perfect',g.mode==='minute'&&g.correct>=10&&'speed',s.games>=10&&'ten',s.correct>=100&&'century'].filter(Boolean);const unlocked=eligible.filter(b=>!s.achievements.includes(b));s.achievements.push(...unlocked);return g.reward={record,xp,unlocked,mastery,saved:save(s)};}
