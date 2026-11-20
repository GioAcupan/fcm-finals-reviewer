import { QUESTIONS, LESSONS } from './questions.js';
import { CHEATS } from './cheats.js';
import { selectQuestions, makeSession, scoreSession, recordAttempt } from './engine.js';

const $ = (s, root = document) => root.querySelector(s);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'fcm-reviewer-v1';
const BANK = new Map(QUESTIONS.map(q => [q.id, q]));
const icons = {
  study: '<path d="M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-3h3z"/>',
  exam: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h3"/>',
  sheets: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  progress: '<path d="M4 20h16M7 16v-4M12 16V7M17 16V3"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  flag: '<path d="M5 21V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.study}</svg>`;

let storageOK = true;
function readState() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!raw || raw.version !== 1) return { version: 1, progress: {}, bookmarks: [], history: [], session: null };
    const session = raw.session;
    if (session && (!Array.isArray(session.items) || !session.items.length || !session.items.every(i => BANK.has(i.id) && Array.isArray(i.choices) && i.choices.length === 4 && i.choices.every(c => BANK.get(i.id).choices.includes(c))))) raw.session = null;
    if (raw.session) raw.session.index = Math.max(0, Math.min(raw.session.index || 0, raw.session.items.length - 1));
    return { version: 1, progress: raw.progress || {}, bookmarks: Array.isArray(raw.bookmarks) ? raw.bookmarks : [], history: Array.isArray(raw.history) ? raw.history : [], session: raw.session || null };
  } catch { storageOK = false; return { version: 1, progress: {}, bookmarks: [], history: [], session: null }; }
}
let state = readState();
let search = '', sheetLesson = 'all', reviewFilter = 'all', deferredInstall, onlineReady = false;
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { storageOK = false; toast('Device storage is unavailable. Keep this tab open to retain your session.'); }
}
function toast(message) {
  $('#toast').textContent = message; $('#toast').hidden = false;
  clearTimeout(toast.timeout); toast.timeout = setTimeout(() => { $('#toast').hidden = true; }, 4000);
}
function dialog(html) {
  $('#dialog-content').innerHTML = `<button class="dialog-close quiet-button" data-action="close" aria-label="Close dialog">✕</button>${html}`;
  $('#dialog').showModal();
}
function closeDialog() { $('#dialog').close(); }
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const wrongIds = () => QUESTIONS.filter(q => state.progress[q.id] && !state.progress[q.id].lastCorrect).map(q => q.id);
function go(route) { if (location.hash === `#${route}`) render(); else location.hash = route; }
function nav(route) {
  $('#nav').innerHTML = ['study', 'exam', 'sheets', 'progress'].map((id, i) => `<a href="#${id}" class="nav-item ${route === id || (route === 'session' && id === (state.session?.mode === 'exam' ? 'exam' : 'study')) ? 'active' : ''}" ${route === id ? 'aria-current="page"' : ''}>${icon(id)}<span>${['Study desk', 'Mock exam', 'Cheat sheets', 'My progress'][i]}</span></a>`).join('');
}
function header(kicker, title, description) { return `<div class="page-head"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="intro">${description}</p></div>`; }
function resumeCard() {
  if (!state.session || state.session.submitted) return '';
  const done = state.session.items.filter(i => i.selected !== null).length;
  return `<div class="resume"><div><strong>Your ${state.session.mode === 'exam' ? 'mock exam' : 'practice'} is saved.</strong><p class="small">${done} of ${state.session.items.length} answered${state.session.mode === 'exam' ? ' · timer continues while away' : ''}</p></div><button class="button secondary" data-action="resume">Resume</button></div>`;
}
function setupForm(mode) {
  return `<form id="setup-form" data-mode="${mode}" class="setup"><div class="section-head"><h2>${mode === 'exam' ? 'Set up your exam' : 'A practice session, your way'}</h2><span class="small muted">${mode === 'exam' ? 'Answers after submission' : 'Learn as you go'}</span></div>
    <fieldset><legend>Difficulty</legend><div class="segmented">${['easy', 'medium', 'hard', 'mix'].map(d => `<label><input type="radio" name="difficulty" value="${d}" ${d === 'mix' ? 'checked' : ''}><span>${d === 'mix' ? 'Mixed' : cap(d)}</span></label>`).join('')}</div></fieldset>
    <details class="lesson-picker"><summary><span>Lessons</span><span id="selected-label" class="muted small">All 10 selected</span></summary><div class="lesson-picks"><div class="picker-tools"><button type="button" class="text-button" data-action="select-all">Select all</button><button type="button" class="text-button" data-action="select-none">Clear</button></div>${LESSONS.map(l => `<label class="check-row"><input type="checkbox" name="lesson" value="${l.id}" checked><span><span class="mono muted">${String(l.id).padStart(2, '0')}</span> ${l.title}</span></label>`).join('')}</div></details>
    <div class="form-row"><label>Questions<select name="count">${[10, 20, 30, 50, 180].map(n => `<option value="${n}" ${n === (mode === 'exam' ? 30 : 10) ? 'selected' : ''}>${n === 180 ? 'All available' : n}</option>`).join('')}</select></label>${mode === 'exam' ? `<label>Time limit<select name="minutes">${[15,30,45,60,90].map(n => `<option value="${n}" ${n === 45 ? 'selected' : ''}>${n} minutes</option>`).join('')}</select></label>` : `<div class="form-note">No timer.<br>Space to think.</div>`}</div>
    <div class="setup-bottom"><span id="pool-label" class="small muted" aria-live="polite">${QUESTIONS.length} questions available</span><button class="button" type="submit">${mode === 'exam' ? 'Begin mock exam' : 'Start practicing'}</button></div><p id="form-error" class="error-text" role="alert" hidden></p></form>`;
}
function studyPage() {
  const seen = QUESTIONS.filter(q => state.progress[q.id]).length;
  const mastered = QUESTIONS.filter(q => state.progress[q.id]?.lastCorrect).length;
  return `${header('LESSONS 04–13 · FCM FINALS', 'Make the next<br>question count.', 'Work through the ideas. Understand the mistakes. Walk into finals a little more ready.')}
    <div class="study-overview"><div><strong>${QUESTIONS.length}</strong><span>worked questions</span></div><div><strong>${seen}<span class="stat-denominator"> / ${QUESTIONS.length}</span></strong><span>questions attempted</span></div><div><strong>${mastered}</strong><span>correct on last try</span></div></div>
    ${resumeCard()}${setupForm('practice')}
    <section class="lesson-index"><div class="section-head"><h2>Pick up a lesson</h2><span class="small muted">10 lessons</span></div>${LESSONS.map(l => {
      const qs = QUESTIONS.filter(q => q.lesson === l.id), done = qs.filter(q => state.progress[q.id]?.lastCorrect).length;
      return `<div class="lesson-row"><span class="lesson-number mono">${String(l.id).padStart(2, '0')}</span><button class="lesson-link" data-action="lesson" data-lesson="${l.id}"><strong>${l.title}</strong><span class="small muted">${l.description}</span></button><div class="lesson-meta"><span class="small muted">${done}/${qs.length} correct</span><span class="mini-track"><span style="width:${done / qs.length * 100}%"></span></span></div><button class="icon-button" title="Open lesson ${l.id} cheat sheet" aria-label="Lesson ${l.id} cheat sheet" data-action="sheet-dialog" data-lesson="${l.id}">${icon('sheets')}</button></div>`;
    }).join('')}</section>`;
}
function examPage() {
  return `${header('EXAM SIMULATION', 'A dry run<br>for the real thing.', 'A timed mix of lessons, with the answers kept until the end. Flag tricky questions and come back to them.')}
    <div class="exam-facts"><span>${icon('clock')}Timed session</span><span>${icon('exam')}Full answer review</span><span>${icon('check')}Saved on this device</span></div>${resumeCard()}${setupForm('exam')}
    <p class="footnote">The mixed 30-question exam draws one question from each difficulty in each lesson. This is a practice simulation, not a prediction of your instructor’s exam.</p>`;
}
function sheetsPage() {
  return `${header('THE QUICK REFERENCE', 'Keep the essentials close.', 'Rules, proof templates, and the small details that are easy to mix up.')}
    <div class="search-row"><label class="search-label"><span class="sr-only">Search cheat sheets</span><input id="sheet-search" type="search" placeholder="Search rules, formulas, or a topic…" value="${esc(search)}"></label><label><span class="sr-only">Filter by lesson</span><select id="sheet-filter"><option value="all">All lessons</option>${LESSONS.map(l => `<option value="${l.id}" ${String(l.id) === sheetLesson ? 'selected' : ''}>Lesson ${l.id}</option>`).join('')}</select></label></div><div id="sheet-list">${sheetList()}</div>`;
}
function sheetList() {
  const terms = search.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const matches = CHEATS.filter(c => (sheetLesson === 'all' || String(c.lesson) === sheetLesson) && terms.every(t => `${c.title} ${c.tags} ${c.html.replace(/<[^>]+>/g, ' ')}`.toLocaleLowerCase().includes(t)));
  if (!matches.length) return `<div class="empty"><h2>No matching sheets</h2><p>Try “induction,” “range,” or “modus.”</p></div>`;
  return matches.map(c => `<details class="sheet" ${search || sheetLesson !== 'all' ? 'open' : ''}><summary><span class="mono muted">${String(c.lesson).padStart(2, '0')}</span><strong>${c.title}</strong><span class="sheet-toggle" aria-hidden="true">+</span></summary><div class="sheet-body">${c.html}<p class="source-note">Based on Lesson ${c.lesson} and its exercises. <a href="https://www.youtube.com/watch?v=${LESSONS.find(l=>l.id===c.lesson).video}" target="_blank" rel="noreferrer">Lecture video (online)</a></p></div></details>`).join('');
}
function progressPage() {
  const attempted = QUESTIONS.filter(q => state.progress[q.id]), correct = attempted.filter(q => state.progress[q.id].lastCorrect).length;
  const wrong = wrongIds();
  return `${header('YOUR PROGRESS', 'See what’s sticking.', 'Your practice history stays on this device. Revisit the questions that still need a little work.')}
    <div class="study-overview"><div><strong>${attempted.length}</strong><span>unique questions tried</span></div><div><strong>${attempted.length ? Math.round(correct/attempted.length*100) : '—'}${attempted.length ? '%' : ''}</strong><span>correct on last try</span></div><div><strong>${state.history.length}</strong><span>completed sessions</span></div></div>
    <div class="review-tools"><button class="button" data-action="mistakes" ${wrong.length ? '' : 'disabled'}>Review mistakes · ${wrong.length}</button><button class="button secondary" data-action="bookmarks" ${state.bookmarks.length ? '' : 'disabled'}>Saved questions · ${state.bookmarks.length}</button></div>
    <section><div class="section-head"><h2>Lesson coverage</h2><span class="small muted">Correct on last try</span></div>${LESSONS.map(l => { const qs=QUESTIONS.filter(q=>q.lesson===l.id), n=qs.filter(q=>state.progress[q.id]?.lastCorrect).length; return `<div class="coverage-row"><span>${l.id} · ${l.title}</span><span class="coverage-track"><span style="width:${n/qs.length*100}%"></span></span><strong class="mono small">${n}/${qs.length}</strong></div>`; }).join('')}</section>
    <section class="history"><div class="section-head"><h2>Recent sessions</h2><button class="text-button" data-action="export">Export progress</button></div>${state.history.length ? state.history.slice(0,12).map(h => `<div class="history-row"><div><strong>${h.mode === 'exam' ? 'Mock exam' : 'Practice'}</strong><span class="small muted">${new Date(h.finished).toLocaleDateString(undefined,{month:'short',day:'numeric'})} · ${h.total} questions</span></div><strong class="mono">${h.correct}/${h.total} <span class="muted small">${h.percent}%</span></strong></div>`).join('') : `<div class="empty"><h3>A fresh page.</h3><p>Complete a practice session to start your history.</p></div>`}</section><p class="footnote">${storageOK ? 'Progress is stored locally in this browser, without an account. Clearing browser data removes it. Export a backup whenever you like.' : 'Storage is unavailable in this browser. Progress currently lasts only while this tab is open.'}</p><button class="text-button danger" data-action="reset-confirm">Reset all progress</button>`;
}
function sessionPage() {
  const s = state.session;
  if (!s) return `${header('NO ACTIVE SESSION', 'Ready when you are.', 'Choose a lesson or start a mixed practice session.')}<button class="button" data-action="home">Go to study desk</button>`;
  if (s.submitted) return resultsPage();
  const item = s.items[s.index], q = BANK.get(item.id), isExam = s.mode === 'exam', checked = item.checked;
  const answered = s.items.filter(i => i.selected !== null).length;
  const saved = state.bookmarks.includes(q.id);
  return `<div class="session-top"><button class="text-button" data-action="leave">Save & leave</button><span class="session-mode">${isExam ? 'MOCK EXAM' : 'PRACTICE'}</span>${isExam ? `<span class="timer mono" id="timer" role="timer" aria-label="Time remaining"></span>` : `<span class="small muted">No timer</span>`}</div>
    <div class="session-progress"><span style="width:${answered/s.items.length*100}%"></span></div><div class="question-heading"><span class="eyebrow">QUESTION ${String(s.index+1).padStart(2,'0')} <span class="muted">/ ${s.items.length}</span></span><span class="badge ${q.difficulty}">${cap(q.difficulty)}</span></div>
    <div class="question-tools"><span class="small muted">Lesson ${q.lesson} · ${LESSONS.find(l=>l.id===q.lesson).title}</span><div><button class="icon-button ${saved?'on':''}" data-action="bookmark" aria-label="${saved?'Unsave':'Save'} question" aria-pressed="${saved}">${icon('bookmark')}</button><button class="icon-button ${item.flagged?'on':''}" data-action="flag" aria-label="${item.flagged?'Unflag':'Flag'} question" aria-pressed="${item.flagged}">${icon('flag')}</button></div></div>
    <section class="question" aria-labelledby="question-title"><h1 id="question-title">${esc(q.stem)}</h1><div class="answers" role="group" aria-label="Answer choices">${item.choices.map((choice, i) => {
      const isCorrect = checked && choice === q.answer, isWrong = checked && item.selected === choice && choice !== q.answer;
      return `<button class="answer ${item.selected === choice ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'incorrect' : ''}" data-action="answer" data-choice="${i}" aria-pressed="${item.selected === choice}" ${checked ? 'disabled' : ''}><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${esc(choice)}</span>${isCorrect ? `<span class="answer-indicator" aria-label="Correct answer">✓</span>` : isWrong ? '<span class="answer-indicator" aria-label="Incorrect answer">✕</span>' : ''}</button>`;
    }).join('')}</div></section>
    ${checked ? explanation(q, item.selected) : ''}
    <div class="question-actions"><button class="button secondary" data-action="previous" ${s.index === 0 ? 'disabled' : ''}>Previous</button>${!isExam && !checked ? `<button class="button" data-action="check" ${item.selected === null ? 'disabled' : ''}>Check answer</button>` : `<button class="button" data-action="${s.index === s.items.length-1 ? 'finish-confirm' : 'next'}">${s.index === s.items.length-1 ? (isExam?'Submit exam':'See results') : 'Next question'}</button>`}</div>
    ${!isExam && !checked ? `<button class="text-button skip-question" data-action="${s.index === s.items.length-1 ? 'finish-confirm' : 'next'}">${s.index === s.items.length-1 ? 'Finish session' : 'Skip for now'}</button>` : ''}
    <details class="question-map"><summary>Question navigator <span class="small muted">${answered}/${s.items.length} answered</span></summary><div class="map-legend small muted">Filled = answered · Flag = revisit</div><div class="map-grid">${s.items.map((x,i)=>`<button class="map-button ${x.selected!==null?'answered':''} ${x.flagged?'flagged':''} ${i===s.index?'current':''}" data-action="jump" data-index="${i}" aria-label="Question ${i+1}${x.selected!==null?', answered':', unanswered'}${x.flagged?', flagged':''}" ${i===s.index?'aria-current="step"':''}>${i+1}${x.flagged?'<span aria-hidden="true">⚑</span>':''}</button>`).join('')}</div></details>
    ${!isExam ? `<button class="text-button sheet-shortcut" data-action="sheet-dialog" data-lesson="${q.lesson}">${icon('sheets')}Open lesson cheat sheet</button>` : `<p class="footnote">Answers and explanations appear after submission. The timer keeps running if you leave this screen.</p>`}`;
}
function explanation(q, selected) {
  return `<div class="explanation ${selected===q.answer?'right':'wrong'}" role="status"><p class="eyebrow">${selected===q.answer ? 'CORRECT · HERE’S WHY' : selected===null ? 'UNANSWERED · WORKED SOLUTION' : 'LET’S WORK THROUGH IT'}</p><p><strong>${esc(q.answer)}</strong></p><p>${esc(q.explanation)}</p><span class="source-note">${esc(q.source)} · ${q.id}</span></div>`;
}
function resultsPage() {
  const s=state.session;
  if (!s?.submitted) return sessionPage();
  const score=scoreSession(s,QUESTIONS), missed=s.items.filter(i=>i.selected!==BANK.get(i.id).answer);
  const items=s.items.filter(i=>reviewFilter==='all'||(reviewFilter==='missed'&&i.selected!==BANK.get(i.id).answer)||(reviewFilter==='flagged'&&i.flagged));
  return `${header('SESSION COMPLETE', score.percent>=80 ? 'Good work. Keep it going.' : 'Every mistake is a next step.', 'Review the reasoning below, then give the tricky ones another try.')}
    <div class="result-score"><strong>${score.percent}<span>%</span></strong><div><h2>${score.correct} of ${score.total} correct</h2><p class="muted">${score.total-score.answered} unanswered · ${s.mode==='exam'?'Mock exam':'Practice'}</p></div></div>
    <div class="review-tools"><button class="button" data-action="retry-session" ${missed.length?'':'disabled'}>Retry missed · ${missed.length}</button><button class="button secondary" data-action="home">Back to study desk</button></div>
    <section class="result-breakdown"><h2>By lesson</h2>${Object.entries(score.byLesson).map(([l,n])=>`<div class="coverage-row"><span>${l} · ${LESSONS.find(x=>x.id===Number(l)).title}</span><span class="coverage-track"><span style="width:${n.correct/n.total*100}%"></span></span><strong class="mono small">${n.correct}/${n.total}</strong></div>`).join('')}</section>
    <section class="answer-review"><div class="section-head"><h2>Answer review</h2><label><span class="sr-only">Filter reviewed answers</span><select id="review-filter"><option value="all" ${reviewFilter==='all'?'selected':''}>All questions</option><option value="missed" ${reviewFilter==='missed'?'selected':''}>Missed questions</option><option value="flagged" ${reviewFilter==='flagged'?'selected':''}>Flagged questions</option></select></label></div>${items.length ? items.map(item=>{ const q=BANK.get(item.id); return `<details class="review-item"><summary><span class="review-mark ${item.selected===q.answer?'right-text':'wrong-text'}">${item.selected===q.answer?'✓':'✕'}</span><span>${esc(q.stem)}</span></summary><div class="review-body"><p class="small muted">Your answer: ${esc(item.selected??'Unanswered')}</p>${explanation(q,item.selected)}<button class="text-button" data-action="sheet-dialog" data-lesson="${q.lesson}">Lesson ${q.lesson} cheat sheet</button></div></details>`;}).join('') : '<p class="empty">No questions in this view.</p>'}</section>`;
}
function render() {
  const route=location.hash.slice(1)||'study';
  nav(route);
  $('#main').innerHTML=route==='exam'?examPage():route==='sheets'?sheetsPage():route==='progress'?progressPage():route==='session'||route==='results'?sessionPage():studyPage();
  document.title=`${({study:'Study desk',exam:'Mock exam',sheets:'Cheat sheets',progress:'My progress',session:'Session',results:'Results'})[route]||'Study desk'} · FCM`;
  if ($('#setup-form')) updatePool();
  tick();
}
function updatePool() {
  const f=$('#setup-form'); if(!f) return;
  const lessons=[...f.querySelectorAll('[name=lesson]:checked')].map(x=>Number(x.value));
  const difficulty=new FormData(f).get('difficulty');
  const count=QUESTIONS.filter(q=>lessons.includes(q.lesson)&&(difficulty==='mix'||q.difficulty===difficulty)).length;
  const wanted=Number(new FormData(f).get('count'));
  $('#selected-label').textContent=lessons.length===10?'All 10 selected':`${lessons.length} selected`;
  $('#pool-label').textContent=`${count} available · ${Math.min(count,wanted)} in this session`;
  f.querySelector('[type=submit]').disabled=!count;
}
let pendingStart;
function start(options) {
  const questions=selectQuestions(QUESTIONS,options);
  if (!questions.length) {toast('No questions match these choices.');return;}
  const launch=()=>{state.session=makeSession(questions,options);save();reviewFilter='all';go('session');window.scrollTo(0,0);};
  if(state.session&&!state.session.submitted) {
    pendingStart=launch;
    dialog('<p class="eyebrow">SAVED SESSION</p><h2>You have a session in progress.</h2><p>Starting a new one replaces the saved session. Checked practice answers stay in your progress.</p><div class="dialog-actions"><button class="button" data-action="resume-dialog">Resume saved</button><button class="button secondary" data-action="replace-session">Start new session</button></div>');
  } else launch();
}
function finish() {
  const s=state.session;if(!s||s.submitted)return;
  for(const item of s.items) if(!item.checked) {
    state.progress=recordAttempt(state.progress,BANK.get(item.id),item.selected); item.checked=true;
  }
  s.submitted=true;s.finished=Date.now();
  state.history.unshift({mode:s.mode,finished:s.finished,...scoreSession(s,QUESTIONS)});
  state.history=state.history.slice(0,50);reviewFilter='all';save();closeDialog();go('results');window.scrollTo(0,0);
}
function tick() {
  const s=state.session;if(!s||s.submitted||s.mode!=='exam')return;
  const seconds=Math.max(0,Math.ceil((s.deadline-Date.now())/1000));
  if($('#timer')) {$('#timer').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;$('#timer').classList.toggle('urgent',seconds<300);}
  if(seconds===0) {finish();toast('Time is up. Your exam has been submitted.');}
}
document.addEventListener('submit',e=>{
  if(e.target.id!=='setup-form')return;e.preventDefault();
  const f=e.target,data=new FormData(f),lessons=data.getAll('lesson').map(Number);
  if(!lessons.length){$('#form-error').hidden=false;$('#form-error').textContent='Select at least one lesson.';return;}
  start({mode:f.dataset.mode,difficulty:data.get('difficulty'),count:Number(data.get('count')),minutes:Number(data.get('minutes')||45),lessons});
});
document.addEventListener('change',e=>{
  if(e.target.closest('#setup-form'))updatePool();
  if(e.target.id==='sheet-filter'){sheetLesson=e.target.value;$('#sheet-list').innerHTML=sheetList();}
  if(e.target.id==='review-filter'){reviewFilter=e.target.value;render();}
});
document.addEventListener('input',e=>{if(e.target.id==='sheet-search'){search=e.target.value;$('#sheet-list').innerHTML=sheetList();}});
document.addEventListener('click',async e=>{
  const button=e.target.closest('[data-action]');if(!button)return;
  const action=button.dataset.action, s=state.session, item=s?.items[s.index];
  if(action==='close')closeDialog();
  else if(action==='home')go('study');
  else if(action==='resume'||action==='resume-dialog'){closeDialog();go('session');}
  else if(action==='replace-session'){closeDialog();pendingStart?.();pendingStart=null;}
  else if(action==='leave'){save();go(s?.mode==='exam'?'exam':'study');}
  else if(action==='select-all'||action==='select-none'){document.querySelectorAll('[name=lesson]').forEach(x=>x.checked=action==='select-all');updatePool();}
  else if(action==='lesson')start({mode:'practice',lessons:[Number(button.dataset.lesson)],count:10,difficulty:'mix'});
  else if(action==='answer'&&item&&!item.checked&&!s.submitted){item.selected=item.choices[Number(button.dataset.choice)];save();render();}
  else if(action==='check'&&item&&item.selected!==null&&!item.checked){item.checked=true;state.progress=recordAttempt(state.progress,BANK.get(item.id),item.selected);save();render();$('.explanation')?.scrollIntoView({block:'nearest',behavior:'smooth'});}
  else if(action==='bookmark'&&item){state.bookmarks=state.bookmarks.includes(item.id)?state.bookmarks.filter(id=>id!==item.id):[...state.bookmarks,item.id];save();render();toast(state.bookmarks.includes(item.id)?'Question saved. Find it in My progress.':'Question removed from saved.');}
  else if(action==='flag'&&item&&!s.submitted){item.flagged=!item.flagged;save();render();}
  else if(['previous','next','jump'].includes(action)&&s&&!s.submitted){s.index=action==='jump'?Number(button.dataset.index):s.index+(action==='next'?1:-1);s.index=Math.max(0,Math.min(s.index,s.items.length-1));save();render();window.scrollTo(0,0);$('#question-title')?.setAttribute('tabindex','-1');$('#question-title')?.focus({preventScroll:true});}
  else if(action==='finish-confirm'){
    const left=s.items.filter(i=>i.selected===null).length;
    dialog(`<p class="eyebrow">${s.mode==='exam'?'SUBMIT EXAM':'FINISH PRACTICE'}</p><h2>Ready to see your results?</h2><p>${left?`${left} unanswered question${left===1?'':'s'} will count as incorrect.`:'You have answered every question.'} You can review every solution after submission.</p><div class="dialog-actions"><button class="button" data-action="finish">${s.mode==='exam'?'Submit exam':'Finish session'}</button><button class="button secondary" data-action="close">Keep working</button></div>`);
  }
  else if(action==='finish')finish();
  else if(action==='mistakes')start({ids:wrongIds(),count:180,mode:'practice'});
  else if(action==='bookmarks')start({ids:state.bookmarks,count:180,mode:'practice'});
  else if(action==='retry-session')start({ids:s.items.filter(i=>i.selected!==BANK.get(i.id).answer).map(i=>i.id),count:180,mode:'practice'});
  else if(action==='sheet-dialog'){const c=CHEATS.find(c=>c.lesson===Number(button.dataset.lesson));dialog(`<p class="eyebrow">LESSON ${c.lesson} · CHEAT SHEET</p><h2>${c.title}</h2><div class="sheet-body">${c.html}</div>`);}
  else if(action==='about')dialog(`<p class="eyebrow">FCM FINALS REVIEWER</p><h2>Made for lessons 4–13.</h2><p>${QUESTIONS.length} original MCQ adaptations based on the local lecture notes, slide exercises, Problem Set 4, and Problem Set 5. Some harder questions are clearly marked as extensions in their source labels.</p><p>The explanations use mathematically correct endpoint and codomain conventions. Source inconsistencies are called out in the relevant cheat sheets. This is a study aid; MCQs do not replace writing full proofs.</p><h3>Offline & installation</h3><p>Open the app online once and wait for “Ready offline.” The full question bank and cheat sheets are then stored for offline use. Lecture video links need internet. On iPhone/iPad: Safari → Share → Add to Home Screen. On Android or desktop: use the browser’s Install app action.</p><h3>Your data</h3><p>No account or server database. Progress is saved in this browser. Export progress from My progress for a backup. Browser storage can be cleared by you or by the device.</p><p><a href="https://github.com/GioAcupan/fcm-finals-reviewer" target="_blank" rel="noreferrer">View the source repository</a></p>`);
  else if(action==='export'){
    const blob=new Blob([JSON.stringify({...state,exported:new Date().toISOString()},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='fcm-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Progress backup downloaded.');
  }
  else if(action==='reset-confirm')dialog('<h2>Reset your study history?</h2><p>This clears attempts, saved questions, session history, and your current session from this browser. Export a backup first if you want a record.</p><div class="dialog-actions"><button class="button" data-action="reset">Reset everything</button><button class="button secondary" data-action="close">Keep my progress</button></div>');
  else if(action==='reset'){state={version:1,progress:{},bookmarks:[],history:[],session:null};save();closeDialog();render();toast('Progress reset. A fresh start.');}
});

$('#install-button').addEventListener('click',async()=>{
  if(deferredInstall){await deferredInstall.prompt();deferredInstall=null;$('#install-button').hidden=true;}
  else dialog('<h2>Take your reviewer with you.</h2><p><strong>iPhone / iPad:</strong> open in Safari, tap Share, then Add to Home Screen.</p><p><strong>Android / desktop:</strong> open the browser menu and choose Install app or Add to Home screen, when available.</p><p>For offline use, first wait for the “Ready offline” message. Installation requires HTTPS or localhost.</p>');
});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;$('#install-button').hidden=false;});
window.addEventListener('appinstalled',()=>{$('#install-button').hidden=true;toast('Reviewer installed.');});
function connectionStatus(){
  const banner=$('#offline-banner');banner.hidden=navigator.onLine;
  banner.textContent='You’re offline. Cached questions, cheat sheets, and saved progress still work.';
  $('#cache-status').textContent=onlineReady?'Ready offline':navigator.onLine?'Preparing offline copy…':'Offline · cache not yet verified';
  $('#mobile-cache-status').textContent=onlineReady?'Ready offline':navigator.onLine?'Preparing offline…':'Offline';
}
window.addEventListener('online',connectionStatus);window.addEventListener('offline',connectionStatus);
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);$('#main').focus({preventScroll:true});});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
setInterval(tick,1000);
render();connectionStatus();
if(!storageOK)toast('Local storage is unavailable. Keep this tab open to retain progress.');
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js').then(async registration=>{
    await navigator.serviceWorker.ready;onlineReady=true;connectionStatus();
    // Activating an update does not reload an active exam or practice session.
    registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)toast('A fresh offline copy is ready. Reopen the app after your session to use it.');});});
  }).catch(()=>{$('#cache-status').textContent='Offline setup failed · reconnect and reload';$('#mobile-cache-status').textContent='Offline setup failed';});
}else {$('#cache-status').textContent='This browser does not support offline caching';$('#mobile-cache-status').textContent='Online only';}
