import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import * as Recharts from 'recharts';

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

const SimulationEnterprise = () => {
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
          <Card>
            <CardHeader>
              <CardTitle>Répartition de la masse salariale</CardTitle>
              <CardDescription>Aperçu des composantes du coût salarial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <SalaryDistributionChart
                  data={[
                    { name: 'Salaires bruts', value: stats.totalGrossSalary, color: '#4CAF50' },
                    { name: 'Charges sociales', value: stats.socialContributions, color: '#2196F3' },
                    { name: 'Avantages', value: stats.totalBenefits, color: '#FFC107' }
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Répartition par département */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Répartition par département</CardTitle>
              <CardDescription>Masse salariale par service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <DepartmentBarChart data={departments} />
              </div>
            </CardContent>
          </Card>

          {/* Évolution mensuelle */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Évolution mensuelle</CardTitle>
              <CardDescription>Tendance sur les 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <DepartmentBarChart data={monthlyData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SimulationEnterprise; 