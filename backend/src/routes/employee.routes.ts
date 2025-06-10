import { Router } from 'express';
import { 
  getEmployees, 
  getEmployee, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} from '../controllers/employee.controller';
import { auth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createEmployeeSchema, updateEmployeeSchema } from '../schemas/employee.schema';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', validateRequest(createEmployeeSchema), createEmployee);
router.put('/:id', validateRequest(updateEmployeeSchema), updateEmployee);
router.delete('/:id', deleteEmployee);

export { router as employeeRouter }; 