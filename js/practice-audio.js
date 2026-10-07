// A session owns all transient audio. Nothing is uploaded or persisted.
export function spanishVoice(voices) {
 const es=voices.filter(v=>/^es(?:[-_]|$)/i.test(v.lang));
 const rank=v=>{const l=v.lang.toLowerCase().replace('_','-');return l==='es-mx'?0:l==='es-us'?1:l!=='es-es'&&l!=='es'?2:3;};
 return es.sort((a,b)=>rank(a)-rank(b))[0]||null;
}
export function createPracticeAudio({enabled, notify=()=>{}, state=()=>{}}) {
 let generation=0, recorder=null, stream=null, url=null, player=null, limit=null, speechId=0, busy=false, utterance=null;
 const synth=window.speechSynthesis;
 const tell=message=>notify(message);
 const stopSpeech=()=>{speechId++;utterance=null;try{synth?.cancel();}catch{}};
 const pause=()=>{if(player){player.pause();player.currentTime=0;}};
 const releaseTracks=()=>{stream?.getTracks().forEach(t=>t.stop());stream=null;};
 function clearRecording(){generation++;clearTimeout(limit);if(recorder){recorder.onstop=recorder.ondataavailable=recorder.onerror=null;try{if(recorder.state!=='inactive')recorder.stop();}catch{}recorder=null;}releaseTracks();pause();player=null;if(url)URL.revokeObjectURL(url);url=null;busy=false;state('idle');}
 function stop(){if(!recorder||recorder.state!=='recording')return;state('stopping');clearTimeout(limit);try{recorder.stop();releaseTracks();}catch{clearRecording();tell('Recording interrupted. Please try again.');}}
 function speakSpanish(text){
  if(busy){tell('Stop recording before listening.');return;}
  if(!enabled()){tell('Sound is off. Turn Sound on above to listen.');return;}
  if(!synth||!window.SpeechSynthesisUtterance){tell('Spanish audio is unavailable here. You can read and practice aloud.');return;}
  pause();stopSpeech();const id=speechId;
  try{const voice=spanishVoice(synth.getVoices());if(!voice){tell('No Spanish voice is available yet. Try Listen again, or read and practice aloud.');return;}
   const u=new window.SpeechSynthesisUtterance(text);utterance=u;u.voice=voice;u.lang=voice.lang;u.rate=.85;
   u.onerror=e=>{if(id===speechId&&!['canceled','interrupted'].includes(e.error))tell('Audio could not play. Try Listen again, or practice aloud.');};
   u.onend=()=>{if(id===speechId){utterance=null;tell('Listen again whenever you like.');}};
   synth.speak(u);tell('Listening…');
  }catch{tell('Spanish audio is unavailable here. You can read and practice aloud.');}
 }
 async function record(){
  if(busy)return;
  clearRecording();stopSpeech();const id=generation;
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){tell('Microphone unavailable. You can still listen and practice aloud.');return;}
  busy=true;state('requesting');tell('Allow microphone access to record, or keep practicing aloud.');
  try{const acquired=await navigator.mediaDevices.getUserMedia({audio:true});
   // Permission can resolve after Next, Back, or another screen has disposed us.
   if(id!==generation){acquired.getTracks().forEach(t=>t.stop());return;}
   stream=acquired;const Recorder=window.MediaRecorder;
   const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(t=>Recorder.isTypeSupported?.(t));
   recorder=new Recorder(stream,mime?{mimeType:mime}:undefined);const chunks=[];const active=recorder;
   recorder.ondataavailable=e=>{if(id===generation&&e.data.size)chunks.push(e.data);};
   recorder.onerror=()=>{if(id===generation){clearRecording();tell('Recording interrupted. Please try again.');}};
   recorder.onstop=()=>{if(id!==generation)return;clearTimeout(limit);releaseTracks();recorder=null;busy=false;
    const blob=new Blob(chunks,{type:active.mimeType||chunks[0]?.type||'audio/webm'});
    if(!blob.size){state('idle');tell('No recording was captured. Please try again.');return;}
    try{url=URL.createObjectURL(blob);player=new Audio(url);player.onended=()=>tell('Now hear the Spanish again and compare.');player.onerror=()=>tell('Recording could not play. Please record again.');state('ready');tell('Recording ready. Play it and compare.');}catch{clearRecording();tell('Recording could not play. Please try again.');}
   };
   recorder.start();state('recording');tell('Recording… Press Stop when you finish.');limit=setTimeout(stop,60000);
  }catch{if(id===generation){clearRecording();tell('Microphone unavailable. You can still listen and practice aloud.');}}
 }
 async function play(){if(!enabled()){tell('Sound is off. Turn Sound on above to listen.');return;}if(!player||busy)return;stopSpeech();pause();const id=generation;try{await player.play();if(id===generation)tell('Playing your recording…');}catch{if(id===generation)tell('Playback interrupted. Try Play again.');}}
 return {speakSpanish,record,stop,play,clearRecording,stopAudio(){stopSpeech();pause();},dispose(){stopSpeech();clearRecording();}};
}
