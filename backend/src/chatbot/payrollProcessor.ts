interface PayrollResponse {
  reply: string;
  action: string;
  data: {
    brut?: number;
    net?: number;
    pays?: string;
  };
  lang: string;
}

// Taux d'imposition et charges sociales par pays (simplifiés pour l'exemple)
const COUNTRY_RATES = {
  benin: {
    tax: 0.25, // 25% d'impôts et charges
    name: {
      fr: 'Bénin',
      en: 'Benin'
    }
  },
  togo: {
    tax: 0.23, // 23% d'impôts et charges
    name: {
      fr: 'Togo',
      en: 'Togo'
    }
  },
  france: {
    tax: 0.45, // 45% d'impôts et charges
    name: {
      fr: 'France',
      en: 'France'
    }
  },
  usa: {
    tax: 0.30, // 30% d'impôts et charges
    name: {
      fr: 'États-Unis',
      en: 'USA'
    }
  }
};

// Expressions régulières pour extraire les montants et les pays
const amountRegex = /(\d+(?:\s*[k€$]|\s*euros?|\s*dollars?|\s*FCFA)?)/i;
const countryRegex = /(benin|bénin|togo|france|usa|états-unis)/i;

// Fonction pour normaliser le pays
function normalizeCountry(country: string): string {
  const lowercaseCountry = country.toLowerCase();
  if (lowercaseCountry.includes('benin') || lowercaseCountry.includes('bénin')) return 'benin';
  if (lowercaseCountry.includes('togo')) return 'togo';
  if (lowercaseCountry.includes('france')) return 'france';
  if (lowercaseCountry.includes('usa') || lowercaseCountry.includes('états-unis')) return 'usa';
  return 'benin'; // Par défaut
}

// Fonction pour parser le montant
function parseAmount(amountStr: string): number {
  const cleanAmount = amountStr.toLowerCase().replace(/\s+/g, '');
  let multiplier = 1;
  let baseAmount = cleanAmount;

  if (cleanAmount.includes('k')) {
    multiplier = 1000;
    baseAmount = cleanAmount.replace('k', '');
  }

  // Supprimer les symboles de devise
  baseAmount = baseAmount.replace(/[€$]|euros?|dollars?|fcfa/i, '');

  return parseFloat(baseAmount) * multiplier;
}

export async function processPayrollQuery(message: string, lang: string): Promise<PayrollResponse> {
  const lowercaseMessage = message.toLowerCase();
  
  // Extraction du montant
  const amountMatch = message.match(amountRegex);
  if (!amountMatch) {
    return {
      reply: lang === 'fr' 
        ? "Je n'ai pas pu identifier le montant. Pouvez-vous préciser le montant du salaire ?"
        : "I couldn't identify the amount. Could you specify the salary amount?",
      action: 'request_montant',
      data: {},
      lang
    };
  }

  // Extraction du pays
  const countryMatch = lowercaseMessage.match(countryRegex);
  if (!countryMatch) {
    return {
      reply: lang === 'fr'
        ? "Pour quel pays souhaitez-vous faire le calcul ? (Bénin, Togo, France, USA)"
        : "For which country would you like to calculate? (Benin, Togo, France, USA)",
      action: 'request_pays',
      data: {},
      lang
    };
  }

  const amount = parseAmount(amountMatch[1]);
  const country = normalizeCountry(countryMatch[1]);
  const countryData = COUNTRY_RATES[country];
  
  return {
    reply: getCalculationResponse(result.brut, result.net, country, lang),
    action: 'display_paie_result',
    data: {
      brut: result.brut,
      net: result.net,
      pays: country
    },
    lang
  };
}

// Fonction pour normaliser le montant
function parseAmount(amountStr: string): number {
  // Nettoyer la chaîne
  const cleanAmount = amountStr.replace(/[^0-9k]/gi, '');
  
  // Gérer les montants en "k"
  if (cleanAmount.toLowerCase().includes('k')) {
    return parseInt(cleanAmount.toLowerCase().replace('k', '')) * 1000;
  }
  
  return parseInt(cleanAmount);
}

// Fonction pour normaliser le nom du pays
function normalizeCountry(country: string): string {
  const countryMap: { [key: string]: string } = {
    'benin': 'benin',
    'bénin': 'benin',
    'togo': 'togo',
    'france': 'france',
    'usa': 'usa',
    'états-unis': 'usa'
  };
  
  return countryMap[country.toLowerCase()] || country.toLowerCase();
}

// Fonction pour calculer le salaire net
function calculateSalary(brutAmount: number, country: string): { brut: number; net: number } {
  let netRatio: number;
  
  switch (country) {
    case 'benin':
      netRatio = 0.85; // 15% de charges
      break;
    case 'togo':
      netRatio = 0.83; // 17% de charges
      break;
    case 'france':
      netRatio = 0.78; // 22% de charges
      break;
    case 'usa':
      netRatio = 0.80; // 20% de charges
      break;
    default:
      netRatio = 0.85;
  }
  
  return {
    brut: brutAmount,
    net: Math.round(brutAmount * netRatio)
  };
}

// Messages localisés
function getRequestAmountMessage(lang: string): string {
  const messages = {
    fr: "Quel est le montant du salaire brut que vous souhaitez calculer ?",
    en: "What is the gross salary amount you want to calculate?",
    es: "¿Cuál es el monto del salario bruto que desea calcular?"
  };
  return messages[lang] || messages.en;
}

function getRequestCountryMessage(lang: string): string {
  const messages = {
    fr: "Pour quel pays souhaitez-vous faire le calcul ? (Bénin, Togo, France, USA)",
    en: "For which country would you like to calculate? (Benin, Togo, France, USA)",
    es: "¿Para qué país desea hacer el cálculo? (Benin, Togo, Francia, EE.UU.)"
  };
  return messages[lang] || messages.en;
}

function getCalculationResponse(brut: number, net: number, country: string, lang: string): string {
  const currencySymbol = country === 'benin' || country === 'togo' ? 'FCFA' : 
                        country === 'france' ? '€' : '$';
  
  const messages = {
    fr: `Pour un salaire brut de ${brut.toLocaleString()} ${currencySymbol} au ${country}, 
         le salaire net estimé est de ${net.toLocaleString()} ${currencySymbol}.`,
    en: `For a gross salary of ${brut.toLocaleString()} ${currencySymbol} in ${country}, 
         the estimated net salary is ${net.toLocaleString()} ${currencySymbol}.`,
    es: `Para un salario bruto de ${brut.toLocaleString()} ${currencySymbol} en ${country}, 
         el salario neto estimado es de ${net.toLocaleString()} ${currencySymbol}.`
  };
  
  return messages[lang] || messages.en;
} 