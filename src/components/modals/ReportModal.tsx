import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FileText, Download, Printer, Save, Share2, Eye } from 'lucide-react';
import { Report, ReportType, ReportStatus } from '@/types/reports';
import { useReportsStore } from '@/stores/reports.store';
import { usePayrollStore } from '@/stores/payroll.store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType?: ReportType;
  report?: Report;
}

const reportFormSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  status: z.enum(['draft', 'pending', 'validated', 'archived'] as const),
  period: z.string().min(1, "Veuillez sélectionner une période")
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  report
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const { employees, departments } = usePayrollStore();
  const {
    generateSocialReport,
    generateSalaryAnalysis,
    generateBudgetForecast,
    generateHRMetrics,
    exportReportToPDF,
    exportReportToExcel,
    addReport,
    updateReport
  } = useReportsStore();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: report?.title || '',
      description: report?.description || '',
      status: report?.status || 'draft',
      period: selectedPeriod
    }
  });

  const onSubmit = (data: ReportFormValues) => {
    if (report) {
      updateReport(report.id, { ...data });
    } else {
      const newReport = {
        title: data.title,
        description: data.description,
        type: reportType || 'custom',
        date: new Date().toISOString(),
        status: data.status,
        format: 'pdf',
        data: generateReport()
      };
      addReport(newReport);
    }
    onClose();
  };

  const generateReport = () => {
    if (!reportType) return null;

    switch (reportType) {
      case 'social':
        return generateSocialReport(employees, departments);
      case 'salary':
        return generateSalaryAnalysis(employees, departments);
      case 'budget':
        return generateBudgetForecast(employees, departments);
      case 'hr':
        return generateHRMetrics(employees, departments);
      default:
        return null;
    }
  };

  const reportData = report?.data || generateReport();

  const renderSocialReport = (data: any) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Effectifs</CardTitle>
          <CardDescription>Répartition des employés par département</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(data.employeeStats.byDepartment).map(([name, value]) => ({
                    name,
                    value
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.entries(data.employeeStats.byDepartment).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Salaires</CardTitle>
          <CardDescription>Distribution des salaires</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.salaryStats.salaryRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Nombre d'employés" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSalaryAnalysis = (data: any) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyse par département</CardTitle>
          <CardDescription>Comparaison des salaires moyens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageSalary" fill="#8884d8" name="Salaire moyen" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBudgetForecast = (data: any) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prévisions mensuelles</CardTitle>
          <CardDescription>Évolution de la masse salariale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Coût total" />
                <Bar dataKey="baseSalaries" fill="#82ca9d" name="Salaires de base" />
                <Bar dataKey="benefits" fill="#ffc658" name="Avantages" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHRMetrics = (data: any) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Effectifs</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Total employés</dt>
                <dd className="font-medium">{data.workforce.headcount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">ETP</dt>
                <dd className="font-medium">{data.workforce.fte}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Turnover</dt>
                <dd className="font-medium">{(data.workforce.turnover * 100).toFixed(1)}%</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recrutement</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Postes ouverts</dt>
                <dd className="font-medium">{data.recruitment.openPositions}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Entretiens</dt>
                <dd className="font-medium">{data.recruitment.interviews}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Taux d'acceptation</dt>
                <dd className="font-medium">{(data.recruitment.acceptanceRate * 100).toFixed(1)}%</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReportContent = () => {
    if (!reportData) return null;

    switch (reportType) {
      case 'social':
        return renderSocialReport(reportData);
      case 'salary':
        return renderSalaryAnalysis(reportData);
      case 'budget':
        return renderBudgetForecast(reportData);
      case 'hr':
        return renderHRMetrics(reportData);
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {report?.title || 'Nouveau rapport'}
          </DialogTitle>
          <DialogDescription>
            {report?.description || 'Générer et visualiser le rapport'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="settings">
              <FileText className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="flex justify-between items-center">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sélectionner la période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Période en cours</SelectItem>
                  <SelectItem value="previous">Période précédente</SelectItem>
                  <SelectItem value="year">Année en cours</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => exportReportToPDF(report!)}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" onClick={() => exportReportToExcel(report!)}>
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>

            {renderReportContent()}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres du rapport</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre du rapport</FormLabel>
                          <FormControl>
                            <Input placeholder="Saisissez un titre..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Décrivez le rapport..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Statut</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un statut" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Brouillon</SelectItem>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="validated">Validé</SelectItem>
                              <SelectItem value="archived">Archivé</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Période</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une période" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="current">Période en cours</SelectItem>
                              <SelectItem value="previous">Période précédente</SelectItem>
                              <SelectItem value="year">Année en cours</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={onClose}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {report ? 'Mettre à jour' : 'Créer le rapport'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal; 