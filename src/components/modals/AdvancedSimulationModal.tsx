import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Not used in this snippet, but kept as it was in original
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Not used in this snippet, but kept as it was in original
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calculator, Download, Plus, Users } from "lucide-react";
import { PayrollLineChart } from "@/components/charts/PayrollCharts";

// --- Interfaces (inchangées) ---
interface AdvancedSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  userRole: string;
}

interface SimulationParams {
  generalIncrease: string;
  inflation: string;
  horizon: string;
  recruitment: {
    enabled: boolean;
    count: string;
  };
  departures: {
    enabled: boolean;
    count: string;
  };
  promotions: {
    enabled: boolean;
    count: string;
  };
  departments: {
    [key: string]: {
      growth: string; // Percentage increase for existing department payroll
      newPositions: string; // Number of new positions
    };
  };
}

interface SimulationResults {
  currentPayroll: number;
  projectedPayroll: number;
  increase: number;
  increasePercentage: number;
  monthlyProjections: Array<{
    name: string; // Month name, e.g., "Mois 1"
    value: number; // Projected payroll for that month
  }>;
  factors: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  grossSalary: number;
  benefits: {
    transport?: number;
    housing?: number;
    performance?: number;
  };
}

interface Department {
  id: string;
  name: string;
}

// --- Utility Functions (inchangées) ---
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF', // Changed to XOF as per previous context
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// --- Composant AdvancedSimulationModal ---
const AdvancedSimulationModal = ({ isOpen, onClose, companyId, userRole }: AdvancedSimulationModalProps) => {
  const [activeView, setActiveView] = useState<"form" | "results">("form");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Valeurs initiales par défaut des paramètres
  const initialParams: SimulationParams = {
    generalIncrease: "3",
    inflation: "2",
    horizon: "12",
    recruitment: {
      enabled: false,
      count: "0"
    },
    departures: {
      enabled: false,
      count: "0"
    },
    promotions: {
      enabled: false,
      count: "0"
    },
    departments: {} // Sera rempli dynamiquement
  };
  const [params, setParams] = useState<SimulationParams>(initialParams);

  // --- useEffect pour le chargement des données (Adapté) ---
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      const fetchInitialData = async () => {
        try {
          // --- SIMULATION DE RÉCUPÉRATION DE DONNÉES (Remplacez par vos appels API réels) ---
          const fetchedEmployees: Employee[] = [
            { id: "e1", name: "Alice Dupont", position: "Développeur", department: "Technique", grossSalary: 300000, benefits: { transport: 10000 } },
            { id: "e2", name: "Bob Martin", position: "Commercial Senior", department: "Commercial", grossSalary: 350000, benefits: { housing: 50000 } },
            { id: "e3", name: "Charlie Brown", position: "Assistant RH", department: "Ressources Humaines", grossSalary: 280000, benefits: {} },
            { id: "e4", name: "Diana Prince", position: "Chef de projet", department: "Technique", grossSalary: 450000, benefits: {} },
            { id: "e5", name: "Eve Adams", position: "Commercial Junior", department: "Commercial", grossSalary: 250000, benefits: { performance: 20000 } },
            { id: "e6", name: "Frank White", position: "Spécialiste RH", department: "Ressources Humaines", grossSalary: 320000, benefits: { transport: 5000 } },
            { id: "e7", name: "Grace Hall", position: "Développeur Senior", department: "Technique", grossSalary: 500000, benefits: {} },
          ];

          // Extraire les départements uniques des employés
          const uniqueDepartments = Array.from(new Set(fetchedEmployees.map(emp => emp.department)))
            .map(deptName => ({ id: deptName, name: deptName }));

          setEmployees(fetchedEmployees);
          setDepartments(uniqueDepartments);

          // Initialiser les paramètres des départements dynamiquement
          const initialDepartmentParams: SimulationParams['departments'] = {};
          uniqueDepartments.forEach(dept => {
            initialDepartmentParams[dept.name] = {
              growth: "0", // Taux de croissance par défaut
              newPositions: "0" // Nombre de nouveaux postes par défaut
            };
          });

          // Mettre à jour les paramètres avec les départements dynamiques, en conservant les autres params par défaut
          setParams(prev => ({
            ...prev,
            departments: initialDepartmentParams
          }));

        } catch (err) {
          console.error("Failed to fetch initial data:", err);
          setError("Impossible de charger les données initiales.");
        } finally {
          setLoading(false);
        }
      };
      fetchInitialData();
    }
  }, [isOpen, companyId]); // companyId comme dépendance si les données varient par entreprise

  // --- Validation des paramètres (inchangée) ---
  const validateParams = (): string[] => {
    const errors: string[] = [];

    const generalIncrease = parseFloat(params.generalIncrease);
    const inflation = parseFloat(params.inflation);
    const horizon = parseInt(params.horizon);

    if (isNaN(generalIncrease) || generalIncrease < 0 || generalIncrease > 100) {
      errors.push("Le pourcentage d'augmentation générale doit être entre 0 et 100.");
    }
    if (isNaN(inflation) || inflation < 0 || inflation > 100) {
      errors.push("Le taux d'inflation doit être entre 0 et 100.");
    }
    if (isNaN(horizon) || horizon <= 0) {
      errors.push("L'horizon de simulation doit être un nombre de mois positif.");
    }

    const recruitmentCount = parseInt(params.recruitment.count);
    if (params.recruitment.enabled && (isNaN(recruitmentCount) || recruitmentCount < 0)) {
      errors.push("Le nombre de recrutements doit être positif.");
    }

    const departuresCount = parseInt(params.departures.count);
    if (params.departures.enabled && (isNaN(departuresCount) || departuresCount < 0)) {
      errors.push("Le nombre de départs doit être positif.");
    }
    if (params.departures.enabled && departuresCount >= employees.length && employees.length > 0) {
      errors.push("Le nombre de départs ne peut pas être supérieur ou égal au nombre d'employés actuels.");
    }

    const promotionsCount = parseInt(params.promotions.count);
    if (params.promotions.enabled && (isNaN(promotionsCount) || promotionsCount < 0)) {
      errors.push("Le nombre de promotions doit être positif.");
    }
    if (params.promotions.enabled && promotionsCount > employees.length && employees.length > 0) {
      errors.push("Le nombre de promotions ne peut pas être supérieur au nombre d'employés.");
    }

    Object.entries(params.departments).forEach(([dept, values]) => {
      const growth = parseFloat(values.growth);
      const newPositions = parseInt(values.newPositions);

      if (isNaN(growth) || growth < 0 || growth > 100) {
        errors.push(`Le taux de croissance du département ${dept} doit être entre 0 et 100.`);
      }
      if (isNaN(newPositions) || newPositions < 0) {
        errors.push(`Le nombre de nouveaux postes du département ${dept} doit être positif.`);
      }
    });

    return errors;
  };

  // Helper pour calculer la masse salariale brute + avantages d'un employé
  const calculateEmployeeTotalCost = (employee: Employee): number => {
    const benefits = Object.values(employee.benefits).reduce((a, b) => a + (b || 0), 0);
    // Ici, vous pouvez ajouter les charges patronales si vous les connaissez
    // Pour simplifier, nous utilisons juste Salaire Brut + Bénéfices
    return employee.grossSalary + benefits;
  };

  // --- Fonction de calcul de la simulation (Complétée) ---
  const calculateSimulation = (): SimulationResults => {
    if (employees.length === 0) {
      // Gérer le cas où il n'y a pas d'employés
      return {
        currentPayroll: 0,
        projectedPayroll: 0,
        increase: 0,
        increasePercentage: 0,
        monthlyProjections: [],
        factors: []
      };
    }

    let currentPayroll = employees.reduce((sum, emp) => sum + calculateEmployeeTotalCost(emp), 0);
    // currentPayroll représente la masse salariale mensuelle actuelle
    const generalIncreaseRate = parseFloat(params.generalIncrease) / 100;
    const inflationRate = parseFloat(params.inflation) / 100;
    const horizonMonths = parseInt(params.horizon);

    let projectedPayroll = currentPayroll;
    let monthlyProjections: Array<{ name: string; value: number }> = [];
    let initialTotalCost = currentPayroll; // Pour le calcul des facteurs

    // Coûts/économies pour les facteurs d'évolution (par mois)
    let generalIncreaseImpact = 0;
    let recruitmentImpact = 0;
    let departuresImpact = 0;
    let promotionsImpact = 0;
    let departmentGrowthImpact = 0;

    // Simulation mois par mois
    let currentEmployeesCount = employees.length;
    let tempCurrentPayroll = currentPayroll; // Masse salariale qui évolue mois par mois

    for (let month = 1; month <= horizonMonths; month++) {
      let monthPayroll = tempCurrentPayroll;

      // 1. Impact de l'augmentation générale (généralement annuelle, appliquée au premier mois de l'année/horizon)
      if (month === 1 && generalIncreaseRate > 0) { // Appliqué une seule fois au début de l'horizon
        const increaseThisMonth = tempCurrentPayroll * generalIncreaseRate;
        monthPayroll += increaseThisMonth;
        generalIncreaseImpact += increaseThisMonth; // Somme de l'impact sur l'horizon
      }

      // 2. Impact des recrutements (répartis sur l'horizon, ou en un bloc au début)
      // Simplification: le coût moyen d'un nouvel employé est le coût moyen actuel
      const averageEmployeeCost = currentPayroll / employees.length;

      if (params.recruitment.enabled && parseInt(params.recruitment.count) > 0) {
        // Hypothèse: les recrutements sont répartis uniformément sur l'horizon (si horizon > 0)
        // Ou tous au premier mois pour simplifier
        const monthlyRecruitmentCount = Math.ceil(parseInt(params.recruitment.count) / horizonMonths);
        const newRecruitCost = monthlyRecruitmentCount * averageEmployeeCost;
        monthPayroll += newRecruitCost;
        recruitmentImpact += newRecruitCost;
        currentEmployeesCount += monthlyRecruitmentCount; // Mise à jour du nombre d'employés
      }

      // 3. Impact des départs
      if (params.departures.enabled && parseInt(params.departures.count) > 0) {
        const monthlyDepartureCount = Math.ceil(parseInt(params.departures.count) / horizonMonths);
        const departureSavings = monthlyDepartureCount * averageEmployeeCost;
        monthPayroll -= departureSavings;
        departuresImpact -= departureSavings; // Économie = impact négatif
        currentEmployeesCount -= monthlyDepartureCount; // Mise à jour du nombre d'employés
      }

      // 4. Impact des promotions (simplifié: 5% d'augmentation par promotion, appliquée une seule fois au début)
      if (month === 1 && params.promotions.enabled && parseInt(params.promotions.count) > 0) {
        // Hypothèse: l'augmentation de 5% est sur le salaire moyen de l'employé promu
        // Pour simplifier, nous appliquons 5% de l'impact total des promotions sur la masse salariale actuelle
        const promoCost = averageEmployeeCost * 0.05 * parseInt(params.promotions.count);
        monthPayroll += promoCost;
        promotionsImpact += promoCost;
      }

      // 5. Impact de la croissance et des nouveaux postes par département
      Object.entries(params.departments).forEach(([deptName, deptValues]) => {
        const deptGrowthRate = parseFloat(deptValues.growth) / 100;
        const deptNewPositions = parseInt(deptValues.newPositions);

        // Croissance du salaire des employés existants dans le département (si appliqué)
        if (month === 1 && deptGrowthRate > 0) {
          const currentDeptPayroll = employees
            .filter(emp => emp.department === deptName)
            .reduce((sum, emp) => sum + calculateEmployeeTotalCost(emp), 0);
          const deptGrowthCost = currentDeptPayroll * deptGrowthRate;
          monthPayroll += deptGrowthCost;
          departmentGrowthImpact += deptGrowthCost;
        }

        // Nouveaux postes par département (coût moyen par poste)
        if (deptNewPositions > 0) {
          const monthlyDeptNewPositions = Math.ceil(deptNewPositions / horizonMonths);
          const newDeptPositionCost = monthlyDeptNewPositions * averageEmployeeCost; // Utiliser le coût moyen général
          monthPayroll += newDeptPositionCost;
          departmentGrowthImpact += newDeptPositionCost; // Agrégé dans l'impact de croissance des départements
          currentEmployeesCount += monthlyDeptNewPositions;
        }
      });


      // 6. Impact de l'inflation (appliquée mensuellement sur la nouvelle masse salariale)
      // L'inflation est généralement un taux annuel, converti en mensuel pour l'application
      const monthlyInflationRate = Math.pow(1 + inflationRate, 1/12) - 1;
      monthPayroll *= (1 + monthlyInflationRate); // Appliquer l'inflation sur la masse salariale du mois

      monthlyProjections.push({ name: `Mois ${month}`, value: monthPayroll });
      tempCurrentPayroll = monthPayroll; // La masse salariale du mois devient la base pour le mois suivant
    }

    projectedPayroll = monthlyProjections[horizonMonths - 1]?.value || currentPayroll; // Dernière valeur projetée

    const totalIncrease = projectedPayroll - currentPayroll; // Augmentation totale sur la période
    const increasePercentage = (totalIncrease / currentPayroll) * 100;

    // Calcul des facteurs d'évolution
    // Ces montants sont des impacts sur le total projeté, par rapport à la masse salariale initiale
    const factors: Array<{ name: string; amount: number; percentage: number }> = [];

    // Facteurs agrégés sur l'horizon
    const totalImpact = projectedPayroll - initialTotalCost;

    const addFactor = (name: string, impact: number) => {
        if (impact !== 0) { // N'ajouter que les facteurs ayant un impact
            factors.push({
                name: name,
                amount: impact * horizonMonths, // Impact total sur la période
                percentage: (impact * horizonMonths / Math.abs(totalImpact)) * 100 || 0 // % de l'impact total
            });
        }
    }

    addFactor("Augmentation Générale", generalIncreaseImpact / horizonMonths); // impact par mois
    addFactor("Coût Recrutements", recruitmentImpact / horizonMonths);
    addFactor("Économie Départs", departuresImpact / horizonMonths);
    addFactor("Coût Promotions", promotionsImpact / horizonMonths);
    addFactor("Croissance/Nouveaux postes Dép.", departmentGrowthImpact / horizonMonths);


    // Ajuster les pourcentages pour qu'ils soient positifs et représentent une proportion du total absolu de l'augmentation
    const absoluteSumOfImpacts = factors.reduce((sum, f) => sum + Math.abs(f.amount), 0);
    factors.forEach(f => {
        f.percentage = (Math.abs(f.amount) / absoluteSumOfImpacts) * 100 || 0;
    });


    return {
      currentPayroll: initialTotalCost,
      projectedPayroll: projectedPayroll,
      increase: totalIncrease,
      increasePercentage: isNaN(increasePercentage) ? 0 : increasePercentage,
      monthlyProjections: monthlyProjections,
      factors: factors
    };
  };

  // --- Fonctions de gestion des actions de l'utilisateur ---
  const launchSimulation = (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    const errors = validateParams();
    if (errors.length > 0) {
      setError(errors.join("\n")); // Affiche les erreurs
      return;
    }
    setError(null); // Efface les erreurs précédentes
    setLoading(true);
    // Simuler un petit délai pour le calcul
    setTimeout(() => {
      try {
        const calculatedResults = calculateSimulation();
        setResults(calculatedResults);
        setActiveView("results");
      } catch (err) {
        console.error("Erreur lors du calcul de la simulation:", err);
        setError("Une erreur est survenue lors du calcul de la simulation.");
      } finally {
        setLoading(false);
      }
    }, 500); // Délai de 500ms
  };

  const handleReset = () => {
    setActiveView("form");
    setResults(null);
    setParams(initialParams); // Réinitialise les paramètres aux valeurs par défaut
    setError(null);
  };

  const handleCloseModal = () => {
    onClose();
    handleReset(); // Réinitialise l'état lors de la fermeture
  }

  // --- Rendu du composant ---
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Simulation Avancée</DialogTitle>
          <DialogDescription>
            Analysez l'impact des différents scénarios sur votre masse salariale.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Chargement des données...</p> {/* Ou un spinner */}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">
            <p>{error}</p>
            <Button onClick={handleCloseModal} className="mt-4">Fermer</Button>
          </div>
        ) : activeView === "form" ? (
          <form onSubmit={launchSimulation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hypothèses Générales */}
              <div>
                <h3 className="text-sm font-medium mb-4">Hypothèses Générales</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="general-increase" className="text-xs">Augmentation générale (%)</Label>
                    <Input
                      id="general-increase"
                      type="number"
                      value={params.generalIncrease}
                      onChange={(e) => setParams({ ...params, generalIncrease: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inflation" className="text-xs">Inflation (%)</Label>
                    <Input
                      id="inflation"
                      type="number"
                      value={params.inflation}
                      onChange={(e) => setParams({ ...params, inflation: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="horizon" className="text-xs">Horizon (mois)</Label>
                    <Select
                      value={params.horizon}
                      onValueChange={(value) => setParams({ ...params, horizon: value })}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 mois</SelectItem>
                        <SelectItem value="6">6 mois</SelectItem>
                        <SelectItem value="12">12 mois</SelectItem>
                        <SelectItem value="24">24 mois</SelectItem>
                        <SelectItem value="36">36 mois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Évolution des effectifs */}
              <div>
                <h3 className="text-sm font-medium mb-4">Évolution des effectifs</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox
                        id="enable-recruitment"
                        checked={params.recruitment.enabled}
                        onCheckedChange={(checked) => setParams({
                          ...params,
                          recruitment: { ...params.recruitment, enabled: checked as boolean }
                        })}
                      />
                      <label htmlFor="enable-recruitment" className="ml-2 text-sm">
                        Inclure recrutements
                      </label>
                    </div>
                    <Input
                      type="number"
                      value={params.recruitment.count}
                      onChange={(e) => setParams({
                        ...params,
                        recruitment: { ...params.recruitment, count: e.target.value }
                      })}
                      className="w-20 h-8 text-sm"
                      disabled={!params.recruitment.enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox
                        id="enable-departures"
                        checked={params.departures.enabled}
                        onCheckedChange={(checked) => setParams({
                          ...params,
                          departures: { ...params.departures, enabled: checked as boolean }
                        })}
                      />
                      <label htmlFor="enable-departures" className="ml-2 text-sm">
                        Inclure départs
                      </label>
                    </div>
                    <Input
                      type="number"
                      value={params.departures.count}
                      onChange={(e) => setParams({
                        ...params,
                        departures: { ...params.departures, count: e.target.value }
                      })}
                      className="w-20 h-8 text-sm"
                      disabled={!params.departures.enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox
                        id="enable-promotions"
                        checked={params.promotions.enabled}
                        onCheckedChange={(checked) => setParams({
                          ...params,
                          promotions: { ...params.promotions, enabled: checked as boolean }
                        })}
                      />
                      <label htmlFor="enable-promotions" className="ml-2 text-sm">
                        Inclure promotions
                      </label>
                    </div>
                    <Input
                      type="number"
                      value={params.promotions.count}
                      onChange={(e) => setParams({
                        ...params,
                        promotions: { ...params.promotions, count: e.target.value }
                      })}
                      className="w-20 h-8 text-sm"
                      disabled={!params.promotions.enabled}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Évolution par département (Maintenant dynamique) */}
            <div>
              <h3 className="text-sm font-medium mb-4">Évolution par département</h3>
              <div className="space-y-4">
                {departments.map((dept) => {
                  const deptParams = params.departments[dept.name] || { growth: "0", newPositions: "0" };
                  const employeesInDept = employees.filter(emp => emp.department === dept.name).length;
                  return (
                    <Card key={dept.id} className="bg-gray-50 dark:bg-gray-800">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{dept.name}</h4>
                          <Badge variant="outline">{employeesInDept} employé(s)</Badge> {/* Dynamique */}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <Label className="text-xs">Croissance (%)</Label> {/* Clarifié comme pourcentage */}
                            <Select
                              value={deptParams.growth}
                              onValueChange={(value) => setParams(prevParams => ({
                                ...prevParams,
                                departments: {
                                  ...prevParams.departments,
                                  [dept.name]: { ...deptParams, growth: value }
                                }
                              }))}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="%" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0%</SelectItem>
                                <SelectItem value="3">3%</SelectItem>
                                <SelectItem value="5">5%</SelectItem>
                                <SelectItem value="7">7%</SelectItem>
                                <SelectItem value="10">10%</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Nouveaux postes</Label>
                            <Input
                              type="number"
                              value={deptParams.newPositions}
                              onChange={(e) => setParams(prevParams => ({
                                ...prevParams,
                                departments: {
                                  ...prevParams.departments,
                                  [dept.name]: { ...deptParams, newPositions: e.target.value }
                                }
                              }))}
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Pied de dialogue du formulaire */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                <Calculator className="mr-2 h-4 w-4" /> Lancer la simulation
              </Button>
            </DialogFooter>
          </form>
        ) : results && (
          // Vue des résultats
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Masse salariale actuelle</p>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(results.currentPayroll)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Masse salariale projetée</p>
                    <p className="text-2xl font-bold mt-1 text-green-600">
                      {formatCurrency(results.projectedPayroll)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Augmentation</p>
                    <p className="text-2xl font-bold mt-1 text-amber-600">
                      {results.increase > 0 ? '+' : ''}{results.increasePercentage.toFixed(1)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Évolution mensuelle</h3>
                <div className="h-[300px]">
                  <PayrollLineChart
                    data={results.monthlyProjections}
                    title="Évolution de la masse salariale"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Facteurs d'évolution</h3>
                <div className="space-y-4">
                  {results.factors.map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{factor.name}</span>
                        <span>{formatCurrency(factor.amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all"
                          style={{ width: `${Math.min(100, Math.max(0, factor.percentage))}%` }} // Clamp percentage
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pied de dialogue des résultats */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleReset}>
                <Calculator className="mr-2 h-4 w-4" /> Nouvelle simulation
              </Button>
              <Button type="button" onClick={handleCloseModal}>
                Fermer
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSimulationModal;