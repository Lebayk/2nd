import type { QuizQuestion } from '../types'

const R = String.raw

/** QCM d'auto-évaluation par chapitre. `answer` = index de la bonne réponse. */
export const QUIZZES: QuizQuestion[] = [
  // ── Chapitre 1 — Python ──────────────────────────────────────────────
  { id: 'q-1-0', chapter: 1, q: 'Que parcourt `range(2, 10, 3)` ?', choices: ['2, 5, 8', '2, 4, 6, 8', '3, 6, 9', '2, 5, 8, 11'], answer: 0, explain: 'On part de 2 par pas de 3 sans atteindre 10 : 2, 5, 8.' },
  { id: 'q-1-1', chapter: 1, q: 'Combien vaut `len([k for k in range(10) if k % 2 == 0])` ?', choices: ['4', '5', '6', '10'], answer: 1, explain: 'Les pairs de 0 à 9 : 0, 2, 4, 6, 8 → 5 éléments.' },
  { id: 'q-1-2', chapter: 1, q: 'Après `L = [1, 2, 3]` puis `L.append(4)`, que vaut `L[-1]` ?', choices: ['1', '3', '4', 'une erreur'], answer: 2, explain: '`append` ajoute 4 en fin ; `L[-1]` est le dernier élément.' },

  // ── Chapitre 2 — Second degré ────────────────────────────────────────
  { id: 'q-2-0', chapter: 2, q: R`Le discriminant de $x^2-5x+6$ vaut :`, choices: ['1', '-1', '49', '0'], answer: 0, explain: R`$\Delta=(-5)^2-4\times1\times6=25-24=1$.` },
  { id: 'q-2-1', chapter: 2, q: R`Combien de solutions réelles a $x^2+x+1=0$ ?`, choices: ['0', '1', '2', 'une infinité'], answer: 0, explain: R`$\Delta=1-4=-3<0$ : aucune solution réelle.` },
  { id: 'q-2-2', chapter: 2, q: R`Les racines de $x^2-5x+6$ sont :`, choices: ['2 et 3', '-2 et -3', '1 et 6', '-1 et 6'], answer: 0, explain: R`Somme $5$, produit $6$ → $2$ et $3$.` },
  { id: 'q-2-3', chapter: 2, q: R`L'abscisse du sommet de $f(x)=x^2-4x+1$ est :`, choices: ['2', '-2', '4', '1'], answer: 0, explain: R`$-\dfrac{b}{2a}=-\dfrac{-4}{2}=2$.` },

  // ── Chapitre 3 — Dérivation (polynômes) ──────────────────────────────
  { id: 'q-3-0', chapter: 3, q: R`La dérivée de $f(x)=3x^2-5x+2$ est :`, choices: [R`$6x-5$`, R`$3x-5$`, R`$6x-5x$`, R`$x^2-5$`], answer: 0, explain: R`$(3x^2)'=6x$, $(-5x)'=-5$, $(2)'=0$.` },
  { id: 'q-3-1', chapter: 3, q: R`Le coefficient directeur de la tangente à $\mathcal{C}_f$ en $a$ est :`, choices: [R`$f'(a)$`, R`$f(a)$`, R`$a$`, R`$f'(x)$`], answer: 0, explain: R`La tangente a pour pente le nombre dérivé $f'(a)$.` },
  { id: 'q-3-2', chapter: 3, q: R`Si $f'(x)<0$ sur un intervalle $I$, alors sur $I$ :`, choices: [R`$f$ est décroissante`, R`$f$ est croissante`, R`$f$ est constante`, R`$f$ est positive`], answer: 0, explain: R`Dérivée négative ⇒ fonction décroissante.` },
  { id: 'q-3-3', chapter: 3, q: R`La dérivée de $x^4$ est :`, choices: [R`$4x^3$`, R`$4x^4$`, R`$x^3$`, R`$3x^4$`], answer: 0, explain: R`$(x^n)'=n\,x^{n-1}$ avec $n=4$.` },

  // ── Chapitre 4 — Dérivation (non polynomiales) ───────────────────────
  { id: 'q-4-0', chapter: 4, q: R`La dérivée de $f(x)=\dfrac{1}{x}$ est :`, choices: [R`$-\dfrac{1}{x^2}$`, R`$\dfrac{1}{x^2}$`, R`$-\dfrac{1}{x}$`, R`$\ln x$`], answer: 0, explain: R`$\left(\dfrac1x\right)'=-\dfrac1{x^2}$.` },
  { id: 'q-4-1', chapter: 4, q: R`La dérivée de $\sqrt{x}$ est :`, choices: [R`$\dfrac{1}{2\sqrt{x}}$`, R`$\dfrac{1}{\sqrt{x}}$`, R`$2\sqrt{x}$`, R`$\dfrac{\sqrt{x}}{2}$`], answer: 0, explain: R`$(\sqrt x)'=\dfrac1{2\sqrt x}$ sur $]0;+\infty[$.` },
  { id: 'q-4-2', chapter: 4, q: R`La dérivée d'un produit $uv$ vaut :`, choices: [R`$u'v+uv'$`, R`$u'v'$`, R`$u'v-uv'$`, R`$\dfrac{u'}{v'}$`], answer: 0, explain: R`Formule du produit : $(uv)'=u'v+uv'$.` },
  { id: 'q-4-3', chapter: 4, q: R`La dérivée de $f(x)=\sqrt{3x+1}$ est :`, choices: [R`$\dfrac{3}{2\sqrt{3x+1}}$`, R`$\dfrac{1}{2\sqrt{3x+1}}$`, R`$\dfrac{3}{\sqrt{3x+1}}$`, R`$2\sqrt{3x+1}$`], answer: 0, explain: R`$x\mapsto g(ax+b)$ : dérivée $a\,g'(ax+b)$ avec $a=3$.` },

  // ── Chapitre 5 — Suites numériques ───────────────────────────────────
  { id: 'q-5-0', chapter: 5, q: R`Suite arithmétique $u_0=2$, $r=3$. $u_4=$ ?`, choices: ['14', '11', '12', '17'], answer: 0, explain: R`$u_4=u_0+4r=2+12=14$.` },
  { id: 'q-5-1', chapter: 5, q: R`Suite géométrique $u_0=5$, $q=2$. $u_3=$ ?`, choices: ['40', '30', '20', '80'], answer: 0, explain: R`$u_3=u_0\,q^3=5\times8=40$.` },
  { id: 'q-5-2', chapter: 5, q: R`$1+2+3+\dots+100$ vaut :`, choices: ['5050', '10100', '5000', '10000'], answer: 0, explain: R`$\dfrac{100\times101}{2}=5050$.` },
  { id: 'q-5-3', chapter: 5, q: R`Une suite vérifiant $u_{n+1}=u_n+5$ est :`, choices: ['arithmétique de raison 5', 'géométrique de raison 5', 'constante', 'décroissante'], answer: 0, explain: R`$u_{n+1}-u_n=5$ constant ⇒ arithmétique.` },

  // ── Chapitre 6 — Comportement d'une suite ────────────────────────────
  { id: 'q-6-0', chapter: 6, q: R`$\lim\limits_{n\to+\infty} q^n$ pour $q=0{,}5$ :`, choices: ['0', R`$+\infty$`, '1', '0,5'], answer: 0, explain: R`$-1<q<1$ ⇒ la limite est $0$.` },
  { id: 'q-6-1', chapter: 6, q: R`$\lim\limits_{n\to+\infty} q^n$ pour $q=2$ :`, choices: [R`$+\infty$`, '0', '1', '2'], answer: 0, explain: R`$q>1$ ⇒ la limite est $+\infty$.` },
  { id: 'q-6-2', chapter: 6, q: R`Suite géométrique $u_0=1$, $q=3$. Elle est :`, choices: ['croissante', 'décroissante', 'constante', 'alternée'], answer: 0, explain: R`$u_0>0$ et $q>1$ ⇒ croissante.` },
  { id: 'q-6-3', chapter: 6, q: R`$\lim\limits_{n\to+\infty}\dfrac{1}{n}$ vaut :`, choices: ['0', R`$+\infty$`, '1', "n'existe pas"], answer: 0, explain: R`$\dfrac1n\to 0$ quand $n\to+\infty$.` },

  // ── Chapitre 7 — Exponentielle ───────────────────────────────────────
  { id: 'q-7-0', chapter: 7, q: R`$e^a\times e^b$ vaut :`, choices: [R`$e^{a+b}$`, R`$e^{ab}$`, R`$e^a+e^b$`, R`$e^{a-b}$`], answer: 0, explain: R`Relation fonctionnelle : $e^{a+b}=e^a e^b$.` },
  { id: 'q-7-1', chapter: 7, q: R`La dérivée de $e^x$ est :`, choices: [R`$e^x$`, R`$x\,e^{x-1}$`, R`$\dfrac1{e^x}$`, R`$1$`], answer: 0, explain: R`L'exponentielle est sa propre dérivée.` },
  { id: 'q-7-2', chapter: 7, q: R`$\dfrac{e^5}{e^2}$ vaut :`, choices: [R`$e^3$`, R`$e^{7}$`, R`$e^{2{,}5}$`, R`$e^{10}$`], answer: 0, explain: R`$\dfrac{e^a}{e^b}=e^{a-b}=e^{3}$.` },
  { id: 'q-7-3', chapter: 7, q: R`Le signe de $e^x$ sur $\mathbb{R}$ est :`, choices: ['toujours strictement positif', 'toujours négatif', "positif puis négatif", "nul en 0"], answer: 0, explain: R`$e^x>0$ pour tout réel $x$.` },

  // ── Chapitre 8 — Trigonométrie ───────────────────────────────────────
  { id: 'q-8-0', chapter: 8, q: R`$\cos^2 x+\sin^2 x$ vaut :`, choices: ['1', '0', R`$2$`, R`$\cos(2x)$`], answer: 0, explain: R`Identité fondamentale : $\cos^2x+\sin^2x=1$.` },
  { id: 'q-8-1', chapter: 8, q: R`$\cos\dfrac{\pi}{3}$ vaut :`, choices: [R`$\dfrac12$`, R`$\dfrac{\sqrt2}{2}$`, R`$\dfrac{\sqrt3}{2}$`, R`$1$`], answer: 0, explain: R`Valeur remarquable : $\cos\frac\pi3=\frac12$.` },
  { id: 'q-8-2', chapter: 8, q: R`$\sin\dfrac{\pi}{2}$ vaut :`, choices: ['1', '0', R`$\dfrac{\sqrt2}{2}$`, R`-1`], answer: 0, explain: R`Au sommet du cercle : $\sin\frac\pi2=1$.` },
  { id: 'q-8-3', chapter: 8, q: R`$\cos(-x)$ est égal à :`, choices: [R`$\cos x$`, R`$-\cos x$`, R`$\sin x$`, R`$-\sin x$`], answer: 0, explain: R`Le cosinus est une fonction paire.` },

  // ── Chapitre 9 — Produit scalaire ────────────────────────────────────
  { id: 'q-9-0', chapter: 9, q: R`$\vec u\cdot\vec v=0$ signifie que $\vec u$ et $\vec v$ sont :`, choices: ['orthogonaux', 'colinéaires', 'égaux', 'opposés'], answer: 0, explain: R`Produit scalaire nul ⇔ vecteurs orthogonaux.` },
  { id: 'q-9-1', chapter: 9, q: R`$\vec u(2;3)\cdot\vec v(1;-1)$ vaut :`, choices: ['-1', '5', '1', '6'], answer: 0, explain: R`$2\times1+3\times(-1)=2-3=-1$.` },
  { id: 'q-9-2', chapter: 9, q: R`La norme de $\vec u(3;4)$ est :`, choices: ['5', '7', '25', R`$\sqrt7$`], answer: 0, explain: R`$\sqrt{3^2+4^2}=\sqrt{25}=5$.` },
  { id: 'q-9-3', chapter: 9, q: R`$\vec u\cdot\vec u$ est égal à :`, choices: [R`$\lVert\vec u\rVert^2$`, R`$\lVert\vec u\rVert$`, R`$0$`, R`$2\vec u$`], answer: 0, explain: R`$\vec u\cdot\vec u=\lVert\vec u\rVert^2$.` },

  // ── Chapitre 10 — Applications du produit scalaire ───────────────────
  { id: 'q-10-0', chapter: 10, q: R`Le cercle de centre $\Omega(1;-2)$ et de rayon $3$ a pour équation :`, choices: [R`$(x-1)^2+(y+2)^2=9$`, R`$(x+1)^2+(y-2)^2=9$`, R`$(x-1)^2+(y-2)^2=3$`, R`$(x-1)^2+(y+2)^2=3$`], answer: 0, explain: R`$(x-a)^2+(y-b)^2=R^2$ avec $a=1$, $b=-2$, $R^2=9$.` },
  { id: 'q-10-1', chapter: 10, q: R`Le théorème d'Al-Kashi donne $a^2=$`, choices: [R`$b^2+c^2-2bc\cos\widehat A$`, R`$b^2+c^2+2bc\cos\widehat A$`, R`$b^2-c^2$`, R`$b^2+c^2$`], answer: 0, explain: R`Généralisation de Pythagore avec l'angle $\widehat A$.` },
  { id: 'q-10-2', chapter: 10, q: R`Une droite de vecteur normal $\vec n(2;3)$ a une équation de la forme :`, choices: [R`$2x+3y+c=0$`, R`$3x+2y+c=0$`, R`$2x-3y+c=0$`, R`$-2x+3y+c=0$`], answer: 0, explain: R`Les coefficients de $x$ et $y$ sont les coordonnées du vecteur normal.` },

  // ── Chapitre 11 — Probabilités ───────────────────────────────────────
  { id: 'q-11-0', chapter: 11, q: R`La probabilité conditionnelle $P_A(B)$ vaut :`, choices: [R`$\dfrac{P(A\cap B)}{P(A)}$`, R`$\dfrac{P(A\cap B)}{P(B)}$`, R`$P(A)\times P(B)$`, R`$\dfrac{P(A)}{P(B)}$`], answer: 0, explain: R`Définition de la probabilité conditionnelle.` },
  { id: 'q-11-1', chapter: 11, q: R`Si $A$ et $B$ sont indépendants, $P(A\cap B)=$`, choices: [R`$P(A)\times P(B)$`, R`$P(A)+P(B)$`, R`$0$`, R`$P(A)$`], answer: 0, explain: R`Indépendance : la proba de l'intersection est le produit.` },
  { id: 'q-11-2', chapter: 11, q: R`L'espérance $E(X)$ d'une variable aléatoire vaut :`, choices: [R`$\sum x_i\,p_i$`, R`$\sum p_i$`, R`$\sum x_i$`, R`$\dfrac{\sum x_i}{n}$`], answer: 0, explain: R`Moyenne des valeurs pondérée par les probabilités.` },
  { id: 'q-11-3', chapter: 11, q: R`Sur un arbre pondéré, la probabilité d'un chemin s'obtient en :`, choices: ['multipliant les probabilités des branches', 'additionnant les branches', 'prenant la plus grande', 'divisant les branches'], answer: 0, explain: R`On multiplie le long du chemin (probabilités composées).` },
]

export function quizForChapter(ch: number): QuizQuestion[] {
  return QUIZZES.filter((q) => q.chapter === ch)
}
