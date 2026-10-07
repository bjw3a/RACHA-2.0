// Mastery is independent of arcade points, XP and personal records.
export const sequence = ['match','quick','lives','streak','story'];
export const minimum = mode => mode === 'match' ? 6 : ['story','streak'].includes(mode) ? 5 : 10;
export const progressKey = (course, topic) => `${course}:${topic}`;
export function levelState(profile, course, topic) {
  const levels = profile.mastery?.[progressKey(course, topic)] || {};
  const next = sequence.findIndex(mode => !levels[mode]?.completed);
  return {levels, next, complete: next === -1,
    count: sequence.filter(mode => levels[mode]?.completed).length};
}
export function canPlay(profile, course, topic, mode) {
  const state = levelState(profile, course, topic), index = sequence.indexOf(mode);
  return index >= 0 && (state.complete || index <= state.next);
}
export function assess(g) {
  const total = g.mode === 'match' ? g.assessedPairs : g.attempts;
  const correct = g.mode === 'match' ? g.firstPairCorrect : g.correct;
  const enough = total >= minimum(g.mode);
  return {total, correct, percent: total ? correct / total * 100 : 0,
    enough, passed: enough && correct * 5 >= total * 4};
}
export const percentText = n => `${Math.floor(n * 10 + 1e-8) / 10}%`;
export function recordMastery(profile, g) {
  const result = assess(g);
  if (!g.completed || !canPlay(profile, g.course, g.topic, g.mode)) return result;
  profile.mastery ||= {};
  const levels = profile.mastery[progressKey(g.course, g.topic)] ||= {};
  const previous = levels[g.mode] || {completed:false,best:0};
  levels[g.mode] = {completed:previous.completed || result.passed,
    completedAt:previous.completedAt || (result.passed ? new Date().toISOString() : null),
    best:result.enough ? Math.max(previous.best, result.percent) : previous.best};
  return result;
}
