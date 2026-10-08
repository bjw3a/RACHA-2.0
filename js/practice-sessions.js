// Structured sessions adapt the existing curriculum; no separate vocabulary database.
import {practiceContent} from './practice-data.js';
import {contentTopics} from './curriculum.js';
import {matchBank,normalize,shuffle} from './data.js';
const nearMeanings=[['simpático','amable'],['adiós','hasta luego','nos vemos','hasta mañana']].map(group=>new Set(group.map(normalize)));
const unique=items=>{const seen=new Set();return items.filter(i=>{const key=normalize(i.text);if(seen.has(key))return false;seen.add(key);return true;});};
export const dictationCorrect=(value,item)=>normalize(value)===normalize(item.text);
const bankCache=new Map();
export function practiceBank(course,selection){
 const cacheKey=`${course}:${selection}`;if(bankCache.has(cacheKey))return bankCache.get(cacheKey);
 const choose=[],words=[],sentences=[];
 for(const topic of contentTopics(course,selection)){
  const p=practiceContent(course,topic);
  const aliases=new Map((matchBank(course,topic)||[]).map(([es,...en])=>[normalize(es),new Set(en.map(normalize))]));
  const vocabulary=unique(p.vocabulary).map(item=>({...item,topic}));
  for(const item of vocabulary){
   const accepted=new Set([normalize(item.meaning),...(aliases.get(normalize(item.text))||[])]);
   // Exclude overlapping translations (e.g. nos vemos / hasta luego).
   const wrong=shuffle(vocabulary).filter(other=>normalize(other.text)!==normalize(item.text)&&!nearMeanings.some(group=>group.has(normalize(item.text))&&group.has(normalize(other.text)))&&![normalize(other.meaning),...(aliases.get(normalize(other.text))||[])].some(en=>accepted.has(en)));
   const options=[item.meaning];for(const other of wrong)if(!options.some(v=>normalize(v)===normalize(other.meaning))&&options.length<4)options.push(other.meaning);
   if(options.length>=3)choose.push({...item,prompt:topic==='time'?'What time did you hear?':topic==='numbers'?'Which number did you hear?':'What does it mean?',answer:item.meaning,choices:options});
   words.push(item);
  }
  sentences.push(...p.sentences.map(item=>({...item,topic})));
  // Keep authored comprehension questions and their vetted distractors together.
  choose.push(...p.listening.map(item=>({...item,topic})));
 }
 const bank={choose,words:unique(words),sentences:unique(sentences)};bankCache.set(cacheKey,bank);return bank;
}
export function createPracticeSession(course,selection,mode){
 const bank=practiceBank(course,selection);
 if(mode==='choose'){
  const short=shuffle(bank.choose.filter(i=>i.meaning)),comprehension=shuffle(bank.choose.filter(i=>!i.meaning));
  return shuffle([...short.slice(0,7),...comprehension.slice(0,3),...short.slice(7),...comprehension.slice(3)].slice(0,10)).map(i=>({...i,choices:shuffle(i.choices)}));
 }
 // Start with short words/phrases, then sentences. Fill small banks without repeats.
 const simple=shuffle(bank.words).sort((a,b)=>a.text.split(/\s+/).length-b.text.split(/\s+/).length);
 return unique([...simple.slice(0,4),...shuffle(bank.sentences).slice(0,6),...simple.slice(4),...bank.sentences]).slice(0,10);
}
