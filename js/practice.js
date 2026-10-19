import {positionQuestion} from './viewport.js';
import {continueLabel} from './curriculum.js';
import {sequence} from './progression.js';
import {createPracticeSession,dictationCorrect} from './practice-sessions.js';
import {createPracticeAudio} from './practice-audio.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const practiceIcon=name=>`<svg class="practice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${({headphones:'<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>',speaker:'<path d="M4 9h4l5-4v14l-5-4H4zM17 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',stop:'<rect x="5" y="5" width="14" height="14" rx="1"/>',play:'<path d="m7 4 14 8-14 8z"/>'})[name]||''}</svg>`;
const activities={choose:['Listen & Choose','Listen to Spanish. Choose the answer.','headphones'],type:['Listen & Type','Listen. Type what you hear in Spanish.','speaker'],record:['Read & Record','Read the Spanish aloud and hear yourself.','mic']};
// One integrated level per session. The topic path is the only activity menu.
export function openPractice(main,{course,topic,label,mode,enabled,enableSound,back,complete,topicComplete,next,canAdvance,nextTopic,hasNextTopic}) {
 if(!activities[mode])throw new Error('Unknown audio level');
 let items=[],index=0,disposed=false,selected=null,answered=false,firstCorrect=0,result=null;
 let heard=false,played=false,micUnavailable=false,speechUnavailable=false,confirmed=false,practiced=0;
 const $=s=>main.querySelector(s);
 const notify=s=>{if(!disposed&&$('#practice-status'))$('#practice-status').textContent=s;};
 const ready=()=>mode!=='record'||(micUnavailable?confirmed&&(heard||speechUnavailable):played);
 function sync(){
  if(disposed||mode!=='record'||!$('#practice-next'))return;
  $('#practice-next').disabled=!ready();
  if($('#practice-fallback')){
   $('#practice-fallback').hidden=!micUnavailable;
   $('#confirm-practice').disabled=!(heard||speechUnavailable);
   $('#fallback-instruction').textContent=speechUnavailable?'Read the Spanish, say it aloud, then confirm below.':'Listen to the model, say it aloud, then confirm below.';
  }
 }
 const audio=createPracticeAudio({enabled,notify,
  heard:()=>{heard=true;sync();},played:()=>{played=true;sync();},
  unavailable:kind=>{if(kind==='microphone')micUnavailable=true;else speechUnavailable=true;sync();},
  state:s=>{
   if(disposed||!$('#record'))return;
   const busy=['requesting','recording','stopping'].includes(s);
   if(s==='idle'||s==='requesting'){played=false;confirmed=false;if($('#confirm-practice'))$('#confirm-practice').checked=false;}
   if(s==='recording'){micUnavailable=false;}
   $('#record').disabled=busy;$('#record').innerHTML=practiceIcon('mic')+(s==='requesting'?' Waiting for permission…':s==='recording'?' Recording…':s==='stopping'?' Saving recording…':s==='ready'?' Record Again':' Record Yourself');
   $('#stop-recording').hidden=!['recording','stopping'].includes(s);$('#stop-recording').disabled=s!=='recording';
   $('#play-recording').hidden=s!=='ready';
   main.querySelectorAll('[data-listen]').forEach(b=>b.disabled=busy);
   $('#record-indicator').hidden=s!=='recording';sync();
  }
 });
 const soundHint=()=>enabled()?'Replay as often as you like.':'Sound is off. Turn Sound on above to listen.';
 function shell(title,body){
  audio.dispose();
  main.innerHTML=`<section class="game-shell practice-shell"><div class="game-top"><div><span class="eyebrow">SPANISH ${course} · LEVEL ${sequence.indexOf(mode)+1}</span><h2 id="practice-title" tabindex="-1">${esc(title)}</h2><p>${esc(label)}</p></div><button id="practice-back" class="quiet">← Back to Topic</button></div>${body}</section>`;
  $('#practice-back').onclick=back;$('#practice-title').focus({preventScroll:true});positionQuestion(main.querySelector('.question'));
 }
 function start(){items=createPracticeSession(course,topic,mode);index=0;firstCorrect=0;practiced=0;result=null;render();}
 function render(){
  selected=null;answered=false;heard=false;played=false;confirmed=false;speechUnavailable=false;
  const item=items[index];
  shell(activities[mode][0],!item?'<p>No prompts available. Return to the topic and try again.</p>':`
   <p class="practice-progress" id="practice-progress">${index+1} / ${items.length}</p>
   <div class="bar" aria-label="Activity progress"><span style="width:${index/items.length*100}%"></span></div>
   <section class="question"><p class="hint" id="practice-sound">${soundHint()}</p><button id="practice-enable-sound" ${enabled()?'hidden':''}>Turn Sound On</button>
   ${mode==='record'?`
    <h2 lang="es" id="speaking-prompt">${esc(item.text)}</h2>
    <p class="hint">Read → Hear → Record → Play back → Compare</p>
    <div class="practice-controls">
     <button class="primary" data-listen>${practiceIcon('speaker')} Hear Spanish</button>
     <button id="record">${practiceIcon('mic')} Record Yourself</button>
     <button id="stop-recording" hidden>${practiceIcon('stop')} Stop</button>
     <button id="play-recording" hidden>${practiceIcon('play')} Play My Recording</button>
    </div><p id="record-indicator" hidden>● Recording…</p>
    <p class="hint">Make and play back a recording before continuing. Private and temporary. No pronunciation grade.</p>
    <div id="practice-fallback" hidden><p id="fallback-instruction"></p><label><input type="checkbox" id="confirm-practice" disabled> I practiced this prompt aloud.</label></div>
   `:`
    <p class="mastery-rule">Reach 80% to master this level. Each question counts once; mistakes stay in your score.</p>
    <button class="primary practice-listen" data-listen>${practiceIcon('speaker')} PLAY AUDIO</button>
    ${mode==='choose'?`
     <h3>${esc(item.prompt)}</h3><div class="choices practice-choices">${item.choices.map((c,i)=>`<button class="choice" data-answer="${i}" aria-pressed="false">${esc(c)}</button>`).join('')}</div>
     <button class="primary" id="practice-check" disabled>CHECK →</button>
    `:`
     <form id="dictation-form"><label class="label" for="dictation">Type what you hear in Spanish:</label>
      <input id="dictation" enterkeyhint="done" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="dictation-hint">
      <p class="hint" id="dictation-hint">Accents and punctuation are optional. Keep ñ.</p>
      <div class="accent-keys">${['á','é','í','ó','ú','ñ','ü'].map(c=>`<button type="button" data-letter="${c}" aria-label="Insert ${c}">${c}</button>`).join('')}</div>
      <button class="primary" id="practice-check" type="submit">CHECK →</button>
     </form>`}
    <div id="practice-feedback" role="status" aria-live="polite"></div><p id="practice-transcript" hidden lang="es"></p>`}
   <button id="practice-next" class="primary" ${mode==='record'?'disabled':'hidden'}>${index===items.length-1?'FINISH →':continueLabel(course,topic)+' →'}</button>
   <p id="practice-status" role="status" aria-live="polite"></p></section>`);
  if(!item)return;
  $('#practice-enable-sound').onclick=()=>enableSound?.();
  main.querySelectorAll('[data-listen]').forEach(b=>b.onclick=()=>audio.speakSpanish(item.text));
  $('#record')?.addEventListener('click',audio.record);$('#stop-recording')?.addEventListener('click',audio.stop);$('#play-recording')?.addEventListener('click',audio.play);
  $('#confirm-practice')?.addEventListener('change',e=>{confirmed=e.target.checked;sync();});
  if(mode==='record'&&(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder))micUnavailable=true;
  sync();
  main.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{if(answered)return;selected=Number(b.dataset.answer);main.querySelectorAll('[data-answer]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===b)));$('#practice-check').disabled=false;});
  const check=()=>{
   if(answered)return;
   const value=mode==='choose'?(selected===null?null:item.choices[selected]):$('#dictation').value;
   if(value==null||!value.trim())return;
   const correct=mode==='choose'?value===item.answer:dictationCorrect(value,item);
   answered=true;if(correct)firstCorrect++;
   $('#practice-feedback').textContent=correct?'✓ ¡Correcto!':`Not quite. Correct answer: ${mode==='choose'?item.answer:item.text}`;
   $('#practice-check').disabled=true;main.querySelectorAll('[data-answer],#dictation,[data-letter]').forEach(b=>b.disabled=true);
   $('#practice-transcript').textContent=`You heard: “${item.text}”`;$('#practice-transcript').hidden=false;
   $('#practice-next').hidden=false;$('#practice-next').focus({preventScroll:true});positionQuestion($('#practice-next'));
  };
  if(mode==='choose')$('#practice-check').onclick=check;
  if(mode==='type'){
   $('#dictation-form').onsubmit=e=>{e.preventDefault();check();};
   main.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>{const input=$('#dictation');input.setRangeText(b.dataset.letter,input.selectionStart,input.selectionEnd,'end');input.focus();});
   $('#dictation').focus({preventScroll:true});
  }
  $('#practice-next').onclick=()=>{
   if(mode==='record'?!ready():!answered)return;
   if(mode==='record')practiced++;
   index++;if(index<items.length)render();else finish();
  };
 }
 function finish(){
  const session={course,topic,mode,completed:true,attempts:items.length,promptCount:items.length,correct:firstCorrect,practiced};
  result ||= complete(session);
  const passed=result.mastery.passed;
  shell(passed?(topicComplete()?'Topic complete!':'✓ Level mastered!'):'Keep practicing. You’ve got this.',`
   <section class="question practice-finished"><h3>${esc(activities[mode][0])}</h3>
   ${mode==='record'?`<p>${practiced} / ${items.length} prompts practiced.</p><p>Speaking practice completed. No pronunciation grade.</p>`:`<p>${firstCorrect} / ${items.length} correct · ${Math.floor(firstCorrect/items.length*100)}%</p><p>${passed?'Ready for your next level!':'Reach 80% to unlock the next level. Try a fresh round.'}</p>`}
   ${!result.saved?'<p>Progress could not be saved in this browser. Keep this page open and try again.</p>':''}
   <div class="practice-finish-actions">${topicComplete()&&hasNextTopic?.()?'<button id="practice-next-topic" class="primary">NEXT TOPIC →</button>':''}${canAdvance?.()?'<button id="practice-next-level" class="primary">NEXT LEVEL →</button>':''}<button id="finish-topic">${topicComplete()?'TOPIC COMPLETE ✓':'View Levels'}</button><button id="practice-again">${passed?'REPLAY':'TRY AGAIN'}</button></div></section>`);
  $('#practice-next-topic')?.addEventListener('click',nextTopic);$('#practice-next-level')?.addEventListener('click',next);$('#practice-again').onclick=start;$('#finish-topic').onclick=back;($('#practice-next-topic')||$('#practice-next-level')||$('#practice-again')).focus({preventScroll:true});
 }
 const hide=()=>audio.dispose();window.addEventListener('pagehide',hide);
 const visibility=()=>{if(document.hidden)hide();};document.addEventListener('visibilitychange',visibility);start();
 return {isActive(){return !disposed&&!result;},soundChanged(){if(!enabled())audio.stopAudio();if($('#practice-sound'))$('#practice-sound').textContent=soundHint();if($('#practice-enable-sound'))$('#practice-enable-sound').hidden=enabled();},dispose(){audio.dispose();disposed=true;window.removeEventListener('pagehide',hide);document.removeEventListener('visibilitychange',visibility);}};
}
