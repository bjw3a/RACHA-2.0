import {TEACHER_EMAIL} from './config.js';
import {topics} from './data.js';
import {modes} from './engine.js';
import {sequence,levelState,percentText} from './progression.js';
const NAME_KEY='racha-student-name-v1';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanName=s=>String(s).replace(/[\r\n\t]/g,' ').trim().slice(0,100);
function savedName(){try{return cleanName(localStorage.getItem(NAME_KEY)||'');}catch{return '';}}
// A unit is complete only when every listed topic has all five activities mastered.
// Mixed review remains an optional, separate practice path; it cannot substitute for topics.
export function unitComplete(profile,course,unit){
 return !!unit?.topics.length && unit.topics.every(t=>levelState(profile,course,t).complete);
}
export function unitReport(profile,course,unit,name){
 if(!unitComplete(profile,course,unit))return null;
 const dates=unit.topics.map(t=>{
  const topicDate=profile.completionDates?.[`${course}:${t}`];
  if(topicDate&&Number.isFinite(Date.parse(topicDate)))return Date.parse(topicDate);
  const levels=levelState(profile,course,t).levels;
  const values=sequence.map(m=>Date.parse(levels[m]?.completedAt));
  return values.every(Number.isFinite)?Math.max(...values):NaN;
 });
 const completionDate=dates.every(Number.isFinite)?new Date(Math.max(...dates)).toLocaleString():'Previously completed — date unavailable';
 return ['RACHA UNIT COMPLETION','',`Student: ${cleanName(name)}`,`Course: Spanish ${course}`,`Unit: ${unit.name}`,'Status: Unit Complete','','Topics Mastered:',...unit.topics.map(t=>`✓ ${topics[course][t]}`),'','Unit Performance (best mastery):',...unit.topics.flatMap(t=>[topics[course][t],...sequence.map(m=>`  ${modes.find(mode=>mode.id===m).name}: ${percentText(levelState(profile,course,t).levels[m].best)}`)]),'',`Completion Date: ${completionDate}`,'','Results are saved in this browser; not teacher-verified.'].join('\n');
}
export function completionMailto(email,course,unit,name,report){
 const subject=`RACHA COMPLETION | Spanish ${course} | ${unit.name} | ${cleanName(name)}`;
 return `mailto:${encodeURIComponent(email.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(report)}`;
}
export function unitCompletionView(profile,course,unit){
 if(!unitComplete(profile,course,unit))return '';
 return `<section class="completion unit-completion" aria-labelledby="unit-complete-title"><h2 id="unit-complete-title">🏆 UNIT COMPLETE!</h2><strong>${esc(unit.name)}</strong><p>All required topics mastered ✓</p><label for="unit-student-name">Student name</label><input id="unit-student-name" autocomplete="off" maxlength="100" value="${esc(savedName())}" aria-describedby="unit-name-help"><p class="hint" id="unit-name-help">Saved on this browser. Edit for a different student.</p><div class="unit-completion-actions"><button id="send-unit-completion" class="primary" ${TEACHER_EMAIL.trim()?'':'disabled'}>SEND COMPLETION TO MR. WALSH</button><button id="copy-unit-completion">COPY COMPLETION</button></div><p class="hint">${TEACHER_EMAIL.trim()?'Email opens a draft. Press Send in your email app.':'Email is not configured yet. Use Copy Completion.'} Submit only when your teacher asks.</p><textarea id="unit-copy-fallback" aria-label="Select and copy unit completion report" hidden readonly></textarea><p id="unit-completion-status" role="status"></p></section>`;
}
export function bindUnitCompletion(main,profile,course,unit){
 const input=main.querySelector('#unit-student-name');if(!input)return;
 const status=main.querySelector('#unit-completion-status');
 const persist=()=>{try{localStorage.setItem(NAME_KEY,cleanName(input.value));return true;}catch{return false;}};
 input.addEventListener('change',()=>{status.textContent=persist()?'Name saved.':'Name could not be saved on this browser. You can still submit.';});
 function report(){
  if(!unitComplete(profile,course,unit))return null;
  if(!cleanName(input.value)){status.textContent='Enter your name first.';input.focus();return null;}
  persist();return unitReport(profile,course,unit,input.value);
 }
 main.querySelector('#send-unit-completion').onclick=()=>{
  const text=report();if(!text||!TEACHER_EMAIL.trim())return;
  window.location.href=completionMailto(TEACHER_EMAIL,course,unit,input.value,text);
  status.textContent='Press Send in your email app. If no draft opens, use Copy Completion.';
 };
 main.querySelector('#copy-unit-completion').onclick=async()=>{
  const text=report();if(!text)return;
  try{await navigator.clipboard.writeText(text);status.textContent='Completion copied ✓';}
  catch{const field=main.querySelector('#unit-copy-fallback');field.hidden=false;field.value=text;field.focus();field.select();status.textContent='Copy the selected report and paste it into Schoology or email.';}
 };
}
