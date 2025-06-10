import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calculator, Download, Plus, Trash2, Users, Building, PieChart, BarChart2, HelpCircle, Eye } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCountry } from "@/hooks/use-country";
import { FaEye } from "react-icons/fa";
import { PayrollPieChart, PayrollBarChart, PayrollLineChart, ChartData } from "@/components/charts/PayrollCharts";
import AdvancedSimulationModal from "@/components/modals/AdvancedSimulationModal";
import AddEmployeeModal from "@/components/modals/AddEmployeeModal";
import AddDepartmentModal from "@/components/modals/AddDepartmentModal";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

interface Stats {
  totalGrossSalary: number;
  totalBenefits: number;
  socialContributions: number;
  netSalaries: number;
  totalCost: number;
  employeeCount: number;
}

interface Department {
  id: string;
  name: string;
  budget: number;
  headcount: number;
  growthRate: number;
  plannedPositions: number;
}

interface DepartmentStats {
  totalSalary: number;
  averageSalary: number;
  employeeCount: number;
  percentageOfTotal: number;
  yearlyGrowth: number;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

interface SimulationEntrepriseProps {
  companyId?: string;
  userRole?: 'Administrateur RH' | 'Administrateur';
}

const SimulationEnterprise: React.FC<SimulationEntrepriseProps> = ({ 
  companyId = '1', // Valeur par défaut
  userRole = 'Administrateur RH' // Valeur par défaut
}) => {
  const navigate = useNavigate();
  const { country } = useCountry();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAdvancedSimulation, setShowAdvancedSimulation] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Marie Koné",
      position: "Responsable Ventes",
      department: "Commercial",
      grossSalary: 650000,
      benefits: {
        transport: 25000,
        performance: 50000,
      }
    },
    {
      id: "2",
      name: "Paul Agossou",
      position: "Développeur Frontend",
      department: "Technique",
      grossSalary: 450000,
      benefits: {
        transport: 20000,
      }
    },
    {
      id: "3",
      name: "Sophie Mensah",
      position: "Assistante RH",
      department: "Ressources Humaines",
      grossSalary: 380000,
      benefits: {
        transport: 15000,
      }
    },
    {
      id: "4",
      name: "Jean Koffi",
      position: "Directeur Technique",
      department: "Technique",
      grossSalary: 950000,
      benefits: {
        transport: 30000,
        housing: 150000,
        performance: 150000,
      }
    }
  ]);

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Technique",
      budget: 1400000,
      headcount: 2,
      growthRate: 5.5,
      plannedPositions: 2
    },
    {
      id: "2",
      name: "Commercial",
      budget: 650000,
      headcount: 1,
      growthRate: 4.2,
      plannedPositions: 1
    },
    {
      id: "3",
      name: "Ressources Humaines",
      budget: 380000,
      headcount: 1,
      growthRate: 3.8,
      plannedPositions: 0
    }
  ]);

  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // Calculate total payroll stats
  const calculateStats = (): Stats => {
    const totalGrossSalary = employees.reduce((sum, emp) => sum + emp.grossSalary, 0);
    
    const totalBenefits = employees.reduce((sum, emp) => {
      return sum + 
        (emp.benefits.transport || 0) + 
        (emp.benefits.housing || 0) + 
        (emp.benefits.performance || 0);
    }, 0);
    
    const socialContributions = totalGrossSalary * 0.154; // 15.4% employer contributions
    const netSalaries = employees.reduce((sum, emp) => {
      const employeeSocialContribution = emp.grossSalary * 0.036; // 3.6% employee contribution
      const taxableIncome = emp.grossSalary - employeeSocialContribution;
      
      // Simplified tax calculation
      let incomeTax = 0;
      if (taxableIncome <= 50000) {
        incomeTax = 0;
      } else if (taxableIncome <= 130000) {
        incomeTax = (taxableIncome - 50000) * 0.1;
      } else if (taxableIncome <= 280000) {
        incomeTax = 8000 + (taxableIncome - 130000) * 0.15;
      } else if (taxableIncome <= 530000) {
        incomeTax = 30500 + (taxableIncome - 280000) * 0.2;
      } else {
        incomeTax = 80500 + (taxableIncome - 530000) * 0.35;
      }
      
      const netSalary = emp.grossSalary - employeeSocialContribution - incomeTax;
      return sum + netSalary;
    }, 0);
    
    const totalCost = totalGrossSalary + totalBenefits + socialContributions;
    
    return {
      totalGrossSalary,
      totalBenefits,
      socialContributions,
      netSalaries,
      totalCost,
      employeeCount: employees.length
    };
  };

  const stats = calculateStats();

  // Données pour les graphiques
  const payrollDistributionData: ChartData[] = [
    { name: 'Salaires bruts', value: stats.totalGrossSalary, color: '#4F46E5' },
    { name: 'Charges sociales', value: stats.socialContributions, color: '#EF4444' },
    { name: 'Avantages', value: stats.totalBenefits, color: '#F59E0B' }
  ];

  const departmentData: ChartData[] = [
    { name: 'Technique', value: 1400000, color: '#4F46E5' },
    { name: 'Commercial', value: 650000, color: '#10B981' },
    { name: 'RH', value: 380000, color: '#F59E0B' }
  ];

  const monthlyEvolutionData: ChartData[] = [
    { name: 'Déc', value: 2300000 },
    { name: 'Jan', value: 2350000 },
    { name: 'Fév', value: 2400000 },
    { name: 'Mar', value: 2450000 },
    { name: 'Avr', value: 2500000 },
    { name: 'Mai', value: 2430000 }
  ];

  const calculateDepartmentStats = (departmentName: string): DepartmentStats => {
    const departmentEmployees = employees.filter(emp => emp.department === departmentName);
    const totalSalary = departmentEmployees.reduce((sum, emp) => sum + emp.grossSalary, 0);
    const employeeCount = departmentEmployees.length;
    
    return {
      totalSalary,
      averageSalary: employeeCount > 0 ? totalSalary / employeeCount : 0,
      employeeCount,
      percentageOfTotal: (totalSalary / stats.totalGrossSalary) * 100,
      yearlyGrowth: departments.find(d => d.name === departmentName)?.growthRate || 0
    };
  };

  const handleAddEmployee = (newEmployee: Omit<Employee, "id">) => {
    const employee = {
      ...newEmployee,
      id: (employees.length + 1).toString()
    };
    
    setEmployees([...employees, employee]);
    toast({
      title: "Employé ajouté",
      description: `${employee.name} a été ajouté avec succès.`
    });
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId));
    toast({
      title: "Employé supprimé",
      description: "L'employé a été supprimé avec succès."
    });
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadPDF = () => {
    // Création du document PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // En-tête
    doc.setFontSize(20);
    doc.text("Rapport de Masse Salariale", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Nombre d'employés: ${employees.length}`, 20, 40);
    doc.text(`Masse salariale totale: ${formatCurrency(stats.totalGrossSalary)}`, 20, 50);
    
    // Statistiques globales
    doc.setFontSize(16);
    doc.text("Statistiques Globales", 20, 70);
    
    const statsData = [
      ["Salaires bruts", formatCurrency(stats.totalGrossSalary)],
      ["Charges sociales", formatCurrency(stats.socialContributions)],
      ["Avantages", formatCurrency(stats.totalBenefits)],
      ["Coût total", formatCurrency(stats.totalCost)]
    ];
    
    autoTable(doc, {
      startY: 80,
      head: [["Indicateur", "Montant"]],
      body: statsData,
      theme: 'grid'
    });
    
    // Liste des employés
    doc.setFontSize(16);
    doc.text("Liste des Employés", 20, doc.lastAutoTable.finalY + 20);
    
    const employeeData = employees.map(emp => {
      const totalBenefits = (emp.benefits.transport || 0) + 
                           (emp.benefits.housing || 0) + 
                           (emp.benefits.performance || 0);
      return [
        emp.name,
        emp.department,
        emp.position,
        formatCurrency(emp.grossSalary),
        formatCurrency(totalBenefits)
      ];
    });
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [["Nom", "Département", "Poste", "Salaire brut", "Avantages"]],
      body: employeeData,
      theme: 'striped'
    });
    
    // Pied de page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
    
    // Sauvegarde du PDF
    doc.save("rapport-masse-salariale.pdf");
  };

  const handleAddDepartment = (newDepartment: Omit<Department, "id">) => {
    const department = {
      ...newDepartment,
      id: (departments.length + 1).toString()
    };
    
    setDepartments([...departments, department]);
    toast({
      title: "Département ajouté",
      description: `Le département ${department.name} a été ajouté avec succès.`
    });
  };

  const handleUpdateDepartment = (departmentId: string, updates: Partial<Department>) => {
    setDepartments(departments.map(dept => 
      dept.id === departmentId ? { ...dept, ...updates } : dept
    ));
    
    toast({
      title: "Département mis à jour",
      description: "Les modifications ont été enregistrées avec succès."
    });
  };

  const handleDeleteDepartment = (departmentId: string) => {
    if (employees.some(emp => emp.department === departments.find(d => d.id === departmentId)?.name)) {
      toast({
        title: "Suppression impossible",
        description: "Ce département contient des employés. Veuillez d'abord réaffecter les employés.",
        variant: "destructive"
      });
      return;
    }

    setDepartments(departments.filter(dept => dept.id !== departmentId));
    toast({
      title: "Département supprimé",
      description: "Le département a été supprimé avec succès."
    });
  };

  const simulateDepartmentGrowth = (departmentId: string, months: number) => {
    const department = departments.find(d => d.id === departmentId);
    if (!department) return null;

    const monthlyGrowthRate = department.growthRate / 12;
    const projectedBudget = department.budget * Math.pow(1 + monthlyGrowthRate / 100, months);
    const newHeadcount = department.headcount + department.plannedPositions;
    
    return {
      projectedBudget,
      newHeadcount,
      budgetIncrease: projectedBudget - department.budget,
      percentageIncrease: ((projectedBudget - department.budget) / department.budget) * 100
    };
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
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
              <h1 className="text-3xl font-bold">Simulateur Entreprise</h1>
            </div>
            <p className="text-muted-foreground">
              Gérez votre masse salariale et planifiez vos budgets RH
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <PieChart className="h-4 w-4 mr-2" />
              Vue globale
            </TabsTrigger>
            <TabsTrigger value="employees">
              <Users className="h-4 w-4 mr-2" />
              Employés
            </TabsTrigger>
            <TabsTrigger value="departments">
              <Building className="h-4 w-4 mr-2" />
              Départements
            </TabsTrigger>
            <TabsTrigger value="projections">
              <BarChart2 className="h-4 w-4 mr-2" />
              Projections
            </TabsTrigger>
          </TabsList>

          {/* Vue globale */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Masse salariale</CardTitle>
                  <CardDescription>Salaires bruts mensuels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-benin-green">{formatCurrency(stats.totalGrossSalary)}</div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span>Moyenne par employé: {formatCurrency(stats.totalGrossSalary / stats.employeeCount)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Effectif total</CardTitle>
                  <CardDescription>Employés actifs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.employeeCount}</div>
                  <div className="flex items-center mt-1">
                    <Badge variant="success" className="text-xs">+2 ce mois</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Charges sociales</CardTitle>
                  <CardDescription>Cotisations employeur</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-togo-red">{formatCurrency(stats.socialContributions)}</div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span>{Math.round((stats.socialContributions / stats.totalGrossSalary) * 100)}% de la masse salariale</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Coût total</CardTitle>
                  <CardDescription>Incluant charges et avantages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(stats.totalCost)}</div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span>Ratio net/coût: {Math.round((stats.netSalaries / stats.totalCost) * 100)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Répartition de la masse salariale</CardTitle>
                  <CardDescription>
                    Aperçu des composantes du coût salarial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-72">
                      <PayrollPieChart 
                        data={payrollDistributionData} 
                        title="Répartition de la masse salariale"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Analyse des coûts</h3>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Salaires bruts</span>
                            <span className="font-medium">{formatCurrency(stats.totalGrossSalary)}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full" 
                              style={{ width: `${(stats.totalGrossSalary / stats.totalCost) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Charges sociales patronales</span>
                            <span className="font-medium">{formatCurrency(stats.socialContributions)}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-red-500 h-full" 
                              style={{ width: `${(stats.socialContributions / stats.totalCost) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Avantages et primes</span>
                            <span className="font-medium">{formatCurrency(stats.totalBenefits)}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-500 h-full" 
                              style={{ width: `${(stats.totalBenefits / stats.totalCost) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="flex items-center justify-between font-medium">
                          <span>Coût total employeur</span>
                          <span>{formatCurrency(stats.totalCost)}</span>
                        </div>
                      </div>
                      
                      <Card className="bg-gray-50 dark:bg-gray-800 border-amber-200 dark:border-amber-900">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <HelpCircle className="h-5 w-5 mr-3 text-amber-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm mb-1">Optimisations possibles</h4>
                              <p className="text-xs text-muted-foreground">
                                Réduisez votre coût employeur de jusqu'à 8% grâce à des optimisations fiscales et sociales légales.
                              </p>
                              <Button 
                                variant="link" 
                                className="text-xs p-0 h-auto mt-1"
                                onClick={() => navigate('/optimization-guide')}
                              >
                                Découvrir comment →
                              </Button>
                            </div>
                  </div>
                </CardContent>
              </Card>
            </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par département</CardTitle>
                  <CardDescription>
                    Masse salariale par service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <PayrollBarChart 
                      data={departmentData} 
                      title="Répartition par département"
                    />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>Technique</span>
                      </div>
                      <span className="font-medium">{formatCurrency(1400000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Commercial</span>
                      </div>
                      <span className="font-medium">{formatCurrency(650000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                        <span>Ressources Humaines</span>
                      </div>
                      <span className="font-medium">{formatCurrency(380000)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Évolution mensuelle</CardTitle>
                  <CardDescription>
                    Tendance sur les 6 derniers mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <PayrollLineChart 
                      data={monthlyEvolutionData} 
                      title="Évolution mensuelle"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Décembre</span>
                      <span>Janvier</span>
                      <span>Février</span>
                      <span>Mars</span>
                      <span>Avril</span>
                      <span>Mai</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1 h-1 bg-benin-green rounded-full"></div>
                      <div className="flex-1 h-1 bg-benin-green rounded-full"></div>
                      <div className="flex-1 h-1 bg-benin-green rounded-full"></div>
                      <div className="flex-1 h-1 bg-benin-green rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger rapport
              </Button>
              <Button onClick={() => setShowAdvancedSimulation(true)}>
                <Calculator className="mr-2 h-4 w-4" />
                Lancer simulation avancée
              </Button>
            </div>
            
            {/* Modale de simulation avancée */}
            <AdvancedSimulationModal
              isOpen={showAdvancedSimulation}
              onClose={() => setShowAdvancedSimulation(false)}
              companyId={companyId}
              userRole={userRole}
            />
          </TabsContent>

          {/* Gestion des employés */}
          <TabsContent value="employees" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des employés</h2>
              <Button onClick={() => setShowAddEmployee(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un employé
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Liste des employés</CardTitle>
                    <CardDescription>
                      Masse salariale totale: {formatCurrency(stats.totalGrossSalary)}
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Rechercher..." 
                      className="w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="outline">Filtrer</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead className="text-right">Salaire brut</TableHead>
                      <TableHead className="text-right">Avantages</TableHead>
                      <TableHead className="text-right">Coût total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map(employee => {
                      const totalBenefits = (employee.benefits.transport || 0) + 
                                          (employee.benefits.housing || 0) + 
                                          (employee.benefits.performance || 0);
                      const employerCost = employee.grossSalary * 1.154 + totalBenefits;
                      
                      return (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.name}
                          </TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell className="text-right">{formatCurrency(employee.grossSalary)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(totalBenefits)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(employerCost)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Calculator className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500"
                                onClick={() => handleDeleteEmployee(employee.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Affichage de {filteredEmployees.length} employés sur {employees.length}
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Employé sélectionné</CardTitle>
                <CardDescription>
                  Détail et simulation individuelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sélectionnez un employé</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                    Cliquez sur un employé dans la liste pour voir ses détails et effectuer des simulations individuelles
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Départements */}
          <TabsContent value="departments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analyse par département</h2>
              <Button onClick={() => setShowAddDepartment(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau département
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {departments.map(department => {
                const stats = calculateDepartmentStats(department.name);
                const projection = simulateDepartmentGrowth(department.id, 12);
                
                return (
                  <Card key={department.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <span>{department.name}</span>
                        <Badge variant="outline">{stats.employeeCount} employés</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Masse salariale</span>
                          <span className="font-medium">{formatCurrency(stats.totalSalary)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Coût moyen / employé</span>
                          <span className="font-medium">{formatCurrency(stats.averageSalary)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">% de la masse salariale</span>
                          <span className="font-medium">{stats.percentageOfTotal.toFixed(1)}%</span>
                        </div>
                        {projection && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Projection à 12 mois</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Budget projeté</span>
                                <span className="font-medium">{formatCurrency(projection.projectedBudget)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Croissance</span>
                                <Badge variant="success">+{projection.percentageIncrease.toFixed(1)}%</Badge>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedDepartment(department)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeleteDepartment(department.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            
            {/* Graphiques et analyses */}
            <Card>
              <CardHeader>
                <CardTitle>Analyse comparative des départements</CardTitle>
                <CardDescription>
                  Indicateurs clés par département
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-72">
                    <PayrollPieChart 
                      data={departments.map(dept => ({
                        name: dept.name,
                        value: calculateDepartmentStats(dept.name).totalSalary,
                        color: dept.name === 'Technique' ? '#4F46E5' : 
                               dept.name === 'Commercial' ? '#10B981' : '#F59E0B'
                      }))}
                      title="Répartition de la masse salariale"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-4">Croissance par département</h4>
                      <div className="space-y-4">
                        {departments.map(dept => {
                          const projection = simulateDepartmentGrowth(dept.id, 12);
                          return (
                            <div key={dept.id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">{dept.name}</span>
                                <Badge variant="success">
                                  +{projection?.percentageIncrease.toFixed(1)}%
                                </Badge>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-benin-green h-full" 
                                  style={{ 
                                    width: `${Math.min(100, (projection?.percentageIncrease || 0))}%` 
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <HelpCircle className="h-5 w-5 mr-3 text-amber-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm mb-1">Recommandations</h4>
                            <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                              <li>Le département {departments.reduce((a, b) => 
                                calculateDepartmentStats(a.name).yearlyGrowth > 
                                calculateDepartmentStats(b.name).yearlyGrowth ? a : b
                              ).name} a la plus forte croissance.</li>
                              <li>Considérez une redistribution du budget pour équilibrer la croissance.</li>
                              <li>Planifiez les recrutements en fonction des projections de croissance.</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projections */}
          <TabsContent value="projections" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Projections budgétaires</h2>
              <div className="flex items-center space-x-2">
                <Select defaultValue="2025">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Calculator className="mr-2 h-4 w-4" />
                  Nouvelle simulation
                </Button>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de simulation</CardTitle>
                <CardDescription>
                  Définissez les hypothèses pour votre projection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-4">Hypothèses générales</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Augmentation générale</Label>
                          <div className="flex items-center mt-1">
                            <Input
                              type="number"
                              placeholder="3" 
                              className="w-20 mr-2"
                            />
                            <span className="text-sm text-muted-foreground">% par an</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Inflation prévue</Label>
                          <div className="flex items-center mt-1">
                            <Input
                              type="number"
                              placeholder="2" 
                              className="w-20 mr-2"
                            />
                            <span className="text-sm text-muted-foreground">% par an</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Horizon de projection</Label>
                          <Select defaultValue="12">
                            <SelectTrigger className="mt-1">
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
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-4">Évolution des effectifs</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Checkbox id="enable-recruitment" />
                            <label htmlFor="enable-recruitment" className="ml-2 text-sm">
                              Inclure recrutements
                            </label>
                          </div>
                          <Input
                            type="number"
                            placeholder="Nombre"
                            className="w-20 h-8 text-sm"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Checkbox id="enable-departures" />
                            <label htmlFor="enable-departures" className="ml-2 text-sm">
                              Inclure départs
                            </label>
                          </div>
                          <Input
                            type="number"
                            placeholder="Nombre"
                            className="w-20 h-8 text-sm"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Checkbox id="enable-promotions" />
                            <label htmlFor="enable-promotions" className="ml-2 text-sm">
                              Inclure promotions
                            </label>
                          </div>
                          <Input
                            type="number"
                            placeholder="Nombre"
                            className="w-20 h-8 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-4">Évolution par département</h3>
                    
                    <div className="space-y-4">
                      <Card className="bg-gray-50 dark:bg-gray-800">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Technique</h4>
                            <Badge variant="outline">2 employés</Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-2">
                              <div>
                                <Label className="text-xs">Croissance</Label>
                              <Select defaultValue="5">
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
                              <Input type="number" placeholder="0" className="h-8 text-xs" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      
                      <Card className="bg-gray-50 dark:bg-gray-800">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Commercial</h4>
                            <Badge variant="outline">1 employé</Badge>
                    </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <Label className="text-xs">Croissance</Label>
                              <Select defaultValue="7">
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
                              <Input type="number" placeholder="1" className="h-8 text-xs" />
                </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-50 dark:bg-gray-800">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Ressources Humaines</h4>
                            <Badge variant="outline">1 employé</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <Label className="text-xs">Croissance</Label>
                              <Select defaultValue="3">
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
                              <Input type="number" placeholder="0" className="h-8 text-xs" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculer la projection
                </Button>
              </CardContent>
            </Card>

              <Card>
                <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Résultats de la projection</CardTitle>
                  <CardDescription>
                      Simulation sur 12 mois (juin 2025 - mai 2026)
                  </CardDescription>
                  </div>
                  <Badge variant="warning">Simulation</Badge>
                </div>
                </CardHeader>
              <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm text-muted-foreground mb-1">Masse salariale actuelle</h4>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalGrossSalary)}</div>
                    <div className="mt-2 text-xs text-muted-foreground">Mai 2025</div>
                              </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm text-muted-foreground mb-1">Masse salariale projetée</h4>
                    <div className="text-2xl font-bold text-benin-green">{formatCurrency(stats.totalGrossSalary * 1.15)}</div>
                    <div className="mt-2 text-xs text-muted-foreground">Mai 2026</div>
                              </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm text-muted-foreground mb-1">Augmentation</h4>
                    <div className="text-2xl font-bold text-amber-500">+15%</div>
                    <div className="mt-2 text-xs text-muted-foreground">Sur 12 mois</div>
                              </div>
                            </div>
                
                <div className="h-72">
                  <PayrollLineChart 
                    data={monthlyEvolutionData} 
                    title="Évolution mensuelle"
                  />
                    </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Facteurs d'évolution</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Augmentation générale (3%)</span>
                        <span>{formatCurrency(stats.totalGrossSalary * 0.03)}</span>
                          </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: "20%" }}></div>
                            </div>
                            </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Recrutements (3 postes)</span>
                        <span>{formatCurrency(stats.totalGrossSalary * 0.08)}</span>
                          </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: "55%" }}></div>
                        </div>
                  </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Promotions</span>
                        <span>{formatCurrency(stats.totalGrossSalary * 0.04)}</span>
                  </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ width: "25%" }}></div>
                </div>
                      </div>
                      </div>
                </div>

                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <HelpCircle className="h-5 w-5 mr-3 text-amber-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm mb-1">Points d'attention</h4>
                        <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                          <li>L'augmentation de la masse salariale est supérieure à l'inflation projetée (15% vs 2%).</li>
                          <li>Le coût des nouveaux recrutements représente 55% de la hausse totale.</li>
                          <li>Considérez d'échelonner les recrutements sur deux exercices fiscaux.</li>
                        </ul>
                      </div>
                      </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={handleDownloadPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger rapport
                  </Button>
                  <Button>
                    <Calculator className="mr-2 h-4 w-4" />
                    Affiner la simulation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AdvancedSimulationModal
        isOpen={showAdvancedSimulation}
        onClose={() => setShowAdvancedSimulation(false)}
        companyId={companyId}
        userRole={userRole}
      />

      <AddEmployeeModal
        isOpen={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
        onAddEmployee={handleAddEmployee}
      />

      <AddDepartmentModal
        isOpen={showAddDepartment}
        onClose={() => setShowAddDepartment(false)}
        onAddDepartment={handleAddDepartment}
        initialDepartment={selectedDepartment || undefined}
      />
    </Layout>
  );
};

export default SimulationEnterprise;