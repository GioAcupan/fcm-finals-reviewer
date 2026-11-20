import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS, LESSONS } from '../questions.js';
import { CHEATS } from '../cheats.js';
import { validateBank, selectQuestions, makeSession, scoreSession, recordAttempt } from '../engine.js';

test('180 unique questions have four unique choices, a valid key, rationale, source, and every lesson/difficulty',()=>{
  assert.equal(QUESTIONS.length,180); assert.deepEqual(validateBank(QUESTIONS),[]);
  for(const l of LESSONS) for(const d of ['easy','medium','hard']) assert.ok(QUESTIONS.filter(q=>q.lesson===l.id&&q.difficulty===d).length>=4);
  assert.equal(CHEATS.length,10); assert.deepEqual(CHEATS.map(c=>c.lesson),LESSONS.map(l=>l.id));
});
test('30-question mixed exam represents every lesson at every difficulty, without duplicates',()=>{
  for(let run=0;run<50;run++) {
    const exam=selectQuestions(QUESTIONS,{count:30});assert.equal(exam.length,30);assert.equal(new Set(exam.map(q=>q.id)).size,30);
    for(const l of LESSONS) for(const d of ['easy','medium','hard'])assert.equal(exam.filter(q=>q.lesson===l.id&&q.difficulty===d).length,1);
  }
});
test('filters and small banks never backfill from unselected lessons or difficulties',()=>{
  const result=selectQuestions(QUESTIONS,{lessons:[6],difficulty:'hard',count:50});
  assert.equal(result.length,4);assert.ok(result.every(q=>q.lesson===6&&q.difficulty==='hard'));
  assert.deepEqual(selectQuestions(QUESTIONS,{lessons:[]}),[]);
  assert.deepEqual(selectQuestions(QUESTIONS,{ids:[]}),[]);
});
test('answer keys are independent of shuffled option positions and survive JSON reload',()=>{
  const qs=selectQuestions(QUESTIONS,{count:30});const s=makeSession(qs,{mode:'exam',minutes:45},1000);
  assert.equal(s.deadline,2701000);
  s.items.forEach((item,i)=>item.selected=i<20?qs[i].answer: i<25?qs[i].choices.find(x=>x!==qs[i].answer):null);
  const result=scoreSession(JSON.parse(JSON.stringify(s)),QUESTIONS);
  assert.equal(result.correct,20);assert.equal(result.answered,25);assert.equal(result.percent,67);
});
test('correcting a mistake removes latest-mistake status while retaining past attempts',()=>{
  const q=QUESTIONS[0];let p=recordAttempt({},q,q.choices[1]);assert.equal(p[q.id].lastCorrect,false);
  p=recordAttempt(p,q,q.answer);assert.equal(p[q.id].lastCorrect,true);assert.equal(p[q.id].correct,1);assert.equal(p[q.id].attempts,2);
});

const imp=(p,q)=>!p||q;
test('problem-set counterexamples satisfy all premises and falsify the conclusion',()=>{
  // Independently evaluate the exact assignments used in the authored rationales.
  const a=true,b=true,c=false,d=false,e=false;
  assert.ok(imp(a,b||c)&&imp(c,d&&e)&&!d);assert.equal(imp(a,e),false);
  const x=true,y=true,z=false;assert.ok(imp(x,y||z)&&imp(y&&z,!x));assert.equal(!x,false);
  const f=true,g=false,h=false,j=false,k=false;assert.ok(imp(f,imp(g,h))&&imp(g,imp(!h,j))&&imp(h||j,k));assert.equal(imp(f,k),false);
  const m=false,n=true,q=false,r=false,p=false;assert.ok((imp(m,n)||q)&&imp(r,p)&&(n||r)&&!q);assert.equal(m||p,false);
});
test('PS5 relation classifications, checked independently from definitions',()=>{
  function props(A,R){const has=(a,b)=>R.some(([x,y])=>x===a&&y===b);return [A.every(a=>has(a,a)),R.every(([a,b])=>has(b,a)),R.every(([a,b])=>R.every(([c,d])=>b!==c||has(a,d))),R.every(([a,b])=>!has(b,a)||a===b)];}
  const A=[1,2,3,4];
  assert.deepEqual(props(A,[[1,1],[2,2],[3,3],[4,4],[1,2],[2,1]]),[true,true,true,false]);
  assert.deepEqual(props(A,[[1,1],[2,2],[2,4],[3,2],[3,3],[3,4],[4,2]]),[false,false,false,false]);
  assert.deepEqual(props(A,[[1,1],[1,2],[2,2],[2,4],[3,3],[3,4],[4,3],[4,4]]),[true,false,false,false]);
});
test('induction identities and composition calculations hold on many sample inputs',()=>{
  for(let n=1;n<=100;n++){
    assert.equal(Array.from({length:n},(_,i)=>2*i+1).reduce((a,b)=>a+b,0),n*n);
    assert.equal((n**3-n)%6,0);assert.equal((n**3+2*n)%3,0);
    assert.equal((n+1)**3-(n+1)-(n**3-n),3*n*(n+1));
    assert.equal(n*n*(n+1)**2/4+(n+1)**3,(n+1)**2*(n+2)**2/4);
  }
  const f=x=>2*x+1,g=x=>x*x-3,h=x=>1/x;
  assert.equal(h(f(g(-1))),-1/3);assert.equal(g(h(2)),-11/4);
  for(const x of [-3,-2,-1,.5,1,2,3])assert.equal(f(g(h(x))),2/(x*x)-5);
  assert.equal(Math.sqrt(9**2-81),0);assert.equal(8+6*3-3**2,17);
});
