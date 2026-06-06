# 📐 Maths Première Spé — Révision gamifiée

Application de révision pour le programme de **Mathématiques · Première Spécialité** (manuel **Belin** 2019), pensée pour un planning d'été intensif du **6 juin au 1ᵉʳ septembre 2026**.

L'ancien planning statique (un seul fichier HTML) a été transformé en une vraie application web moderne, interactive et **gamifiée**, pour rendre la révision agréable et motivante.

## ✨ Fonctionnalités

- **🏠 Tableau de bord** — compte à rebours, niveau, objectif quotidien (anneau de progression), série de jours, focus du jour, prochaine échéance.
- **📅 Planning 12 semaines** — tout le programme calé sur les pages exactes du manuel, avec cases à cocher, filtres par domaine et mise en avant de la semaine en cours.
- **🧠 Flashcards** — révision active des formules et théorèmes (rendu mathématique **KaTeX**), cartes retournables en 3D, système de répétition espacée (boîtes de Leitner).
- **✅ Quiz** — un QCM d'auto-évaluation par chapitre, correction immédiate et explications.
- **📊 Statistiques** — XP des 14 derniers jours, avancement par domaine, heatmap d'assiduité sur 10 semaines.
- **🏆 Gamification** — XP, **12 niveaux** à thème mathématique, séries (streaks), **22 succès** à débloquer (dont des secrets), confettis et sons de célébration.
- **⏱ Minuteur Pomodoro** — sessions de concentration (25/5, 50/10, 15/3) qui tournent même en changeant d'onglet, et rapportent de l'XP.
- **💾 Sauvegarde locale** — toute la progression est stockée dans le navigateur (aucune inscription).

## 🛠 Stack technique

| | |
|---|---|
| **Build** | [Vite](https://vite.dev) |
| **UI** | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| **Style** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **État** | [Zustand](https://zustand-demo.pmnd.rs) (avec persistance `localStorage`) |
| **Maths** | [KaTeX](https://katex.org) |
| **Icônes** | [Lucide](https://lucide.dev) |
| **Effets** | [canvas-confetti](https://www.kirilv.com/canvas-confetti/) + WebAudio (sons synthétisés, sans fichiers) |

## 🚀 Lancer le projet

```bash
npm install      # installer les dépendances
npm run dev      # serveur de développement (http://localhost:5173)
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build de production
```

## 📁 Structure

```
src/
├── data/            # curriculum, flashcards, quiz (contenu pédagogique)
├── lib/             # logique : niveaux/XP, succès, minuteur, sons, confettis, utilitaires
├── components/      # vues (Dashboard, Planning, Flashcards, Quiz, Stats, Achievements…)
│   └── ui/          # primitives réutilisables (Ring, Bar)
├── store.ts         # store Zustand — progression, XP, streak, succès
├── types.ts         # types partagés
└── index.css        # design system (tokens Tailwind v4)
legacy/              # ancien planning HTML d'origine (archivé)
```

---

*Objectif : prêt pour la Terminale.* 🎓
