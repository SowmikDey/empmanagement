import express from "express";
import { signupAdmin,loginAdmin,logout,getEmployees,updateEmpData,deleteEmpData } from "../controller/admin.controller.js";
import { adminProtectRoute } from "../middleware/adminProtectRoute.js";
const router = express.Router();

router.post('/signup',signupAdmin);
router.post('/login',loginAdmin);
router.post('/logout',adminProtectRoute,logout);
router.post('/getallemployee',adminProtectRoute,getEmployees);
router.post('/update/:id',adminProtectRoute,updateEmpData);
router.post('/delete/:id',adminProtectRoute,deleteEmpData);

export default router;