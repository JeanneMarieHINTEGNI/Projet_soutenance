import { detectLanguage } from './languageDetector';
import { processPayrollQuery } from './payrollProcessor';

type SupportedLanguage = 'fr' | 'en';

interface ChatbotResponse {
  reply: string;
  action: string | null;
  data: {
    brut?: number;
    net?: number;
    pays?: string;
  };
  lang?: string;
}

interface KnowledgeBaseContent {
  features: {
    dashboard: string;
    employees: string;
    departments: string;
    reports: string;
    simulation: string;
  };
  help: {
    general: string;
    navigation: string;
    salary: string;
  };
}

type KnowledgeBase = {
  [K in SupportedLanguage]: KnowledgeBaseContent;
};

// Base de connaissances du chatbot
const knowledgeBase: KnowledgeBase = {
  fr: {
    features: {
      dashboard: "Le tableau de bord vous permet de visualiser les statistiques de votre entreprise, gérer vos employés et départements, et suivre la masse salariale.",
      employees: "La gestion des employés permet d'ajouter, modifier et supprimer des employés, gérer leurs salaires et avantages.",
      departments: "La gestion des départements permet d'organiser votre entreprise, suivre les budgets par département et gérer les effectifs.",
      reports: "Le module de rapports permet de générer des analyses détaillées sur la paie, les charges sociales et la répartition des salaires.",
      simulation: "Le simulateur de paie permet de calculer rapidement les salaires nets et les charges sociales pour différents pays."
    },
    help: {
      general: "Je peux vous aider avec :\n- Calculs de salaire\n- Informations sur les fonctionnalités\n- Navigation dans l'application\n- Questions sur la paie\n- Gestion des employés et départements",
      navigation: "Vous pouvez accéder aux différentes sections via le menu principal :\n- Tableau de bord\n- Gestion des employés\n- Gestion des départements\n- Rapports\n- Paramètres",
      salary: "Je peux vous aider à calculer les salaires nets et les charges sociales pour plusieurs pays (Bénin, Togo, France, USA)."
    }
  },
  en: {
    features: {
      dashboard: "The dashboard allows you to view company statistics, manage employees and departments, and track payroll.",
      employees: "Employee management allows you to add, modify and delete employees, manage their salaries and benefits.",
      departments: "Department management allows you to organize your company, track departmental budgets and manage workforce.",
      reports: "The reporting module generates detailed analyses of payroll, social charges and salary distribution.",
      simulation: "The payroll simulator quickly calculates net salaries and social charges for different countries."
    },
    help: {
      general: "I can help you with:\n- Salary calculations\n- Feature information\n- Application navigation\n- Payroll questions\n- Employee and department management",
      navigation: "You can access different sections via the main menu:\n- Dashboard\n- Employee management\n- Department management\n- Reports\n- Settings",
      salary: "I can help you calculate net salaries and social charges for several countries (Benin, Togo, France, USA)."
    }
  }
} as const;

export async function handleChatbotMessage(message: string): Promise<ChatbotResponse> {
  const detectedLang = detectLanguage(message);
  const lang = (detectedLang === 'fr' || detectedLang === 'en') ? detectedLang : 'en';
  const kb = knowledgeBase[lang];
  const lowercaseMessage = message.toLowerCase();
  
  // Vérification des questions sur les fonctionnalités
  if (lowercaseMessage.includes('fonctionnalité') || lowercaseMessage.includes('feature') || 
      lowercaseMessage.includes('que puis') || lowercaseMessage.includes('what can') ||
      lowercaseMessage.includes('aide') || lowercaseMessage.includes('help')) {
    return {
      reply: kb.help.general,
      action: 'guide_platform',
      data: {},
      lang
    };
  }

  // Questions sur le tableau de bord
  if (lowercaseMessage.includes('tableau de bord') || lowercaseMessage.includes('dashboard')) {
    return {
      reply: kb.features.dashboard,
      action: null,
      data: {},
      lang
    };
  }

  // Questions sur la gestion des employés
  if (lowercaseMessage.includes('employé') || lowercaseMessage.includes('employee') ||
      lowercaseMessage.includes('personnel') || lowercaseMessage.includes('staff')) {
    return {
      reply: kb.features.employees,
      action: null,
      data: {},
      lang
    };
  }

  // Questions sur les départements
  if (lowercaseMessage.includes('département') || lowercaseMessage.includes('department') ||
      lowercaseMessage.includes('service')) {
    return {
      reply: kb.features.departments,
      action: null,
      data: {},
      lang
    };
  }

  // Questions sur les rapports
  if (lowercaseMessage.includes('rapport') || lowercaseMessage.includes('report') ||
      lowercaseMessage.includes('statistique') || lowercaseMessage.includes('statistic')) {
    return {
      reply: kb.features.reports,
      action: null,
      data: {},
      lang
    };
  }

  // Questions sur la navigation
  if (lowercaseMessage.includes('navigation') || lowercaseMessage.includes('menu') ||
      lowercaseMessage.includes('trouver') || lowercaseMessage.includes('find')) {
    return {
      reply: kb.help.navigation,
      action: null,
      data: {},
      lang
    };
  }

  // Questions sur le calcul de salaire
  if (lowercaseMessage.includes('calcul') || lowercaseMessage.includes('salaire') || 
      lowercaseMessage.includes('calculate') || lowercaseMessage.includes('salary') ||
      lowercaseMessage.includes('paie') || lowercaseMessage.includes('payroll')) {
    
    // Si la question est générale sur le calcul de salaire
    if (!lowercaseMessage.match(/\d+/)) {
      return {
        reply: kb.help.salary,
        action: null,
        data: {},
        lang
      };
    }
    
    // Si la question contient un montant, utiliser le processeur de paie
    return await processPayrollQuery(message, lang);
  }

  // Réponse par défaut
  const defaultResponses: Record<SupportedLanguage, string> = {
    fr: "Je suis là pour vous aider avec la gestion de la paie et des employés. Vous pouvez me poser des questions sur :\n" +
        "- Le calcul des salaires\n" +
        "- Les fonctionnalités de la plateforme\n" +
        "- La gestion des employés et départements\n" +
        "- Les rapports et statistiques",
    en: "I'm here to help you with payroll and employee management. You can ask me about:\n" +
        "- Salary calculations\n" +
        "- Platform features\n" +
        "- Employee and department management\n" +
        "- Reports and statistics"
  };

  return {
    reply: defaultResponses[lang],
    action: null,
    data: {},
    lang
  };
} 