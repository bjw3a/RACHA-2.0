import {orderedTopics,reviewId} from './curriculum.js';
import {topics} from './data.js';
import {modes} from './engine.js';
import {sequence,levelState,percentText,masteryLabel} from './progression.js';
const NAME_KEY='racha-student-name-v1';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanName=s=>String(s).replace(/[\r\n\t]/g,' ').trim().slice(0,100);
function savedName(){try{return cleanName(localStorage.getItem(NAME_KEY)||'');}catch{return '';}}
// A unit is complete only when every listed topic has all eight activities mastered.
// Mixed Review follows the individual topics and is required for unit completion.
// Existing per-topic records are preserved; older students only finish missing review.
export function unitComplete(profile,course,unit){
 return !!unit?.topics.length && orderedTopics(unit).every(t=>levelState(profile,course,t).complete);
}
export function unitReport(profile,course,unit,name){
 if(!unitComplete(profile,course,unit))return null;
 const dates=orderedTopics(unit).map(t=>{
  const topicDate=profile.completionDates?.[`${course}:${t}`];
  if(topicDate&&Number.isFinite(Date.parse(topicDate)))return Date.parse(topicDate);
  const levels=levelState(profile,course,t).levels;
  const values=sequence.map(m=>Date.parse(levels[m]?.completedAt));
  return values.every(Number.isFinite)?Math.max(...values):NaN;
 });
 const completionDate=dates.every(Number.isFinite)?new Date(Math.max(...dates)).toLocaleString():'Previously completed — date unavailable';
 return ['RACHA UNIT COMPLETION','',`Name: ${cleanName(name)}`,`Course: Spanish ${course}`,`Unit: ${unit.name}`,'Status: Unit Complete','','Topics Mastered:',...orderedTopics(unit).map(t=>`✓ ${t===reviewId(unit)?'Mixed Review':topics[course][t]}`),'','Unit Performance (best mastery):',...orderedTopics(unit).flatMap(t=>[t===reviewId(unit)?'Mixed Review':topics[course][t],...sequence.map(m=>`  ${modes.find(mode=>mode.id===m).name}: ${m==='record'?'Completed (practice; no pronunciation grade)':masteryLabel(m,levelState(profile,course,t).levels[m])}`)]),'',`Completion Date: ${completionDate}`,'','Results are saved in this browser; self-reported practice results.'].join('\n');
}
export function unitCompletionView(profile,course,unit){
 if(!unitComplete(profile,course,unit))return '';
 return `<section class="completion unit-completion" aria-labelledby="unit-complete-title"><h2 id="unit-complete-title">🏆 UNIT COMPLETE!</h2><strong>${esc(unit.name)}</strong><p>All required topics mastered ✓</p><label for="unit-student-name">Name (optional)</label><input id="unit-student-name" autocomplete="off" maxlength="100" value="${esc(savedName())}" aria-describedby="unit-name-help"><p class="hint" id="unit-name-help">Optional. Saved only in this browser.</p><div class="unit-completion-actions"><button id="copy-unit-completion">COPY COMPLETION</button></div><p class="hint">Copy your progress report to keep or share yourself.</p><textarea id="unit-copy-fallback" aria-label="Select and copy unit completion report" hidden readonly></textarea><p id="unit-completion-status" role="status"></p></section>`;
}
export function bindUnitCompletion(main,profile,course,unit){
 const input=main.querySelector('#unit-student-name');if(!input)return;
 const status=main.querySelector('#unit-completion-status');
 const persist=()=>{try{localStorage.setItem(NAME_KEY,cleanName(input.value));return true;}catch{return false;}};
 input.addEventListener('change',()=>{status.textContent=persist()?'Name saved.':'Name could not be saved on this browser. You can still copy the report.';});
 function report(){
  if(!unitComplete(profile,course,unit))return null;
  persist();return unitReport(profile,course,unit,input.value);
 }
 main.querySelector('#copy-unit-completion').onclick=async()=>{
  const text=report();if(!text)return;
  try{await navigator.clipboard.writeText(text);status.textContent='Completion copied ✓';}
  catch{const field=main.querySelector('#unit-copy-fallback');field.hidden=false;field.value=text;field.focus();field.select();status.textContent='Copy the selected report and paste it wherever you choose.';}
 };
}
