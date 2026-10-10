// Reuse the dormant catalog and existing readings; never activate Flashcards UI.
import {cardsFor} from './flashcards-data.js';
import {contentTopics} from './curriculum.js';
import {readings} from './readings.js';
export function practiceContent(course, selection) {
 const vocabulary=cardsFor(course,selection).filter(c=>c.frontLang!==c.backLang).map(c=>({text:c.frontLang==='es'?c.front:c.back,meaning:c.frontLang==='en'?c.front:c.back}));
 const passages=[...new Set(contentTopics(course,selection).flatMap(t=>t==='verbs'?['ar','er','ir']:[t]))].map(t=>readings[t]).filter(Boolean);
 const sentences=[...new Set(passages.flatMap(p=>p.text.split(/(?<=[.!?])\s+/u)))].map(text=>({text}));
 const listening=passages.flatMap(p=>p.questions.map(([prompt,answer,wrong],i)=>({text:course===1 && earlyListening[selection]?earlyListening[selection][i]:p.text,prompt,answer,choices:[answer,...wrong]})));
 return {vocabulary,sentences,listening};
}

// One authored clip per existing question, in question order. Longer readings stay
// in Story Challenge and Spanish 2; no arbitrary text truncation or answer drift.
export const earlyListening = {
 greetings:['Hola.','Buenos días, profesora.','Buenas tardes.','Mucho gusto.','Hasta mañana.'],
 introductions:['Me llamo Ana.','Soy de México.','Tengo quince años.','¿Cómo te llamas?','Estoy bien.'],
 numbers:['Hay treinta estudiantes.','Hay veinte libros.','Hay cuarenta lápices.','Hay dos cuadernos.','Hay cien tarjetas.'],
 days:['El lunes estudio español.','El martes dibujo.','El miércoles canto.','El jueves estudio arte.','El viernes bailo.'],
 months:['Mi cumpleaños es en enero.','El cumpleaños de Ana es en marzo.','El concierto es en mayo.','Las clases empiezan en agosto.','En diciembre visitamos a la familia.'],
 time:['La clase de español es a las ocho.','La clase de arte es a las diez y cuarto.','El almuerzo es a las doce y media.','La clase de música es a la una.','El partido es a las tres y cinco.'],
 colors:['Mi mochila es azul.','Mi cuaderno es rojo.','Mi libro es verde.','Mi lápiz es amarillo.','La carpeta de la profesora es morada.'],
 weather:['El lunes hace sol.','El martes llueve.','El miércoles hace viento.','El jueves está nublado.','El viernes nieva.'],
 subjects:['Mi clase favorita es español.','A Ana le gusta historia.','La clase favorita de Luis es ciencias.','Eva estudia arte.','A Pablo le gusta educación física.']
};
