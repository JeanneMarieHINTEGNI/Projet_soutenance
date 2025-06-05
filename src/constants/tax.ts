// Constantes pour les calculs des frais professionnels
export const FRAIS_PRO_RATE = 0.20; // 20% pour frais professionnels
export const FRAIS_PRO_PLAFOND_MENSUEL = 84334; // Plafond mensuel exact pour le Togo

// Constantes CNSS et AMU Togo 2024-2025
export const TOGO = {
  CNSS_SALARIAL: {
    PENSION: 0.04,    // 4% pension vieillesse
    AMU: 0.05,       // 5% assurance maladie (INAM)
    AUTRES: 0.0068,  // 0.68% autres rubriques
    TOTAL: 0.0968    // 9.68% au total
  },
  CNSS_PATRONAL: {
    PENSION: 0.125,    // 12.5% pension vieillesse
    PF: 0.03,         // 3% prestations familiales
    AT: 0.02,         // 2% accidents du travail/risques professionnels
    AMU: 0.05,        // 5% assurance maladie
    TOTAL: 0.225      // 22.5% au total
  },
  IRPP_TRANCHES: [
    { min: 0, max: 60000, taux: 0 },
    { min: 60001, max: 150000, taux: 0.10 },
    { min: 150001, max: 300000, taux: 0.15 },
    { min: 300001, max: 500000, taux: 0.20 },
    { min: 500001, max: 800000, taux: 0.25 },
    { min: 800001, max: Infinity, taux: 0.30 }
  ]
};

// Constantes CNSS Bénin 2025
export const BENIN = {
  CNSS_SALARIAL: 0.036, // 3.6%
  CNSS_PATRONAL: 0.154, // 15.4% (6.4% vieillesse + 9% PF + 0.5% AT)
  ITS_TRANCHES: [
    { min: 0, max: 60000, taux: 0 },
    { min: 60001, max: 150000, taux: 0.10 },
    { min: 150001, max: 250000, taux: 0.15 },
    { min: 250001, max: 500000, taux: 0.19 },
    { min: 500001, max: Infinity, taux: 0.30 }
  ]
};

// Fonction pour calculer l'IRPP au Togo avec la méthode par tranches
export const calculateIRPPTogo = (baseImposable: number): number => {
  let irpp = 0;
  
  for (const tranche of TOGO.IRPP_TRANCHES) {
    if (baseImposable > tranche.min) {
      const montantDansLaTranche = Math.min(
        baseImposable - tranche.min,
        tranche.max - tranche.min
      );
      irpp += montantDansLaTranche * tranche.taux;
    }
  }
  
  return Math.round(irpp);
};

// Fonction pour calculer la CNSS
export const calculateCNSS = (salaireBrut: number, country: string) => {
  if (country === "benin") {
    return Math.round(salaireBrut * BENIN.CNSS_SALARIAL);
  } else {
    // Pour le Togo, on calcule la CNSS totale (9.68%)
    return Math.round(salaireBrut * TOGO.CNSS_SALARIAL.TOTAL);
  }
};

// Fonction pour calculer les frais professionnels
export const calculateFraisPro = (salaireBrut: number, cotisationsSociales: number) => {
  if (salaireBrut <= 0) return 0;
  
  // Pour le Togo : 20% du (brut - cotisations), plafonné à 84 334 FCFA
  const baseCalculFrais = salaireBrut - cotisationsSociales;
  const fraisPro = baseCalculFrais * FRAIS_PRO_RATE;
  return Math.round(Math.min(fraisPro, FRAIS_PRO_PLAFOND_MENSUEL));
};

// Fonction pour calculer les charges patronales au Togo
export const calculateChargesPatronalesTogo = (salaireBrut: number) => {
  const totalCharges = salaireBrut * TOGO.CNSS_PATRONAL.TOTAL;
  
  return {
    pension: Math.round(salaireBrut * TOGO.CNSS_PATRONAL.PENSION),
    pf: Math.round(salaireBrut * TOGO.CNSS_PATRONAL.PF),
    at: Math.round(salaireBrut * TOGO.CNSS_PATRONAL.AT),
    amu: Math.round(salaireBrut * TOGO.CNSS_PATRONAL.AMU),
    total: Math.round(totalCharges)
  };
};

// Fonction pour calculer l'ITS détaillé au Bénin
const calculateDetailedITSBenin = (baseImposable: number) => {
  let its = 0;
  let details = {
    tranche1: 0, // 0-60000 : 0%
    tranche2: 0, // 60001-150000 : 10%
    tranche3: 0, // 150001-250000 : 15%
    tranche4: 0, // 250001-500000 : 19%
    tranche5: 0  // >500000 : 30%
  };

  // Tranche 1 : 0 à 60 000 FCFA (0%)
  details.tranche1 = 0;

  // Tranche 2 : 60 001 à 150 000 FCFA (10%)
  if (baseImposable > 60000) {
    const montantTranche2 = Math.min(150000 - 60000, Math.max(0, baseImposable - 60000));
    details.tranche2 = montantTranche2 * 0.10;
    its += details.tranche2;
  }

  // Tranche 3 : 150 001 à 250 000 FCFA (15%)
  if (baseImposable > 150000) {
    const montantTranche3 = Math.min(250000 - 150000, Math.max(0, baseImposable - 150000));
    details.tranche3 = montantTranche3 * 0.15;
    its += details.tranche3;
  }

  // Tranche 4 : 250 001 à 500 000 FCFA (19%)
  if (baseImposable > 250000) {
    const montantTranche4 = Math.min(500000 - 250000, Math.max(0, baseImposable - 250000));
    details.tranche4 = montantTranche4 * 0.19;
    its += details.tranche4;
  }

  // Tranche 5 : Au-delà de 500 000 FCFA (30%)
  if (baseImposable > 500000) {
    const montantTranche5 = baseImposable - 500000;
    details.tranche5 = montantTranche5 * 0.30;
    its += details.tranche5;
  }

  return {
    total: Math.round(its),
    details: {
      tranche1: Math.round(details.tranche1),
      tranche2: Math.round(details.tranche2),
      tranche3: Math.round(details.tranche3),
      tranche4: Math.round(details.tranche4),
      tranche5: Math.round(details.tranche5)
    }
  };
};

// Export de la version simple de calculateITSBenin pour la compatibilité
export const calculateITSBenin = (baseImposable: number): number => {
  return calculateDetailedITSBenin(baseImposable).total;
};

// Fonction pour calculer le salaire brut à partir du net souhaité au Bénin
export const calculateNetToBrutBenin = (salaireNetSouhaite: number): { 
  salaireBrut: number;
  details: {
    cnss: number;
    its: {
      total: number;
      details: {
        tranche1: number;
        tranche2: number;
        tranche3: number;
        tranche4: number;
        tranche5: number;
      };
    };
    salaireNet: number;
  };
} => {
  // Estimation initiale du brut basée sur le net
  // On commence avec une estimation de 120% du net souhaité
  let salaireBrut = salaireNetSouhaite * 1.20;
  let meilleurBrut = salaireBrut;
  let meilleureDifference = Infinity;
  let meilleursDetails = null;
  
  // Nombre maximum d'itérations pour éviter une boucle infinie
  const maxIterations = 20;
  let iteration = 0;
  
  while (iteration < maxIterations) {
    // 1. Calcul CNSS (3.6%)
    const cnss = Math.round(salaireBrut * BENIN.CNSS_SALARIAL);
    
    // 2. Base imposable pour l'ITS (pas d'abattement pour frais professionnels)
    const baseImposableITS = salaireBrut;
    
    // 3. Calcul détaillé de l'ITS
    const itsResultat = calculateDetailedITSBenin(baseImposableITS);
    
    // 4. Calcul du net obtenu
    const netObtenu = salaireBrut - cnss - itsResultat.total;
    
    // 5. Calcul de la différence avec le net souhaité
    const difference = Math.abs(netObtenu - salaireNetSouhaite);
    
    // Si on a trouvé une meilleure approximation
    if (difference < meilleureDifference) {
      meilleurBrut = salaireBrut;
      meilleureDifference = difference;
      meilleursDetails = {
        cnss,
        its: itsResultat,
        salaireNet: netObtenu
      };
    }
    
    // Si on est assez proche du net souhaité (marge d'erreur de 1 FCFA)
    if (difference < 1) {
      break;
    }
    
    // Ajustement du brut pour la prochaine itération
    // On utilise un facteur d'ajustement plus précis basé sur les taux effectifs
    const tauxPrelevementEffectif = (cnss + itsResultat.total) / salaireBrut;
    const ajustement = (salaireNetSouhaite - netObtenu) / (1 - tauxPrelevementEffectif);
    
    // Ajustement plus contrôlé pour éviter les oscillations
    salaireBrut += ajustement * 0.8; // Facteur de 0.8 pour une convergence plus stable
    
    iteration++;
  }
  
  return {
    salaireBrut: Math.round(meilleurBrut),
    details: meilleursDetails
  };
};

// Fonction pour calculer l'IRPP détaillé au Togo
const calculateDetailedIRPPTogo = (baseImposable: number) => {
  let irpp = 0;
  let details = {
    tranche1: 0, // 0-50000 : 0%
    tranche2: 0, // 50001-120000 : 10%
    tranche3: 0, // 120001-250000 : 15%
    tranche4: 0, // 250001-400000 : 20%
    tranche5: 0, // 400001-750000 : 25%
    tranche6: 0  // >750000 : 30%
  };

  // Tranche 1 : 0 à 50 000 FCFA (0%)
  details.tranche1 = 0;

  // Tranche 2 : 50 001 à 120 000 FCFA (10%)
  if (baseImposable > 50000) {
    const montantTranche2 = Math.min(120000 - 50000, Math.max(0, baseImposable - 50000));
    details.tranche2 = montantTranche2 * 0.10;
    irpp += details.tranche2;
  }

  // Tranche 3 : 120 001 à 250 000 FCFA (15%)
  if (baseImposable > 120000) {
    const montantTranche3 = Math.min(250000 - 120000, Math.max(0, baseImposable - 120000));
    details.tranche3 = montantTranche3 * 0.15;
    irpp += details.tranche3;
  }

  // Tranche 4 : 250 001 à 400 000 FCFA (20%)
  if (baseImposable > 250000) {
    const montantTranche4 = Math.min(400000 - 250000, Math.max(0, baseImposable - 250000));
    details.tranche4 = montantTranche4 * 0.20;
    irpp += details.tranche4;
  }

  // Tranche 5 : 400 001 à 750 000 FCFA (25%)
  if (baseImposable > 400000) {
    const montantTranche5 = Math.min(750000 - 400000, Math.max(0, baseImposable - 400000));
    details.tranche5 = montantTranche5 * 0.25;
    irpp += details.tranche5;
  }

  // Tranche 6 : Au-delà de 750 000 FCFA (30%)
  if (baseImposable > 750000) {
    const montantTranche6 = baseImposable - 750000;
    details.tranche6 = montantTranche6 * 0.30;
    irpp += details.tranche6;
  }

  return {
    total: Math.round(irpp),
    details: {
      tranche1: Math.round(details.tranche1),
      tranche2: Math.round(details.tranche2),
      tranche3: Math.round(details.tranche3),
      tranche4: Math.round(details.tranche4),
      tranche5: Math.round(details.tranche5),
      tranche6: Math.round(details.tranche6)
    }
  };
};

// Fonction pour calculer le salaire brut à partir du net souhaité au Togo
export const calculateNetToBrutTogo = (salaireNetSouhaite: number): { 
  salaireBrut: number;
  details: {
    cnss: number;
    amu: number;
    fraisPro: number;
    baseImposable: number;
    irpp: {
      total: number;
      details: {
        tranche1: number;
        tranche2: number;
        tranche3: number;
        tranche4: number;
        tranche5: number;
        tranche6: number;
      };
    };
    salaireNet: number;
  };
} => {
  // Estimation initiale du brut basée sur le net
  // On commence avec une estimation de 130% du net souhaité pour tenir compte de toutes les charges
  let salaireBrut = salaireNetSouhaite * 1.30;
  let meilleurBrut = salaireBrut;
  let meilleureDifference = Infinity;
  let meilleursDetails = null;
  
  // Nombre maximum d'itérations pour éviter une boucle infinie
  const maxIterations = 20;
  let iteration = 0;
  
  while (iteration < maxIterations) {
    // 1. Calcul CNSS (4%)
    const cnss = Math.round(salaireBrut * TOGO.CNSS_SALARIAL.PENSION);
    
    // 2. Calcul AMU (5%)
    const amu = Math.round(salaireBrut * TOGO.CNSS_SALARIAL.AMU);
    
    // 3. Calcul des frais professionnels (10% du brut)
    const fraisPro = Math.round(salaireBrut * 0.10);
    
    // 4. Base imposable pour l'IRPP (après déduction des frais pro)
    const baseImposable = salaireBrut - fraisPro;
    
    // 5. Calcul détaillé de l'IRPP
    const irppResultat = calculateDetailedIRPPTogo(baseImposable);
    
    // 6. Calcul du net obtenu
    const netObtenu = salaireBrut - cnss - amu - irppResultat.total;
    
    // 7. Calcul de la différence avec le net souhaité
    const difference = Math.abs(netObtenu - salaireNetSouhaite);
    
    // Si on a trouvé une meilleure approximation
    if (difference < meilleureDifference) {
      meilleurBrut = salaireBrut;
      meilleureDifference = difference;
      meilleursDetails = {
        cnss,
        amu,
        fraisPro,
        baseImposable,
        irpp: irppResultat,
        salaireNet: netObtenu
      };
    }
    
    // Si on est assez proche du net souhaité (marge d'erreur de 1 FCFA)
    if (difference < 1) {
      break;
    }
    
    // Ajustement du brut pour la prochaine itération
    // On utilise un facteur d'ajustement plus précis basé sur les taux effectifs
    const tauxPrelevementEffectif = (cnss + amu + irppResultat.total) / salaireBrut;
    const ajustement = (salaireNetSouhaite - netObtenu) / (1 - tauxPrelevementEffectif);
    
    // Ajustement plus contrôlé pour éviter les oscillations
    salaireBrut += ajustement * 0.8; // Facteur de 0.8 pour une convergence plus stable
    
    iteration++;
  }
  
  return {
    salaireBrut: Math.round(meilleurBrut),
    details: meilleursDetails
  };
};

// Fonction principale pour calculer l'impôt
export const calculateImpot = (
  salaireBrut: number, 
  country: string, 
  familyStatus: string, 
  childrenCount: number
) => {
  if (country === "benin") {
    return calculateITSBenin(salaireBrut);
  } else {
    // Pour le Togo
    const cotisationsSociales = calculateCNSS(salaireBrut, country);
    const fraisPro = calculateFraisPro(salaireBrut, cotisationsSociales);
    const baseImposable = salaireBrut - cotisationsSociales - fraisPro;
    return calculateIRPPTogo(baseImposable);
  }
}; 