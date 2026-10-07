// Phase 4.2: one catalog derived from the existing curriculum. No random questions.
import {units, contentTopics} from './curriculum.js';
import {matchBank, persons, ser, vocab, conjugate, agree, timeAnswers, shuffle} from './data.js';

// Add optional standalone cards here without changing the study interface.
// {course:1, unit:'s1-u1', topic:'greetings', front:'Hello!', back:'¡Hola!',
//  frontLang:'en', backLang:'es', kind:'phrase', audio:null}
// A new topic should also be registered in curriculum.js and topics in data.js.
export const extraCards = [];
const keyText = value => String(value).normalize('NFC').toLocaleLowerCase('es').replace(/[.!?¿¡]/g,'').replace(/\s+/g,' ').trim();
const pairKey = (front,back) => [keyText(front),keyText(back)].sort().join(' ⇄ ');
const forbidden = /\bvosotr[oa]s\b/iu;

function topicCards(course, unit, topic) {
 const cards=[];
 const add=(front,back,kind='grammar',frontLang='es',backLang='es')=>{
  if(forbidden.test(front+' '+back))return;
  cards.push({id:`${course}:${pairKey(front,back)}`,course,unit,topic,front,back,kind,frontLang,backLang,audio:null});
 };
 if(topic==='time') {
  for(let h=1;h<=12;h++)for(const m of [0,5,10,15,20,25,30,35,40,45,50,55]) {
   const answers=timeAnswers(h,m);
   add(`${h}:${String(m).padStart(2,'0')}`,answers[answers.length-1]+'.','time','en');
  }
 } else {
  // Reverse a small, consistent subset to mix recognition and recall.
  (matchBank(course,topic)||[]).forEach(([es,english],i)=>{
   const en=topic==='greetings'&&es==='buenas noches'?'good evening / good night':english;
   if(i%5===4)add(es,en,'translation','es','en');
   else add(en,es,'translation','en','es');
  });
 }
 if(topic==='ser') for(const [person,index] of persons)add(`${person} + ser`,ser[index]);
 if(topic==='adjectives')for(const [adjective] of matchBank(course,topic)) {
  add(`La chica es ___. (${adjective})`,agree(adjective,true,false));
  add(`Los chicos son ___. (${adjective})`,agree(adjective,false,true));
 }
 const verbTopics=topic==='verbs'?['ar','er','ir']:['ar','er','ir'].includes(topic)?[topic]:[];
 for(const type of verbTopics)for(const [verb] of vocab[type])for(const [person,index] of persons)add(`${person} + ${verb}`,conjugate(verb,index));
 return cards;
}
export const flashcardCatalog=Object.fromEntries([1,2].map(course=>[course,units[course].flatMap(unit=>unit.topics.flatMap(topic=>topicCards(course,unit.id,topic)))]));
export function uniqueCards(cards) {
 const seen=new Set();
 return cards.filter(card=>{const key=pairKey(card.front,card.back);if(seen.has(key))return false;seen.add(key);return true;});
}
export function cardsFor(course, selection='mixed') {
 const selected=new Set(contentTopics(course,selection));
 const extras=extraCards.filter(c=>c.course===course).map(c=>({...c,id:`${course}:${pairKey(c.front,c.back)}`,audio:c.audio??null}));
 return uniqueCards([...flashcardCatalog[course],...extras].filter(c=>selected.has(c.topic)&&!forbidden.test(c.front+' '+c.back)));
}

// Sample from each unit before course-level deduplication: mixed-review units
// can share cards with other units and must still receive a fair allocation.
export function cumulativeReview(course, size=30) {
 const buckets=shuffle(units[course].map(unit=>shuffle(cardsFor(course,`unit:${unit.id}`))));
 const selected=[],seen=new Set();
 while(selected.length<size) {
  let added=false;
  for(const bucket of buckets) {
   let card;
   while(bucket.length) {
    const candidate=bucket.pop(),key=pairKey(candidate.front,candidate.back);
    if(!seen.has(key)){card=candidate;seen.add(key);break;}
   }
   if(card){selected.push(card);added=true;}
   if(selected.length===size)break;
  }
  if(!added)break;
 }
 return shuffle(selected);
}
