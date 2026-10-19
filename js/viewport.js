// All controls stay in document flow. VisualViewport handles keyboard/browser
// chrome changes without a fixed footer or repeated smooth-scroll animations.
function visibleBounds(){
 const v=window.visualViewport;
 return {top:(v?.offsetTop||0)+12,bottom:(v?.offsetTop||0)+(v?.height||window.innerHeight)-12};
}
function reveal(element){
 if(!element?.isConnected)return;
 const r=element.getBoundingClientRect(),b=visibleBounds();
 if(r.top>=b.top&&r.bottom<=b.bottom)return;
 const delta=r.height>b.bottom-b.top?r.top-b.top:r.top<b.top?r.top-b.top:r.bottom-b.bottom;
 if(Math.abs(delta)>2)window.scrollTo({top:Math.max(0,window.scrollY+delta),behavior:'instant'});
}
export function positionQuestion(element){
 window.requestAnimationFrame?.(()=>{
  const input=document.activeElement;
  if(input?.matches('#typed,#dictation')){revealTyping(input);return;}
  if(!element?.isConnected)return;
  const r=element.getBoundingClientRect(),b=visibleBounds();
  // Start a long question at its heading, retaining ordinary vertical scrolling.
  if(r.height>b.bottom-b.top && r.top>=b.top && r.top<b.bottom/3)return;
  reveal(element);
 });
}
function revealTyping(input){
 const form=input.closest('form'),submit=form?.querySelector('[type="submit"]'),b=visibleBounds();
 if(submit){
  const top=input.getBoundingClientRect().top,bottom=submit.getBoundingClientRect().bottom;
  if(bottom-top<=b.bottom-b.top){
   if(top<b.top||bottom>b.bottom)window.scrollTo({top:Math.max(0,window.scrollY+(top<b.top?top-b.top:bottom-b.bottom)),behavior:'instant'});
   return;
  }
 }
 reveal(input); // Very small visible areas retain scrolling and keyboard Done.
}
let installed=false;
export function installViewportSupport(){
 if(installed)return;installed=true;
 let pending;
 const adjust=()=>{
  clearTimeout(pending);
  // Wait briefly for a keyboard resize burst to settle; never fight user scrolling.
  pending=setTimeout(()=>{const input=document.activeElement;if(input?.matches('#typed,#dictation'))revealTyping(input);},120);
 };
 window.visualViewport?.addEventListener('resize',adjust);
 window.addEventListener('resize',adjust);
 document.addEventListener('focusin',adjust);
}
