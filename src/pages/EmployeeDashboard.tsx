import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCountry } from "@/hooks/use-country";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Calculator,
  Calendar,
  CalendarDays,
  ChartBar,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Mail,
  Printer,
  Save,
  Share2,
  Target,
  TrendingUp,
  User as UserIcon,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { useEmployeeData } from "@/hooks/use-employee-data";

// Sample data for the dashboard
const salaryHistoryData = [
  { month: "Jun 24", salary: 220000 },
  { month: "Jul 24", salary: 220000 },
  { month: "Aug 24", salary: 220000 },
  { month: "Sep 24", salary: 220000 },
  { month: "Oct 24", salary: 250000, event: "Augmentation" },
  { month: "Nov 24", salary: 250000 },
  { month: "Dec 24", salary: 270000, event: "Prime" },
  { month: "Jan 25", salary: 250000 },
  { month: "Feb 25", salary: 250000 },
  { month: "Mar 25", salary: 265000, event: "Augmentation" },
  { month: "Apr 25", salary: 265000 },
  { month: "May 25", salary: 265000 }
];

const mockDocuments = [
  { name: "Bulletin de paie - Mai 2025", type: "Bulletin", date: "28/05/2025", icon: "FileText" },
  { name: "Bulletin de paie - Avril 2025", type: "Bulletin", date: "28/04/2025", icon: "FileText" },
  { name: "Attestation de travail", type: "Attestation", date: "15/03/2025", icon: "FileText" }
];

const mockLeavesData = [
  { type: "Congés annuels", start: "05/08/2025", end: "20/08/2025", days: 12, status: "approved" },
  { type: "Congés annuels", start: "02/05/2025", end: "03/05/2025", days: 2, status: "approved" },
  { type: "Congé maladie", start: "15/02/2025", end: "17/02/2025", days: 3, status: "justified" }
];

// Add new LeaveRequest type
interface LeaveRequest {
  type: string;
  startDate: Date;
  endDate: Date;
  reason: string;
}

// Add new function to calculate business days between two dates
const getBusinessDays = (startDate: Date, endDate: Date) => {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { country } = useCountry();
  const { employeeData } = useEmployeeData();
  const [salaryView, setSalaryView] = useState<string>("net");
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest>({
    type: "annual",
    startDate: new Date(),
    endDate: new Date(),
    reason: ""
  });
  const currencySymbol = "FCFA";
  
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Add error state
  const [error, setError] = useState<string | null>(null);

  // Add function to handle leave request submission
  const handleLeaveRequest = () => {
    const days = getBusinessDays(leaveRequest.startDate, leaveRequest.endDate);
    if (days <= 0) {
      toast({
        title: "Erreur",
        description: "La date de fin doit être après la date de début",
        variant: "destructive"
      });
      return;
    }
    
    if (days > 14) { // Current available days
      toast({
        title: "Erreur",
        description: "Vous n'avez pas assez de jours de congés disponibles",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Demande envoyée",
        description: `Votre demande de ${days} jours de congés a été envoyée pour approbation.`,
      });
      setShowLeaveDialog(false);
    }, 1000);
  };

  // Add LeaveRequestDialog component
  const LeaveRequestDialog = () => (
    <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de congés</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour soumettre votre demande de congés.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="leave-type" className="text-right">
              Type
            </Label>
            <Select
              value={leaveRequest.type}
              onValueChange={(value) => setLeaveRequest({ ...leaveRequest, type: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Type de congé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">Congés annuels</SelectItem>
                <SelectItem value="sick">Congé maladie</SelectItem>
                <SelectItem value="special">Congé spécial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Période</Label>
            <div className="col-span-3">
              <div className="flex flex-col gap-2">
                <CalendarComponent
                  mode="range"
                  selected={{
                    from: leaveRequest.startDate,
                    to: leaveRequest.endDate
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setLeaveRequest({
                        ...leaveRequest,
                        startDate: range.from,
                        endDate: range.to
                      });
                    }
                  }}
                  locale={fr}
                  disabled={(date) => {
                    const day = date.getDay();
                    return day === 0 || day === 6;
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Motif
            </Label>
            <Input
              id="reason"
              className="col-span-3"
              value={leaveRequest.reason}
              onChange={(e) => setLeaveRequest({ ...leaveRequest, reason: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
            Annuler
          </Button>
          <Button onClick={handleLeaveRequest}>Soumettre la demande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Add function to handle document download
  const handleDownload = (documentName: string) => {
    toast({
      title: "Téléchargement démarré",
      description: `Le document "${documentName}" va être téléchargé.`
    });
  };

  // Add function to handle document preview
  const handlePreview = (documentName: string) => {
    toast({
      title: "Aperçu du document",
      description: `L'aperçu de "${documentName}" va s'ouvrir dans un nouvel onglet.`
    });
  };
  
  // Format currency for display
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value.replace(/[^\d]/g, ''), 10) : value;
    return `${numValue.toLocaleString()} ${currencySymbol}`;
  };

  const handleSimulateSalary = () => {
    navigate('/simulation/employee');
  };

  const handleViewAllDocuments = () => {
    toast({
      title: "Documents",
      description: "La section des documents va s'ouvrir dans un nouvel onglet.",
    });
  };

  const handleViewEmployeeDetails = () => {
    toast({
      title: "Détails de l'employé",
      description: "Les détails complets vont s'ouvrir dans un nouvel onglet.",
    });
  };

  const handleViewLeaveDetails = () => {
    toast({
      title: "Détails des congés",
      description: "Les détails des congés vont s'ouvrir dans un nouvel onglet.",
    });
  };

  const handleDownloadAll = () => {
    toast({
      title: "Téléchargement groupé",
      description: "Le téléchargement de tous les documents va démarrer.",
    });
  };

  const handleNewLeaveRequest = () => {
    setShowLeaveDialog(true);
    toast({
      title: "Nouvelle demande de congés",
      description: "Le formulaire de demande de congés est maintenant ouvert.",
    });
  };

  const handleViewPayslip = (month: string) => {
    toast({
      title: "Bulletin de paie",
      description: `Le bulletin de paie de ${month} va s'ouvrir dans un nouvel onglet.`,
    });
  };

  const handleViewContract = (documentName: string) => {
    toast({
      title: "Visualisation de document",
      description: `Le document "${documentName}" va s'ouvrir dans un nouvel onglet.`,
    });
  };

  const handleViewCertificate = (documentName: string) => {
    toast({
      title: "Visualisation du certificat",
      description: `Le certificat "${documentName}" va s'ouvrir dans un nouvel onglet.`,
    });
  };

  const handleDownloadDocument = (documentName: string) => {
    toast({
      title: "Téléchargement",
      description: `Le document "${documentName}" va être téléchargé.`,
    });
  };

  useEffect(() => {
    // Simulate data loading and check for employee data
    const timer = setTimeout(() => {
        setIsLoading(false);
      if (!employeeData) {
        setError("Aucune donnée employé trouvée. Veuillez d'abord effectuer une simulation.");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [employeeData]);

  // Redirect to simulation if no employee data and not loading
  useEffect(() => {
    if (!isLoading && !employeeData) {
      navigate('/simulation/employee');
    }
  }, [isLoading, employeeData, navigate]);

  if (error) {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => navigate('/simulation/employee')}>
              Aller à la page de simulation
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        ) : employeeData ? (
          <>
            {/* Employee Overview Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{employeeData.name}</CardTitle>
                    <CardDescription>{employeeData.position}</CardDescription>
                  </div>
                  <Button onClick={handleSimulateSalary}>
                    <Calculator className="mr-2 h-4 w-4" />
                    Nouvelle simulation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Dernier salaire brut
                      </CardTitle>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(employeeData.lastSimulation?.grossSalary || employeeData.currentSalary)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Dernier salaire net
                      </CardTitle>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(employeeData.lastSimulation?.netSalary || 0)}
                      </div>
                    </CardContent>
                  </Card>
                  {/* Add more cards for other metrics */}
                </div>
              </CardContent>
            </Card>

            {/* Rest of the dashboard content */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
              {/* Employee Profile Card - Updated with dark mode support */}
              <div className="w-full md:w-64 flex flex-col items-center bg-card text-card-foreground rounded-lg p-6 shadow-sm transition-colors duration-200">
            <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-muted-foreground" />
              </div>
                  <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            
            <h2 className="mt-4 text-xl font-bold">Simon Adoko</h2>
            <p className="text-sm text-muted-foreground">Développeur Front-end</p>
            <Badge className="mt-2" variant="outline">Tech</Badge>
            
                <div className="w-full mt-4 pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">Chez TechnoBénin depuis:</div>
              <div className="font-medium">2 ans et 4 mois</div>
            </div>
            
                <Button className="w-full mt-4" variant="default" onClick={handleSimulateSalary}>
              <Calculator className="mr-2 h-4 w-4" />
              Simuler mon salaire
            </Button>
          </div>
          
              {/* Main Content Area - Updated with dark mode support */}
              <div className="flex-1 space-y-6">
                <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Salary KPI - Updated with dark mode support */}
                  <Card className="bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Salaire net</CardTitle>
                  <CardDescription>Mai 2025</CardDescription>
                </CardHeader>
                <CardContent>
                      <div className="text-2xl font-bold text-foreground">265 000 FCFA</div>
                  <div className="flex items-center mt-1 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+5.2%</span>
                    <span className="text-muted-foreground ml-1">vs mois précédent</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Leave KPI */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Congés disponibles</CardTitle>
                  <CardDescription>À prendre avant Déc. 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14 jours</div>
                  <div className="flex items-center mt-1 text-xs">
                    <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                    <span className="text-muted-foreground">Prochains congés: Août</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Annual Earnings KPI */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Cumul annuel</CardTitle>
                  <CardDescription>Jan - Mai 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1 295 000 FCFA</div>
                  <div className="flex items-center mt-1 text-xs">
                    <Target className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="text-blue-500 font-medium">43%</span>
                    <span className="text-muted-foreground ml-1">de l'objectif annuel</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Salary Evolution Chart */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Évolution de mon salaire</CardTitle>
              <CardDescription>12 derniers mois</CardDescription>
            </div>
            <Select defaultValue="net" onValueChange={setSalaryView}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type d'affichage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="net">Salaire Net</SelectItem>
                <SelectItem value="gross">Salaire Brut</SelectItem>
                <SelectItem value="both">Net et Brut</SelectItem>
                <SelectItem value="deductions">Charges et Déductions</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salaryHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Salaire Net']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <ReferenceLine x="Oct 24" stroke="#FF8042" label={{ position: 'top', value: 'Augmentation', fill: '#FF8042' }} />
                  <ReferenceLine x="Dec 24" stroke="#FFBB28" label={{ position: 'top', value: 'Prime', fill: '#FFBB28' }} />
                  <ReferenceLine x="Mar 25" stroke="#FF8042" label={{ position: 'top', value: 'Augmentation', fill: '#FF8042' }} />
                  <Line
                    type="monotone"
                    dataKey="salary"
                    stroke="#2E7D32"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Documents and Leaves Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-blue-500" />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-xs text-muted-foreground">Émis le {doc.date}</div>
                      </div>
                    </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc.name)}>
                      <Download className="h-4 w-4" />
                    </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleViewCertificate(doc.name)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                  </div>
                ))}
              </div>
              
                  <Button variant="outline" className="w-full mt-4" onClick={handleDownloadAll}>
                    <Download className="mr-2 h-4 w-4" />
                    Tout télécharger
              </Button>
            </CardContent>
          </Card>
          
          {/* Leaves and Absences */}
          <Card>
            <CardHeader>
              <CardTitle>Congés et absences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium">Solde actuel</div>
                    <div className="text-2xl font-bold">14 jours</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Utilisés cette année</div>
                    <div className="text-2xl font-bold">10 jours</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">En attente</div>
                    <div className="text-2xl font-bold">0</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Prochains congés planifiés</div>
                  <div className="flex items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <Calendar className="h-5 w-5 mr-3 text-green-500" />
                    <div className="flex-1">
                      <div className="font-medium">Congés annuels</div>
                      <div className="text-xs text-muted-foreground">Du 05/08/2025 au 20/08/2025 (12 jours)</div>
                    </div>
                    <Badge variant="secondary">Approuvé</Badge>
                  </div>
                </div>
                
                    <Button onClick={handleNewLeaveRequest}>
                  <Calendar className="mr-2 h-4 w-4" />
                      Nouvelle demande
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="documents">Mes documents</TabsTrigger>
            <TabsTrigger value="salary">Détail des revenus</TabsTrigger>
            <TabsTrigger value="leaves">Congés</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Detailed Overview Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu personnel</CardTitle>
                <CardDescription>Informations clés et statistiques</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Informations professionnelles</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Poste:</span>
                        <p className="font-medium">Développeur Front-end</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Département:</span>
                        <p className="font-medium">Technique</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Manager:</span>
                        <p className="font-medium">Franck Touré</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Date d'embauche:</span>
                        <p className="font-medium">15/01/2023</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Performance 2025</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Objectifs atteints:</span>
                        <p className="font-medium">4 sur 6</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Évaluation prévue:</span>
                        <p className="font-medium">18/06/2025</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Formations suivies:</span>
                        <p className="font-medium">2 (React Advanced, UX Design)</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Points à revoir:</span>
                        <p className="font-medium">Test unitaires, Documentation</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Projets en cours</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Refonte PayeAfrique:</span>
                        <p className="font-medium">75% complété</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Dashboard Analytics:</span>
                        <p className="font-medium">40% complété</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Prochain milestone:</span>
                        <p className="font-medium">15/06/2025</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Tâches assignées:</span>
                        <p className="font-medium">8 (5 en cours, 3 à faire)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Tabs defaultValue="payslips">
              <TabsList>
                <TabsTrigger value="payslips">Bulletins de paie</TabsTrigger>
                <TabsTrigger value="certificates">Attestations</TabsTrigger>
                <TabsTrigger value="contracts">Contrats</TabsTrigger>
              </TabsList>
              
              <TabsContent value="payslips" className="pt-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle>Bulletins de paie</CardTitle>
                        <CardDescription>
                          Historique de vos bulletins de salaire
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Select defaultValue="2025">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Année" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                          </SelectContent>
                        </Select>
                            <Button variant="outline" onClick={handleDownloadAll}>
                          <Download className="mr-2 h-4 w-4" />
                          Tout télécharger
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Mai', 'Avril', 'Mars', 'Février', 'Janvier', 'Décembre', 'Novembre', 'Octobre'].map((month, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-medium">{month}</h3>
                              <p className="text-xs text-muted-foreground">2025</p>
                            </div>
                            <FileText className="h-6 w-6 text-blue-500" />
                          </div>
                          <div className="text-xs text-muted-foreground mb-3">
                            Émis le 28/{month === 'Janvier' ? '01' : month === 'Février' ? '02' : month === 'Mars' ? '03' : month === 'Avril' ? '04' : '05'}/2025
                          </div>
                          <div className="flex justify-between">
                                <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleViewPayslip(month)}>
                              <Download className="h-3 w-3 mr-1" />
                              Télécharger
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="certificates" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attestations et certificats</CardTitle>
                    <CardDescription>
                      Documents administratifs liés à votre emploi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Date d'émission</TableHead>
                          <TableHead>Validité</TableHead>
                          <TableHead>Format</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Attestation de travail</TableCell>
                          <TableCell>15/03/2025</TableCell>
                          <TableCell>Permanente</TableCell>
                          <TableCell>PDF</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument("Attestation de travail")}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleViewCertificate("Attestation de travail")}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Attestation fiscale 2024</TableCell>
                          <TableCell>15/01/2025</TableCell>
                          <TableCell>31/12/2025</TableCell>
                          <TableCell>PDF</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument("Attestation fiscale 2024")}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleViewCertificate("Attestation fiscale 2024")}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Certificat de formation React</TableCell>
                          <TableCell>05/04/2025</TableCell>
                          <TableCell>Permanente</TableCell>
                          <TableCell>PDF</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument("Certificat de formation React")}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleViewCertificate("Certificat de formation React")}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contracts" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contrats et avenants</CardTitle>
                    <CardDescription>
                      Documents contractuels de votre emploi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Date de signature</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Contrat de travail initial</TableCell>
                          <TableCell>15/01/2023</TableCell>
                          <TableCell>CDI</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument("Contrat de travail initial")}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleViewCertificate("Contrat de travail initial")}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Avenant - Promotion</TableCell>
                          <TableCell>01/10/2024</TableCell>
                          <TableCell>Modification</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument("Avenant - Promotion")}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleViewCertificate("Avenant - Promotion")}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Avenant - Augmentation</TableCell>
                          <TableCell>01/03/2025</TableCell>
                          <TableCell>Modification</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument("Avenant - Augmentation")}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleViewCertificate("Avenant - Augmentation")}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="salary" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <CardTitle>Détail des revenus</CardTitle>
                    <CardDescription>Analyse complète de votre rémunération</CardDescription>
                  </div>
                  <Select defaultValue="current">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Mois en cours</SelectItem>
                      <SelectItem value="previous">Mois précédent</SelectItem>
                      <SelectItem value="year">Année en cours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Salary breakdown */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Composition du salaire - Mai 2025</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium">Salaire de base</span>
                        <span className="font-bold">320 000 FCFA</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium">Prime de transport</span>
                        <span className="font-bold">25 000 FCFA</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-t-2 border-green-500 bg-green-50/50 dark:bg-green-950/20">
                        <span className="font-medium">Salaire brut</span>
                        <span className="font-bold">345 000 FCFA</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <span className="font-medium">Cotisations sociales</span>
                        <span className="font-bold">-18 112 FCFA</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <span className="font-medium">Impôt sur le revenu</span>
                        <span className="font-bold">-61 888 FCFA</span>
                      </div>
                      <div className="flex justify-between p-3 bg-green-100 dark:bg-green-950/30 rounded-lg border-t-2 border-green-500">
                        <span className="font-medium">Salaire net</span>
                        <span className="font-bold">265 000 FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Graphical representation */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Répartition graphique</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Salaire brut", value: 345000 },
                          { name: "Cotisations", value: 18112 },
                          { name: "Impôts", value: 61888 },
                          { name: "Salaire net", value: 265000 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Bar dataKey="value" name="Montant" fill="#2E7D32" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Year-to-date summary */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Cumul depuis janvier 2025</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mois</TableHead>
                        <TableHead>Salaire brut</TableHead>
                        <TableHead>Cotisations</TableHead>
                        <TableHead>Impôts</TableHead>
                        <TableHead>Salaire net</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Janvier</TableCell>
                        <TableCell>340 000 FCFA</TableCell>
                        <TableCell>17 850 FCFA</TableCell>
                        <TableCell>57 150 FCFA</TableCell>
                        <TableCell>265 000 FCFA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Février</TableCell>
                        <TableCell>340 000 FCFA</TableCell>
                        <TableCell>17 850 FCFA</TableCell>
                        <TableCell>57 150 FCFA</TableCell>
                        <TableCell>265 000 FCFA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Mars</TableCell>
                        <TableCell>340 000 FCFA</TableCell>
                        <TableCell>17 850 FCFA</TableCell>
                        <TableCell>57 150 FCFA</TableCell>
                        <TableCell>265 000 FCFA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Avril</TableCell>
                        <TableCell>340 000 FCFA</TableCell>
                        <TableCell>17 850 FCFA</TableCell>
                        <TableCell>57 150 FCFA</TableCell>
                        <TableCell>265 000 FCFA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Mai</TableCell>
                        <TableCell>340 000 FCFA</TableCell>
                        <TableCell>17 850 FCFA</TableCell>
                        <TableCell>57 150 FCFA</TableCell>
                        <TableCell>265 000 FCFA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold">TOTAL</TableCell>
                        <TableCell className="font-bold">1 700 000 FCFA</TableCell>
                        <TableCell className="font-bold">89 250 FCFA</TableCell>
                        <TableCell className="font-bold">285 750 FCFA</TableCell>
                        <TableCell className="font-bold">1 325 000 FCFA</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Gestion des congés</CardTitle>
                    <CardDescription>Suivi et demandes d'absence</CardDescription>
                  </div>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Nouvelle demande
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground">Solde actuel</div>
                    <div className="text-2xl font-bold">14 jours</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground">Congés pris</div>
                    <div className="text-2xl font-bold">10 jours</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground">En attente</div>
                    <div className="text-2xl font-bold">0 jours</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground">Acquisition mensuelle</div>
                    <div className="text-2xl font-bold">2 jours</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Historique des congés</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Début</TableHead>
                        <TableHead>Fin</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLeavesData.map((leave, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{leave.type}</TableCell>
                          <TableCell>{leave.start}</TableCell>
                          <TableCell>{leave.end}</TableCell>
                          <TableCell>{leave.days} jours</TableCell>
                          <TableCell>
                            <Badge 
                              variant={leave.status === "approved" ? "secondary" : "outline"}
                            >
                              {leave.status === "approved" ? "Approuvé" : "Justifié"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => handleViewEmployeeDetails()}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Prochains jours fériés</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium">Fête du Travail</div>
                        <div className="text-xs text-muted-foreground">Jour férié national</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">01/05/2025</div>
                        <div className="text-xs text-muted-foreground">Dans 10 jours</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium">Fête de l'Indépendance</div>
                        <div className="text-xs text-muted-foreground">Jour férié national</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">01/08/2025</div>
                        <div className="text-xs text-muted-foreground">Dans 3 mois</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
          </>
        ) : null}
      </div>
      
      {/* Add LeaveRequestDialog */}
      <LeaveRequestDialog />
    </Layout>
  );
};

export default EmployeeDashboard;
