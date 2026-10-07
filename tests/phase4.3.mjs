import assert from 'node:assert/strict';
import {practiceContent} from '../js/practice-data.js';
import {units,reviewId} from '../js/curriculum.js';
import {spanishVoice,createPracticeAudio} from '../js/practice-audio.js';
for(const c of [1,2])for(const t of ['mixed',...units[c].flatMap(u=>[reviewId(u),...u.topics])]){
 const p=practiceContent(c,t);assert(p.sentences.length);assert(p.vocabulary.length);assert(p.listening.length);
 for(const q of p.listening){assert(q.text&&q.prompt);assert(q.choices.includes(q.answer));assert.equal(new Set(q.choices).size,q.choices.length);}
 for(const q of [...p.sentences,...p.vocabulary])assert(!/vosotros|___|\+ ser/.test(q.text));
}
const voices=['en-US','es-ES','es-AR','es-US','es-MX'].map(lang=>({lang}));
assert.equal(spanishVoice(voices).lang,'es-MX');assert.equal(spanishVoice(voices.slice(0,4)).lang,'es-US');assert.equal(spanishVoice(voices.slice(0,3)).lang,'es-AR');assert.equal(spanishVoice(voices.slice(0,2)).lang,'es-ES');assert.equal(spanishVoice(voices.slice(0,1)),null);
let enabled=true,messages=[],states=[],spoken=[],stopped=0,revoked=0,requests=0,resolvePermission;
globalThis.window={speechSynthesis:{getVoices:()=>voices,speak:u=>spoken.push(u),cancel(){}},SpeechSynthesisUtterance:class{constructor(text){this.text=text;}}};
Object.defineProperty(globalThis,'navigator',{value:{mediaDevices:{getUserMedia:async()=>{requests++;return {getTracks:()=>[{stop(){stopped++;}}]};}}},configurable:true});
let latest;
class Recorder{static isTypeSupported(){return true;}constructor(){latest=this;this.state='inactive';this.mimeType='audio/webm';}start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['audio'])});queueMicrotask(()=>this.onstop?.());}}
window.MediaRecorder=Recorder;
globalThis.Audio=class{pause(){}async play(){}};
const oldRevoke=URL.revokeObjectURL;URL.revokeObjectURL=u=>{revoked++;oldRevoke(u);};
const api=createPracticeAudio({enabled:()=>enabled,notify:s=>messages.push(s),state:s=>states.push(s)});
api.speakSpanish('Hola');assert.equal(spoken[0].voice.lang,'es-MX');enabled=false;api.speakSpanish('No');assert.equal(spoken.length,1);enabled=true;
await api.record();await api.record();assert.equal(requests,1);assert.equal(states.at(-1),'recording');api.stop();await Promise.resolve();assert.equal(states.at(-1),'ready');await api.play();await api.record();assert.equal(revoked,1);api.dispose();assert(stopped>=2);
navigator.mediaDevices.getUserMedia=()=>new Promise(r=>resolvePermission=r);const pending=api.record();api.dispose();resolvePermission({getTracks:()=>[{stop(){stopped++;}}]});await pending;assert.equal(states.at(-1),'idle');
navigator.mediaDevices.getUserMedia=async()=>{throw Error('denied');};await api.record();assert(messages.at(-1).startsWith('Microphone unavailable'));
window.MediaRecorder=undefined;await api.record();assert(messages.at(-1).startsWith('Microphone unavailable'));
window.MediaRecorder=Recorder;delete navigator.mediaDevices;await api.record();assert(messages.at(-1).startsWith('Microphone unavailable'));
window.speechSynthesis.getVoices=()=>[];api.speakSpanish('Hola');assert(messages.at(-1).startsWith('No Spanish voice'));
const unsupported=createPracticeAudio({enabled:()=>true,notify:s=>messages.push(s)});window.SpeechSynthesisUtterance=undefined;unsupported.speakSpanish('Hola');assert(messages.at(-1).startsWith('Spanish audio is unavailable'));
// Fault paths: empty capture, recorder interruption, playback rejection.
navigator.mediaDevices={getUserMedia:async()=>({getTracks:()=>[{stop(){stopped++;}}]})};
window.MediaRecorder=class extends Recorder{stop(){this.state='inactive';queueMicrotask(()=>this.onstop?.());}};
await api.record();api.stop();await Promise.resolve();assert(messages.at(-1).startsWith('No recording'));
window.MediaRecorder=Recorder;await api.record();latest.onerror();assert(messages.at(-1).startsWith('Recording interrupted'));assert.equal(states.at(-1),'idle');
globalThis.Audio=class{pause(){}async play(){throw Error('blocked');}};
await api.record();api.stop();await Promise.resolve();await api.play();assert(messages.at(-1).startsWith('Playback interrupted'));
api.dispose();unsupported.dispose();console.log('PASS: all course/topic data, voice preference/fallback, sound off, rapid record clicks, recording/play/re-record cleanup, late permission cleanup, denied/missing microphone, missing recorder, missing speech/voice.');
