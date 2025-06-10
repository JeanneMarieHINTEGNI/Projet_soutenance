import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmployeeProfileInput } from '@/types/simulation';

interface NewEmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProfile: (profile: EmployeeProfileInput) => void;
}

const NewEmployeeProfileModal: React.FC<NewEmployeeProfileModalProps> = ({
  isOpen,
  onClose,
  onAddProfile
}) => {
  const [profile, setProfile] = useState<EmployeeProfileInput>({
    salaire_base_mensuel: 0,
    departement: '',
    nb_employees: 1,
    statut_matrimonial: 'Celibataire',
    custom_benefits: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProfile(profile);
    onClose();
    // Réinitialiser le formulaire
    setProfile({
      salaire_base_mensuel: 0,
      departement: '',
      nb_employees: 1,
      statut_matrimonial: 'Celibataire',
      custom_benefits: {}
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un Profil d'Employé Virtuel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="salaire">Salaire Base Mensuel</Label>
            <Input
              id="salaire"
              type="number"
              value={profile.salaire_base_mensuel}
              onChange={(e) => setProfile({
                ...profile,
                salaire_base_mensuel: parseFloat(e.target.value) || 0
              })}
              required
            />
          </div>

          <div>
            <Label htmlFor="departement">Département</Label>
            <Input
              id="departement"
              type="text"
              value={profile.departement}
              onChange={(e) => setProfile({
                ...profile,
                departement: e.target.value
              })}
              required
            />
          </div>

          <div>
            <Label htmlFor="nb_employees">Nombre d'Employés</Label>
            <Input
              id="nb_employees"
              type="number"
              min="1"
              value={profile.nb_employees}
              onChange={(e) => setProfile({
                ...profile,
                nb_employees: parseInt(e.target.value) || 1
              })}
              required
            />
          </div>

          <div>
            <Label htmlFor="statut">Statut Matrimonial</Label>
            <Select
              value={profile.statut_matrimonial}
              onValueChange={(value) => setProfile({
                ...profile,
                statut_matrimonial: value as 'Celibataire' | 'Marié' | 'Divorcé' | 'Veuf'
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Celibataire">Célibataire</SelectItem>
                <SelectItem value="Marié">Marié(e)</SelectItem>
                <SelectItem value="Divorcé">Divorcé(e)</SelectItem>
                <SelectItem value="Veuf">Veuf/Veuve</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter le Profil
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEmployeeProfileModal; 