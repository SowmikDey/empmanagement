import express from "express";
import { employeeProtectRoute } from "../middleware/employeeProtectRoute.js";
import { loginEmployee,signupEmployee,logout,updateEmpData,getEmployees,getMe,deleteEmpData } from "../controller/employee.controller.js";


const router = express.Router();

router.post('/signup',signupEmployee);
router.post('/login',loginEmployee);
router.post('/logout',employeeProtectRoute,logout);
router.post('/getEmployee',employeeProtectRoute,getEmployees);
router.post('/update/:id',employeeProtectRoute,updateEmpData);
router.post('/delete/:id',employeeProtectRoute,deleteEmpData);
router.post('/getMe',employeeProtectRoute,getMe);



export default router;