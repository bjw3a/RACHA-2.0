import {fresh,normalizeProgress,save} from './storage.js';
import {units,orderedTopics} from './curriculum.js';
import {sequence} from './progression.js';
const LIMIT=1024*1024;
const knownModes=[...sequence,'speed','minute'];
const knownTopics=new Set([1,2].flatMap(c=>['mixed',...units[c].flatMap(orderedTopics)].map(t=>`${c}:${t}`)));
const badgeIds=['first','fire','perfect','speed','ten','century'];
const fail=()=>{throw new Error('This file is not a compatible Racha progress backup. No progress was changed.');};
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const only=(v,keys)=>{if(!object(v)||Object.keys(v).some(k=>!keys.includes(k)))fail();};
const number=(v,max=Number.MAX_SAFE_INTEGER)=>{if(!Number.isFinite(v)||v<0||v>max)fail();};
const date=v=>{if(v!==null&&(typeof v!=='string'||v.length>40||!Number.isFinite(Date.parse(v))))fail();};
const activityKey=k=>{const i=k.lastIndexOf(':');return knownTopics.has(k.slice(0,i))&&knownModes.includes(k.slice(i+1));};
function location(v){only(v,['course','topic']);if(!knownTopics.has(`${v.course}:${v.topic}`)||![1,2].includes(v.course))fail();}
export function validateProfile(p){
 only(p,Object.keys(fresh()));
 for(const k of ['xp','bestStreak','correct','games']){if(p[k]!==undefined){number(p[k]);if(!Number.isSafeInteger(p[k]))fail();}}
 for(const k of ['sound','light'])if(p[k]!==undefined&&typeof p[k]!=='boolean')fail();
 for(const k of ['bests','xpBests'])if(p[k]!==undefined){if(!object(p[k]))fail();for(const [id,n] of Object.entries(p[k])){if(!activityKey(id))fail();number(n);}}
 if(p.achievements!==undefined&&(!Array.isArray(p.achievements)||p.achievements.length>badgeIds.length||p.achievements.some(v=>!badgeIds.includes(v))))fail();
 if(p.mastery!==undefined){if(!object(p.mastery))fail();for(const [id,levels] of Object.entries(p.mastery)){
  if(!knownTopics.has(id))fail();only(levels,knownModes);
  for(const [mode,v] of Object.entries(levels)){
   only(v,['best','completed','completedAt','englishChoicePassed','englishChoiceBest']);if(typeof v.completed!=='boolean')fail();
   if(mode==='record'){if(v.best!==null&&v.best!==undefined)number(v.best,100);}else number(v.best,100);
   if(v.completed&&mode!=='record'&&v.best<80)fail();
   if(v.completedAt!==undefined)date(v.completedAt);
   if(v.englishChoiceBest!==undefined){if(mode!=='streak')fail();number(v.englishChoiceBest,100);}
   if(v.englishChoicePassed===true&&!(v.englishChoiceBest>=80))fail();
   if(v.englishChoicePassed!==undefined&&(mode!=='streak'||typeof v.englishChoicePassed!=='boolean'||(v.englishChoicePassed&&!v.completed)))fail();
  }
 }}
 if(p.lastTopic!==undefined&&p.lastTopic!==null)location(p.lastTopic);
 if(p.lastTopics!==undefined){only(p.lastTopics,['1','2']);for(const [c,v] of Object.entries(p.lastTopics)){location(v);if(v.course!==Number(c))fail();}}
 if(p.completionDates!==undefined){if(!object(p.completionDates))fail();for(const [id,v] of Object.entries(p.completionDates)){if(!knownTopics.has(id))fail();date(v);}}
 return normalizeProgress(p);
}
export function parseBackup(text){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>LIMIT)throw new Error('Choose a Racha backup smaller than 1 MB. No progress was changed.');
 let data;try{data=JSON.parse(text);}catch{throw new Error('This file contains invalid JSON. No progress was changed.');}
 only(data,['app','version','exportedAt','progress']);
 if(data.app!=='racha'||data.version!==1||!object(data.progress)||Object.keys(data.progress).length===0)fail();
 if(data.exportedAt!==undefined)date(data.exportedAt);
 return validateProfile(data.progress);
}
export function exportBackup(profile){
 const progress=validateProfile(profile);
 return JSON.stringify({app:'racha',version:1,exportedAt:new Date().toISOString(),progress},null,2);
}
const earlier=(a,b)=>!a?b:!b?a:Date.parse(a)<=Date.parse(b)?a:b;
export function mergeProgress(current,incoming){
 const a=normalizeProgress(current),b=validateProfile(incoming),out=structuredClone(a);
 for(const k of ['xp','bestStreak','correct','games'])out[k]=Math.max(a[k],b[k]);
 out.achievements=[...new Set([...a.achievements,...b.achievements])];
 for(const field of ['bests','xpBests'])for(const [id,value] of Object.entries(b[field])){
  out[field][id]=a[field][id]===undefined?value:field==='bests'&&id.endsWith(':match')?Math.min(a[field][id],value):Math.max(a[field][id],value);
 }
 for(const [id,levels] of Object.entries(b.mastery)){
  out.mastery[id] ||= {};
  for(const [mode,value] of Object.entries(levels)){
   const old=out.mastery[id][mode];
   out.mastery[id][mode]=!old?structuredClone(value):{
    best:mode==='record'?null:Math.max(old.best,value.best),completed:old.completed||value.completed,
    completedAt:earlier(old.completedAt,value.completedAt)||null,
    ...(old.englishChoicePassed||value.englishChoicePassed?{englishChoicePassed:true}:{}),
    ...(old.englishChoiceBest!==undefined||value.englishChoiceBest!==undefined?{englishChoiceBest:Math.max(old.englishChoiceBest||0,value.englishChoiceBest||0)}:{})
   };
  }
 }
 for(const [id,value] of Object.entries(b.completionDates))out.completionDates[id]=earlier(a.completionDates[id],value);
 // Keep this device's preferences and resume position; fill missing positions only.
 out.lastTopic ||= b.lastTopic;
 for(const c of [1,2])out.lastTopics[c] ||= b.lastTopics[c];
 for(const c of [1,2])if(!out.lastTopics[c])delete out.lastTopics[c];
 return normalizeProgress(out);
}
export const backupView=()=>`<details class="backup-panel"><summary>Progress & backups</summary><p>Progress stays in this browser. Clearing site data or changing devices can lose it. Download a backup to keep a copy.</p><button id="export-progress">Download backup</button><label class="label" for="import-progress">Import a Racha backup</label><input type="file" id="import-progress" accept=".json,application/json"><p class="hint">Import merges achievements and best results. Existing completions stay unlocked. Totals use the higher value, not a sum. Names and recordings are not included. Keep backups private.</p><button id="confirm-import" class="primary" hidden>Merge this backup</button><button id="cancel-import" hidden>Cancel import</button><p id="backup-status" role="status" aria-live="polite"></p></details>`;
export function bindBackup(main,getProfile,onSaved){
 const input=main.querySelector('#import-progress'),status=main.querySelector('#backup-status'),confirm=main.querySelector('#confirm-import'),cancel=main.querySelector('#cancel-import');
 let pending=null,request=0;
 const clear=()=>{pending=null;confirm.hidden=true;cancel.hidden=true;};
 main.querySelector('#export-progress').onclick=()=>{
  try{const text=exportBackup(getProfile()),url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`Racha-progress-${new Date().toISOString().slice(0,10)}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Backup download requested. Keep the file somewhere safe.';}
  catch{status.textContent='Backup could not be downloaded. Your current progress is unchanged.';}
 };
 input.onchange=async()=>{
  const id=++request;clear();const file=input.files?.[0];if(!file){status.textContent='';return;}
  try{if(file.size>LIMIT)throw new Error('Choose a Racha backup smaller than 1 MB.');const candidate=parseBackup(await file.text());if(id!==request||!input.isConnected)return;
   pending=candidate;const completed=Object.values(candidate.mastery).flatMap(Object.values).filter(v=>v.completed).length;
   status.textContent=`Backup checked: ${completed} completed activities, ${candidate.xp} XP. Merge it with this browser’s progress?`;
   confirm.hidden=false;cancel.hidden=false;
  }catch(error){if(id===request)status.textContent=error.message;}
 };
 cancel.onclick=()=>{request++;clear();input.value='';status.textContent='Import canceled. Progress unchanged.';};
 confirm.onclick=()=>{
  if(!pending)return;
  try{const merged=mergeProgress(getProfile(),pending);if(!save(merged))throw new Error('This browser could not save the backup. Existing progress is unchanged. Free browser storage and try again.');clear();onSaved(merged);}
  catch(error){status.textContent=error.message;}
 };
}
