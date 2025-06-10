import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: {
    name: string;
    position: string;
    department: string;
    grossSalary: number;
    benefits: {
      transport?: number;
      housing?: number;
      performance?: number;
    };
  }) => void;
}

const AddEmployeeModal = ({ isOpen, onClose, onAddEmployee }: AddEmployeeModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    grossSalary: "",
    benefits: {
      transport: "",
      housing: "",
      performance: ""
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee = {
      name: formData.name,
      position: formData.position,
      department: formData.department,
      grossSalary: Number(formData.grossSalary),
      benefits: {
        transport: Number(formData.benefits.transport) || undefined,
        housing: Number(formData.benefits.housing) || undefined,
        performance: Number(formData.benefits.performance) || undefined
      }
    };

    onAddEmployee(employee);
    onClose();
    // Reset form
    setFormData({
      name: "",
      position: "",
      department: "",
      grossSalary: "",
      benefits: {
        transport: "",
        housing: "",
        performance: ""
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel employé</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technique">Technique</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Ressources Humaines">Ressources Humaines</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Poste</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grossSalary">Salaire brut</Label>
            <Input
              id="grossSalary"
              type="number"
              value={formData.grossSalary}
              onChange={(e) => setFormData({ ...formData, grossSalary: e.target.value })}
              required
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Avantages</h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transport">Transport</Label>
                <Input
                  id="transport"
                  type="number"
                  value={formData.benefits.transport}
                  onChange={(e) => setFormData({
                    ...formData,
                    benefits: { ...formData.benefits, transport: e.target.value }
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="housing">Logement</Label>
                <Input
                  id="housing"
                  type="number"
                  value={formData.benefits.housing}
                  onChange={(e) => setFormData({
                    ...formData,
                    benefits: { ...formData.benefits, housing: e.target.value }
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="performance">Performance</Label>
                <Input
                  id="performance"
                  type="number"
                  value={formData.benefits.performance}
                  onChange={(e) => setFormData({
                    ...formData,
                    benefits: { ...formData.benefits, performance: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal; 