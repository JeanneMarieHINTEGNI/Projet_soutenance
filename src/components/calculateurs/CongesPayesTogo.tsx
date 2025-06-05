import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";

interface SalaireHistorique {
  mois: string;
  salaireBrut: number;
  primes: {
    rendement?: number;
    objectifs?: number;
    anciennete?: number;
    transport?: number;
    autres?: number;
  };
  majorations: {
    heuresSupp?: number;
    travailNuit?: number;
    autres?: number;
  };
  avantagesNature: number;
}

interface ResultatCalcul {
  joursDeCongesAcquis: number;
  joursSupplementaires: number;
  totalJours: number;
  methode1: {
    baseCalcul: number;
    indemnite: number;
    detailsCalcul: {
      salairesBruts: number;
      primes: number;
      majorations: number;
      avantagesNature: number;
    };
  };
  methode2: {
    baseCalcul: number;
    indemnite: number;
    salaireMoyenMensuel: number;
  };
  indemniteTotale: number;
  methodeRetenue: "dixieme" | "maintien";
}

const CongesPayesTogo = () => {
  // États pour les données du formulaire
  const [dateDebutContrat, setDateDebutContrat] = useState<Date | null>(null);
  const [dateDebutConges, setDateDebutConges] = useState<Date | null>(null);
  const [anciennete, setAnciennete] = useState<number>(0);
  const [salaireHistorique, setSalaireHistorique] = useState<SalaireHistorique[]>([]);
  const [resultat, setResultat] = useState<ResultatCalcul | null>(null);

  // Fonction pour ajouter un mois à l'historique des salaires
  const ajouterMois = () => {
    setSalaireHistorique([
      ...salaireHistorique,
      {
        mois: new Date().toISOString().slice(0, 7),
        salaireBrut: 0,
        primes: {},
        majorations: {},
        avantagesNature: 0
      }
    ]);
  };

  // Fonction pour mettre à jour un mois dans l'historique
  const updateMois = (index: number, field: string, value: any) => {
    const newHistorique = [...salaireHistorique];
    if (field.startsWith("primes.")) {
      const primeField = field.split(".")[1];
      newHistorique[index].primes[primeField] = Number(value);
    } else if (field.startsWith("majorations.")) {
      const majorationField = field.split(".")[1];
      newHistorique[index].majorations[majorationField] = Number(value);
    } else if (field === "avantagesNature") {
      newHistorique[index].avantagesNature = Number(value);
    } else {
      newHistorique[index][field] = value;
    }
    setSalaireHistorique(newHistorique);
  };

  // Fonction pour calculer les jours de congés acquis
  const calculJoursCongesBase = (
    dateDebutContrat: Date,
    dateDebutConges: Date
  ): number => {
    const moisDeService = (dateDebutConges.getTime() - dateDebutContrat.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    return Math.floor(moisDeService * 2.5); // 2.5 jours par mois au Togo
  };

  // Fonction pour calculer les jours supplémentaires selon l'ancienneté
  const calculJoursSupplementaires = (anciennete: number): number => {
    // 1 jour par tranche de 5 ans, plafonné à 6 jours
    const joursSupp = Math.floor(anciennete / 5);
    return Math.min(joursSupp, 6);
  };

  // Fonction pour calculer l'indemnité selon la méthode du 1/10ème
  const calculMethodeDixieme = (salaireHistorique: SalaireHistorique[]) => {
    let totalSalairesBruts = 0;
    let totalPrimes = 0;
    let totalMajorations = 0;
    let totalAvantagesNature = 0;

    salaireHistorique.forEach(mois => {
      // Salaire brut
      totalSalairesBruts += mois.salaireBrut;

      // Primes
      const primes = Object.values(mois.primes).reduce((acc, val) => acc + (val || 0), 0);
      totalPrimes += primes;

      // Majorations
      const majorations = Object.values(mois.majorations).reduce((acc, val) => acc + (val || 0), 0);
      totalMajorations += majorations;

      // Avantages en nature
      totalAvantagesNature += mois.avantagesNature;
    });

    const baseCalcul = totalSalairesBruts + totalPrimes + totalMajorations + totalAvantagesNature;
    const indemnite = baseCalcul / 10;

    return {
      baseCalcul,
      indemnite,
      detailsCalcul: {
        salairesBruts: totalSalairesBruts,
        primes: totalPrimes,
        majorations: totalMajorations,
        avantagesNature: totalAvantagesNature
      }
    };
  };

  // Fonction pour calculer l'indemnité selon la méthode du maintien de salaire
  const calculMethodeMaintien = (salaireHistorique: SalaireHistorique[], joursConges: number) => {
    // Calcul du salaire moyen mensuel
    const derniersMois = salaireHistorique.slice(-3); // On prend les 3 derniers mois
    const totalSalaires = derniersMois.reduce((acc, mois) => {
      const totalMois = mois.salaireBrut +
        Object.values(mois.primes).reduce((a, v) => a + (v || 0), 0) +
        Object.values(mois.majorations).reduce((a, v) => a + (v || 0), 0) +
        mois.avantagesNature;
      return acc + totalMois;
    }, 0);

    const salaireMoyenMensuel = totalSalaires / derniersMois.length;
    const baseCalcul = salaireMoyenMensuel;
    const indemnite = (salaireMoyenMensuel * joursConges) / 30;

    return {
      baseCalcul,
      indemnite,
      salaireMoyenMensuel
    };
  };

  // Fonction principale de calcul
  const calculerIndemnites = () => {
    if (!dateDebutContrat || !dateDebutConges) return;

    // 1. Calcul des jours de congés acquis
    const joursDeCongesAcquis = calculJoursCongesBase(
      dateDebutContrat,
      dateDebutConges
    );

    // 2. Calcul des jours supplémentaires
    const joursSupplementaires = calculJoursSupplementaires(anciennete);

    // 3. Total des jours de congés
    const totalJours = joursDeCongesAcquis + joursSupplementaires;

    // 4. Calcul selon la méthode du 1/10ème
    const resultatDixieme = calculMethodeDixieme(salaireHistorique);

    // 5. Calcul selon la méthode du maintien de salaire
    const resultatMaintien = calculMethodeMaintien(salaireHistorique, totalJours);

    // 6. Détermination de la méthode la plus favorable
    const methodeRetenue = resultatDixieme.indemnite > resultatMaintien.indemnite ? "dixieme" : "maintien";
    const indemniteTotale = Math.max(resultatDixieme.indemnite, resultatMaintien.indemnite);

    setResultat({
      joursDeCongesAcquis,
      joursSupplementaires,
      totalJours,
      methode1: resultatDixieme,
      methode2: resultatMaintien,
      indemniteTotale,
      methodeRetenue
    });
  };

  // Fonction pour formater les montants en FCFA
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(montant);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Calculateur d'Indemnités de Congés Payés - Togo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateDebutContrat">Date de début du contrat</Label>
                <DatePicker
                  id="dateDebutContrat"
                  selected={dateDebutContrat}
                  onChange={setDateDebutContrat}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateDebutConges">Date de début des congés</Label>
                <DatePicker
                  id="dateDebutConges"
                  selected={dateDebutConges}
                  onChange={setDateDebutConges}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anciennete">Ancienneté (en années)</Label>
                <Input
                  id="anciennete"
                  type="number"
                  value={anciennete}
                  onChange={(e) => setAnciennete(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Historique des salaires */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Historique des salaires</h3>
                <Button onClick={ajouterMois}>Ajouter un mois</Button>
              </div>
              
              {salaireHistorique.map((mois, index) => (
                <div key={index} className="space-y-4 p-4 border rounded">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Mois</Label>
                      <Input
                        type="month"
                        value={mois.mois}
                        onChange={(e) => updateMois(index, "mois", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Salaire brut</Label>
                      <Input
                        type="number"
                        value={mois.salaireBrut}
                        onChange={(e) => updateMois(index, "salaireBrut", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Avantages en nature</Label>
                      <Input
                        type="number"
                        value={mois.avantagesNature}
                        onChange={(e) => updateMois(index, "avantagesNature", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Primes</Label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                      <div>
                        <Label>Rendement</Label>
                        <Input
                          type="number"
                          value={mois.primes.rendement || 0}
                          onChange={(e) => updateMois(index, "primes.rendement", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Objectifs</Label>
                        <Input
                          type="number"
                          value={mois.primes.objectifs || 0}
                          onChange={(e) => updateMois(index, "primes.objectifs", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Ancienneté</Label>
                        <Input
                          type="number"
                          value={mois.primes.anciennete || 0}
                          onChange={(e) => updateMois(index, "primes.anciennete", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Autres primes</Label>
                        <Input
                          type="number"
                          value={mois.primes.autres || 0}
                          onChange={(e) => updateMois(index, "primes.autres", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Majorations</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label>Heures supplémentaires</Label>
                        <Input
                          type="number"
                          value={mois.majorations.heuresSupp || 0}
                          onChange={(e) => updateMois(index, "majorations.heuresSupp", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Travail de nuit</Label>
                        <Input
                          type="number"
                          value={mois.majorations.travailNuit || 0}
                          onChange={(e) => updateMois(index, "majorations.travailNuit", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Autres majorations</Label>
                        <Input
                          type="number"
                          value={mois.majorations.autres || 0}
                          onChange={(e) => updateMois(index, "majorations.autres", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={calculerIndemnites} className="w-full">
              Calculer l'indemnité
            </Button>

            {/* Résultats */}
            {resultat && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Résultats du calcul</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <h4 className="font-medium mb-2">Jours de congés</h4>
                    <p>Jours acquis: {resultat.joursDeCongesAcquis}</p>
                    <p>Jours supplémentaires: {resultat.joursSupplementaires}</p>
                    <p className="font-bold">Total: {resultat.totalJours} jours</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <h4 className="font-medium mb-2">Méthode du 1/10ème</h4>
                    <p>Base de calcul: {formatMontant(resultat.methode1.baseCalcul)}</p>
                    <p>Indemnité: {formatMontant(resultat.methode1.indemnite)}</p>
                    <div className="mt-2 text-sm">
                      <p>Salaires bruts: {formatMontant(resultat.methode1.detailsCalcul.salairesBruts)}</p>
                      <p>Primes: {formatMontant(resultat.methode1.detailsCalcul.primes)}</p>
                      <p>Majorations: {formatMontant(resultat.methode1.detailsCalcul.majorations)}</p>
                      <p>Avantages en nature: {formatMontant(resultat.methode1.detailsCalcul.avantagesNature)}</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded">
                    <h4 className="font-medium mb-2">Méthode du maintien de salaire</h4>
                    <p>Salaire moyen mensuel: {formatMontant(resultat.methode2.salaireMoyenMensuel)}</p>
                    <p>Indemnité: {formatMontant(resultat.methode2.indemnite)}</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <h4 className="font-medium text-green-700 mb-2">
                    Indemnité de congés payés (méthode {resultat.methodeRetenue === "dixieme" ? "du 1/10ème" : "du maintien"})
                  </h4>
                  <p className="text-2xl font-bold text-green-700">
                    {formatMontant(resultat.indemniteTotale)}
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    Cette méthode a été retenue car plus favorable au salarié.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CongesPayesTogo; 