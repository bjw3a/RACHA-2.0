import {createPracticeSession,dictationCorrect} from './practice-sessions.js';
import {createPracticeAudio} from './practice-audio.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const practiceIcon=name=>`<svg class="practice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${({headphones:'<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>',speaker:'<path d="M4 9h4l5-4v14l-5-4H4zM17 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',stop:'<rect x="5" y="5" width="14" height="14" rx="1"/>',play:'<path d="m7 4 14 8-14 8z"/>'})[name]||''}</svg>`;
const activities={choose:['Listen & Choose','Listen to Spanish. Choose the answer.','headphones'],type:['Listen & Type','Listen. Type what you hear in Spanish.','speaker'],record:['Read & Record','Read the Spanish aloud and hear yourself.','mic']};
export function openPractice(main,{course,topic,label,enabled,back}) {
 let mode=null,items=[],index=0,disposed=false,selected=null,answered=false,attempts=0,firstCorrect=0;
 const $=s=>main.querySelector(s);
 const notify=s=>{if(!disposed&&$('#practice-status'))$('#practice-status').textContent=s;};
 const audio=createPracticeAudio({enabled,notify,state:s=>{
  if(disposed||!$('#record'))return;
  const busy=['requesting','recording','stopping'].includes(s);
  $('#record').disabled=busy;$('#record').innerHTML=practiceIcon('mic')+(s==='ready'?' Record Again':' Record Yourself');
  $('#stop-recording').hidden=!['recording','stopping'].includes(s);$('#stop-recording').disabled=s!=='recording';
  $('#play-recording').hidden=s!=='ready';$('#hear-again').hidden=s!=='ready';
  main.querySelectorAll('[data-listen]').forEach(b=>b.disabled=busy);
  $('#record-indicator').hidden=s!=='recording';
 }});
 const soundHint=()=>enabled()?'Replay as often as you like.':'Sound is off. Turn Sound on above to listen.';
 function shell(title,body){audio.dispose();main.innerHTML=`<section class="game-shell practice-shell"><div class="game-top"><div><span class="eyebrow">SPANISH ${course} · OPTIONAL PRACTICE</span><h2 id="practice-title" tabindex="-1">${esc(title)}</h2><p>${esc(label)}</p></div><button id="practice-back" class="quiet">← Back to Topic</button></div>${body}</section>`;$('#practice-back').onclick=back;$('#practice-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
 function menu(){mode=null;shell('Listen & Speak',`<div class="practice-menu">${Object.entries(activities).map(([id,[name,instruction,icon]])=>`<button class="practice-card" data-practice="${id}"><strong>${practiceIcon(icon)} ${name}</strong><span>${instruction}</span><span aria-hidden="true">Start →</span></button>`).join('')}</div>`);main.querySelectorAll('[data-practice]').forEach(b=>b.onclick=()=>start(b.dataset.practice));}
 function start(value){mode=value;items=createPracticeSession(course,topic,mode);index=0;firstCorrect=0;render();}
 function render(){
  selected=null;answered=false;attempts=0;const item=items[index];
  shell(activities[mode][0],`<button id="practice-menu-back" class="quiet">← Back to Listen &amp; Speak</button>${!item?'<p>No prompts available for this topic yet.</p>':`<p class="practice-progress" id="practice-progress">${index+1} / ${items.length}</p><div class="bar" aria-label="Practice progress"><span style="width:${index/items.length*100}%"></span></div><section class="question"><p class="hint" id="practice-sound">${soundHint()}</p>${mode==='record'?`<h2 lang="es" id="speaking-prompt">${esc(item.text)}</h2><p class="hint">Read → Hear → Speak → Listen → Compare</p><div class="practice-controls"><button class="primary" data-listen>${practiceIcon('speaker')} Hear Spanish</button><button id="record">${practiceIcon('mic')} Record Yourself</button><button id="stop-recording" hidden>${practiceIcon('stop')} Stop</button><button id="play-recording" hidden>${practiceIcon('play')} Play My Recording</button><button id="hear-again" data-listen hidden>${practiceIcon('speaker')} Hear Spanish Again</button></div><p id="record-indicator" hidden>● Recording…</p><p class="hint">Private, temporary recording. No pronunciation grade.</p>`:`<button class="primary practice-listen" data-listen>${practiceIcon('speaker')} PLAY AUDIO</button>${mode==='choose'?`<h3>${esc(item.prompt)}</h3><div class="choices practice-choices">${item.choices.map((c,i)=>`<button class="choice" data-answer="${i}" aria-pressed="false">${esc(c)}</button>`).join('')}</div><button class="primary" id="practice-check" disabled>CHECK →</button>`:`<form id="dictation-form"><label class="label" for="dictation">Type what you hear in Spanish:</label><input id="dictation" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="dictation-hint"><p class="hint" id="dictation-hint">Accents and punctuation are optional. Keep ñ.</p><div class="accent-keys">${['á','é','í','ó','ú','ñ','ü'].map(c=>`<button type="button" data-letter="${c}" aria-label="Insert ${c}">${c}</button>`).join('')}</div><button class="primary" id="practice-check" type="submit">CHECK →</button></form>`}<div id="practice-feedback" role="status" aria-live="polite"></div><p id="practice-transcript" hidden lang="es"></p>`}<button id="practice-next" class="primary" ${mode==='record'?'':'hidden'}>${index===items.length-1?'FINISH →':'NEXT →'}</button><p id="practice-status" role="status" aria-live="polite"></p></section>`}`);
  $('#practice-menu-back').onclick=menu;if(!item)return;
  main.querySelectorAll('[data-listen]').forEach(b=>b.onclick=()=>audio.speakSpanish(item.text));
  $('#record')?.addEventListener('click',audio.record);$('#stop-recording')?.addEventListener('click',audio.stop);$('#play-recording')?.addEventListener('click',audio.play);
  main.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{if(answered)return;selected=Number(b.dataset.answer);main.querySelectorAll('[data-answer]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===b)));$('#practice-check').disabled=false;});
  const check=()=>{
   if(answered)return;const value=mode==='choose'?item.choices[selected]:$('#dictation').value;if(value==null||!value.trim())return;
   const correct=mode==='choose'?value===item.answer:dictationCorrect(value,item);attempts++;
   $('#practice-feedback').textContent=correct?'✓ Correct!':'Try again.';
   if(!correct){if(mode==='type')$('#dictation').focus();return;}
   answered=true;if(attempts===1)firstCorrect++;
   $('#practice-check').disabled=true;main.querySelectorAll('[data-answer],#dictation,[data-letter]').forEach(b=>b.disabled=true);
   $('#practice-transcript').textContent=`You heard: “${item.text}”`;$('#practice-transcript').hidden=false;$('#practice-next').hidden=false;$('#practice-next').focus({preventScroll:true});
  };
  if(mode==='choose')$('#practice-check').onclick=check;
  if(mode==='type'){
   $('#dictation-form').onsubmit=e=>{e.preventDefault();check();};
   main.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>{const input=$('#dictation');input.setRangeText(b.dataset.letter,input.selectionStart,input.selectionEnd,'end');input.focus();});
  }
  $('#practice-next').onclick=()=>{index++;if(index<items.length)render();else finish();};
 }
 function finish(){shell('Nice work!',`<section class="question practice-finished"><h3>You finished ${activities[mode][0]}.</h3>${mode==='record'?'<p>You practiced reading and speaking aloud.</p>':`<p>${firstCorrect} / ${items.length} correct on the first try.</p>`}<p class="hint">Optional practice complete.</p><div class="practice-finish-actions"><button id="practice-again" class="primary">PRACTICE AGAIN</button><button id="practice-menu-back">BACK TO LISTEN &amp; SPEAK</button><button id="finish-topic">BACK TO TOPIC</button></div></section>`);$('#practice-again').onclick=()=>start(mode);$('#practice-menu-back').onclick=menu;$('#finish-topic').onclick=back;}
 const hide=()=>audio.dispose();window.addEventListener('pagehide',hide);
 const visibility=()=>{if(document.hidden)hide();};document.addEventListener('visibilitychange',visibility);menu();
 return {soundChanged(){if(!enabled())audio.stopAudio();if($('#practice-sound'))$('#practice-sound').textContent=soundHint();},dispose(){audio.dispose();disposed=true;window.removeEventListener('pagehide',hide);document.removeEventListener('visibilitychange',visibility);}};
}
