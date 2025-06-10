import { X, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface SimulationParams {
  generalIncrease: number;
  inflation: number;
  horizon: string;
  departments: {
    [key: string]: {
      growth: string;
      newPositions: number;
    };
  };
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

interface SimulationDrawerProps {
  open: boolean;
  onClose: () => void;
  simulationParams: SimulationParams;
  employees: Employee[];
  onParamChange: (field: string, value: any) => void;
  onDepartmentParamChange: (department: string, field: string, value: any) => void;
  onSimulate: () => void;
}

export const SimulationDrawer = ({
  open,
  onClose,
  simulationParams,
  employees,
  onParamChange,
  onDepartmentParamChange,
  onSimulate
}: SimulationDrawerProps) => {
  return (
    <div 
      className={`fixed inset-y-0 right-0 w-[600px] bg-background border-l border-border transform transition-transform duration-200 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
    >
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Simulation de masse salariale</h2>
              <p className="text-muted-foreground">Définissez vos paramètres de projection</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hypothèses générales</CardTitle>
                <CardDescription>Paramètres globaux de la simulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Augmentation générale</Label>
                    <div className="flex items-center mt-1">
                      <Input
                        type="number"
                        value={simulationParams.generalIncrease}
                        onChange={(e) => onParamChange('generalIncrease', parseFloat(e.target.value))}
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
                        value={simulationParams.inflation}
                        onChange={(e) => onParamChange('inflation', parseFloat(e.target.value))}
                        className="w-20 mr-2"
                      />
                      <span className="text-sm text-muted-foreground">% par an</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Horizon de projection</Label>
                  <Select 
                    value={simulationParams.horizon}
                    onValueChange={(value) => onParamChange('horizon', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 mois</SelectItem>
                      <SelectItem value="6">6 mois</SelectItem>
                      <SelectItem value="12">12 mois</SelectItem>
                      <SelectItem value="24">24 mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution par département</CardTitle>
                <CardDescription>Paramètres spécifiques à chaque service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(simulationParams.departments).map(([department, params]) => (
                  <Card key={department} className="bg-gray-50 dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{department}</h4>
                        <Badge variant="outline">
                          {employees.filter(e => e.department === department).length} employés
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Croissance</Label>
                          <Select 
                            value={params.growth}
                            onValueChange={(value) => onDepartmentParamChange(department, 'growth', value)}
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
                            value={params.newPositions}
                            onChange={(e) => onDepartmentParamChange(department, 'newPositions', parseInt(e.target.value))}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <Button className="w-full" onClick={onSimulate}>
            <Calculator className="mr-2 h-4 w-4" />
            Lancer la simulation
          </Button>
        </div>
      </div>
    </div>
  );
}; 