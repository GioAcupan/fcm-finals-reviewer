export const LEVELS = ['easy', 'medium', 'hard'];

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Round-robin buckets keep lessons represented before taking extra questions.
export function selectQuestions(bank, { lessons, topics, difficulty = 'mix', count = 20, ids } = {}, random = Math.random) {
  const pool = bank.filter(q => (!lessons || lessons.includes(q.lesson)) &&
    (!topics || topics.includes(q.topic)) &&
    (difficulty === 'mix' || q.difficulty === difficulty) && (!ids || ids.includes(q.id)));
  const buckets = new Map();
  for (const q of shuffle(pool, random)) {
    const key = `${q.lesson}-${difficulty === 'mix' ? q.difficulty : ''}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(q);
  }
  const keys = shuffle([...buckets.keys()], random);
  const selected = [];
  while (selected.length < Math.min(count, pool.length)) {
    for (const key of keys) {
      if (buckets.get(key).length) selected.push(buckets.get(key).pop());
      if (selected.length >= Math.min(count, pool.length)) break;
    }
  }
  return shuffle(selected, random);
}

export function makeSession(questions, { mode = 'practice', minutes = 40 } = {}, now = Date.now(), random = Math.random) {
  return {
    version: 1, mode, started: now, deadline: mode === 'exam' ? now + minutes * 60000 : null,
    index: 0, submitted: false,
    items: questions.map(q => ({ id: q.id, choices: shuffle(q.choices, random), selected: null, checked: false, flagged: false }))
  };
}

export function scoreSession(session, bank) {
  const lookup = new Map(bank.map(q => [q.id, q]));
  const byLesson = {};
  let correct = 0, answered = 0;
  for (const item of session.items) {
    const q = lookup.get(item.id);
    if (!q) continue;
    const right = item.selected === q.answer;
    if (item.selected !== null) answered++;
    if (right) correct++;
    byLesson[q.lesson] ??= { correct: 0, total: 0 };
    byLesson[q.lesson].total++;
    if (right) byLesson[q.lesson].correct++;
  }
  return { correct, total: session.items.length, answered, percent: session.items.length ? Math.round(correct / session.items.length * 100) : 0, byLesson };
}

export function recordAttempt(progress, q, selected) {
  const previous = progress[q.id] || { attempts: 0, correct: 0 };
  return { ...progress, [q.id]: { attempts: previous.attempts + 1, correct: previous.correct + Number(selected === q.answer), lastCorrect: selected === q.answer, updated: Date.now() } };
}

export function validateBank(bank) {
  const errors = [], ids = new Set(), stems = new Set();
  for (const q of bank) {
    if (ids.has(q.id)) errors.push(`Duplicate id ${q.id}`);
    if (stems.has(q.stem)) errors.push(`Duplicate question ${q.id}`);
    ids.add(q.id); stems.add(q.stem);
    if (!LEVELS.includes(q.difficulty) || q.lesson < 4 || q.lesson > 13) errors.push(`Invalid metadata ${q.id}`);
    if (q.choices.length !== 4 || new Set(q.choices).size !== 4 || !q.choices.includes(q.answer)) errors.push(`Invalid choices ${q.id}`);
    if (!q.explanation || !q.source) errors.push(`Missing rationale/source ${q.id}`);
  }
  return errors;
}
