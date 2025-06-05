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
    transport?: number;
    logement?: number;
    autres?: number;
  };
}

interface ResultatCalcul {
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

const CongesPayesBenin = () => {
  // États pour les données du formulaire
  const [dateDebutContrat, setDateDebutContrat] = useState<Date | null>(null);
  const [dateDebutConges, setDateDebutConges] = useState<Date | null>(null);
  const [age, setAge] = useState<number>(0);
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
        primes: {}
      }
    ]);
  };

  // Fonction pour mettre à jour un mois dans l'historique
  const updateMois = (index: number, field: string, value: any) => {
    const newHistorique = [...salaireHistorique];
    if (field.startsWith("primes.")) {
      const primeField = field.split(".")[1];
      newHistorique[index].primes[primeField] = Number(value);
    } else {
      newHistorique[index][field] = value;
    }
    setSalaireHistorique(newHistorique);
  };

  // Fonction pour calculer les jours de congés acquis
  const calculJoursCongesBase = (
    dateDebutContrat: Date,
    dateDebutConges: Date,
    age: number
  ): number => {
    const moisDeService = (dateDebutConges.getTime() - dateDebutContrat.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    const tauxAcquisition = age < 18 ? 2.5 : 2;
    return Math.floor(moisDeService * tauxAcquisition);
  };

  // Fonction pour calculer les jours supplémentaires
  const calculJoursSupplementaires = (anciennete: number): number => {
    if (anciennete >= 20) return 4;
    if (anciennete >= 15) return 2;
    return 0;
  };

  // Fonction pour calculer la base de l'indemnité
  const calculBaseIndemnite = (salaireHistorique: SalaireHistorique[]) => {
    let totalSalairesBruts = 0;
    let totalPrimesIncluses = 0;
    let totalPrimesExclues = 0;

    salaireHistorique.forEach(mois => {
      totalSalairesBruts += mois.salaireBrut;
      const primesIncluses = (mois.primes.transport || 0) +
                            (mois.primes.logement || 0) +
                            (mois.primes.autres || 0);
      totalPrimesIncluses += primesIncluses;
      totalPrimesExclues += mois.primes.rendement || 0;
    });

    return {
      baseCalcul: totalSalairesBruts + totalPrimesIncluses,
      detailsCalcul: {
        salairesBruts: totalSalairesBruts,
        primesIncluses: totalPrimesIncluses,
        primesExclues: totalPrimesExclues
      }
    };
  };

  // Fonction principale de calcul
  const calculerIndemnites = () => {
    if (!dateDebutContrat || !dateDebutConges) return;

    // 1. Calcul des jours de congés acquis
    const joursDeCongesAcquis = calculJoursCongesBase(
      dateDebutContrat,
      dateDebutConges,
      age
    );

    // 2. Calcul des jours supplémentaires
    const joursSupplementaires = calculJoursSupplementaires(anciennete);

    // 3. Total des jours de congés
    const totalJours = Math.min(joursDeCongesAcquis + joursSupplementaires, 30);

    // 4. Calcul de la base de l'indemnité
    const { baseCalcul, detailsCalcul } = calculBaseIndemnite(salaireHistorique);

    // 5. Calcul de l'indemnité (règle du 1/12ème)
    const indemnite = baseCalcul / 12;

    setResultat({
      joursDeCongesAcquis,
      joursSupplementaires,
      totalJours,
      baseCalcul,
      indemnite,
      detailsCalcul
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
          <CardTitle>Calculateur d'Indemnités de Congés Payés - Bénin</CardTitle>
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
                <Label htmlFor="age">Âge du salarié</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
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
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border rounded">
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
                    <Label>Prime de rendement</Label>
                    <Input
                      type="number"
                      value={mois.primes.rendement || 0}
                      onChange={(e) => updateMois(index, "primes.rendement", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Prime de transport</Label>
                    <Input
                      type="number"
                      value={mois.primes.transport || 0}
                      onChange={(e) => updateMois(index, "primes.transport", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Prime de logement</Label>
                    <Input
                      type="number"
                      value={mois.primes.logement || 0}
                      onChange={(e) => updateMois(index, "primes.logement", e.target.value)}
                    />
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
                    <h4 className="font-medium mb-2">Base de calcul</h4>
                    <p>Salaires bruts: {formatMontant(resultat.detailsCalcul.salairesBruts)}</p>
                    <p>Primes incluses: {formatMontant(resultat.detailsCalcul.primesIncluses)}</p>
                    <p>Primes exclues: {formatMontant(resultat.detailsCalcul.primesExclues)}</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <h4 className="font-medium text-green-700 mb-2">Indemnité de congés payés</h4>
                  <p className="text-2xl font-bold text-green-700">
                    {formatMontant(resultat.indemnite)}
                  </p>
                  <p className="text-sm text-green-600">
                    Base de calcul: {formatMontant(resultat.baseCalcul)}
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

export default CongesPayesBenin; 