interface SalaireHistorique {
  mois: string;
  salaireBrut: number;
  primes: {
    rendement?: number;
    transport?: number;
    logement?: number;
    autres?: number;
  };
}

interface CalculCongesParams {
  dateDebutContrat: Date;
  dateDebutConges: Date;
  age: number;
  anciennete: number; // en années
  salaireHistorique: SalaireHistorique[];
}

interface ResultatCalculConges {
  joursDeCongesAcquis: number;
  joursSupplementaires: number;
  totalJours: number;
  baseCalcul: number;
  indemnite: number;
  detailsCalcul: {
    salairesBruts: number;
    primesIncluses: number;
    primesExclues: number;
  };
}

/**
 * Calcule le nombre de jours de congés acquis
 */
const calculJoursCongesBase = (
  dateDebutContrat: Date,
  dateDebutConges: Date,
  age: number
): number => {
  // Calcul des mois de service
  const moisDeService = (dateDebutConges.getTime() - dateDebutContrat.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  
  // Taux d'acquisition selon l'âge
  const tauxAcquisition = age < 18 ? 2.5 : 2; // 2.5 jours/mois pour les moins de 18 ans, 2 jours/mois sinon
  
  // Calcul des jours acquis
  return Math.floor(moisDeService * tauxAcquisition);
};

/**
 * Calcule les jours supplémentaires selon l'ancienneté
 */
const calculJoursSupplementaires = (anciennete: number): number => {
  if (anciennete >= 20) return 4;
  if (anciennete >= 15) return 2;
  return 0;
};

/**
 * Calcule la base de l'indemnité de congés payés
 */
const calculBaseIndemnite = (salaireHistorique: SalaireHistorique[]): {
  baseCalcul: number;
  detailsCalcul: {
    salairesBruts: number;
    primesIncluses: number;
    primesExclues: number;
  };
} => {
  let totalSalairesBruts = 0;
  let totalPrimesIncluses = 0;
  let totalPrimesExclues = 0;

  salaireHistorique.forEach(mois => {
    // Salaire brut
    totalSalairesBruts += mois.salaireBrut;

    // Primes incluses (transport, logement, autres sauf rendement)
    const primesIncluses = (mois.primes.transport || 0) +
                          (mois.primes.logement || 0) +
                          (mois.primes.autres || 0);
    totalPrimesIncluses += primesIncluses;

    // Primes exclues (rendement)
    totalPrimesExclues += mois.primes.rendement || 0;
  });

  const baseCalcul = totalSalairesBruts + totalPrimesIncluses;

  return {
    baseCalcul,
    detailsCalcul: {
      salairesBruts: totalSalairesBruts,
      primesIncluses: totalPrimesIncluses,
      primesExclues: totalPrimesExclues
    }
  };
};

/**
 * Fonction principale de calcul des indemnités de congés payés
 */
export const calculIndemnitesConges = (params: CalculCongesParams): ResultatCalculConges => {
  // 1. Calcul des jours de congés acquis
  const joursDeCongesAcquis = calculJoursCongesBase(
    params.dateDebutContrat,
    params.dateDebutConges,
    params.age
  );

  // 2. Calcul des jours supplémentaires selon l'ancienneté
  const joursSupplementaires = calculJoursSupplementaires(params.anciennete);

  // 3. Total des jours de congés
  const totalJours = Math.min(joursDeCongesAcquis + joursSupplementaires, 30); // Plafond de 30 jours

  // 4. Calcul de la base de l'indemnité
  const { baseCalcul, detailsCalcul } = calculBaseIndemnite(params.salaireHistorique);

  // 5. Calcul de l'indemnité (règle du 1/12ème)
  const indemnite = (baseCalcul / 12);

  return {
    joursDeCongesAcquis,
    joursSupplementaires,
    totalJours,
    baseCalcul,
    indemnite,
    detailsCalcul
  };
}; 