import {practiceContent} from './practice-data.js';
import {createPracticeAudio} from './practice-audio.js';
import {shuffle} from './data.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const practiceIcon=name=>`<svg class="practice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${({headphones:'<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>',speaker:'<path d="M4 9h4l5-4v14l-5-4H4zM17 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',stop:'<rect x="5" y="5" width="14" height="14" rx="1"/>',play:'<path d="m7 4 14 8-14 8z"/>'})[name]||''}</svg>`;
export function openPractice(main,{course,topic,label,enabled,back}) {
 const content=practiceContent(course,topic);let mode='sentences',index=0,items=[],disposed=false;
 const $=s=>main.querySelector(s);
 const notify=s=>{if(!disposed&&$('#practice-status'))$('#practice-status').textContent=s;};
 const audio=createPracticeAudio({enabled,notify,state:s=>{
  if(disposed||!$('#record'))return;
  $('#record').disabled=['requesting','recording','stopping'].includes(s);
  $('#record').innerHTML=practiceIcon('mic')+(s==='ready'?' Record Again':' Record Yourself');
  $('#stop-recording').disabled=s!=='recording';$('#play-recording').disabled=s!=='ready';
  main.querySelectorAll('[data-listen]').forEach(b=>b.disabled=['requesting','recording','stopping'].includes(s));
 }});
 function render(){
  audio.dispose();const item=items[index];
  main.innerHTML=`<section class="game-shell practice-shell"><div class="game-top"><div><span class="eyebrow">SPANISH ${course} · OPTIONAL PRACTICE</span><h2>${practiceIcon('headphones')} Listen & Speak</h2><p>${esc(label)}</p></div><button id="practice-back" class="quiet">← Levels</button></div><div class="practice-tabs" aria-label="Practice type">${[['sentences','Speak sentences'],['vocabulary','Speak words'],['listening','Listening']].map(([id,title])=>`<button data-practice="${id}" aria-pressed="${mode===id}">${title}</button>`).join('')}</div><p class="hint">${mode==='listening'?'Listen, then answer. Replay as often as you need.':'Hear → Speak → Play your recording → Compare'}</p><p id="practice-sound" class="hint">${enabled()?'Sound on':'Sound is off. Turn Sound on above to listen.'}</p><div class="question">${!item?'<p>No practice items for this topic yet. Choose another practice type.</p>':`<span class="eyebrow">${index+1} / ${items.length}</span>${mode==='listening'?`<h3>${esc(item.prompt)}</h3><button class="primary" data-listen>${practiceIcon('speaker')} Listen to Spanish</button><div class="choices practice-choices">${shuffle(item.choices).map(c=>`<button class="choice" data-answer="${esc(c)}">${esc(c)}</button>`).join('')}</div><p id="listening-feedback" role="status"></p><details><summary>Show Spanish transcript</summary><p lang="es">${esc(item.text)}</p></details>`:`<h2 lang="es">${esc(item.text)}</h2>${item.meaning?`<p>${esc(item.meaning)}</p>`:''}<div class="practice-controls"><button class="primary" data-listen>${practiceIcon('speaker')} Hear Spanish</button><button id="record">${practiceIcon('mic')} Record Yourself</button><button id="stop-recording" disabled>${practiceIcon('stop')} Stop Recording</button><button id="play-recording" disabled>${practiceIcon('play')} Play My Recording</button><button data-listen>${practiceIcon('speaker')} Hear Spanish Again</button></div><p class="hint">Your recording is temporary and private. It disappears when you move on. No pronunciation grade.</p>`}<button id="practice-next" class="primary">${index===items.length-1?'Practice Again ↻':'Next →'}</button>`}<p id="practice-status" role="status" aria-live="polite"></p></div></section>`;
  $('#practice-back').onclick=back;
  main.querySelectorAll('[data-practice]').forEach(b=>b.onclick=()=>select(b.dataset.practice));
  main.querySelectorAll('[data-listen]').forEach(b=>b.onclick=()=>audio.speakSpanish(item.text));
  $('#record')?.addEventListener('click',audio.record);$('#stop-recording')?.addEventListener('click',audio.stop);$('#play-recording')?.addEventListener('click',audio.play);
  main.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{const correct=b.dataset.answer===item.answer;$('#listening-feedback').textContent=correct?'✓ Correct! Listen again or move on.':'Not quite. Listen again and try another answer.';b.classList.add(correct?'correct':'wrong');});
  $('#practice-next')?.addEventListener('click',()=>{index=(index+1)%items.length;render();});
  ($('#practice-next')||$('#practice-back')).focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
 }
 function select(value){mode=value;items=shuffle(content[mode]);index=0;render();}
 const hide=()=>{audio.dispose();};window.addEventListener('pagehide',hide);
 const visibility=()=>{if(document.hidden)hide();};document.addEventListener('visibilitychange',visibility);
 select(mode);
 return {soundChanged(){if(!enabled())audio.stopAudio();if($('#practice-sound'))$('#practice-sound').textContent=enabled()?'Sound on':'Sound is off. Turn Sound on above to listen.';},dispose(){audio.dispose();disposed=true;window.removeEventListener('pagehide',hide);document.removeEventListener('visibilitychange',visibility);}};
}
