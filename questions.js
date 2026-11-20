// Original MCQ adaptations of the supplied lessons and problem sets.
// Each row: stem, correct answer, three distractors, worked rationale, source section.
export const LESSONS = [
  [4, 'Validity of arguments', 'Premises, truth tables & counterexamples', 'cKyCNyPpV_o'],
  [5, 'Rules & formal proofs', 'Standard forms, inference & replacement', 'GAndYM62c7c'],
  [6, 'Quantifiers', 'All, some, no & their negations', 's-gU9rRcxAE'],
  [7, 'Proof of implications', 'Direct, contrapositive & contradiction', '7iXvf6dIv0k'],
  [8, 'Mathematical induction', 'Base cases, hypotheses & induction steps', 'R2SavwptNSM'],
  [9, 'Relations', 'Cartesian products & relation properties', 'Yvd2h_Tb2no'],
  [10, 'Functions · Part 1', 'Existence, uniqueness & mapping rules', 'Y1jFtEvJCGU'],
  [11, 'Functions · Part 2', 'Domain, codomain & range', 'GpXV9pYJN-I'],
  [12, 'Types of functions', 'Injective, surjective & bijective', 'QhUTS_96T4A'],
  [13, 'Function composition', 'Order, evaluation & domain restrictions', 'VSYs4UScI6k']
].map(([id, title, description, video]) => ({ id, title, description, video }));

// Explicit primary-topic assignments keep filtering independent of wording/source labels.
export const TOPICS = [
  [4, 'argument-basics', 'Validity & premises', [1,2]],
  [4, 'truth-tables', 'Truth tables & conditional form', [3,4,5,6,11,12,15,16]],
  [4, 'counterexamples', 'Counterexamples & truth assignments', [7,8,9,10,13,14,17,18]],
  [5, 'standard-forms', 'Standard forms & fallacies', [1,2,3,4,5,6]],
  [5, 'inference', 'Rules of inference', [7,9,10,22]],
  [5, 'replacement', 'Equivalences & replacement rules', [8,11,12,13,14,15,16,21,24]],
  [5, 'formal-proofs', 'Formal proof steps', [17,18,19,20,23]],
  [6, 'quantifier-meaning', 'Quantifier meanings & equivalents', [3,4,7,10,12]],
  [6, 'quantifier-negation', 'Negating quantified statements', [1,2,5,6,8,9,11]],
  [7, 'proof-methods', 'Proof methods & contrapositives', [1,2,4,5,10,12,15]],
  [7, 'parity-proofs', 'Odd & even integer proofs', [3,6,7,8,9,11,13,14]],
  [8, 'induction-foundations', 'Base cases & induction structure', [1,2,3,6,16,17]],
  [8, 'induction-sums', 'Induction for sum identities', [4,5,7,8,9,11,12,13]],
  [8, 'induction-divisibility', 'Induction for divisibility', [10,14,15,18]],
  [9, 'cartesian-products', 'Cartesian products', [1,2,23]],
  [9, 'relation-rules', 'Relation rules & ordered pairs', [3,7,9,10,11,14,15,24]],
  [9, 'relation-properties', 'Relation properties & equivalence', [4,5,6,8,12,13,16,17,18,19,20,21,22]],
  [10, 'function-definition', 'Function definitions & images', [1,4,5,14]],
  [10, 'finite-functions', 'Finite mappings: existence & uniqueness', [2,3,6,9,10,15]],
  [10, 'formula-functions', 'Formula relations & branch restrictions', [7,8,11,12,13]],
  [11, 'domain-codomain', 'Domain, codomain & range concepts', [1,4,15]],
  [11, 'polynomial-range', 'Linear & quadratic ranges', [2,5,6,9,14]],
  [11, 'rational-functions', 'Rational domains, ranges & preimages', [3,7,10,13]],
  [11, 'radical-functions', 'Square-root domains & endpoints', [8,11,12]],
  [12, 'function-classification', 'Injective, surjective & bijective', [1,2,3,4,5,6,7,8,9,11,13,18]],
  [12, 'domain-restrictions', 'Domain restrictions for injectivity', [10,12,16]],
  [12, 'onto-proofs', 'Codomain choices & surjectivity proofs', [14,15,17]],
  [13, 'composition-evaluation', 'Composition order & evaluation', [1,2,3,4,5,7,8,9,10,11,12,13,14,15,16]],
  [13, 'composition-domains', 'Composition domains & codomains', [6,17,18,19,20]],
  [13, 'composition-injectivity', 'Composition & injectivity', [21]]
].map(([lesson, id, title, numbers]) => ({
  id, lesson, title, questionIds: numbers.map(n => `L${lesson}-${String(n).padStart(2, '0')}`)
}));

export const QUESTIONS = [];
function add(lesson, difficulty, rows) {
  for (const [stem, answer, b, c, d, explanation, section] of rows) {
    const n = QUESTIONS.filter(q => q.lesson === lesson).length + 1;
    QUESTIONS.push({ id: `L${lesson}-${String(n).padStart(2, '0')}`, lesson, difficulty, stem, answer,
      choices: [answer, b, c, d], explanation, source: section.startsWith('PS') ? section : `L${lesson} · ${section}` });
  }
}

add(4, 'easy', [
  ['An argument is invalid precisely when there is a case with…', 'All premises true and the conclusion false', 'All premises false and the conclusion true', 'One premise false and the conclusion false', 'A true conclusion in every case', 'A counterexample must satisfy every premise while falsifying the conclusion. Rows with a false premise cannot refute validity.', 'Validity and Invalidity'],
  ['If I eat breakfast, I have energy. I eat breakfast. Therefore, I have energy. Which statement is the conclusion?', 'I have energy', 'I eat breakfast', 'If I eat breakfast, I have energy', 'I do not eat breakfast', 'The conclusion is the proposition supported by the premises, here the statement after “therefore.”', 'Premises and Conclusion'],
  ['Which is the conditional form of premises p, q and conclusion r?', '(p ∧ q) → r', 'r → (p ∧ q)', '(p ∨ q) → r', 'p ∧ (q → r)', 'Join all premises with AND, then use that conjunction as the antecedent and the conclusion as the consequent.', 'Conditional-form Method'],
  ['A conditional-form truth table is a tautology. What follows about the argument?', 'The argument is valid', 'The argument is invalid', 'Every premise is a tautology', 'The conclusion is always false', 'A tautological conditional form rules out a row with true premises and false conclusion. The individual premises need not be tautologies.', 'Conditional-form Method'],
  ['How many truth-value rows are needed for three distinct propositional variables?', '8', '3', '6', '9', 'Each variable has two possible truth values, so there are 2³ = 8 combinations.', 'Truth-table Methods'],
  ['If p → q is false, which assignment must hold?', 'p = T, q = F', 'p = F, q = T', 'p = T, q = T', 'p = F, q = F', 'An implication fails only when its hypothesis holds but its conclusion fails.', 'Assigning Truth Values']
]);
add(4, 'medium', [
  ['Find a counterexample to p → q; ¬p; therefore ¬q.', 'p = F, q = T', 'p = T, q = F', 'p = F, q = F', 'p = T, q = T', 'With p false and q true, p → q and ¬p are both true, but ¬q is false. This is the fallacy of the inverse.', 'Direct Method'],
  ['Find a counterexample to p → q; q; therefore p.', 'p = F, q = T', 'p = T, q = T', 'p = T, q = F', 'p = F, q = F', 'A true consequent does not force the antecedent. F → T is true, q is true, and p is false.', 'Assigning Truth Values'],
  ['Premises: d ∨ ¬e and d. Conclusion: ¬(e ∧ d). Which assignment refutes the argument?', 'd = T, e = T', 'd = T, e = F', 'd = F, e = F', 'd = F, e = T', 'For the conclusion to be false, e ∧ d must be true. At d = e = T, both premises are also true.', 'PS4 · B1'],
  ['Premises: a and b. Conclusion: a ∧ ¬b. Is the argument valid?', 'Invalid; a = T, b = T is a counterexample', 'Valid by conjunction', 'Invalid; a = F, b = F is a counterexample', 'Valid because the conclusion contains a', 'Both premises force a = b = T. Then ¬b is false, so the conclusion is false. Conjunction cannot negate a premise.', 'PS4 · A1'],
  ['Premises: (f ∨ g) → h and ¬h. Conclusion: ¬f ∧ ¬g. What is the verdict?', 'Valid', 'Invalid when f = T and h = F', 'Invalid when f = g = F', 'Invalid because conjunctions cannot be conclusions', 'Modus tollens gives ¬(f ∨ g); De Morgan gives ¬f ∧ ¬g. If f is true and h false, the first premise would be false.', 'PS4 · B2'],
  ['A truth-table row has a false premise and a false conclusion. What does this row show?', 'It does not establish invalidity', 'It proves the argument invalid', 'It proves the argument valid by itself', 'It is impossible in a truth table', 'Validity only constrains rows in which all premises are true. One irrelevant row cannot decide the whole argument.', 'Direct Method']
]);
add(4, 'hard', [
  ['Premises: x → (y ∨ z); (y ∧ z) → ¬x. Conclusion: ¬x. Which is a counterexample?', 'x = T, y = T, z = F', 'x = T, y = T, z = T', 'x = T, y = F, z = F', 'x = F, y = F, z = F', '¬x must be false, so x = T. Exactly one of y,z can be true: that makes y ∨ z true and y ∧ z false, satisfying both premises.', 'PS4 · B3'],
  ['Premises: a → (b ∨ c); c → (d ∧ e); ¬d. Conclusion: a → e. Which assignment is a counterexample?', 'a=T, b=T, c=F, d=F, e=F', 'a=T, b=F, c=T, d=F, e=F', 'a=F, b=T, c=F, d=F, e=F', 'a=T, b=T, c=F, d=F, e=T', 'To falsify a → e, set a=T,e=F. ¬d forces d=F, so the second premise forces c=F. The first then forces b=T.', 'PS4 · C1'],
  ['Premises: p → (q ∧ r); ¬q. Conclusion: ¬p. Which explains validity?', 'If p were true, q would be true, contradicting ¬q', '¬q forces r to be false', 'A false consequent makes an implication true', 'Every implication is reversible', 'With ¬q true, q ∧ r is false regardless of r. A true first premise therefore requires p false, making ¬p true.', 'PS4 · A3'],
  ['Premise: f ∨ (g ∧ ¬g); another premise: f. Conclusion: ¬(g ∧ ¬f). What is the verdict?', 'Valid, since f true makes g ∧ ¬f false', 'Invalid, since g may be true', 'Invalid, since the first premise is a contradiction', 'Valid only when g is false', 'The contradiction g ∧ ¬g contributes nothing to the disjunction. The premise f makes ¬f false, so the conclusion is true for either value of g.', 'PS4 · A2'],
  ['Premises: f → (g → h); g → (¬h → j); (h ∨ j) → k. Conclusion: f → k. Which assignment refutes it?', 'f=T, g=F, h=F, j=F, k=F', 'f=T, g=T, h=F, j=F, k=F', 'f=T, g=F, h=T, j=F, k=F', 'f=F, g=F, h=F, j=F, k=F', 'Set f=T,k=F to falsify the conclusion. The third premise forces h=j=F. Then the first forces g=F; the second is vacuously true.', 'PS4 · C2'],
  ['Premises: (m → n) ∨ q; r → p; (n ∨ r) ∧ ¬q. Conclusion: m ∨ p. Which counterexample works?', 'm=F, n=T, q=F, r=F, p=F', 'm=F, n=F, q=F, r=F, p=F', 'm=T, n=T, q=F, r=F, p=F', 'm=F, n=T, q=F, r=T, p=F', 'The false conclusion requires m=p=F. Then r → p requires r=F. The third premise requires n=T,q=F. The first premise is true because m is false.', 'PS4 · C3']
]);

add(5, 'easy', [
  ['Name the form: p → q; p; therefore q.', 'Modus ponens', 'Modus tollens', 'Fallacy of the converse', 'Disjunctive syllogism', 'Modus ponens affirms the antecedent and infers the consequent.', 'Standard Forms'],
  ['Name the form: p → q; ¬q; therefore ¬p.', 'Modus tollens', 'Modus ponens', 'Fallacy of the inverse', 'Addition', 'Modus tollens denies the consequent, then denies the antecedent.', 'Standard Forms'],
  ['Name the form: p ∨ q; ¬p; therefore q.', 'Disjunctive syllogism', 'Hypothetical syllogism', 'Constructive dilemma', 'Conjunction', 'If at least one disjunct is true and one is false, the other must be true.', 'Standard Forms'],
  ['Name the form: p → q; q → r; therefore p → r.', 'Hypothetical syllogism', 'Disjunctive syllogism', 'Modus tollens', 'Material equivalence', 'The conditionals chain: p implies q, which implies r.', 'Standard Forms'],
  ['The school did not win. If it wins, students celebrate. Therefore they will not celebrate. Which form is used?', 'Fallacy of the inverse', 'Modus tollens', 'Modus ponens', 'Hypothetical syllogism', 'This has w → c, ¬w, therefore ¬c. Students could celebrate for another reason.', 'PS4 · D2'],
  ['A teacher gives a quiz or an assignment. A quiz was given. Therefore no assignment was given. What is wrong?', 'Inclusive OR allows both a quiz and an assignment', 'A disjunction always means neither', 'The second premise contradicts the first', 'Modus ponens requires three premises', 'p ∨ q does not mean exactly one. Affirming p does not license denying q.', 'PS4 · D1'],
  ['From p alone, which conclusion follows by Addition?', 'p ∨ q', 'p ∧ q', 'q', '¬p', 'Addition introduces any second disjunct. It does not establish that second statement by itself.', 'Rules of Inference'],
  ['Which is equivalent to ¬(p ∨ q)?', '¬p ∧ ¬q', '¬p ∨ ¬q', 'p ∧ q', 'p ∨ ¬q', 'De Morgan negates both parts and swaps OR for AND.', 'De Morgan’s Laws']
]);
add(5, 'medium', [
  ['From (p → q) ∧ (r → s) and p ∨ r, which conclusion follows by Constructive Dilemma?', 'q ∨ s', 'q ∧ s', 'p ∧ r', '¬q ∨ ¬s', 'Whichever antecedent holds supplies its matching consequent; at least one of q,s must hold, not necessarily both.', 'Rules of Inference'],
  ['From (p → q) ∧ (r → s) and ¬q ∨ ¬s, what follows by Destructive Dilemma?', '¬p ∨ ¬r', '¬p ∧ ¬r', 'p ∨ r', 'q ∧ s', 'At least one false consequent forces its corresponding antecedent false. The disjunction does not tell us both are false.', 'Rules of Inference'],
  ['Which rule changes (a ↔ b) ∧ [(a ↔ b) ∨ c] into a ↔ b?', 'Absorption', 'Association', 'Exportation', 'Distribution', 'Let P be a ↔ b. The expression is P ∧ (P ∨ c), equivalent to P by absorption.', 'PS4 · F2'],
  ['Which rule changes (d ∧ e) → (¬e ↔ f) into ¬(d ∧ e) ∨ (¬e ↔ f)?', 'Material implication', 'De Morgan’s law', 'Modus tollens', 'Material equivalence', 'Replace P → Q with ¬P ∨ Q, treating each compound expression as one unit.', 'PS4 · F4'],
  ['Which is the negation of “If I am admitted to PLM, then I should study hard”?', 'I am admitted to PLM and I should not study hard', 'If I am not admitted, I should not study hard', 'I am not admitted or I should study hard', 'I am not admitted and I should study hard', '¬(p → q) is p ∧ ¬q. A negated conditional asserts the hypothesis together with failure of the conclusion.', 'PS4 · H2'],
  ['Which rule transforms [(p ∧ q) → r] into [p → (q → r)]?', 'Exportation', 'Commutation', 'Association', 'Absorption', 'Exportation moves one part of a conjunctive antecedent into a nested implication.', 'Rules of Replacement'],
  ['Which is equivalent to p ↔ q?', '(p → q) ∧ (q → p)', '(p → q) ∨ (q → p)', '(p ∧ q) ∧ (¬p ∧ ¬q)', 'p ∨ q', 'Material equivalence requires both directions, hence a conjunction of conditionals.', 'Rules of Replacement'],
  ['Which rule changes [P ∨ Q] ∧ [P ∨ R] into P ∨ (Q ∧ R)?', 'Distribution', 'Conjunction', 'Commutation', 'Idempotence', 'This is the distributive law in reverse. The common disjunct P can be factored out.', 'PS4 · F5']
]);
add(5, 'hard', [
  ['Proof: 1. a → b; 2. ¬(b ∨ c); 3. ¬b ∧ ¬c; 4. ¬b; 5. ¬a. Which justifies line 5?', '1, 4: Modus tollens', '1, 3: Modus ponens', '2, 4: Disjunctive syllogism', '4: Addition', 'Line 1 has a → b and line 4 denies b. Modus tollens therefore denies a. Line 3 is not itself the needed single consequent negation.', 'Formal Proof · Example 1'],
  ['Premises: (x ∧ y) → [x → (z ∨ a)] and (x ∧ y) ∧ b. Which sequence derives z ∨ a?', 'Simplify to x ∧ y; MP to x → (z ∨ a); simplify to x; MP', 'Simplify to b; MP directly to z ∨ a', 'Use MT twice with x ∧ y', 'Use Addition to infer z ∧ a', 'The compound antecedent first yields the inner conditional. Then x, obtained from x ∧ y, triggers that conditional.', 'PS4 · M-B'],
  ['In a proof of x → (y → z) ⊢ y → (x → z), which sequence of replacements works?', 'Exportation, Commutation, Exportation', 'De Morgan, Addition, Simplification', 'Modus tollens, Modus ponens, Addition', 'Association, Absorption, Material equivalence', 'Export to (x ∧ y) → z, commute the antecedent to (y ∧ x) → z, then export back to y → (x → z).', 'Constructing Formal Proofs · Example 1'],
  ['Given a → ¬c, which two steps yield (c → ¬a) ∨ b?', 'Transposition (with double negation), then Addition', 'Converse, then Conjunction', 'De Morgan, then Simplification', 'Modus ponens, then Distribution', 'Transposition gives ¬¬c → ¬a, equivalent to c → ¬a. Addition then appends the disjunct b.', 'PS4 · M-A'],
  ['Which conclusion follows from (p → q) ∧ (p → ¬q) by the Absurdity replacement?', '¬p', 'p', 'q', 'q ∧ ¬q', 'If p were true, both q and ¬q would follow. Thus p must be false. The premises do not establish q itself.', 'Rules of Replacement'],
  ['In a proof, (w → x) ∧ (y → z) is replaced by w → x. Which justification is sufficient?', 'Simplification', 'Modus ponens', 'Hypothetical syllogism', 'Material implication', 'The outermost connective is AND. Simplification extracts one conjunct without using the internal conditionals.', 'Identifying Rules of Inference'],
  ['Premises: m → n and ¬(n ∨ p). Why is p ↔ m a valid conclusion?', 'Both p and m are forced false, so they have the same truth value', 'Both p and m are forced true', 'Every false conditional is a biconditional', 'The premises force p and m to have opposite truth values', 'De Morgan gives ¬n and ¬p; MT gives ¬m. Both implications between p and m are then true, so the biconditional is true.', 'Constructing Formal Proofs · Example 3'],
  ['Which replacement transforms ¬[(p → q) ∨ r] into (p ∧ ¬q) ∧ ¬r?', 'De Morgan followed by negation of a conditional', 'Material equivalence followed by Addition', 'Exportation followed by Association', 'Transposition followed by Absorption', 'First get ¬(p → q) ∧ ¬r. Then replace ¬(p → q) by p ∧ ¬q. Keep the negation on the entire conditional until that step.', 'Replacement Laws · adapted']
]);

add(6, 'easy', [
  ['What is the negation of “All students are hardworking”?', 'Some students are not hardworking', 'No students are hardworking', 'Some students are hardworking', 'All students are not hardworking', 'A single student who is not hardworking refutes the universal statement. “No students” is stronger than necessary.', 'Negation Exercise 1'],
  ['What is the negation of “Some cats are mammals”?', 'No cats are mammals', 'Some cats are not mammals', 'All cats are mammals', 'Not all cats are mammals', 'To deny that at least one cat is a mammal is to say there are zero cats that are mammals.', 'Negation Exercise 2'],
  ['Which phrase expresses an existential quantifier?', 'At least one', 'Every', 'All', 'None', '“Some,” “there exists,” and “at least one” express existence of a witness.', 'Quantifiers'],
  ['Which statement means the same as “No students are careless”?', 'All students are not careless', 'Some students are careless', 'Not all students are careless', 'All careless people are students', '“No P are Q” means every P fails to have property Q. “Not all” would only require one exception.', 'Equivalent Statements']
]);
add(6, 'medium', [
  ['Negate: “Some real numbers are not rational numbers.”', 'All real numbers are rational numbers', 'No real numbers are rational numbers', 'Some real numbers are rational numbers', 'Not all real numbers are rational numbers', '¬∃x(Real(x) ∧ ¬Rational(x)) says every real number is rational. Negation changes the quantifier and removes the inner negation.', 'PS4 · K3'],
  ['Negate: “All prime numbers greater than 2 are odd.”', 'Some prime numbers greater than 2 are not odd', 'No prime numbers greater than 2 are odd', 'Some prime numbers are greater than 2', 'All odd numbers are prime', 'Keep the restricted subject “prime numbers greater than 2,” and assert the existence of one that is not odd.', 'PS4 · K2'],
  ['Which is equivalent to “Some students do not like math”?', 'Not all students like math', 'No students like math', 'All students dislike math', 'Some students like math', 'One counterexample to “all students like math” is enough. The statement does not tell us how other students feel.', 'Equivalent Statements'],
  ['Negate: “Some college students receive government scholarships.”', 'No college students receive government scholarships', 'All college students receive government scholarships', 'Some college students do not receive government scholarships', 'Not all college students receive government scholarships', 'The original asserts at least one recipient. Its negation says no such recipient exists.', 'PS4 · K1']
]);
add(6, 'hard', [
  ['“All P are Q” is false. What must be true?', 'There exists a P that is not Q', 'Every Q is P', 'No P is Q', 'There exists a Q that is not P', 'A false universal has a counterexample within its subject class P. Reversing the classes does not address the statement.', 'Negation · adapted'],
  ['If there are no objects in class P, what is the truth value of “All P are Q” under standard predicate logic?', 'True, because no counterexample exists', 'False, because a P must exist', 'True only if some Q exists', 'Equivalent to “Some P are Q”', 'A universal statement does not assert existence. With no P, there is no P that fails Q. This is vacuous truth.', 'Equivalent Statements · extension'],
  ['Which correctly negates “Every student who reviews passes”?', 'Some student reviews and does not pass', 'Some student does not review and passes', 'Every student reviews and does not pass', 'No student who reviews passes', 'A universal implication is refuted by one student satisfying its hypothesis (reviews) and failing its conclusion (passes).', 'Negation · combined with L5'],
  ['“Some negative integers do not have additive inverses.” Which is logically equivalent, regardless of its mathematical truth?', 'Not all negative integers have additive inverses', 'No negative integers have additive inverses', 'All negative integers have additive inverses', 'Some nonnegative integers have additive inverses', '“Some P are not Q” is “Not all P are Q.” Equivalence is about logical form; in the integers the original statement is in fact false.', 'PS4 · J3']
]);

add(7, 'easy', [
  ['To directly prove p → q, what do you assume?', 'p is true, then derive q', 'q is false, then derive p', 'q is true, then derive p', 'p is false, then derive ¬q', 'A direct proof starts at the hypothesis and uses definitions and established results to reach the conclusion.', 'Direct Proof'],
  ['Which is the contrapositive of “If m² is odd, then m is odd,” for integer m?', 'If m is even, then m² is even', 'If m is odd, then m² is odd', 'If m² is even, then m is even', 'If m is even, then m² is odd', 'Negate and reverse the implication. For integers, “not odd” means even.', 'Example 2'],
  ['Which is the definition of an even integer n?', 'n = 2k for some integer k', 'n = 2k + 1 for some integer k', 'n = k/2 for every integer k', 'n > 0 and n is divisible by 2', 'Even integers are integer multiples of 2, including zero and negative multiples.', 'Odd and Even Integers'],
  ['For a contradiction proof of p → q, which joint assumption is appropriate?', 'p ∧ ¬q', '¬p ∧ q', 'p ∧ q', '¬p ∧ ¬q', 'Assume the hypothesis holds while the conclusion fails, then derive a contradiction. This is the negation of the implication.', 'Proof by Contradiction'],
  ['What is a theorem?', 'A statement proved using axioms and other established results', 'A statement checked for three examples', 'Any unproved assumption', 'An open sentence with no domain', 'A theorem has a proof; testing a few instances is not enough to establish a universal claim.', 'Theorems']
]);
add(7, 'medium', [
  ['Let a and a+1 be consecutive integers. Which expression shows their sum is odd?', '2a + 1', '2(a + 1)', 'a² + 1', '2a', 'a + (a+1) = 2a+1, which has the defining form of an odd integer.', 'Example 1'],
  ['If n = 2k, which step proves n−4 is even?', 'n−4 = 2(k−2), with k−2 an integer', 'n−4 = 2k−4, so it is positive', 'n−4 = 2(k−4)', 'n−4 = 2k+1', 'Factoring out 2 and identifying the remaining quantity as an integer proves evenness. The result need not be positive.', 'Example 3'],
  ['For odd integers 2a+1 and 2b+1, which proves their sum is even?', '2(a+b+1)', '2(a+b)+1', '4ab+1', '2(a+b+2)+1', '(2a+1)+(2b+1) = 2a+2b+2 = 2(a+b+1). The factor a+b+1 is an integer.', 'PS5 · I1'],
  ['If n = 2k, which expression proves n² is even?', '2(2k²)', '2k²', '2k+1', '4k', 'n² = (2k)² = 4k² = 2(2k²). Squaring 2k requires squaring both factors.', 'PS5 · I2'],
  ['To prove “if ab is odd then a and b are odd” by contrapositive, what should you prove?', 'If a is even or b is even, then ab is even', 'If a and b are even, then ab is odd', 'If ab is even, then a and b are even', 'If a or b is odd, then ab is odd', 'Negating “a and b are odd” gives “a is even OR b is even.” Either even factor makes the product even.', 'PS5 · I3']
]);
add(7, 'hard', [
  ['A student writes a=2k+1 and b=2k+1 to prove the sum of any two odd integers is even. What is the flaw?', 'Using the same k unjustifiably assumes a=b', 'Odd integers must be positive', 'The sum of two odd integers is odd', 'Odd integers cannot be written as 2k+1', 'Use independent integer parameters a=2r+1 and b=2s+1. The same parameter only covers pairs of equal odd integers.', 'PS5 · I1 · proof critique'],
  ['To prove m² odd ⇒ m odd, a student assumes m odd and obtains m² odd. What has been proved?', 'The converse, which does not establish the requested implication', 'The contrapositive of the requested implication', 'The negation of the requested implication', 'The exact requested implication', 'The proof starts from the requested conclusion and derives the requested hypothesis. Even if that converse is true, it is not the required direction.', 'Example 2 · proof critique'],
  ['In a contradiction proof that the sum of two even integers is even, which equality produces the contradiction?', '2(p+q) = 2k+1 for integers p,q,k', '2(p+q) = 2k for integers p,q,k', 'p+q = k for integers p,q,k', '2p+2q = 2(p+q)', 'Assuming the sum is odd gives an odd right side, while expressing both inputs as even gives an even left side. No integer is both even and odd.', 'Example 4'],
  ['Which is a complete direct proof that the product of an even integer and any integer is even?', 'a=2k, b∈ℤ ⇒ ab=2(kb), with kb∈ℤ', 'a=2k ⇒ ab=kb', 'Check that 2×3 and 4×5 are even', 'Assume ab is even, then a is even', 'The defining factorization works for arbitrary integers and shows the remaining factor is an integer. Checking examples is insufficient.', 'PS5 · I3 · supporting lemma'],
  ['Why is proving ¬q → ¬p sufficient to prove p → q?', 'A conditional and its contrapositive are logically equivalent', 'A conditional and its converse are always equivalent', 'Both statements always have true hypotheses', 'Any implication with a negation is true', 'The two forms have identical truth values for every assignment. They are false in precisely the case p true, q false.', 'Indirect Proof']
]);

add(8, 'easy', [
  ['What is the induction hypothesis for 1+3+⋯+(2n−1)=n²?', 'Assume 1+3+⋯+(2k−1)=k² for an arbitrary k≥1', 'Assume the formula for every n≥1', 'Assume 1+3+⋯+(2k+1)=(k+1)² as already proved', 'Assume k is the largest natural number', 'Assume the claim at an arbitrary k and use it to prove the next case. Assuming all cases would be circular.', 'Example 1'],
  ['Which is the n=1 base case for 1³+⋯+n³=n²(n+1)²/4?', '1 = 1²·2²/4', '1 = 1²·1²/4', '0 = 1', '1+8 = 1', 'Substitute n=1 on both sides: 1³=1 and 1²(1+1)²/4=1.', 'Example 2'],
  ['What is the induction step?', 'Prove P(k) ⇒ P(k+1)', 'Prove only P(1)', 'Assume P(k+1) and stop', 'Check P(2), P(3), P(4) only', 'The step propagates truth from each case to its successor. It must be paired with a valid starting case.', 'Induction Procedure'],
  ['For the first n odd numbers, what is the next term after 2k−1?', '2k+1', '2k', '2k+2', 'k+1', 'Replace n by k+1 in 2n−1 to get 2(k+1)−1=2k+1.', 'Example 1'],
  ['Which is the sum 1+3+5+7+9?', '25', '20', '24', '36', 'There are five odd terms, so the sum is 5²=25.', 'Example 1 · evaluation'],
  ['Checking a formula for n=1,2,3 establishes which result by itself?', 'Only those checked cases', 'Every natural-number case', 'The induction step', 'The hypothesis for all integers', 'A finite check cannot prove a universal statement over infinitely many natural numbers. The induction step is essential.', 'Induction Procedure']
]);
add(8, 'medium', [
  ['Using the hypothesis that the first k odd numbers sum to k², what is the next total?', 'k²+(2k+1)=(k+1)²', 'k²+2k=(k+1)²', 'k²+(k+1)=(k+1)²', 'k²+2=(k+1)²', 'Add the (k+1)th odd term 2k+1. The result factors as (k+1)².', 'Example 1 · induction step'],
  ['For 1+2+⋯+n=n(n+1)/2, what do you add to both the k-term sum and its formula?', 'k+1', 'k', '2k+1', '(k+1)²', 'The next summand in the sequence of natural numbers is k+1, not the next odd number.', 'PS5 · II1'],
  ['Simplify k(k+1)/2+(k+1).', '(k+1)(k+2)/2', 'k(k+2)/2', '(k+1)²/2', '(k+1)(k+2)', 'Factor k+1: (k+1)(k/2+1)=(k+1)(k+2)/2, the desired formula at n=k+1.', 'PS5 · II1 · induction step'],
  ['Which expression equals (k+1)³+2(k+1) after isolating k³+2k?', '(k³+2k)+3(k²+k+1)', '(k³+2k)+3(k²+k)', '(k³+2k)+k²+1', '(k³+2k)+3k²+1', 'Expand: k³+3k²+3k+1+2k+2. Removing k³+2k leaves 3k²+3k+3.', 'Example 3'],
  ['In the induction step for the sum of cubes, what term is added to the sum through k³?', '(k+1)³', 'k³+1', '(k+1)²', '3k²+3k+1', 'The next summand is the cube of the next integer. k³+1 is not generally (k+1)³.', 'Example 2'],
  ['What is the n=k+1 target for 1³+⋯+n³=n²(n+1)²/4?', '(k+1)²(k+2)²/4', 'k²(k+1)²/4', '(k+1)²(k+1)²/4', '(k+1)(k+2)/4', 'Replace every n by k+1, so the factor n+1 becomes k+2.', 'Example 2 · target']
]);
add(8, 'hard', [
  ['Why is k²+4(k+1)=(k+2)² useful in the sum-of-cubes proof?', 'It turns (k+1)²[k²+4(k+1)]/4 into the target (k+1)²(k+2)²/4', 'It proves the base case without substitution', 'It lets us cancel (k+1)³ from the original sum', 'It shows that k²=(k+2)²', 'Factoring (k+1)² after adding (k+1)³ leaves a perfect-square factor k²+4k+4.', 'Example 2 · factorization'],
  ['For n³−n divisible by 6, which difference appears between the k+1 and k cases?', '3k(k+1)', '3k²+3k+2', 'k(k+1)', '6k³', '(k+1)³−(k+1)−(k³−k)=3k²+3k=3k(k+1).', 'PS5 · II2'],
  ['Why is 3k(k+1) divisible by 6 for every integer k?', 'One of the consecutive integers k,k+1 is even', 'Every k is divisible by 6', 'Both k and k+1 are always odd', 'Every multiple of 3 is a multiple of 6', 'k(k+1) is even, so it equals 2t for some integer t; multiplying by 3 gives 6t.', 'PS5 · II2 · divisibility'],
  ['A student proves P(k)⇒P(k+1) but checks no base case. What is missing?', 'A starting true case; the step alone can propagate falsehood vacuously', 'A check of every integer', 'A separate proof of P(k+2) for each k', 'An assumption that the theorem is already true', 'The implication can hold even if every P(k) is false. A base case anchors the chain.', 'Induction Procedure · proof critique'],
  ['An induction proof verifies P(3) and proves P(k)⇒P(k+1) for k≥3. What follows?', 'P(n) for all integers n≥3', 'P(n) for all integers n≥1', 'P(n) only for n=3', 'P(n) for all negative integers', 'The propagation begins at 3 and moves forward. It says nothing about 1 or 2 unless those are independently established.', 'Induction Procedure · domain'],
  ['A proof of n³+2n divisible by 3 assumes k³+2k=3t. Which is a valid final factorization for the next case?', '3(t+k²+k+1)', '3(t+k²+k)+1', '3t+k²+k+1', '3(t+k²)+k+1', 'The next expression is (k³+2k)+3(k²+k+1)=3[t+k²+k+1]. The bracket is an integer.', 'Example 3 · completed step']
]);

add(9, 'easy', [
  ['If |A|=2 and |B|=3, how many pairs are in A×B?', '6', '5', '8', '9', 'Every element of A pairs with every element of B, giving |A||B|=2·3=6.', 'Cartesian Product'],
  ['Let A={a,b}, B={b,c,d}. Which pair belongs to A×B?', '(a,d)', '(d,a)', '(c,b)', '(d,d)', 'The first coordinate must belong to A and the second to B. Only (a,d) meets both conditions.', 'Cartesian Product · Exercise'],
  ['What is the domain of R={(1,1),(2,4),(3,9),(4,16)}?', '{1,2,3,4}', '{1,4,9,16}', '{1,2,3,4,9,16}', '{1,4}', 'The domain collects first coordinates. Second coordinates form the range.', 'Domain and Range'],
  ['A relation on A is reflexive when…', 'Every a∈A has (a,a)∈R', 'At least one diagonal pair occurs', 'Every pair has distinct coordinates', 'No diagonal pair occurs', 'Reflexivity requires all self-pairs from the specified underlying set.', 'Types of Relations'],
  ['A relation is symmetric when…', '(a,b)∈R implies (b,a)∈R', '(a,b)∈R implies a=b', 'Every a has a self-pair', '(a,b),(b,c)∈R implies (a,c)∈R', 'Symmetry is the reverse-pair condition. The other options describe antisymmetry, reflexivity, and transitivity.', 'Types of Relations'],
  ['An equivalence relation must be…', 'Reflexive, symmetric, and transitive', 'Reflexive and antisymmetric only', 'Symmetric and antisymmetric only', 'Transitive and a function', 'All three conditions are necessary. Antisymmetry is not part of the definition.', 'Equivalence Relations'],
  ['Let R={(2,4),(4,8),(5,10)}. Is 2R10 true?', 'False; (2,10) is absent', 'True; 10>2', 'True; 2 divides 10', 'True; (5,10) is present', 'For an explicitly listed relation, membership depends on the listed pairs, not a pattern guessed from them.', 'True or False · Exercise 1'],
  ['For A={1,2,3}, the identity relation {(1,1),(2,2),(3,3)} is…', 'Both symmetric and antisymmetric', 'Symmetric but not antisymmetric', 'Antisymmetric but not symmetric', 'Neither symmetric nor antisymmetric', 'Each pair reverses to itself, satisfying symmetry. There are no reverse pairs of distinct elements, satisfying antisymmetry too.', 'Types · Example R4']
]);
add(9, 'medium', [
  ['Let A={1,2,3,4}, B={2,3,4,5,6}. For x+y=5, what is R⊆A×B?', '{(1,4),(2,3),(3,2)}', '{(1,4),(2,3),(3,2),(4,1)}', '{(1,5),(2,5),(3,5),(4,5)}', '{(1,2),(2,3),(3,4),(4,5)}', 'The candidate (4,1) is excluded because 1∉B. Both the equation and the coordinate-set restrictions must hold.', 'PS5 · IV2'],
  ['With A={1,2,3,4}, B={2,3,4,5,6}, what relation satisfies xy=12?', '{(2,6),(3,4),(4,3)}', '{(1,12),(2,6),(3,4),(4,3)}', '{(2,6),(3,4)}', '{(3,4),(4,3),(6,2)}', '(1,12) and (6,2) fail the specified sets. The three listed pairs satisfy both membership and xy=12.', 'PS5 · IV3'],
  ['Let A={2,3,4,5}, B={2,4,6,7,9,10}. For y=2x, which is R?', '{(2,4),(3,6),(5,10)}', '{(2,4),(3,6),(4,8),(5,10)}', '{(2,2),(4,4)}', '{(2,4),(3,6)}', 'The candidate (4,8) is not allowed because 8∉B. Do not extend the codomain set while solving the equation.', 'Open Sentence · Exercise 2'],
  ['On A={1,2,3}, let R={(1,1),(1,2),(2,3),(1,3)}. Which classification is correct?', 'Transitive and antisymmetric, but neither reflexive nor symmetric', 'Reflexive and symmetric only', 'Symmetric and transitive only', 'An equivalence relation', 'The chain 1→2→3 is completed by 1→3. There are no reverse pairs of distinct elements. Self-pairs (2,2),(3,3) and reverses are missing.', 'Types · Exercise R5'],
  ['On A={1,2,3}, R={(2,3),(3,2)} is not transitive because…', '(2,2) and (3,3) are missing', '(1,1) is missing', '(2,3) is missing', 'The set contains reverse pairs', 'The chains 2→3→2 and 3→2→3 require the two self-pairs. Missing (1,1) concerns reflexivity instead.', 'Types · Example R3'],
  ['For A={1,2,3,4}, B={2,4,6,8,10}, define xR₁y iff x+y≥11. Which is true?', '3R₁10', '4R₁6', '1R₁8', '2R₁6', '3+10=13≥11. The other sums are 10,9,8, each below 11.', 'PS5 · V'],
  ['The pairs {(1,5),(2,4),(3,3),(4,2),(5,1)} satisfy which rule?', 'x+y=6', 'y=x+4', 'xy=5', 'y=6x', 'Each pair has coordinates summing to 6. The rule y=x+4 works only for the first pair.', 'PS5 · VI4'],
  ['On A={1,2,3}, R={(1,1),(1,2),(2,2),(2,1),(3,3)} is…', 'An equivalence relation, but not antisymmetric', 'Antisymmetric and transitive only', 'Reflexive but not symmetric', 'Symmetric but not transitive', 'The block {1,2} contains every pair within it, and {3} is a singleton block. Reverse pairs (1,2),(2,1) violate antisymmetry.', 'Types · Exercise R8']
]);
add(9, 'hard', [
  ['On A={1,2,3}, R={(1,1),(1,3),(2,2),(3,1)}. Which addition makes it an equivalence relation?', '(3,3)', '(1,2)', '(2,3)', '(3,2)', 'R is symmetric but lacks (3,3), needed for reflexivity and the chain 3→1→3. Adding it yields the blocks {1,3} and {2}.', 'Types · Exercise R6'],
  ['On A={1,2,3,4}, R contains all self-pairs plus (1,2),(2,1). Which statement is correct?', 'It is an equivalence relation but is not antisymmetric', 'It is antisymmetric but is not symmetric', 'It is reflexive but not transitive', 'It is symmetric but not reflexive', 'The equivalence classes are {1,2},{3},{4}. The two-way pair between distinct elements violates antisymmetry.', 'PS5 · VII1'],
  ['On A={1,2,3,4}, R={(1,1),(2,2),(2,4),(3,2),(3,3),(3,4),(4,2)}. Which witness disproves transitivity?', '(4,2),(2,4) are present, but (4,4) is absent', '(2,4) is present, but (4,2) is absent', '(1,1) is present', '(3,3) is present, but (1,3) is absent', 'A transitivity counterexample must be a composable pair of arrows with a missing shortcut. 4→2→4 requires 4→4.', 'PS5 · VII2'],
  ['On A={1,2,3,4}, R has all self-pairs plus (1,2),(2,4),(3,4),(4,3). Which property holds?', 'Reflexivity', 'Symmetry', 'Transitivity', 'Antisymmetry', 'All self-pairs occur. Symmetry fails at (1,2); transitivity fails at 1→2→4 without (1,4); antisymmetry fails at (3,4),(4,3).', 'PS5 · VII3'],
  ['On a nonempty set A, which properties does the empty relation have?', 'Symmetric, antisymmetric, and transitive, but not reflexive', 'Reflexive only', 'Symmetric only', 'No properties at all', 'No pairs exist to violate symmetry, antisymmetry, or transitivity. Reflexivity fails because the nonempty set has elements without self-pairs.', 'Types of Relations · extension'],
  ['On A={1,2,3}, R={(1,1),(1,2),(2,2),(2,3),(3,2),(3,3)}. Which missing pair witnesses failure of transitivity?', '(1,3)', '(1,1)', '(2,2)', '(3,3)', 'The pairs (1,2) and (2,3) require (1,3). All three diagonal pairs listed in the distractors already occur.', 'Types · Exercise R7'],
  ['Let B={b,c,d}, D={e,f}. Which is B×D?', '{(b,e),(b,f),(c,e),(c,f),(d,e),(d,f)}', '{(b,e),(b,f),(c,e),(c,f),(e,e),(e,f)}', '{(e,b),(f,b),(e,c),(f,c),(e,d),(f,d)}', '{(b,c),(b,d),(e,f)}', 'First coordinates must be b,c,d and second coordinates e,f. The notes accidentally use e instead of d in the last two first coordinates; this answer corrects that typo.', 'Cartesian Product · Exercise 6 · corrected'],
  ['For A={1,2,3,4}, B={2,3,4,5,6}, which is the relation “x divides y”?', '{(1,2),(1,3),(1,4),(1,5),(1,6),(2,2),(2,4),(2,6),(3,3),(3,6),(4,4)}', '{(2,2),(4,2),(4,4)}', '{(1,2),(2,4),(3,6)}', '{(2,1),(3,1),(4,1),(5,1),(6,1)}', 'For each x∈A, list the multiples of x belonging to B. “x divides y” means y=xk for an integer k; reversing divisibility gives a different relation.', 'PS5 · IV5']
]);

add(10, 'easy', [
  ['A function f:A→B must assign to each element of A…', 'Exactly one element of B', 'At least two elements of B', 'Every element of B', 'At most one element of A', 'Existence requires an output for every input; uniqueness requires that output to be the only one.', 'Formal Definition'],
  ['A={0,1,3,8}, B={0,3,9}. Is R={(0,9),(3,0),(1,9),(8,3)} a function A→B?', 'Yes; every input has exactly one output', 'No; two inputs map to 9', 'No; the pairs are not sorted', 'No; 8 is not in B', 'Multiple inputs may share an output. Only inputs belong to A; outputs belong to B. Order of listed pairs is irrelevant.', 'Exercise 1'],
  ['C={0,1,8}, D={0,3,4,9}. R={(0,3),(1,0),(1,9),(8,4)} violates which condition?', 'Uniqueness of output', 'Existence of an output', 'Both existence and uniqueness', 'Neither condition', 'Input 1 has two distinct outputs, 0 and 9. Every domain element does have an output, so existence holds.', 'Exercise 2'],
  ['A constant mapping from five inputs to a single output is…', 'A function', 'Never a function', 'A function only with one input', 'Invalid because outputs repeat', 'Each input still has exactly one image. Functions allow many-to-one mappings.', 'Exercise 3'],
  ['If (x,y) belongs to a function f, then y is called…', 'The image of x under f', 'The domain of x', 'The preimage of x under f', 'The entire codomain of f', 'y=f(x) is the image; x is a preimage of y. One output value is not itself the whole codomain.', 'Images and Preimages']
]);
add(10, 'medium', [
  ['G={3,6,9}, H={3,4,15,30}. R={(9,3),(9,4),(9,15),(9,30)} fails which function conditions?', 'Both existence and uniqueness', 'Existence only', 'Uniqueness only', 'Neither', 'Inputs 3 and 6 have no outputs, violating existence. Input 9 has four outputs, violating uniqueness.', 'Exercise 4'],
  ['Why does y=(x+1)/(x−1) fail to define a function ℝ→ℝ?', 'There is no output at x=1', 'Input 0 has two outputs', 'All fractions are disallowed as outputs', 'Outputs may not be negative', 'The denominator vanishes at 1. On ℝ ∖ {1}, the same formula does define a real-valued function.', 'Exercise 9'],
  ['Why does y²=3x−17 fail to define a function ℝ→ℝ?', 'Some inputs have no output and others have two', 'Every input has exactly two outputs', 'It has a noninteger coefficient', 'Only uniqueness fails for every input', 'For x<17/3 there is no real y; at x=17/3 there is one; for x>17/3 there are two values ±√(3x−17).', 'Exercise 7'],
  ['For A={1,2,3,4}, R={(1,d),(2,c),(4,b)} into B={a,b,c,d}, what fails?', 'Existence, because input 3 has no image', 'Uniqueness, because c repeats', 'Both conditions, because a is unused', 'Nothing; unused outputs are forbidden anyway', 'A function must cover every element of its domain, not every codomain element. Input 3 is missing; unused a is harmless.', 'PS5 · VIII5'],
  ['For A={1,2,3,4}, R={(1,a),(2,c),(2,d),(3,b),(4,a)}, what fails?', 'Uniqueness, because input 2 has two images', 'Existence, because output b appears once', 'Uniqueness, because a is used twice', 'Both conditions, because d is an output', 'All domain inputs occur, so existence holds. The two outputs c,d for the same input 2 violate uniqueness.', 'PS5 · VIII2']
]);
add(10, 'hard', [
  ['For x²+y²=36 on ℝ×ℝ, which input shows a failure of existence?', 'x=7', 'x=0', 'x=3', 'x=6', 'At x=7, y²=36−49=−13, with no real solution. At x=0 or 3 there are two outputs; at x=6 there is exactly one.', 'Exercise 10'],
  ['For |y|=2x+25 on ℝ×ℝ, which is the largest subset of inputs on which at least one real output exists?', '[−25/2,∞)', 'ℝ', '(−∞,−25/2]', '(−25/2,∞)', 'An absolute value is nonnegative, so 2x+25≥0, giving x≥−25/2. The endpoint gives y=0 and must be included.', 'Exercise 8 · adapted'],
  ['How can y²=3x−17 be turned into a real-valued function with the nonnegative output branch?', 'Use domain [17/3,∞) and y=√(3x−17)', 'Keep domain ℝ and take both signs', 'Use domain (−∞,17/3) and y=√(3x−17)', 'Use domain ℝ and y=±√(3x−17)', 'Restricting the input ensures existence; choosing the nonnegative square root ensures uniqueness.', 'Exercise 7 · adapted'],
  ['Is {(1,a),(1,a),(2,b)} a function from {1,2} to {a,b}?', 'Yes; repeated identical pairs do not create distinct outputs', 'No; any repetition breaks uniqueness', 'No; each output must occur twice', 'No; a relation cannot be a set', 'Sets ignore duplicate entries. Input 1 still has only the single distinct image a, and input 2 has image b.', 'Formal Definition · adapted'],
  ['For A={1,2,3,4}, B={a,b,c,d}, R={(1,a),(2,d),(3,b),(4,d),(1,d)}, which statement is correct?', 'It is not a function because 1 maps to a and d', 'It is a function because all inputs appear', 'It is not a function only because c is unused', 'It is a function because sharing d is allowed', 'Coverage of the domain is necessary but not sufficient. Sharing an output is allowed, but input 1 having two different outputs is not.', 'PS5 · VIII3']
]);

add(11, 'easy', [
  ['For f={(1,3),(2,3),(3,3),(4,3)} with codomain {3}, what is the range?', '{3}', '{1,2,3,4}', '{(1,3),(2,3),(3,3),(4,3)}', '∅', 'The range is the set of actual output values, with repeats removed.', 'Example 1'],
  ['For g:ℝ→ℝ, g(x)=5−7x, what is the range?', 'ℝ', '[5,∞)', '(−∞,5]', 'ℝ ∖ {5}', 'For any real y, x=(5−y)/7 gives g(x)=y. A nonconstant linear map on ℝ attains every real value.', 'Example 2'],
  ['Which is the domain of j(x)=(x+4)/(x−3) as a real rational function?', 'ℝ ∖ {3}', 'ℝ ∖ {−4}', 'ℝ ∖ {1}', 'ℝ', 'The denominator must be nonzero, so exclude x=3. A zero numerator is allowed.', 'Example 4'],
  ['For a declared function f:A→B, what is its codomain?', 'B, the declared target set', 'Only the outputs actually attained', 'A, the input set', 'The set of ordered pairs of f', 'The range is a subset of the codomain. The declared target need not equal the range.', 'Domain, Codomain, and Range'],
  ['Complete the square: 4x²−8x+9 = …', '4(x−1)²+5', '4(x−1)²+9', '4(x−2)²+5', '4(x+1)²+5', '4(x²−2x)+9=4[(x−1)²−1]+9=4(x−1)²+5.', 'Example 3']
]);
add(11, 'medium', [
  ['For h:ℝ→ℝ, h(x)=4x²−8x+9, what is the range?', '[5,∞)', '(5,∞)', 'ℝ', '(−∞,5]', 'The completed-square form is 4(x−1)²+5. Its minimum 5 is attained at x=1, so include the endpoint.', 'Example 3 · range'],
  ['For j:ℝ ∖ {3}→ℝ, j(x)=(x+4)/(x−3), what is the range?', 'ℝ ∖ {1}', 'ℝ ∖ {3}', 'ℝ ∖ {−4}', 'ℝ', 'Solving y=(x+4)/(x−3) gives x=(3y+4)/(y−1). Every real y except 1 has an allowed preimage; y=1 would imply 4=−3.', 'Example 4 · range'],
  ['What is the real domain of √(x²−81)?', '(−∞,−9] ∪ [9,∞)', '[−9,9]', '(−∞,−9) ∪ (9,∞)', '[9,∞)', 'Require x²−81≥0, giving |x|≥9. The endpoints yield a defined square root of zero.', 'Example 5'],
  ['For f:ℝ→ℝ, f(x)=8+6x−x², what is the range?', '(−∞,17]', '[17,∞)', '(−∞,8]', 'ℝ', 'f(x)=17−(x−3)², so the maximum is 17 at x=3 and the function is unbounded below.', 'PS5 · IX1'],
  ['For f:ℝ ∖ {−2}→ℝ, f(x)=5/(x+2), what is the range?', 'ℝ ∖ {0}', 'ℝ ∖ {−2}', '(0,∞)', 'ℝ', 'The nonzero numerator prevents output zero. Every y≠0 is attained at x=5/y−2, which is never −2.', 'PS5 · IX2']
]);
add(11, 'hard', [
  ['The notes declare k(x)=√(x²−81) on |x|≥9 with codomain (0,∞). What needs correction?', 'Zero is attained, so the codomain must include 0 or the endpoint inputs must be removed', 'The range includes every negative real number', 'No real inputs are possible', 'Only x=0 must be excluded', 'k(±9)=0, so the stated strictly positive codomain excludes a genuine output. With endpoints included, the range is [0,∞).', 'Example 5 · corrected endpoint'],
  ['For k(x)=√(x²−81), using domain (−∞,−9]∪[9,∞) and codomain [0,∞), which is the range?', '[0,∞)', '(0,∞)', '[9,∞)', 'ℝ', 'Zero occurs at ±9. Given any y≥0, x=√(y²+81) is in the domain and yields output y.', 'Example 5 · corrected range'],
  ['For j(x)=(x+4)/(x−3), which solves j(x)=y when y≠1?', 'x=(3y+4)/(y−1)', 'x=(3y−4)/(y+1)', 'x=(y−3)/(y+4)', 'x=(y+4)/(y−3)', 'yx−3y=x+4 implies x(y−1)=3y+4. Dividing by y−1 yields the inverse expression.', 'Example 4 · solving for preimage'],
  ['For f(x)=8+6x−x², which inputs have output 8?', 'x=0 and x=6', 'x=3 only', 'x=−3 and x=3', 'x=−6 and x=0', '8+6x−x²=8 reduces to x(6−x)=0. The two solutions also demonstrate noninjectivity on ℝ.', 'PS5 · IX1 · preimages'],
  ['A function f:{1,2,3}→{a,b,c,d} has pairs {(1,a),(2,b),(3,a)}. Which is correct?', 'Domain={1,2,3}, codomain={a,b,c,d}, range={a,b}', 'Domain={1,2,3}, codomain={a,b}, range={a,b,c,d}', 'Domain={a,b}, codomain={1,2,3}, range={1,2,3}', 'Domain={1,3}, codomain={a,b,c,d}, range={a}', 'The declaration fixes the domain and codomain; the actual second coordinates determine the range. Unused c,d stay in the codomain.', 'Domain, Codomain, and Range · adapted']
]);

add(12, 'easy', [
  ['Which condition defines injectivity?', 'f(a)=f(b) implies a=b', 'Every codomain value has a preimage', 'Every input has multiple images', 'The domain equals the codomain', 'Injectivity means distinct inputs cannot share an output. Surjectivity is about hitting every codomain value.', 'Injective Functions'],
  ['A function f:A→B is surjective when…', 'Its range equals B', 'Its domain equals B', 'It is injective', 'Every output has at most one preimage', 'Surjectivity requires every target element to be attained. It does not restrict how many inputs reach the same output.', 'Surjective Functions'],
  ['A bijection is a function that is…', 'Both injective and surjective', 'Injective only', 'Surjective only', 'Neither injective nor surjective', 'A bijection hits every codomain element exactly once.', 'Bijective Functions'],
  ['Classify f:ℝ→ℝ, f(x)=2x+7.', 'Bijective', 'Injective but not surjective', 'Surjective but not injective', 'Neither', 'Equal outputs imply 2a+7=2b+7, hence a=b. Every y has the real preimage (y−7)/2.', 'Example · Bijectivity Proof'],
  ['Classify f:ℝ→ℝ, f(x)=eˣ.', 'Injective but not surjective', 'Bijective', 'Surjective but not injective', 'Neither', 'The exponential is strictly increasing, but its range is (0,∞), excluding zero and negative values in the codomain.', 'Exercise 2'],
  ['Why is f:ℤ→ℤ, f(x)=|x−1| not injective?', 'f(0)=f(2)=1 although 0≠2', 'f(1)=0', 'All outputs are integers', 'It has infinitely many inputs', 'One pair of distinct inputs sharing an output disproves injectivity. A zero output is allowed.', 'Exercise 3']
]);
add(12, 'medium', [
  ['Classify f:ℤ→ℤ, f(x)=8−15x.', 'Injective but not surjective', 'Bijective', 'Surjective but not injective', 'Neither', 'Equal outputs imply equal inputs. But y=0 would require x=8/15, not an integer, so zero in the codomain is missed.', 'Exercise 1'],
  ['Classify f:ℚ→ℚ, f(x)=(3x−5)/7.', 'Bijective', 'Injective but not surjective', 'Surjective but not injective', 'Neither', 'The slope is nonzero, so it is injective. For every rational y, x=(7y+5)/3 is rational and maps to y.', 'Exercise 5'],
  ['Classify f:[0,π]→[−1,1], f(x)=cos x.', 'Bijective', 'Injective but not surjective', 'Surjective but not injective', 'Neither', 'Cosine is strictly decreasing on [0,π] and attains every value from 1 to −1, including both endpoints.', 'Exercise 4'],
  ['Which domain restriction makes |x−1| injective on integer inputs?', '{x∈ℤ : x≥1}', 'ℤ', '{x∈ℤ : −1≤x≤3}', '{0,2}', 'On x≥1, |x−1|=x−1, which is strictly increasing. Both 0 and 2 give output 1 in the other nontrivial choices.', 'Exercise 3 · restriction'],
  ['Classify f:[0,∞)→ℝ, f(x)=x².', 'Injective but not surjective', 'Bijective', 'Surjective but not injective', 'Neither', 'Squaring is strictly increasing on nonnegative inputs, but never outputs a negative real number in the stated codomain.', 'PS5 · X2'],
  ['Which domain restriction makes f(x)=9−x² injective?', '[0,∞)', 'ℝ', '[−2,2]', '{−1,1}', 'On nonnegative inputs, 9−x² strictly decreases. A domain containing both a and −a for a≠0 permits equal outputs.', 'PS5 · XI1']
]);
add(12, 'hard', [
  ['For f:ℕ→ℝ, f(x)=x−7, which classification is independent of whether ℕ starts at 0 or 1?', 'Injective but not surjective', 'Bijective', 'Surjective but not injective', 'Neither', 'Distinct natural inputs produce distinct outputs. A real such as 1/2 has no natural-number preimage, under either convention for ℕ.', 'PS5 · X1'],
  ['For f:ℝ→(0,∞), f(x)=|x|, what is the first issue to resolve?', 'It is not a well-defined function into that codomain because f(0)=0', 'It is automatically bijective', 'The domain has too many negative numbers', 'It is injective because all outputs are nonnegative', 'Strictly positive reals exclude zero. If the codomain is changed to [0,∞), the map is surjective but not injective. State the convention for ℝ⁺ explicitly.', 'PS5 · X3 · codomain ambiguity'],
  ['Changing the codomain of eˣ from ℝ to (0,∞), with domain ℝ fixed, makes it…', 'Bijective', 'Neither injective nor surjective', 'Surjective but not injective', 'No longer a function', 'It was already injective. The new codomain equals its range, so it becomes surjective as well.', 'Exercise 2 · codomain adjustment'],
  ['Which statement correctly handles f:ℝ→ℝ, f(x)=x³+1 in the domain-restriction exercise?', 'No restriction is needed; it is already injective', 'Restrict to {−1,1} to remove a repeated output', 'It cannot be made injective', 'Restrict to ℝ ∖ {0} because f(0) is undefined', 'Cubing is strictly increasing over all real numbers; adding 1 preserves injectivity. The formula is defined at zero.', 'PS5 · XI5'],
  ['For f:[0,∞)→[0,∞), f(x)=x², which proves surjectivity?', 'For every y≥0, choose x=√y≥0; then f(x)=y', 'For every y≥0, choose x=−y', 'For every x≥0, f(x)≥0, so every y is reached', 'f(0)=0, so all outputs are reached', 'A surjectivity proof must construct a valid preimage for an arbitrary target. Merely proving outputs belong to the codomain is insufficient.', 'PS5 · X2 · changed codomain'],
  ['Can f:A→B be injective when A and B are finite with |A|=4 and |B|=3?', 'No; two inputs must share an output', 'Yes; leave one input unmapped', 'Yes; give one input two outputs', 'Only if it is also surjective', 'Four inputs cannot be assigned four distinct values from three targets. Leaving an input unmapped or assigning multiple outputs would fail the function definition.', 'Injective Functions · finite-set extension']
]);

add(13, 'easy', [
  ['Which expression defines (g∘f)(x)?', 'g(f(x))', 'f(g(x))', 'g(x)·f(x)', 'g(x)+f(x)', 'Composition applies the rightmost function first: evaluate f, then feed its output into g.', 'Definition'],
  ['Let f(x)=x², g(x)=x+5. Find (g∘f)(2).', '9', '49', '14', '7', 'First f(2)=4, then g(4)=9. The value 49 is the reversed composition f(g(2)).', 'Example 2'],
  ['Let f(x)=x², g(x)=x+5. Find (f∘g)(2).', '49', '9', '14', '7', 'First g(2)=7, then f(7)=49. Function composition generally depends on order.', 'Example 2 · reversed order'],
  ['Let f(x)=2x−1, g(x)=x+3. Find (g∘f)(x).', '2x+2', '2x+5', '2x−4', '2x−1', 'g(f(x))=(2x−1)+3=2x+2.', 'Problem Set 2 · item 2'],
  ['Let h(x)=4−x. Find (h∘h)(−2).', '−2', '6', '2', '10', 'h(−2)=6 and h(6)=−2. In general h(h(x))=4−(4−x)=x.', 'Problem Set 2 · item 5'],
  ['If f:A→B and g:B→C, what is the declared codomain of g∘f?', 'C', 'A', 'B', 'A×C', 'The composition starts with an input from A and finishes with an output in the target C of g.', 'Composition Lemma'],
  ['For f={1↦1, 2↦2, 3↦2}, g={1↦1, 2↦2, 3↦1}, find (g∘f)(3).', '2', '1', '3', 'Undefined', 'Follow 3 through f to 2, then through g to 2.', 'Problem Set 1 · item 1']
]);
add(13, 'medium', [
  ['Let f(x)=2x−1 and h(x)=4−x. Find (f∘h)(x).', '7−2x', '5−2x', '4−2x', '2x−7', 'Substitute the entire inner expression: f(4−x)=2(4−x)−1=7−2x.', 'Problem Set 2 · item 1'],
  ['Let f(x)=2x−1, g(x)=x+3. Find (f∘g)(1).', '7', '4', '5', '9', 'g(1)=4, then f(4)=7. Doing f first instead would give 4.', 'Problem Set 2 · item 4'],
  ['Let f(x)=2x−1, h(x)=4−x. Find (h∘f)(3).', '−1', '1', '5', '−3', 'f(3)=5, then h(5)=4−5=−1.', 'Problem Set 2 · item 6'],
  ['Let f(x)=2x−1. Find (f∘f)(0).', '−3', '−1', '1', '0', 'The first application gives −1; the second gives 2(−1)−1=−3.', 'Problem Set 2 · item 7'],
  ['Let f(x)=2x+1 and g(x)=x²−3. Find (f∘g)(x).', '2x²−5', '4x²+4x−2', '2x²−2', '(2x+1)²−3', 'f(g(x))=2(x²−3)+1=2x²−5. Substituting 2x+1 into g gives the reversed composition.', 'PS5 · XII1'],
  ['Let g(x)=x²−3, h(x)=1/x. Find (g∘h)(2).', '−11/4', '1', '−5/2', '1/4', 'h(2)=1/2, then g(1/2)=1/4−3=−11/4.', 'PS5 · XII3'],
  ['For g={1↦1,2↦2,3↦1} and h={1↦3,2↦2,3↦1}, what is h∘g?', '{(1,3),(2,2),(3,3)}', '{(1,1),(2,2),(3,1)}', '{(1,3),(2,2),(3,1)}', '{(1,1),(2,2),(3,2)}', 'Compute each chain: 1→1→3; 2→2→2; 3→1→3. Record original inputs paired with final outputs.', 'Problem Set 1 · item 2']
]);
add(13, 'hard', [
  ['Let f(x)=2x+1, g(x)=x²−3, h(x)=1/x. Find (h∘f∘g)(−1).', '−1/3', '−3', '1/3', '−1/5', 'Apply right to left: g(−1)=−2, f(−2)=−3, h(−3)=−1/3.', 'PS5 · XII4'],
  ['Let f(x)=2x+1, g(x)=x²−3, h(x)=1/x. Find (f∘g∘h)(x), x≠0.', '2/x²−5', '1/(2x²−5)', '2/(x²−3)+1', '2x²−5', 'h(x)=1/x, then g(h(x))=1/x²−3, then f gives 2(1/x²−3)+1=2/x²−5.', 'PS5 · XII5'],
  ['For f(x)=2x+1, g(x)=x²−3, h(x)=1/x, what is the real domain of h∘f∘g?', 'ℝ ∖ {−√(5/2), √(5/2)}', 'ℝ ∖ {0}', 'ℝ', 'ℝ ∖ {−√3,√3}', 'The composition is 1/(2x²−5). The inner value fed to h cannot be zero: 2x²−5≠0. Here x=0 itself is allowed.', 'PS5 · XII4 · domain extension'],
  ['Let f(x)=x−3 and g(x)=√x. What is the real domain of g∘f?', '[3,∞)', '[0,∞)', 'ℝ ∖ {3}', '(3,∞)', 'The inner function accepts every real x, but its output x−3 must be nonnegative for g. Equality is allowed because √0 exists.', 'Composition Definition · domain extension'],
  ['Which is the general domain rule for g∘f when not all outputs of f are accepted by g?', '{x∈dom f : f(x)∈dom g}', 'dom f ∪ dom g', 'dom f ∩ dom g in every case', 'Always dom g', 'Keep inputs where the inner function is defined and its output is a valid input to the outer function. Simply intersecting the two input domains can give a wrong answer.', 'Composition Lemma · restriction'],
  ['Let f(x)=1/(x−1), g(x)=x+1. The expression for f∘g simplifies to 1/x. What is its domain?', 'ℝ ∖ {0}', 'ℝ ∖ {1}', 'ℝ', 'ℝ ∖ {−1}', 'f(g(x))=1/[(x+1)−1]=1/x. The inner output must not equal 1, so x≠0.', 'Composition Definition · rational extension'],
  ['Let f:A→B and g:B→C. If g∘f is injective, what must be true?', 'f is injective', 'g is injective on all of B', 'f is surjective onto B', 'g is surjective onto C', 'If f(a)=f(b), applying g makes the composite outputs equal, forcing a=b. The composite tests g only on ran f, not necessarily the rest of B.', 'Composition and Injectivity · extension']
]);

const topicByQuestion = new Map();
for (const topic of TOPICS) for (const id of topic.questionIds) {
  if (topicByQuestion.has(id)) throw new Error(`Duplicate topic assignment for ${id}`);
  topicByQuestion.set(id, topic.id);
}
for (const question of QUESTIONS) {
  question.topic = topicByQuestion.get(question.id);
  if (!question.topic) throw new Error(`Missing topic for ${question.id}`);
}
