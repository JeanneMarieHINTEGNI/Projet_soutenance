import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Department } from "@/types/payroll";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DepartmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | undefined;
  onEdit: (department: Department) => void;
  employeeCount: number;
  totalSalary: number;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const DepartmentDetailsModal: React.FC<DepartmentDetailsModalProps> = ({
  isOpen,
  onClose,
  department,
  onEdit,
  employeeCount,
  totalSalary
}) => {
  if (!department) return null;

  const budgetUtilization = (totalSalary / department.budget) * 100;
  const headcountUtilization = (employeeCount / department.headcount) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails du département</DialogTitle>
          <DialogDescription>
            Informations détaillées sur le département {department.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Nom du département</Label>
              <div className="font-medium text-lg">{department.name}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Budget alloué</Label>
              <div className="font-medium text-lg">{formatCurrency(department.budget)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Effectif actuel</Label>
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg">{employeeCount}</span>
                <Badge variant={employeeCount < department.headcount ? "outline" : "default"}>
                  {department.headcount} postes prévus
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Masse salariale actuelle</Label>
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg">{formatCurrency(totalSalary)}</span>
                {department.growthRate > 0 ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{department.growthRate}%
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {department.growthRate}%
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">Utilisation du budget</Label>
              <div className="mt-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>{budgetUtilization.toFixed(1)}% utilisé</span>
                  <span>{formatCurrency(department.budget - totalSalary)} restant</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full">
                  <div 
                    className={`h-full rounded-full ${
                      budgetUtilization > 90 ? 'bg-red-500' : 
                      budgetUtilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Occupation des postes</Label>
              <div className="mt-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>{headcountUtilization.toFixed(1)}% des postes pourvus</span>
                  <span>{department.headcount - employeeCount} postes à pourvoir</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full">
                  <div 
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${Math.min(headcountUtilization, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {department.plannedPositions > 0 && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <Label className="text-sm font-medium">Plan de recrutement</Label>
              <div className="mt-1 text-sm">
                {department.plannedPositions} {department.plannedPositions > 1 ? 'postes' : 'poste'} à pourvoir
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={() => onEdit(department)}>
            Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentDetailsModal; 