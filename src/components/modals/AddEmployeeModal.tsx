import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { usePayrollStore } from '@/stores/payroll.store';
import { Employee } from '@/types/payroll';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: Omit<Employee, "id">) => void;
}

const employeeFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  department: z.string().min(1, "Veuillez sélectionner un département"),
  position: z.string().min(2, "Le poste doit contenir au moins 2 caractères"),
  grossSalary: z.number().min(0, "Le salaire ne peut pas être négatif"),
  benefits: z.object({
    transport: z.number().min(0).optional(),
    housing: z.number().min(0).optional(),
    performance: z.number().min(0).optional()
  })
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee
}) => {
  const { departments } = usePayrollStore();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: '',
      department: '',
      position: '',
      grossSalary: 0,
      benefits: {
        transport: 0,
        housing: 0,
        performance: 0
      }
      }
    });
    
  const onSubmit = (data: EmployeeFormValues) => {
    onAddEmployee(data);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un employé</DialogTitle>
          <DialogDescription>
            Remplissez les informations de l'employé
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'employé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Département</FormLabel>
            <Select
                    onValueChange={field.onChange} 
                    value={field.value || departments[0]?.name || "default"}
            >
                    <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
                    </FormControl>
              <SelectContent>
                {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name || `dept-${dept.id}`}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poste</FormLabel>
                  <FormControl>
                    <Input placeholder="Intitulé du poste" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grossSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire brut</FormLabel>
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
          
          <div className="space-y-4">
              <Label>Avantages</Label>
            <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="benefits.transport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transport</FormLabel>
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
                  name="benefits.housing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logement</FormLabel>
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
                  name="benefits.performance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performance</FormLabel>
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
            </div>
          </div>
          
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter l'employé
            </Button>
            </div>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal; 