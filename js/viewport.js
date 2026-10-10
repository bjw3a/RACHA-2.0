// Move only when needed. Keep a fitting question and its controls together;
// long story/mobile content retains normal scrolling.
export function positionQuestion(element) {
 if(!element || !window.requestAnimationFrame)return;
 window.requestAnimationFrame(()=>{
  if(!element.isConnected)return;
  const r=element.getBoundingClientRect(),margin=12,height=window.innerHeight;
  if(r.top>=margin && r.bottom<=height-margin)return;
  if(r.height>height-margin*2 && r.top>=margin && r.top<height/3)return;
  window.scrollTo({top:Math.max(0,window.scrollY+r.top-margin),behavior:'instant'});
 });
}
