import {units,reviewId} from './curriculum.js';
import {topics,shuffle} from './data.js';
import {cardsFor,cumulativeReview} from './flashcards-data.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Session-only state: this module never reads or writes learning progress.
export function openFlashcards(main,course,onExit) {
 let unit=null,deck=[],index=0,again=[],known=0,revealed=false,title='',finished=false,session=null;
 const $=s=>main.querySelector(s);
 const focus=s=>{$(s)?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});};
 const header=(name,back='Topics')=>`<div class="fc-heading"><div><span class="eyebrow">SPANISH ${course} · FLASHCARDS</span><h2>${esc(name)}</h2></div><button id="fc-back" class="quiet">← ${back}</button></div>`;
 const leaveStudy=()=>{document.body.classList.remove('flashcard-session');};
 function home() {
  leaveStudy();
  main.innerHTML=`<section class="fc-shell">${header(unit?unit.name:'Flashcards',unit?'Units':'Back')}${unit?
   `<button id="fc-unit-review" class="primary fc-review">REVIEW THIS UNIT</button><div class="topic-grid">${unit.topics.map(t=>`<button class="topic-card" data-fc-topic="${t}"><strong>${esc(topics[course][t])}</strong></button>`).join('')}</div>`:
   `<button id="fc-all" class="primary fc-review">⭐ REVIEW EVERYTHING</button><div class="unit-grid">${units[course].map((u,i)=>`<button class="unit-card" data-fc-unit="${u.id}"><span class="unit-icon" aria-hidden="true">${u.icon}</span><span><small>UNIT ${i+1}</small><strong>${esc(u.name)}</strong></span><span aria-hidden="true">→</span></button>`).join('')}</div>`}</section>`;
  $('#fc-back').onclick=()=>{if(unit){unit=null;home();}else onExit();};
  $('#fc-all')?.addEventListener('click',newReview);
  $('#fc-unit-review')?.addEventListener('click',()=>start(cardsFor(course,reviewId(unit)),unit.name));
  main.querySelectorAll('[data-fc-unit]').forEach(b=>b.onclick=()=>{unit=units[course].find(u=>u.id===b.dataset.fcUnit);home();});
  main.querySelectorAll('[data-fc-topic]').forEach(b=>b.onclick=()=>start(cardsFor(course,b.dataset.fcTopic),topics[course][b.dataset.fcTopic]));
  focus(unit?'#fc-unit-review':'#fc-all');
 }
 function newReview(){start(cumulativeReview(course),'Review everything',true);}
 function start(cards,label,cumulative=false) {
  session={cards:[...cards],cumulative};title=label;startRound(cards);
 }
 function startRound(cards) {
  deck=[...cards];index=0;again=[];known=0;revealed=false;finished=false;
  document.body.classList.add('flashcard-session');render();
 }
 function render() {
  if(index>=deck.length){summary();return;}
  revealed=false;
  const card=deck[index];
  main.innerHTML=`<section class="fc-study">${header(title)}<div class="fc-tools"><span id="fc-count" role="status">${index+1} / ${deck.length}</span><button id="fc-shuffle" class="quiet">Shuffle</button></div><button id="fc-card" class="fc-card" aria-label="Reveal answer" aria-expanded="false"><span id="fc-text" lang="${card.frontLang||'en'}">${esc(card.front)}</span><small id="fc-hint">Tap to reveal</small></button><div class="fc-actions"><button id="fc-known" class="primary" disabled>NEXT CARD →<small>I know it</small></button><button id="fc-again" disabled>↻ REVIEW LATER</button></div></section>`;
  $('#fc-back').onclick=home;
  $('#fc-card').onclick=()=>{
   revealed=!revealed;
   $('#fc-text').textContent=revealed?card.back:card.front;
   $('#fc-text').lang=(revealed?card.backLang:card.frontLang)||'es';
   $('#fc-hint').textContent=revealed?'Tap to flip back':'Tap to reveal';
   $('#fc-card').setAttribute('aria-expanded',String(revealed));
   $('#fc-card').setAttribute('aria-label',revealed?'Show prompt':'Reveal answer');
   $('#fc-known').disabled=$('#fc-again').disabled=!revealed;
  };
  $('#fc-known').onclick=()=>mark(true);$('#fc-again').onclick=()=>mark(false);
  $('#fc-shuffle').onclick=()=>{deck=[...deck.slice(0,index),...shuffle(deck.slice(index))];render();};
  focus('#fc-card');
 }
 function mark(knows) {
  if(!revealed||finished)return;
  if(knows)known++;else again.push(deck[index]);
  index++;render();
 }
 function summary() {
  finished=true;
  main.innerHTML=`<section class="fc-study">${header(title)}<div class="fc-summary"><span class="fc-check" aria-hidden="true">${again.length?'↻':'✓'}</span><h1>${known} / ${deck.length} known</h1><p>${again.length} to practice</p><div class="fc-summary-actions">${again.length?'<button id="fc-practice" class="primary">PRACTICE MISSED CARDS</button>':'<button id="fc-done" class="primary">DONE</button>'}<button id="fc-restart">${session.cumulative?'NEW 30-CARD REVIEW':'START OVER'}</button></div></div></section>`;
  $('#fc-back').onclick=home;$('#fc-done')?.addEventListener('click',home);
  $('#fc-practice')?.addEventListener('click',()=>startRound(again));
  $('#fc-restart').onclick=()=>session.cumulative?newReview():startRound(shuffle(session.cards));
  focus(again.length?'#fc-practice':'#fc-done');
 }
 home();
}
