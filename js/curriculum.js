// Stable topic IDs preserve existing per-topic personal records.
export const units = {
  1: [
    {id:'s1-u1', name:'Greetings and Introductions', icon:'👋', topics:['greetings','introductions']},
    {id:'s1-u2', name:'Numbers, Dates, and Time', icon:'📅', topics:['numbers','days','months','time']},
    {id:'s1-u3', name:'Colors, Weather, and School', icon:'🎒', topics:['colors','weather','subjects']},
    {id:'s1-u4', name:'Family', icon:'🏡', topics:['family']},
    {id:'s1-u5', name:'Subject Pronouns and SER', icon:'💬', topics:['pronouns','ser']},
    {id:'s1-u6', name:'Adjectives and Descriptions', icon:'✨', topics:['adjectives']},
    {id:'s1-u7', name:'Me gusta and Personal Preferences', icon:'♥', topics:['gusta']}
  ],
  2: [
    {id:'s2-u1', name:'SER and Adjective Review', icon:'💬', topics:['ser','adjectives']},
    {id:'s2-u2', name:'Regular -AR Verbs', icon:'🎨', topics:['ar']},
    {id:'s2-u3', name:'Regular -ER Verbs', icon:'📖', topics:['er']},
    {id:'s2-u4', name:'Regular -IR Verbs', icon:'✉', topics:['ir']},
    {id:'s2-u5', name:'Mixed Present-Tense Review', icon:'🔀', topics:['verbs']}
  ]
};
export const reviewId = unit => `unit:${unit.id}`;
export function contentTopics(course, selection) {
  if (selection === 'mixed') return [...new Set(units[course].flatMap(u=>u.topics))];
  if (selection.startsWith('unit:')) {
    const unit = units[course].find(u=>reviewId(u)===selection);
    if (!unit) throw new Error(`Unknown unit for Spanish ${course}: ${selection}`);
    return [...unit.topics];
  }
  if (!units[course].some(u=>u.topics.includes(selection))) throw new Error(`Unknown topic for Spanish ${course}: ${selection}`);
  return [selection];
}
