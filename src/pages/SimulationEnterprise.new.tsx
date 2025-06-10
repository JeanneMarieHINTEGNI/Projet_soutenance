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
import { PayrollPieChart, PayrollBarChart, PayrollLineChart, ChartDataItem } from "@/components/charts/PayrollCharts";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const SalaryDistributionChart = ({ data }) => (
  <Recharts.ResponsiveContainer width="100%" height="100%">
    <Recharts.PieChart>
      <Recharts.Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Recharts.Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Recharts.Pie>
      <Recharts.Tooltip formatter={(value) => formatCurrency(value)} />
      <Recharts.Legend />
    </Recharts.PieChart>
  </Recharts.ResponsiveContainer>
);

const DepartmentBarChart = ({ data }) => (
  <Recharts.ResponsiveContainer width="100%" height="100%">
    <Recharts.BarChart data={data}>
      <Recharts.CartesianGrid strokeDasharray="3 3" />
      <Recharts.XAxis dataKey="name" />
      <Recharts.YAxis tickFormatter={(value) => formatCurrency(value)} />
      <Recharts.Tooltip formatter={(value) => formatCurrency(value)} />
      <Recharts.Bar dataKey="value" fill="#4CAF50" />
    </Recharts.BarChart>
  </Recharts.ResponsiveContainer>
);

const SimulationEnterprise: React.FC = () => {
  const navigate = useNavigate();
  
  const stats = {
    totalGrossSalary: 2430000,
    totalBenefits: 440000,
    socialContributions: 374220,
    totalCost: 3244220
  };

  const departments = [
    { name: 'Technique', value: 1400000 },
    { name: 'Commercial', value: 450000 },
    { name: 'Ressources Humaines', value: 380000 }
  ];

  const monthlyData = [
    { month: 'Décembre', value: 1400000 },
    { month: 'Janvier', value: 1400000 },
    { month: 'Février', value: 1400000 },
    { month: 'Mars', value: 1400000 },
    { month: 'Avril', value: 1400000 },
    { month: 'Mai', value: 1400000 }
  ];

  const payrollDistributionData: ChartDataItem[] = [
    { name: 'Salaires bruts', value: stats.totalGrossSalary, color: '#4F46E5' },
    { name: 'Charges sociales', value: stats.socialContributions, color: '#EF4444' },
    { name: 'Avantages', value: stats.totalBenefits, color: '#F59E0B' }
  ];

  const departmentData: ChartDataItem[] = [
    { name: 'Technique', value: 1400000, color: '#4F46E5' },
    { name: 'Commercial', value: 650000, color: '#10B981' },
    { name: 'RH', value: 380000, color: '#F59E0B' }
  ];

  const monthlyEvolutionData: ChartDataItem[] = [
    { name: 'Déc', value: 2300000 },
    { name: 'Jan', value: 2350000 },
    { name: 'Fév', value: 2400000 },
    { name: 'Mar', value: 2450000 },
    { name: 'Avr', value: 2500000 },
    { name: 'Mai', value: 2430000 }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Simulateur Entreprise</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Statistiques principales */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques globales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Salaires bruts</span>
                      <span className="font-medium">{formatCurrency(stats.totalGrossSalary)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Charges sociales</span>
                      <span className="font-medium">{formatCurrency(stats.socialContributions)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avantages et primes</span>
                      <span className="font-medium">{formatCurrency(stats.totalBenefits)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Coût total employeur</span>
                      <span className="font-medium">{formatCurrency(stats.totalCost)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Répartition de la masse salariale */}
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
                      <PayrollPieChart data={payrollDistributionData} />
                    </div>
                    {/* ... rest of the content ... */}
                  </div>
                </CardContent>
              </Card>

              {/* Répartition par département */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par département</CardTitle>
                  <CardDescription>
                    Masse salariale par service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <PayrollBarChart data={departmentData} dataKey="value" nameKey="name" />
                  </div>
                  {/* ... rest of the content ... */}
                </CardContent>
              </Card>
              
              {/* Évolution mensuelle */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution mensuelle</CardTitle>
                  <CardDescription>
                    Tendance sur les 6 derniers mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <PayrollLineChart data={monthlyEvolutionData} />
                  </div>
                  {/* ... rest of the content ... */}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SimulationEnterprise; 