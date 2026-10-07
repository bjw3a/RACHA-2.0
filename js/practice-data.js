// Reuse the dormant catalog and existing readings; never activate Flashcards UI.
import {cardsFor} from './flashcards-data.js';
import {contentTopics} from './curriculum.js';
import {readings} from './readings.js';
export function practiceContent(course, selection) {
 const vocabulary=cardsFor(course,selection).filter(c=>c.frontLang!==c.backLang).map(c=>({text:c.frontLang==='es'?c.front:c.back,meaning:c.frontLang==='en'?c.front:c.back}));
 const passages=[...new Set(contentTopics(course,selection).flatMap(t=>t==='verbs'?['ar','er','ir']:[t]))].map(t=>readings[t]).filter(Boolean);
 const sentences=[...new Set(passages.flatMap(p=>p.text.split(/(?<=[.!?])\s+/u)))].map(text=>({text}));
 const listening=passages.flatMap(p=>p.questions.map(([prompt,answer,wrong])=>({text:p.text,prompt,answer,choices:[answer,...wrong]})));
 return {vocabulary,sentences,listening};
}
