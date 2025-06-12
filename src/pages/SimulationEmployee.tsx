import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownRight, ArrowLeft, ArrowUpRight, BarChart2, Calculator, Download, Eye, HelpCircle, Mail, Share } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useCountry } from "@/hooks/use-country";
import { useEmployeeData } from "@/hooks/use-employee-data";

// Mock chart components (would use recharts in real implementation)
const PieChart = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-gray-100 dark:bg-gray-800 h-full rounded-lg flex items-center justify-center">
    <div className="text-center text-sm text-muted-foreground">Graphique de répartition</div>
  </div>
);

const LineChart = ({ data }: { data: any[] }) => (
  <div className="bg-gray-100 dark:bg-gray-800 h-full rounded-lg flex items-center justify-center">
    <div className="text-center text-sm text-muted-foreground">Graphique d'évolution</div>
  </div>
);

const BarChart = ({ data }: { data: any[] }) => (
  <div className="bg-gray-100 dark:bg-gray-800 h-full rounded-lg flex items-center justify-center">
    <div className="text-center text-sm text-muted-foreground">Graphique comparatif</div>
  </div>
);


// Fonction pour calculer les charges sociales selon le pays
const calculateSocialCharges = (grossSalary: number, country: string) => {
  if (country === 'benin') {
    // Au Bénin : CNSS (3.6%)
    return Math.round(grossSalary * 0.036);
  } else {
    // Au Togo : CNSS/AMU (4%)
    return Math.round(grossSalary * 0.04);
  }
};

// Fonction pour calculer l'ITS (Bénin) ou l'IRPP (Togo)
const calculateTax = (taxableIncome: number, familyStatus: string, children: number, country: string) => {
  if (country === 'benin') {
    // Au Bénin : ITS (pas de coefficient familial)
    let tax = 0;
    if (taxableIncome <= 60000) {
      tax = 0;
    } else if (taxableIncome <= 150000) {
      tax = (taxableIncome - 60000) * 0.10;
    } else if (taxableIncome <= 250000) {
      tax = 9000 + (taxableIncome - 150000) * 0.15;
    } else if (taxableIncome <= 500000) {
      tax = 24000 + (taxableIncome - 250000) * 0.19;
    } else {
      tax = 71500 + (taxableIncome - 500000) * 0.30;
    }
    return Math.round(tax);
  } else {
    // Au Togo : IRPP avec coefficient familial
    let familyCoefficient = 1;
    if (familyStatus === "married") {
      familyCoefficient = 2;
    }
    familyCoefficient += children * 0.5;

    const taxableIncomePerPart = taxableIncome / familyCoefficient;
    let tax = 0;

    if (taxableIncomePerPart <= 30000) {
      tax = 0;
    } else if (taxableIncomePerPart <= 100000) {
      tax = (taxableIncomePerPart - 30000) * 0.07;
    } else if (taxableIncomePerPart <= 250000) {
      tax = 4900 + (taxableIncomePerPart - 100000) * 0.15;
    } else if (taxableIncomePerPart <= 500000) {
      tax = 27400 + (taxableIncomePerPart - 250000) * 0.25;
    } else {
      tax = 89900 + (taxableIncomePerPart - 500000) * 0.35;
    }

    return Math.round(tax * familyCoefficient);
  }
};

// Fonction pour calculer le salaire net
const calculateNetSalary = (
  grossSalary: number,
  familyStatus: string,
  children: number,
  benefits: {
    transport: number;
    housing: number;
    thirteenthMonth: boolean;
  },
  country: string
) => {
  // Vérification du SMIG selon le pays
  const minSalary = country === 'togo' ? 35000 : 40000;
  if (grossSalary < minSalary) {
    grossSalary = minSalary;
  }

  // Calcul des charges sociales selon le pays
  const socialCharges = calculateSocialCharges(grossSalary, country);
  
  // Revenu imposable (salaire brut - charges sociales)
  const taxableIncome = grossSalary - socialCharges;
  
  // Calcul de l'impôt selon le pays (ITS pour Bénin, IRPP pour Togo)
  const tax = calculateTax(taxableIncome, familyStatus, children, country);
  
  // Calcul du salaire net
  const netSalary = grossSalary - socialCharges - tax;
  
  // Ajout des avantages non imposables
  const totalNet = netSalary + benefits.transport + benefits.housing;
  
  // Ajout du 13ème mois si applicable
  const annualBonus = benefits.thirteenthMonth ? grossSalary / 12 : 0;
  
  return {
    netSalary: totalNet + annualBonus,
    socialCharges,
    irpp: tax, // Gardons le nom irpp pour la compatibilité avec l'interface
    details: {
      grossSalary,
      taxableIncome,
      benefits: benefits.transport + benefits.housing + annualBonus,
      thirteenthMonth: benefits.thirteenthMonth,
      country: country,
      minSalary: minSalary
    }
  };
};

const SimulationEmployee = () => {
  const navigate = useNavigate();
  const { country } = useCountry();
  const { employeeData, updateLastSimulation } = useEmployeeData();
  
  // État pour stocker les paramètres de simulation
  const [simulationType, setSimulationType] = useState("gross-to-net");
  const [grossSalary, setGrossSalary] = useState<number>(
    employeeData?.currentSalary || 350000
  );
  const [netSalary, setNetSalary] = useState<string>(
    employeeData?.lastSimulation?.netSalary?.toString() || "282625"
  );
  const [familyStatus, setFamilyStatus] = useState<"single" | "married" | "divorced">(
    employeeData?.familyStatus || "single"
  );
  const [children, setChildren] = useState(
    employeeData?.children?.toString() || "0"
  );
  const [showResults, setShowResults] = useState(false);
  const [benefits, setBenefits] = useState({
    transport: employeeData?.benefits?.transport || 0,
    housing: employeeData?.benefits?.housing || 0,
    thirteenthMonth: employeeData?.benefits?.thirteenthMonth || false
  });

  // État pour stocker les détails du calcul
  const [calculationDetails, setCalculationDetails] = useState(() => {
    return calculateNetSalary(grossSalary, familyStatus, parseInt(children), benefits, country);
  });

  // Fonction pour formater la monnaie
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Fonction pour afficher les résultats
  const renderResults = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="text-sm font-medium mb-2">Salaire brut</h4>
            <div className="text-2xl font-bold">{formatCurrency(grossSalary)}</div>
            <div className="text-xs text-muted-foreground mt-1">Base mensuelle</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="text-sm font-medium mb-2">Salaire net</h4>
            <div className="text-2xl font-bold text-benin-green">{formatCurrency(calculationDetails.netSalary)}</div>
            <div className="text-xs text-muted-foreground mt-1">Après impôts et charges</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Déductions</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{country === 'benin' ? 'CNSS (3.6%)' : 'CNSS/AMU (4%)'}</span>
                <span className="font-medium">-{formatCurrency(calculationDetails.socialCharges)}</span>
              </div>
              <div className="flex justify-between">
                <span>{country === 'benin' ? 'ITS' : 'IRPP'}</span>
                <span className="font-medium">-{formatCurrency(calculationDetails.irpp)}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Avantages</h4>
            <div className="space-y-2">
              {benefits.transport > 0 && (
                <div className="flex justify-between">
                  <span>Prime de transport</span>
                  <span className="font-medium">+{formatCurrency(benefits.transport)}</span>
                </div>
              )}
              {benefits.housing > 0 && (
                <div className="flex justify-between">
                  <span>Indemnité de logement</span>
                  <span className="font-medium">+{formatCurrency(benefits.housing)}</span>
                </div>
              )}
              {benefits.thirteenthMonth && (
                <div className="flex justify-between">
                  <span>13ème mois (mensualité)</span>
                  <span className="font-medium">+{formatCurrency(grossSalary / 12)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mise à jour des calculs quand les paramètres changent
  useEffect(() => {
    const result = calculateNetSalary(grossSalary, familyStatus, parseInt(children), benefits, country);
    setCalculationDetails(result);
    
    // Update the last simulation in the store
    updateLastSimulation({
      grossSalary,
      netSalary: result.netSalary,
      socialCharges: result.socialCharges,
      tax: result.tax,
      date: new Date().toISOString(),
    });
  }, [grossSalary, familyStatus, children, benefits, updateLastSimulation, country]);

  // Ajouter un effet pour mettre à jour le titre avec le nom de l'employé
  useEffect(() => {
    if (employeeData) {
      document.title = `Simulation de salaire - ${employeeData.name}`;
    }
  }, [employeeData]);

  // Fonction pour sauvegarder la simulation et naviguer vers le tableau de bord
  const handleSaveAndViewDashboard = () => {
    updateLastSimulation({
      grossSalary,
      netSalary: calculationDetails.netSalary,
      socialCharges: calculationDetails.socialCharges,
      irpp: calculationDetails.irpp,
      date: new Date().toISOString(),
    });
    // Force navigation to employee dashboard using window.location
    window.location.href = '/employee-dashboard';
  };

  // Mettre à jour l'en-tête pour inclure les informations de l'employé
  const renderHeader = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Simulateur de Salaire</h1>
            {employeeData && (
              <p className="text-muted-foreground">
                {employeeData.name} - {employeeData.position}
              </p>
            )}
          </div>
        </div>
        <p className="text-muted-foreground mt-2">
          Calculez votre salaire net/brut et obtenez une analyse détaillée
        </p>
      </div>
      
      <div className="flex items-center space-x-2 mt-4 md:mt-0">
        <span className="text-sm font-medium">Pays:</span>
        <Select defaultValue={country}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="benin">Bénin</SelectItem>
            <SelectItem value="togo">Togo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Fonction pour gérer le changement de salaire brut
  const handleGrossSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setGrossSalary(value);
    
    // Calcul automatique du net
    const result = calculateNetSalary(value, familyStatus, parseInt(children), benefits, country);
    setNetSalary(result.netSalary.toString());
    setCalculationDetails(result);
  };

  // Handlers pour les avantages
  const handleTransportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setBenefits(prev => ({ ...prev, transport: value }));
  };

  const handleHousingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setBenefits(prev => ({ ...prev, housing: value }));
  };

  const handleThirteenthMonthChange = (checked: boolean) => {
    setBenefits(prev => ({ ...prev, thirteenthMonth: checked }));
  };

  // Handler pour le calcul
  const handleCalculate = () => {
    const result = calculateNetSalary(grossSalary, familyStatus, parseInt(children), benefits, country);
    setCalculationDetails(result);
    setShowResults(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {renderHeader()}
          
          {/* Onglets de type de simulation */}
          <Tabs defaultValue="gross-to-net" className="mb-8" onValueChange={setSimulationType}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="gross-to-net">
                <ArrowDownRight className="h-4 w-4 mr-2" />
                Brut → Net
              </TabsTrigger>
              <TabsTrigger value="net-to-gross">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Net → Brut
              </TabsTrigger>
              <TabsTrigger value="compare">
                <BarChart2 className="h-4 w-4 mr-2" />
                Comparaison
              </TabsTrigger>
            </TabsList>
            
            {/* Contenu de l'onglet Brut → Net */}
            <TabsContent value="gross-to-net">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Panneau de gauche - Paramètres */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres de simulation</CardTitle>
                      <CardDescription>
                        Ajustez les valeurs selon votre situation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-4">Salaire brut mensuel</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label htmlFor="gross-salary">Montant</Label>
                            <span className="font-medium text-benin-green">{formatCurrency(grossSalary)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Input
                              id="gross-salary"
                              type="number"
                              value={grossSalary}
                              onChange={handleGrossSalaryChange}
                              className="flex-1"
                              min={50000}
                              max={2000000}
                              step={1000}
                            />
                            <span className="text-sm text-muted-foreground whitespace-nowrap">FCFA / mois</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground text-center">
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                              <div>SMIG</div>
                              <div className="font-medium">52 000 FCFA</div>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                              <div>Moyen</div>
                              <div className="font-medium">250 000 FCFA</div>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                              <div>Élevé</div>
                              <div className="font-medium">1 000 000 FCFA</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Situation personnelle */}
                      <div>
                        <h3 className="text-sm font-medium mb-4">Situation personnelle</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="family-status">Situation familiale</Label>
                            <Select 
                              defaultValue={familyStatus} 
                              onValueChange={(value: "single" | "married" | "divorced") => setFamilyStatus(value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">Célibataire</SelectItem>
                                <SelectItem value="married">Marié(e)</SelectItem>
                                <SelectItem value="divorced">Divorcé(e)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="children">Enfants à charge</Label>
                            <Select defaultValue={children} onValueChange={setChildren}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Aucun</SelectItem>
                                <SelectItem value="1">1 enfant</SelectItem>
                                <SelectItem value="2">2 enfants</SelectItem>
                                <SelectItem value="3">3 enfants</SelectItem>
                                <SelectItem value="4">4 enfants</SelectItem>
                                <SelectItem value="5">5 enfants ou plus</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Avantages */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium">Avantages et primes</h3>
                          <Badge variant="outline">Optionnel</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Checkbox 
                                id="transport-allowance" 
                                checked={benefits.transport > 0}
                                onCheckedChange={(checked) => {
                                  if (!checked) setBenefits(prev => ({ ...prev, transport: 0 }));
                                }}
                              />
                              <label htmlFor="transport-allowance" className="ml-2 text-sm">
                                Prime de transport
                              </label>
                            </div>
                            <Input
                              type="number"
                              placeholder="Montant"
                              className="w-24 h-8 text-sm"
                              value={benefits.transport || ''}
                              onChange={handleTransportChange}
                              disabled={benefits.transport === 0}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Checkbox 
                                id="housing-allowance" 
                                checked={benefits.housing > 0}
                                onCheckedChange={(checked) => {
                                  if (!checked) setBenefits(prev => ({ ...prev, housing: 0 }));
                                }}
                              />
                              <label htmlFor="housing-allowance" className="ml-2 text-sm">
                                Indemnité de logement
                              </label>
                            </div>
                            <Input
                              type="number"
                              placeholder="Montant"
                              className="w-24 h-8 text-sm"
                              value={benefits.housing || ''}
                              onChange={handleHousingChange}
                              disabled={benefits.housing === 0}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Checkbox 
                                id="thirteenth-month"
                                checked={benefits.thirteenthMonth}
                                onCheckedChange={handleThirteenthMonthChange}
                              />
                              <label htmlFor="thirteenth-month" className="ml-2 text-sm">
                                13ème mois
                              </label>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              (annualisé)
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-benin-green hover:bg-benin-green/90"
                        onClick={handleCalculate}
                      >
                        <Calculator className="mr-2 h-4 w-4" />
                        Calculer le salaire net
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Panneau de droite - Résultats */}
                <div className="lg:col-span-2 space-y-6">
                  {showResults ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>Résultats de la simulation</CardTitle>
                          <CardDescription>
                            Basé sur la législation {country === "benin" ? "béninoise" : "togolaise"} en vigueur (mai 2025)
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Résumé des résultats - côté gauche */}
                            <div className="space-y-6">
                              {renderResults()}
                            </div>
                            
                            {/* Visualisations - côté droit */}
                            <div className="space-y-6">
                              {/* Graphique en anneau */}
                              <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                                <h3 className="font-medium mb-4">Répartition du salaire</h3>
                                <div className="h-[250px]">
                                  <PieChart>
                                    {/* Mock chart content */}
                                  </PieChart>
                                </div>
                              </div>
                              
                              {/* Détail du calcul IRPP */}
                              <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="font-medium">Détail du calcul IRPP</h3>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <div className="flex justify-between">
                                      <span>Revenu imposable</span>
                                      <span>337 400 FCFA</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Salaire brut - cotisations sociales
                                    </div>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div>
                                    <div className="flex justify-between font-medium">
                                      <span>Calcul par tranches:</span>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                      <div className="flex justify-between">
                                        <span>Tranche 0% (≤ 50 000)</span>
                                        <span>0 FCFA</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Tranche 10% (50 001 à 130 000)</span>
                                        <span>8 000 FCFA</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Tranche 15% (130 001 à 280 000)</span>
                                        <span>22 500 FCFA</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Tranche 20% (280 001 à 337 400)</span>
                                        <span>11 480 FCFA</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div className="flex justify-between">
                                    <span>Total IRPP mensuel</span>
                                    <span className="font-medium">54 775 FCFA</span>
                                  </div>
                                  
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Taux moyen d'imposition</span>
                                    <span>15.65% du salaire brut</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Informations complémentaires et comparatifs */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Informations complémentaires</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue="details">
                            <TabsList className="w-full">
                              <TabsTrigger value="details">Détails additionnels</TabsTrigger>
                              <TabsTrigger value="market">Comparaison marché</TabsTrigger>
                              <TabsTrigger value="employer">Coût employeur</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="details" className="mt-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                  <h4 className="text-sm font-medium mb-2">Taux de prélèvement</h4>
                                  <div className="text-2xl font-bold">19.25%</div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Cumul des charges sociales et fiscales
                                  </p>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                  <h4 className="text-sm font-medium mb-2">Salaire horaire net</h4>
                                  <div className="text-2xl font-bold">1 637 FCFA</div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Base 40h/semaine (173h/mois)
                                  </p>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                  <h4 className="text-sm font-medium mb-2">Salaire journalier net</h4>
                                  <div className="text-2xl font-bold">13 459 FCFA</div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Base 21 jours travaillés/mois
                                  </p>
                                </div>
                              </div>
                              
                              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 text-sm">
                                <h4 className="font-medium flex items-center text-amber-800 dark:text-amber-400">
                                  <HelpCircle className="h-4 w-4 mr-2" />
                                  Information importante
                                </h4>
                                <p className="mt-1 text-amber-700 dark:text-amber-300">
                                  Cette simulation est donnée à titre indicatif et peut varier selon votre convention collective ou accords d'entreprise spécifiques. Pour une analyse précise, consultez un expert-comptable.
                                </p>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="market" className="mt-4">
                              <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium mb-4">Comparaison avec le marché</h4>
                                  <div className="h-[250px]">
                                    <BarChart data={[]} />
                                  </div>
                                </div>
                                
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium mb-4">Position sur le marché</h4>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">Positionnement global</span>
                                        <span className="text-sm font-medium">65ème percentile</span>
                                      </div>
                                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-benin-green rounded-full" style={{ width: '65%' }}></div>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Votre salaire est supérieur à 65% des salariés au Bénin
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">Dans votre secteur</span>
                                        <span className="text-sm font-medium">Conforme au marché</span>
                                      </div>
                                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>-20%</span>
                                        <span className="font-medium">Votre salaire</span>
                                        <span>+20%</span>
                                      </div>
                                      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                                        <div className="absolute top-0 left-[40%] h-4 w-4 -mt-1 bg-benin-green rounded-full"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="employer" className="mt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="text-sm font-medium mb-4">Charges patronales</h4>
                                  <div className="space-y-3">
                                    <div className="flex justify-between">
                                      <span>Salaire brut (base)</span>
                                      <span className="font-medium">350 000 FCFA</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Cotisations patronales (15.4%)</span>
                                      <span className="font-medium text-red-500">+ 53 900 FCFA</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Assurance risques (2%)</span>
                                      <span className="font-medium text-red-500">+ 7 000 FCFA</span>
                                    </div>
                                    <Separator className="my-1" />
                                    <div className="flex justify-between">
                                      <span className="font-medium">Coût total employeur</span>
                                      <span className="font-bold">410 900 FCFA</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                      <span>Ratio net/coût total</span>
                                      <span>68.78%</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-4">Répartition du coût total</h4>
                                  <div className="h-[200px]">
                                    <PieChart>
                                      {/* Mock chart content */}
                                    </PieChart>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[400px] bg-white dark:bg-gray-800 rounded-xl border p-8 text-center">
                      <div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full inline-flex items-center justify-center mb-4">
                          <Calculator className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Calculez votre salaire</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                          Ajustez les paramètres dans le panneau de gauche selon votre situation personnelle et cliquez sur le bouton "Calculer" pour voir les résultats.
                        </p>
                        <Button 
                          className="bg-benin-green hover:bg-benin-green/90"
                          onClick={() => setShowResults(true)}
                        >
                          <Calculator className="mr-2 h-4 w-4" />
                          Lancer le calcul
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Contenu de Net → Brut (structure similaire) */}
            <TabsContent value="net-to-gross">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Panneau de gauche - Paramètres */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres de simulation</CardTitle>
                      <CardDescription>
                        Calculez le salaire brut nécessaire pour obtenir un net souhaité
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-4">Salaire net souhaité</h3>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label htmlFor="net-salary">Montant net souhaité</Label>
                            <span className="font-medium text-benin-green">{formatCurrency(Number(netSalary))}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Input
                              id="net-salary"
                              type="number"
                              className="w-full"
                              value={netSalary}
                              onChange={(e) => setNetSalary(e.target.value)}
                            />
                            <span className="ml-2 text-sm text-muted-foreground whitespace-nowrap">FCFA / mois</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-4">Situation personnelle</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="family-status">Situation familiale</Label>
                            <Select 
                              defaultValue={familyStatus} 
                              onValueChange={(value: "single" | "married" | "divorced") => setFamilyStatus(value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">Célibataire</SelectItem>
                                <SelectItem value="married">Marié(e)</SelectItem>
                                <SelectItem value="divorced">Divorcé(e)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="children">Enfants à charge</Label>
                            <Select defaultValue={children} onValueChange={setChildren}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Aucun</SelectItem>
                                <SelectItem value="1">1 enfant</SelectItem>
                                <SelectItem value="2">2 enfants</SelectItem>
                                <SelectItem value="3">3 enfants</SelectItem>
                                <SelectItem value="4">4 enfants</SelectItem>
                                <SelectItem value="5">5 enfants ou plus</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium">Avantages et primes</h3>
                          <Badge variant="outline">Optionnel</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Checkbox id="transport-allowance-net" />
                              <label htmlFor="transport-allowance-net" className="ml-2 text-sm">
                                Prime de transport
                              </label>
                            </div>
                            <Input
                              type="number"
                              placeholder="Montant"
                              className="w-24 h-8 text-sm"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Checkbox id="housing-allowance-net" />
                              <label htmlFor="housing-allowance-net" className="ml-2 text-sm">
                                Indemnité de logement
                              </label>
                            </div>
                            <Input
                              type="number"
                              placeholder="Montant"
                              className="w-24 h-8 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-benin-green hover:bg-benin-green/90"
                        onClick={() => setShowResults(true)}
                      >
                        <Calculator className="mr-2 h-4 w-4" />
                        Calculer le salaire brut nécessaire
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Panneau de droite - Résultats (similar structure) */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-center h-full min-h-[400px] bg-white dark:bg-gray-800 rounded-xl border p-8 text-center">
                    <div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full inline-flex items-center justify-center mb-4">
                        <Calculator className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Calculez votre salaire brut</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Saisissez le salaire net souhaité et vos informations personnelles pour déterminer le salaire brut correspondant.
                      </p>
                      <Button 
                        className="bg-benin-green hover:bg-benin-green/90"
                        onClick={() => setShowResults(true)}
                      >
                        <Calculator className="mr-2 h-4 w-4" />
                        Lancer le calcul
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Contenu de Comparaison */}
            <TabsContent value="compare">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Simulateur gauche */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scénario A</CardTitle>
                    <CardDescription>
                      Situation actuelle
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Form for scenario A */}
                    <div className="space-y-4">
                      <div>
                        <Label>Salaire brut mensuel</Label>
                        <Input className="mt-1" defaultValue="350000" />
                      </div>
                      <div>
                        <Label>Situation familiale</Label>
                        <Select defaultValue="single">
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Célibataire</SelectItem>
                            <SelectItem value="married">Marié(e)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Enfants à charge</Label>
                        <Select defaultValue="0">
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Aucun</SelectItem>
                            <SelectItem value="1">1 enfant</SelectItem>
                            <SelectItem value="2">2 enfants</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                          <h4 className="text-sm font-medium mb-1">Salaire net estimé</h4>
                          <div className="text-2xl font-bold text-benin-green">282 625 FCFA</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Simulateur droit */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scénario B</CardTitle>
                    <CardDescription>
                      Situation simulée
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Form for scenario B */}
                    <div className="space-y-4">
                      <div>
                        <Label>Salaire brut mensuel</Label>
                        <Input className="mt-1" defaultValue="400000" />
                      </div>
                      <div>
                        <Label>Situation familiale</Label>
                        <Select defaultValue="married">
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Célibataire</SelectItem>
                            <SelectItem value="married">Marié(e)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Enfants à charge</Label>
                        <Select defaultValue="1">
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Aucun</SelectItem>
                            <SelectItem value="1">1 enfant</SelectItem>
                            <SelectItem value="2">2 enfants</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                          <h4 className="text-sm font-medium mb-1">Salaire net estimé</h4>
                          <div className="text-2xl font-bold text-benin-green">338 000 FCFA</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Différence entre les deux */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Analyse comparative</CardTitle>
                    <CardDescription>
                      Différences entre les deux scénarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Différence nette</h4>
                          <div className="text-2xl font-bold text-green-600">+55 375 FCFA</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Par mois
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Augmentation</h4>
                          <div className="text-2xl font-bold text-green-600">+19.6%</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Du salaire net
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Impact annuel</h4>
                          <div className="text-2xl font-bold text-green-600">+664 500 FCFA</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Sur 12 mois
                          </p>
                        </div>
                      </div>
                      
                      <div className="h-64">
                        <BarChart data={[]} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <h4 className="font-medium">Détails par composante</h4>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Élément</th>
                                <th className="text-right py-2">Scénario A</th>
                                <th className="text-right py-2">Scénario B</th>
                                <th className="text-right py-2">Différence</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-2">Salaire brut</td>
                                <td className="text-right">350 000</td>
                                <td className="text-right">400 000</td>
                                <td className="text-right text-green-600">+50 000</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">Cotisations sociales</td>
                                <td className="text-right">12 600</td>
                                <td className="text-right">14 400</td>
                                <td className="text-right text-red-500">-1 800</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">IRPP</td>
                                <td className="text-right">54 775</td>
                                <td className="text-right">47 600</td>
                                <td className="text-right text-green-600">+7 175</td>
                              </tr>
                              <tr>
                                <td className="py-2 font-medium">Salaire net</td>
                                <td className="text-right font-medium">282 625</td>
                                <td className="text-right font-medium">338 000</td>
                                <td className="text-right font-medium text-green-600">+55 375</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <h4 className="font-medium mb-4">Facteurs d'optimisation</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <div className="bg-green-500 text-white p-1 rounded-full mr-2 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Situation familiale:</span> Le statut "marié" permet une réduction de l'IRPP de 7 175 FCFA.
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-green-500 text-white p-1 rounded-full mr-2 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Optimisation des charges:</span> Le ratio net/brut passe de 80.75% à 84.5% grâce aux abattements familiaux.
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Add a button to save and view dashboard */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/simulation/employee')}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSaveAndViewDashboard}
            >
              Sauvegarder et voir le tableau de bord
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SimulationEmployee;
