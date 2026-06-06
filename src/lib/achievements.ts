import type { Achievement } from '../types'

/**
 * Succès débloquables. `check` reçoit un instantané de l'état et renvoie true
 * quand le succès est acquis. Les succès `secret` restent cachés tant que
 * non débloqués.
 */
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-step', name: 'Premier pas', desc: 'Valider ta toute première sous-partie', icon: '👣', check: (s) => s.doneTopics >= 1 },
  { id: 'warmup', name: 'Échauffement', desc: 'Valider 10 sous-parties', icon: '🔥', check: (s) => s.doneTopics >= 10 },
  { id: 'chapter-done', name: 'Chapitre bouclé', desc: 'Terminer un chapitre complet', icon: '📗', check: (s) => s.completedChapters >= 1 },
  { id: 'halfway', name: 'À mi-chemin', desc: 'Atteindre 50 % du programme', icon: '⛰️', check: (s) => s.totalTopics > 0 && s.doneTopics >= s.totalTopics / 2 },
  { id: 'all-topics', name: 'Programme conquis', desc: 'Valider 100 % des sous-parties', icon: '👑', check: (s) => s.totalTopics > 0 && s.doneTopics >= s.totalTopics },
  { id: 'all-chapters', name: 'Onze sur onze', desc: 'Terminer les 11 chapitres', icon: '🏆', check: (s) => s.completedChapters >= 11 },

  { id: 'streak-3', name: 'Régulier', desc: 'Réviser 3 jours d’affilée', icon: '📅', check: (s) => s.bestStreak >= 3 },
  { id: 'streak-7', name: 'Discipline', desc: 'Réviser 7 jours d’affilée', icon: '🗓️', check: (s) => s.bestStreak >= 7 },
  { id: 'streak-14', name: 'Marathonien', desc: 'Réviser 14 jours d’affilée', icon: '🏅', check: (s) => s.bestStreak >= 14 },

  { id: 'pomodoro-1', name: 'Concentration', desc: 'Terminer une session de focus', icon: '🍅', check: (s) => s.pomodoros >= 1 },
  { id: 'pomodoro-10', name: 'Dans la zone', desc: 'Terminer 10 sessions de focus', icon: '🎯', check: (s) => s.pomodoros >= 10 },
  { id: 'focus-600', name: 'Dix heures', desc: 'Cumuler 10 h de concentration', icon: '⏳', check: (s) => s.focusMinutes >= 600 },

  { id: 'flash-50', name: 'Mémoire vive', desc: 'Réviser 50 flashcards', icon: '🧠', check: (s) => s.flashcardsReviewed >= 50 },
  { id: 'quiz-1', name: 'Premier QCM', desc: 'Réussir un quiz', icon: '✅', check: (s) => s.quizzesPassed >= 1 },
  { id: 'quiz-perfect', name: 'Sans faute', desc: 'Réussir un quiz à 100 %', icon: '💯', check: (s) => s.perfectQuizzes >= 1 },
  { id: 'quiz-5', name: 'Quiz master', desc: 'Réussir 5 quiz', icon: '🎓', check: (s) => s.quizzesPassed >= 5 },

  { id: 'level-5', name: 'Calculateur', desc: 'Atteindre le niveau 5', icon: '⭐', check: (s) => s.level >= 5 },
  { id: 'level-10', name: 'Élite', desc: 'Atteindre le niveau 10', icon: '🌟', check: (s) => s.level >= 10 },
  { id: 'domain-master', name: 'Spécialiste', desc: 'Terminer tous les chapitres d’un domaine', icon: '🧭', check: (s) => s.domainsCompleted >= 1 },

  { id: 'early-bird', name: 'Lève-tôt', desc: 'Réviser avant 7 h du matin', icon: '🌅', check: (s) => s.studiedEarly, secret: true },
  { id: 'night-owl', name: 'Oiseau de nuit', desc: 'Réviser après 23 h', icon: '🦉', check: (s) => s.studiedLate, secret: true },
  { id: 'weekend', name: 'Pas de répit', desc: 'Réviser un week-end', icon: '☀️', check: (s) => s.weekendStudied, secret: true },
]
