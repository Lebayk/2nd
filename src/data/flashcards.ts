import type { Flashcard } from '../types'

const R = String.raw

/**
 * Flashcards de révision active par chapitre.
 * Le texte peut contenir des maths entre $...$ (KaTeX) et du code entre `backticks`.
 */
export const FLASHCARDS: Flashcard[] = [
  // ── Chapitre 1 — Algorithmique & Python ──────────────────────────────
  { id: 'f-1-0', chapter: 1, front: 'Boucle qui répète 5 fois en Python ?', back: '`for i in range(5):` — `range(5)` parcourt 0,1,2,3,4.' },
  { id: 'f-1-1', chapter: 1, front: 'Boucle « tant que `u < 1000` » ?', back: '`while u < 1000:` — on répète tant que la condition reste vraie.' },
  { id: 'f-1-2', chapter: 1, front: 'Structure conditionnelle complète ?', back: '`if cond:` … `elif autre:` … `else:`' },
  { id: 'f-1-3', chapter: 1, front: 'Liste des carrés de 0 à 9 (en compréhension) ?', back: '`[k**2 for k in range(10)]`' },
  { id: 'f-1-4', chapter: 1, front: 'Ajouter `x` à la fin de la liste `L` ?', back: '`L.append(x)`' },
  { id: 'f-1-5', chapter: 1, front: 'Longueur de `L` ? Dernier élément ?', back: '`len(L)` et `L[-1]`' },

  // ── Chapitre 2 — Second degré ────────────────────────────────────────
  { id: 'f-2-0', chapter: 2, front: R`Forme canonique de $f(x)=ax^2+bx+c$ ?`, back: R`$f(x)=a(x-\alpha)^2+\beta$ avec $\alpha=-\dfrac{b}{2a}$ et $\beta=f(\alpha)$.` },
  { id: 'f-2-1', chapter: 2, front: 'Discriminant ?', back: R`$\Delta = b^2-4ac$` },
  { id: 'f-2-2', chapter: 2, front: R`Racines lorsque $\Delta>0$ ?`, back: R`$x_{1,2}=\dfrac{-b\pm\sqrt{\Delta}}{2a}$ — deux racines distinctes.` },
  { id: 'f-2-3', chapter: 2, front: R`Nombre de racines selon $\Delta$ ?`, back: R`$\Delta>0$ : 2 · $\Delta=0$ : 1 (double, $-\dfrac{b}{2a}$) · $\Delta<0$ : 0.` },
  { id: 'f-2-4', chapter: 2, front: R`Forme factorisée si $\Delta>0$ ?`, back: R`$f(x)=a(x-x_1)(x-x_2)$` },
  { id: 'f-2-5', chapter: 2, front: R`Signe de $ax^2+bx+c$ (cas $\Delta>0$) ?`, back: R`Signe de $a$ à l'extérieur des racines, signe de $-a$ entre les racines.`, hint: 'Pense à la parabole.' },
  { id: 'f-2-6', chapter: 2, front: 'Coordonnées du sommet ?', back: R`$S\left(-\dfrac{b}{2a}\,;\ f\!\left(-\dfrac{b}{2a}\right)\right)$` },
  { id: 'f-2-7', chapter: 2, front: 'Somme et produit des racines ?', back: R`$x_1+x_2=-\dfrac{b}{a}$ et $x_1 x_2=\dfrac{c}{a}$` },

  // ── Chapitre 3 — Dérivation (polynômes) ──────────────────────────────
  { id: 'f-3-0', chapter: 3, front: R`Définition du nombre dérivé en $a$ ?`, back: R`$f'(a)=\lim\limits_{h\to 0}\dfrac{f(a+h)-f(a)}{h}$` },
  { id: 'f-3-1', chapter: 3, front: R`Équation de la tangente en $a$ ?`, back: R`$y=f'(a)(x-a)+f(a)$`, hint: 'Pente = nombre dérivé.' },
  { id: 'f-3-2', chapter: 3, front: R`Dérivée de $x^n$ ?`, back: R`$(x^n)'=n\,x^{n-1}$` },
  { id: 'f-3-3', chapter: 3, front: R`Dérivée de $x^2$ ? de $x^3$ ?`, back: R`$2x$ et $3x^2$` },
  { id: 'f-3-4', chapter: 3, front: R`Dérivée de $ax+b$ ? d'une constante ?`, back: R`$a$ et $0$` },
  { id: 'f-3-5', chapter: 3, front: 'Lien signe de la dérivée / variations ?', back: R`$f'>0$ sur $I\Rightarrow f$ croissante ; $f'<0\Rightarrow$ décroissante.` },
  { id: 'f-3-6', chapter: 3, front: R`Que se passe-t-il là où $f'$ s'annule en changeant de signe ?`, back: R`$f$ y admet un extremum local (max ou min).` },

  // ── Chapitre 4 — Dérivation (non polynomiales) ───────────────────────
  { id: 'f-4-0', chapter: 4, front: R`Dérivée de $\dfrac{1}{x}$ ?`, back: R`$-\dfrac{1}{x^2}$ (sur $\mathbb{R}^*$)` },
  { id: 'f-4-1', chapter: 4, front: R`Dérivée de $\sqrt{x}$ ?`, back: R`$\dfrac{1}{2\sqrt{x}}$ (sur $]0;+\infty[$)` },
  { id: 'f-4-2', chapter: 4, front: R`Dérivée d'un produit $uv$ ?`, back: R`$(uv)'=u'v+uv'$` },
  { id: 'f-4-3', chapter: 4, front: R`Dérivée d'un quotient $\dfrac{u}{v}$ ?`, back: R`$\left(\dfrac{u}{v}\right)'=\dfrac{u'v-uv'}{v^2}$` },
  { id: 'f-4-4', chapter: 4, front: R`Dérivée de $\dfrac{1}{v}$ ?`, back: R`$-\dfrac{v'}{v^2}$` },
  { id: 'f-4-5', chapter: 4, front: R`Dérivée de $x\mapsto g(ax+b)$ ?`, back: R`$a\,g'(ax+b)$` },

  // ── Chapitre 5 — Suites numériques ───────────────────────────────────
  { id: 'f-5-0', chapter: 5, front: R`Terme général d'une suite arithmétique de raison $r$ ?`, back: R`$u_n=u_0+nr$  (ou $u_n=u_p+(n-p)r$)` },
  { id: 'f-5-1', chapter: 5, front: R`Terme général d'une suite géométrique de raison $q$ ?`, back: R`$u_n=u_0\times q^{\,n}$` },
  { id: 'f-5-2', chapter: 5, front: 'Reconnaître une suite arithmétique ?', back: R`$u_{n+1}-u_n=r$ constant.` },
  { id: 'f-5-3', chapter: 5, front: 'Reconnaître une suite géométrique ?', back: R`$\dfrac{u_{n+1}}{u_n}=q$ constant.` },
  { id: 'f-5-4', chapter: 5, front: R`Somme $1+2+\dots+n$ ?`, back: R`$\dfrac{n(n+1)}{2}$` },
  { id: 'f-5-5', chapter: 5, front: R`Somme $1+q+q^2+\dots+q^n$ ($q\neq1$) ?`, back: R`$\dfrac{1-q^{\,n+1}}{1-q}$` },

  // ── Chapitre 6 — Comportement d'une suite ────────────────────────────
  { id: 'f-6-0', chapter: 6, front: 'Suite croissante ?', back: R`$u_{n+1}\ge u_n$ pour tout $n$  (ou $u_{n+1}-u_n\ge0$).` },
  { id: 'f-6-1', chapter: 6, front: R`Variation de $u_n=u_0 q^n$ avec $u_0>0$ ?`, back: R`$q>1$ : croissante · $0<q<1$ : décroissante.` },
  { id: 'f-6-2', chapter: 6, front: R`Limite de $q^n$ si $q>1$ ?`, back: R`$+\infty$` },
  { id: 'f-6-3', chapter: 6, front: R`Limite de $q^n$ si $-1<q<1$ ?`, back: R`$0$` },
  { id: 'f-6-4', chapter: 6, front: R`Limites de $\dfrac1n$, $\dfrac1{n^2}$, $\dfrac1{\sqrt n}$ ?`, back: R`Toutes tendent vers $0$.` },
  { id: 'f-6-5', chapter: 6, front: R`Limites de $n$, $n^2$, $\sqrt n$ ?`, back: R`Toutes tendent vers $+\infty$.` },

  // ── Chapitre 7 — Exponentielle ───────────────────────────────────────
  { id: 'f-7-0', chapter: 7, front: 'Relation fonctionnelle de l’exponentielle ?', back: R`$e^{a+b}=e^a\times e^b$` },
  { id: 'f-7-1', chapter: 7, front: R`$e^0$ ? $e^1$ ?`, back: R`$e^0=1$ et $e^1=e\approx 2{,}718$` },
  { id: 'f-7-2', chapter: 7, front: R`Dérivée de $e^x$ ?`, back: R`$(e^x)'=e^x$` },
  { id: 'f-7-3', chapter: 7, front: R`$e^{-x}$ ? $\dfrac{e^a}{e^b}$ ?`, back: R`$e^{-x}=\dfrac1{e^x}$ et $\dfrac{e^a}{e^b}=e^{a-b}$` },
  { id: 'f-7-4', chapter: 7, front: R`$(e^x)^n$ ?`, back: R`$e^{nx}$` },
  { id: 'f-7-5', chapter: 7, front: R`Signe et variations de $x\mapsto e^x$ ?`, back: R`Toujours $>0$, strictement croissante sur $\mathbb{R}$.` },

  // ── Chapitre 8 — Trigonométrie ───────────────────────────────────────
  { id: 'f-8-0', chapter: 8, front: R`$\cos^2 x+\sin^2 x$ ?`, back: R`$=1$` },
  { id: 'f-8-1', chapter: 8, front: R`$\cos\frac{\pi}{4}=\sin\frac{\pi}{4}$ ?`, back: R`$\dfrac{\sqrt2}{2}$` },
  { id: 'f-8-2', chapter: 8, front: R`$\cos\frac{\pi}{3}$ ? $\sin\frac{\pi}{6}$ ?`, back: R`$\dfrac12$ pour les deux.` },
  { id: 'f-8-3', chapter: 8, front: R`$\cos\frac{\pi}{6}$ ? $\sin\frac{\pi}{3}$ ?`, back: R`$\dfrac{\sqrt3}{2}$ pour les deux.` },
  { id: 'f-8-4', chapter: 8, front: R`$\cos(-x)$ et $\sin(-x)$ ?`, back: R`$\cos(-x)=\cos x$ (pair) · $\sin(-x)=-\sin x$ (impair)` },
  { id: 'f-8-5', chapter: 8, front: R`$\cos(\pi-x)$ ? $\sin(\pi-x)$ ?`, back: R`$-\cos x$ et $\sin x$` },
  { id: 'f-8-6', chapter: 8, front: R`Conversion : $180^\circ$ en radians ?`, back: R`$\pi$ rad` },

  // ── Chapitre 9 — Produit scalaire ────────────────────────────────────
  { id: 'f-9-0', chapter: 9, front: 'Produit scalaire avec normes et angle ?', back: R`$\vec u\cdot\vec v=\lVert\vec u\rVert\,\lVert\vec v\rVert\cos\theta$` },
  { id: 'f-9-1', chapter: 9, front: 'Expression analytique (coordonnées) ?', back: R`$\vec u\cdot\vec v=xx'+yy'$` },
  { id: 'f-9-2', chapter: 9, front: R`$\vec u\cdot\vec u$ ?`, back: R`$\lVert\vec u\rVert^2$` },
  { id: 'f-9-3', chapter: 9, front: 'Critère d’orthogonalité ?', back: R`$\vec u\perp\vec v \iff \vec u\cdot\vec v=0$` },
  { id: 'f-9-4', chapter: 9, front: R`Norme d'un vecteur $\vec u(x;y)$ ?`, back: R`$\lVert\vec u\rVert=\sqrt{x^2+y^2}$` },
  { id: 'f-9-5', chapter: 9, front: 'Projeté orthogonal (H projeté de C sur (AB)) ?', back: R`$\vec{AB}\cdot\vec{AC}=\vec{AB}\cdot\vec{AH}$` },

  // ── Chapitre 10 — Applications du produit scalaire ───────────────────
  { id: 'f-10-0', chapter: 10, front: R`Vecteur normal $\vec n(a;b)$ → équation de droite ?`, back: R`$ax+by+c=0$` },
  { id: 'f-10-1', chapter: 10, front: R`Cercle de centre $\Omega(a;b)$, rayon $R$ ?`, back: R`$(x-a)^2+(y-b)^2=R^2$` },
  { id: 'f-10-2', chapter: 10, front: 'Théorème d’Al-Kashi ?', back: R`$a^2=b^2+c^2-2bc\cos\widehat A$` },
  { id: 'f-10-3', chapter: 10, front: 'Aire d’un triangle avec un angle ?', back: R`$\mathcal{A}=\dfrac12\,bc\sin\widehat A$` },
  { id: 'f-10-4', chapter: 10, front: R`Cercle de diamètre $[AB]$ (par prod. scalaire) ?`, back: R`$M$ est sur le cercle $\iff \vec{MA}\cdot\vec{MB}=0$` },

  // ── Chapitre 11 — Probabilités ───────────────────────────────────────
  { id: 'f-11-0', chapter: 11, front: R`Probabilité conditionnelle $P_A(B)$ ?`, back: R`$P_A(B)=\dfrac{P(A\cap B)}{P(A)}$  (avec $P(A)\neq0$)` },
  { id: 'f-11-1', chapter: 11, front: R`Probabilités totales (avec $A$ et $\bar A$) ?`, back: R`$P(B)=P(A\cap B)+P(\bar A\cap B)$` },
  { id: 'f-11-2', chapter: 11, front: 'Événements indépendants ?', back: R`$P(A\cap B)=P(A)\times P(B)$` },
  { id: 'f-11-3', chapter: 11, front: 'Espérance d’une variable aléatoire ?', back: R`$E(X)=\sum x_i\,p_i$` },
  { id: 'f-11-4', chapter: 11, front: 'Variance (König-Huygens) ?', back: R`$V(X)=E(X^2)-\big(E(X)\big)^2$` },
  { id: 'f-11-5', chapter: 11, front: 'Écart-type ?', back: R`$\sigma(X)=\sqrt{V(X)}$` },
  { id: 'f-11-6', chapter: 11, front: 'Arbre pondéré : probabilité d’un chemin ?', back: 'On multiplie les probabilités le long des branches.' },
]

export function flashcardsForChapter(ch: number): Flashcard[] {
  return FLASHCARDS.filter((f) => f.chapter === ch)
}
