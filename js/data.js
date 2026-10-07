import {contentTopics} from './curriculum.js';
import {readings} from './readings.js';
export const pick = a => a[Math.floor(Math.random()*a.length)];
export const shuffle = a => {const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
const rows = s => s.split('|').map(x=>{const r=x.split('~');if(/[.?!]$/.test(r[0]))for(let i=1;i<r.length;i++){r[i]=r[i][0].toUpperCase()+r[i].slice(1);if(!/[.?!]$/.test(r[i]))r[i]+=r[0].slice(-1);}return r;});
export const vocab={
 family:rows('la madre~mother|el padre~father|los padres~parents|la hermana~sister|el hermano~brother|la abuela~grandmother|el abuelo~grandfather|los abuelos~grandparents|la tía~aunt|el tío~uncle|la prima~female cousin|el primo~male cousin|la hija~daughter|el hijo~son|la sobrina~niece|el sobrino~nephew|la nieta~granddaughter|el nieto~grandson|la madrastra~stepmother|el padrastro~stepfather|la hermanastra~stepsister|el hermanastro~stepbrother|la esposa~wife|el esposo~husband'),
 introductions:rows('¿Cómo te llamas?~What is your name?|Me llamo Ana.~my name is Ana|Soy de México.~I am from Mexico|¿De dónde eres?~Where are you from?|Tengo quince años.~I am fifteen years old|¿Cuántos años tienes?~How old are you?|Estoy bien.~I am well|Estoy cansado.~I am tired'),
 weather:rows('Hace calor.~it is hot|Hace frío.~it is cold|Hace sol.~it is sunny|Hace viento.~it is windy|Llueve.~it is raining|Nieva.~it is snowing|Está nublado.~it is cloudy|Hace buen tiempo.~the weather is nice|Hace mal tiempo.~the weather is bad|¿Cómo está el clima?~What is the weather like?'),
 greetings:rows('hola~hello~hi|buenos días~good morning|buenas tardes~good afternoon|buenas noches~good evening~good night|adiós~goodbye~bye|hasta luego~see you later|hasta mañana~see you tomorrow|nos vemos~see you~see you later|¿Cómo estás?~How are you?|mucho gusto~nice to meet you~pleased to meet you'),
 days:rows('lunes~Monday|martes~Tuesday|miércoles~Wednesday|jueves~Thursday|viernes~Friday|sábado~Saturday|domingo~Sunday'),
 months:rows('enero~January|febrero~February|marzo~March|abril~April|mayo~May|junio~June|julio~July|agosto~August|septiembre~September|octubre~October|noviembre~November|diciembre~December'),
 colors:rows('rojo~red|azul~blue|verde~green|amarillo~yellow|negro~black|blanco~white|morado~purple~violet|anaranjado~orange|gris~gray~grey|rosado~pink|marrón~brown'),
 subjects:rows('matemáticas~math~mathematics|ciencias~science|historia~history|inglés~English|español~Spanish|arte~art|educación física~physical education~PE|música~music'),
 pronouns:rows('yo~I|tú~you (informal singular)|él~he|ella~she|usted~you (formal singular)|nosotros~we (masculine or mixed)|nosotras~we (feminine)|ellos~they (masculine or mixed)|ellas~they (feminine)|ustedes~you (plural)'),
 ar:rows('hablar~to speak~to talk|estudiar~to study|escuchar~to listen|bailar~to dance|cantar~to sing|trabajar~to work|dibujar~to draw|caminar~to walk|practicar~to practice|comprar~to buy'),
 er:rows('comer~to eat|beber~to drink|aprender~to learn|leer~to read|correr~to run|vender~to sell|comprender~to understand'),
 ir:rows('escribir~to write|vivir~to live|abrir~to open|recibir~to receive|compartir~to share|asistir~to attend'),
 gusta:rows('bailar~to dance|cantar~to sing|leer~to read|dibujar~to draw|estudiar~to study|escuchar música~to listen to music|correr~to run|escribir~to write')};
// Phase 2 additions stay in existing topics and retain every original row.
vocab.family.push(...rows('la familia~family|los hijos~children (sons and daughters)|los hermanos~siblings|la bisabuela~great-grandmother|el bisabuelo~great-grandfather|los parientes~relatives'));
const schoolSubjects = [...vocab.subjects];
vocab.subjects.push(...rows('el cuaderno~notebook|el lápiz~pencil|la mochila~backpack|la pizarra~board|el escritorio~desk|la biblioteca~library|el papel~paper|la tarea~homework'));
vocab.weather.push(...rows('la lluvia~rain|la nieve~snow|el viento~wind|el sol~sun|la nube~cloud|la temperatura~temperature'));
vocab.ar.push(...rows('preguntar~to ask|contestar~to answer|necesitar~to need|preparar~to prepare|repasar~to review'));
vocab.er.push(...rows('responder~to respond'));
vocab.ir.push(...rows('describir~to describe'));
vocab.gusta.push(...rows('aprender español~to learn Spanish|compartir libros~to share books|practicar español~to practice Spanish|trabajar en grupo~to work in a group'));
const adjectiveWords=rows('alto~tall|bajo~short|simpático~nice|tímido~shy|serio~serious|creativo~creative|atlético~athletic|organizado~organized|inteligente~intelligent|paciente~patient|trabajador~hardworking|amable~kind|responsable~responsible|generoso~generous|estudioso~studious|divertido~fun');
const familySer=rows('Mi madre es amable.~My mother is kind|Mi padre es paciente.~My father is patient|Mis hermanas son creativas.~My sisters are creative|Mis hermanos son altos.~My brothers are tall|Mi abuela es inteligente.~My grandmother is intelligent|Mis primos son estudiosos.~My male cousins are studious|Mi tía es generosa.~My aunt is generous|Mi tío es responsable.~My uncle is responsible');
const pronounSubjects=rows('Ana~ella|Luis~él|Ana y Marta~ellas|Luis y Ana~ellos|Ana y yo (all female)~nosotras|Luis y yo (male speaker)~nosotros');
export const topics={1:{mixed:'Mix it up',greetings:'Greetings',introductions:'Introductions',family:'Family vocabulary',weather:'Weather',numbers:'Numbers 0–100',days:'Days',months:'Months',colors:'Colors',time:'Digital time',subjects:'School subjects and vocabulary',pronouns:'Subject pronouns',ser:'SER conjugations and sentences',adjectives:'Adjective agreement',gusta:'Me gusta'},2:{mixed:'Mixed review',ser:'Ser review',adjectives:'Adjective agreement',ar:'Regular -AR verbs',er:'Regular -ER verbs',ir:'Regular -IR verbs',verbs:'Mixed -AR / -ER / -IR'}};
export function number(n){const small=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'];return n<30?small[n]:n===100?'cien':['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'][Math.floor(n/10)]+(n%10?' y '+small[n%10]:'');}
export const persons=[['yo',0],['tú',1],['él',2],['ella',2],['usted',2],['nosotros',3],['nosotras',3],['ellos',4],['ellas',4],['ustedes',4]];
export const persons2=[...persons];
const coursePersons = course => course===2?persons2:persons;
export const ser=['soy','eres','es','somos','son'];
export const endings={ar:['o','as','a','amos','an'],er:['o','es','e','emos','en'],ir:['o','es','e','imos','en']};
export function conjugate(v,i){return v.slice(0,-2)+endings[v.slice(-2)][i];}
const contexts={preguntar:'en clase',contestar:'la pregunta',necesitar:'un lápiz',preparar:'la tarea',repasar:'la lección',responder:'al profesor',describir:'una foto',hablar:'español en clase',estudiar:'para el examen',escuchar:'música en casa',bailar:'en la fiesta',cantar:'en el coro',trabajar:'en una tienda',dibujar:'un mapa',caminar:'al parque',practicar:'español con amigos',comprar:'un libro',comer:'fruta',beber:'agua',aprender:'español',leer:'un libro',correr:'en el parque',vender:'camisetas',comprender:'la pregunta',escribir:'un mensaje',vivir:'en Nashville',abrir:'la puerta',recibir:'un mensaje',compartir:'la comida',asistir:'a clase'};
export const adjectives=adjectiveWords.map(([es])=>es);
export function agree(a,f,p){let s=a.endsWith('o')&&f?a.slice(0,-1)+'a':a==='trabajador'&&f?'trabajadora':a;return s+(p?(s.endsWith('r')?'es':'s'):'');}
// Vowel accents are optional; ñ is deliberately preserved.
export function normalize(s){return String(s).toLowerCase().normalize('NFC').replace(/[áàäâ]/g,'a').replace(/[éèëê]/g,'e').replace(/[íìïî]/g,'i').replace(/[óòöô]/g,'o').replace(/[úùüû]/g,'u').replace(/[’']/g,'').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();}
// Only generated time questions use this equivalence rule. Keep number-internal y.
function normalizeTime(value){
 const text=normalize(value);
 if(/^son las una(?: |$)/.test(text)||(/^es la /.test(text)&&!/^es la una(?: |$)/.test(text)))return text;
 return text.replace(/^(?:son las|es la) /,'')
  .replace(/^(una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce) y /,'$1 ');
}
export const isCorrect=(value,q)=>{
 const norm=q.time?normalizeTime:normalize;
 return q.answers.some(a=>norm(a)===norm(value));
};
function q(prompt,answer,pool,explanation,extra={}){return {prompt,answers:Array.isArray(answer)?answer:[answer],pool,explanation,...extra};}
export function timeAnswers(h,m){const base=h===1?'Es la una':'Son las '+number(h);return m===0?[base,base+' en punto']:[base+' y '+number(m),...(m===15?[base+' y cuarto']:m===30?[base+' y media']:[])];}
function vocabulary(bank,typing=false){const row=pick(bank),reverse=typing||Math.random()<.5;return reverse?q(`“${row[1]}”`,[row[0],...(bank===vocab.family?[row[0].replace(/^(la|el|los|las) /,'')]:[]),...bank.filter(r=>r.slice(1).includes(row[1])).map(r=>r[0]),...(row[0]==='morado'?['violeta']:row[0]==='anaranjado'?['naranja']:row[0]==='rosado'?['rosa']:row[0]==='marrón'?['café']:[])],bank.map(r=>r[0]),`${row[0]} = ${row[1]}.`,{lang:'es'}):q(`What does “${row[0]}” mean?`,row.slice(1),bank.map(r=>r[1]),`${row[0]} = ${row[1]}.`,{lang:'en'});}
export function generate(course,topic,typing=false){topic=pick(contentTopics(course,topic));if(topic==='verbs')topic=pick(['ar','er','ir']);
 if(topic==='numbers'){const n=Math.floor(Math.random()*101);return Math.random()<.5?q(`${n}`,number(n),Array.from({length:101},(_,i)=>number(i)),`${n} = ${number(n)}.`,{lang:'es'}):q(`${number(n)}`,String(n),Array.from({length:101},(_,i)=>String(i)),`${number(n)} = ${n}.`,{lang:'en',numeric:true});}
 if(topic==='time'){const h=1+Math.floor(Math.random()*12),m=pick([0,5,10,15,20,25,30,35,40,45,50,55]);return q(`¿Qué hora es?  ${h}:${String(m).padStart(2,'0')}`,timeAnswers(h,m),Array.from({length:12},(_,i)=>timeAnswers(i+1,m)[0]),h===1?'Use “Es la una” for one o’clock.':'Use “Son las” for hours other than one.',{lang:'es',time:true});}
 if(topic==='pronouns'&&Math.random()<.4){const [subject,p]=pick(pronounSubjects);return q(`Replace with a Spanish subject pronoun: ${subject}`,p,persons.map(r=>r[0]),`${subject} → ${p}.`,{lang:'es'});}
 if(topic==='ser'){
  const kind=Math.random();
  if(kind<.25)return vocabulary(familySer,typing);
  if(kind<.5)return vocabulary(serPairs(course),typing);
  const [p,i]=pick(coursePersons(course));return q(`${p} ___ ${p==='usted'?'profesor':i>=3?'estudiantes':'estudiante'}. (ser)`,ser[i],ser.slice(0,5),`${p} uses ${ser[i]}.`,{lang:'es'});
 }
 if(topic==='adjectives'){if(Math.random()<.2)return vocabulary(adjectiveWords,typing);const a=pick(adjectives),f=Math.random()<.5,p=Math.random()<.5,n=f?'chica':'chico',s=(p?'Las ':'La ');return q(`${f?s:(p?'Los ':'El ')}${n}${p?'s':''} ${p?'son':'es'} ___. (${a})`,agree(a,f,p),[agree(a,false,false),agree(a,true,false),agree(a,false,true),agree(a,true,true)],`Match the ${f?'feminine':'masculine'}, ${p?'plural':'singular'} noun.`,{lang:'es'});}
 if(topic==='gusta')return vocabulary(preferencePairs(),typing);
 if(['ar','er','ir'].includes(topic)){if(Math.random()<.2)return vocabulary(vocab[topic],typing);const [v]=pick(vocab[topic]),[p,i]=pick(coursePersons(course));return q(Math.random()<.25?`Conjugate ${v} for ${p}.`:`${p} ___ ${contexts[v]}. (${v})`,conjugate(v,i),Array.from({length:5},(_,j)=>conjugate(v,j)),`${p} + ${v} → ${conjugate(v,i)}.`,{lang:'es'});}
 return vocabulary(vocab[topic],typing);}
export function options(question){const wrong=shuffle([...new Set(question.pool)]).filter(v=>!isCorrect(v,question));return shuffle([question.answers[0],...wrong.slice(0,3)]);}
function serPairs(course){const english={yo:'I am',tú:'you are (informal singular)',él:'he is',ella:'she is',usted:'you are (formal singular)',nosotros:'we are (masculine or mixed)',nosotras:'we are (feminine)',ellos:'they are (masculine or mixed)',ellas:'they are (feminine)',ustedes:'you are (plural, ustedes)'};return coursePersons(course).map(([p,i])=>[`${p} ${ser[i]}`,english[p]]);}
function preferencePairs(){return vocab.gusta.flatMap(([es,en])=>[[`Me gusta ${es}.`,`I like ${en}.`],[`No me gusta ${es}.`,`I don’t like ${en}.`,`I do not like ${en}.`]]);}
export function matchBank(course,topic){let bank;if(topic==='mixed')bank=course===1?[...vocab.greetings,...vocab.colors,...vocab.subjects]:[...vocab.ar,...vocab.er,...vocab.ir];else if(topic==='verbs')bank=[...vocab.ar,...vocab.er,...vocab.ir];else if(topic==='numbers')bank=Array.from({length:101},(_,i)=>[number(i),String(i)]);else if(topic==='time')bank=Array.from({length:12},(_,i)=>[timeAnswers(i+1,30)[1],`${i+1}:30`]);else if(topic==='ser')bank=[...serPairs(course),...familySer];else if(topic==='adjectives')bank=adjectiveWords;else if(topic==='gusta')bank=preferencePairs();else bank=vocab[topic];return bank;}
export function matchPairs(course,topic){const bank=shuffle(contentTopics(course,topic).flatMap(t=>matchBank(course,t))), es=new Set(),en=new Set();return bank.filter(r=>{const a=normalize(r[0]),b=normalize(r[1]);if(es.has(a)||en.has(b))return false;es.add(a);en.add(b);return true;}).slice(0,6).map((r,id)=>({id,es:r[0],en:r[1]}));}

export function story(course,topic='mixed'){if(topic!=='mixed')return scopedStory(course,topic);const name=pick(['Lucía','Mateo','Sofía','Diego','Camila','Andrés']),friend=pick(['Alex','Sam','Dani']),age=pick([14,15,16,17]),city=pick(['Nashville','Madrid','Quito','Bogotá','San Juan']),day=pick(vocab.days)[0],subject=pick(schoolSubjects),hour=pick([1,2,3,4]),activity=pick([['bailar','dance'],['dibujar','draw'],['cantar','sing']]),drink=pick([['agua','water'],['leche','milk'],['jugo','juice']]);
const text=course===1?`Hola, soy ${name}. Tengo ${number(age)} años y soy de ${city}. Mi clase favorita es ${subject[0]}. Hoy es ${day}. Mi clase de español es a ${hour===1?'la una':'las '+number(hour)} y media. Me gusta ${activity[0]}, pero no me gusta correr. Mi amigo ${friend} es inteligente y paciente. Después de clase, escucho música.`:`Me llamo ${name} y vivo en ${city}. Los ${day}, mi amigo ${friend} y yo estudiamos ${subject[0]} en la biblioteca. Yo leo un libro y ${friend} escribe en su cuaderno. Después, compartimos fruta y bebemos ${drink[0]}. A ${hour===1?'la una':'las '+number(hour)} y media, caminamos al parque. Allí, unos estudiantes practican español. Por la noche, me gusta ${activity[0]}, pero mi amigo prefiere escuchar música. Somos diferentes, pero trabajamos bien juntos.`;
const questions=course===1?[q('How old is '+name+'?',String(age),['14','15','16','17'],'Look for “Tengo … años”.'),q('Where is '+name+' from?',city,['Nashville','Madrid','Quito','Bogotá','San Juan'],'Look for “soy de”.'),q('What is the favorite class?',subject[1],vocab.subjects.map(r=>r[1]),`“Mi clase favorita” is ${subject[0]}.`),q('What time is Spanish class?',`${hour}:30`,['1:30','2:30','3:30','4:30'],'“Y media” means half past.'),q('What does '+name+' like to do?',activity[1],['dance','draw','sing','run'],`Me gusta ${activity[0]}.`)]:[q('¿Dónde vive '+name+'?',city,['Nashville','Madrid','Quito','Bogotá','San Juan'],`Vive en ${city}.`),q('¿Dónde estudian los amigos?',['en la biblioteca','la biblioteca','biblioteca'],['en la biblioteca','en el parque','en casa','en una tienda'],'Estudian en la biblioteca.'),q('¿Qué hace '+friend+'?',['escribe en su cuaderno','escribe'],['escribe en su cuaderno','lee un libro','corre','canta'],`${friend} escribe en su cuaderno.`),q('¿Qué beben?',drink[0],['agua','leche','jugo','café'],`Bebemos ${drink[0]}.`),q('¿A qué hora caminan al parque?',`${hour}:30`,['1:30','2:30','3:30','4:30'],'Caminan al parque a esa hora.')];return {title:course===1?'Después de clase':'Una tarde con amigos',text,questions};}

// Unit review reads two short passages when a unit contains multiple topics.
function scopedStory(course,selection){
 const available=contentTopics(course,selection).flatMap(t=>t==='verbs'?['ar','er','ir']:[t]);
 const chosen=shuffle(available).slice(0,2).map(t=>readings[t]);
 const questions=chosen.length===1?chosen[0].questions:[...shuffle(chosen[0].questions).slice(0,3),...shuffle(chosen[1].questions).slice(0,2)];
 return {title:chosen.map(r=>r.title).join(' / '),text:chosen.map(r=>r.text).join('\n\n'),questions:questions.map(([prompt,answer,wrong])=>q(prompt,answer,[answer,...wrong],`The passage says: ${answer}.`))};
}

// Sentence completion uses existing topic passages, with a Spanish word bank.
export function application(course,topic){
 const r=story(course,topic),sentences=r.text.split(/(?<=[.!?])\s+/u).filter(x=>x.length>15);
 const questions=shuffle(sentences).slice(0,5).map(sentence=>{
  const words=[...sentence.matchAll(/\p{L}{4,}/gu)];
  const word=pick(words),answer=word[0];
  return q(sentence.slice(0,word.index)+'___'+sentence.slice(word.index+answer.length),answer,[],sentence,{lang:'es'});
 });
 // Every source passage contains at least five sentences; retain a safe fallback.
 while(questions.length<5)questions.push({...pick(questions)});
 const seenWords=new Set();
 const wordBank=shuffle(questions.map(q=>q.answers[0])).filter(word=>{
  const key=word.normalize('NFC').toLocaleLowerCase('es');
  if(seenWords.has(key))return false;
  seenWords.add(key);return true;
 });
 return {title:'Complete the sentences',text:'Word bank: '+wordBank.join(' · '),wordBank,questions};
}
