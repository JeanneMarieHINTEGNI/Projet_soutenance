import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Department {
  name: string;
  budget: number;
  headcount: number;
  growthRate: number;
  plannedPositions: number;
}

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDepartment: (department: Omit<Department, "id">) => void;
  initialDepartment?: Department;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
  onAddDepartment,
  initialDepartment
}) => {
  const [formData, setFormData] = useState<Omit<Department, "id">>(
    initialDepartment || {
      name: "",
      budget: 0,
      headcount: 0,
      growthRate: 0,
      plannedPositions: 0
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDepartment(formData);
    onClose();
  };

  const handleChange = (field: keyof Department, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === "name" ? value : Number(value)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialDepartment ? "Modifier le département" : "Nouveau département"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du département</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ex: Marketing"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget mensuel (XOF)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange("budget", e.target.value)}
              placeholder="Ex: 1000000"
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headcount">Effectif actuel</Label>
            <Input
              id="headcount"
              type="number"
              value={formData.headcount}
              onChange={(e) => handleChange("headcount", e.target.value)}
              placeholder="Ex: 5"
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="growthRate">Taux de croissance annuel (%)</Label>
            <Input
              id="growthRate"
              type="number"
              value={formData.growthRate}
              onChange={(e) => handleChange("growthRate", e.target.value)}
              placeholder="Ex: 5"
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plannedPositions">Postes prévus</Label>
            <Input
              id="plannedPositions"
              type="number"
              value={formData.plannedPositions}
              onChange={(e) => handleChange("plannedPositions", e.target.value)}
              placeholder="Ex: 2"
              required
              min="0"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {initialDepartment ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentModal; 