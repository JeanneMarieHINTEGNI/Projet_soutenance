type SupportedLanguage = 'fr' | 'en';

const languageKeywords: Record<SupportedLanguage, string[]> = {
  fr: [
    'bonjour', 'salut', 'merci', 'calcul', 'salaire', 'paie', 'combien',
    'entreprise', 'employé', 'département', 'rapport', 'tableau', 'bord',
    'aide', 'comment', 'puis', 'faire', 'voir', 'montrer', 'afficher',
    'bénin', 'togo', 'france', 'euros', 'fcfa'
  ],
  en: [
    'hello', 'hi', 'thanks', 'thank', 'calculate', 'salary', 'payroll',
    'how', 'much', 'company', 'employee', 'department', 'report', 'dashboard',
    'help', 'can', 'show', 'display', 'view', 'see', 'benin', 'togo',
    'france', 'dollars', 'usd'
  ]
};

export function detectLanguage(message: string): SupportedLanguage {
  const lowercaseMessage = message.toLowerCase();
  let scores: Record<SupportedLanguage, number> = {
    fr: 0,
    en: 0
  };

  // Calcul du score pour chaque langue
  Object.entries(languageKeywords).forEach(([lang, keywords]) => {
    const langScore = keywords.reduce((count, keyword) => {
      return count + (lowercaseMessage.includes(keyword) ? 1 : 0);
    }, 0);
    scores[lang as SupportedLanguage] = langScore;
  });

  // Si aucun mot-clé n'est trouvé ou si les scores sont égaux, utiliser l'anglais par défaut
  if (scores.fr === scores.en) {
    return 'en';
  }

  // Retourner la langue avec le score le plus élevé
  return scores.fr > scores.en ? 'fr' : 'en';
} 