import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Department } from '@/types/payroll';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDepartment: (department: Omit<Department, "id">) => void;
  initialDepartment?: Department;
}

const departmentFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  budget: z.number().min(0, "Le budget ne peut pas être négatif"),
  headcount: z.number().min(0, "L'effectif ne peut pas être négatif"),
  plannedPositions: z.number().min(0, "Le nombre de postes prévus ne peut pas être négatif"),
  growthRate: z.number().min(-100).max(100, "Le taux de croissance doit être entre -100 et 100")
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
  onAddDepartment,
  initialDepartment
}) => {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
    name: initialDepartment?.name || '',
    budget: initialDepartment?.budget || 0,
    headcount: initialDepartment?.headcount || 0,
      plannedPositions: initialDepartment?.plannedPositions || 0,
      growthRate: initialDepartment?.growthRate || 0
    }
  });

  const onSubmit = (data: DepartmentFormValues) => {
    onAddDepartment(data);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialDepartment ? 'Modifier le département' : 'Ajouter un département'}
          </DialogTitle>
          <DialogDescription>
            {initialDepartment 
              ? 'Modifier les informations du département'
              : 'Remplissez les informations du nouveau département'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du département</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du département" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget annuel</FormLabel>
                  <FormControl>
            <Input
              type="number"
              placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <FormField
              control={form.control}
              name="headcount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effectif actuel</FormLabel>
                  <FormControl>
            <Input
              type="number"
              placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <FormField
              control={form.control}
              name="plannedPositions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postes prévus</FormLabel>
                  <FormControl>
            <Input
              type="number"
              placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <FormField
              control={form.control}
              name="growthRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux de croissance (%)</FormLabel>
                  <FormControl>
            <Input
              type="number"
              placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
                {initialDepartment ? 'Mettre à jour' : 'Ajouter le département'}
            </Button>
            </div>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentModal; 