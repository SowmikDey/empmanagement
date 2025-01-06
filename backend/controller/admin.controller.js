import prisma from '../db/db.config.js';
import bcrypt from 'bcryptjs';
import env from 'dotenv'
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { generateAdminTokenAndSetCookie } from '../lib/utils/generateAdminToken.js';



env.config();

export const signupAdmin = async (req,res) => {
  
  try {
    const {name,email,password} = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
    return res.status(400).json({error:"Invalid email format"})
  }  

  const existingAdmin = await prisma.admin.findUnique({
    where:{
      email:email
    }
  })

  if(existingAdmin){
    return res.status(400).json({message:"User Already Exists"});
  }

  if(password.length <6){
    return res.status(400).json({error: "Password must be atleast 6 digits"});
  }
  //hasing
  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password,saltRounds);

  const newAdmin = await prisma.admin.create({
    data:{
      name: name,
      email: email,
      password: hashedPassword
    }
  })

  if(newAdmin){
    generateAdminTokenAndSetCookie(newAdmin.id,res);

    return res.status(201).json({   
       id: newAdmin.id,
      name: newAdmin.name,
       email: newAdmin.email,});     
  }else{
    res.status(400).json({error:"Invalid user data"});
  }

  } catch (error) {
  res.status(500).json({error:"Couldn't make new User"});
  console.error(error.message);
  }
}

export const loginAdmin = async (req,res) => {
  try {
    const {email,password} = req.body;
    const admin = await prisma.admin.findUnique({
      where: {
        email : email
      }
    })

    const isPasswordCorrect = await bcrypt.compare(password,admin.password);
    if(!admin || !isPasswordCorrect){
      return res.status(500).json({error: "Invalid username or password"});
    }

    generateAdminTokenAndSetCookie(admin.id,res);

    const token = jwt.sign({userId:admin.id},process.env.JWT_SECRET,{
        expiresIn: '15d'
      })

    res.status(201).json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
      token,
    });

  } catch (error) {
    res.status(500).json({error:"Internal server error"});
    console.log("Error in loginAdmin",error);
  }
}

export const logout = async (req,res)=>{

  try {
   res.cookie("admin_jwt","",{maxAge:0});
  res.status(200).json({message:"Logged out successfully"});
  } catch (error) {
   console.log("Error in logout",error.message);
   res.status(500).json({error:"Internal Server Error"});
  }
  }

  export const getEmployees = async (req,res) => {
    try {
      const employees = await prisma.employee.findMany({
        select:{
          id: true,
          email: true,
          name: true,
          position: true,
          department: true,
          status: true,
          dateOfJoining: true,
          profilePic: true,
        }
      });
      if(employees.length === 0){
        return res.status(200).json([]);
      }
      res.status(200).json({employees});
    } catch (error) {
      console.log("Error in getEmployees",error.message);
     res.status(500).json({error:"Internal Server Error"});
    }
  }

  export const updateEmpData = async (req, res) => {
    try {
      const { id } = req.params;
      const { position, email, department, status, action, description } = req.body;
  
      // Fetch the existing employee data
      const existingEmployee = await prisma.employee.findUnique({
        where: {
          id: parseInt(id),
        },
      });
  
      if (!existingEmployee) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      // Check if the email already exists for a different employee
      if (email && email !== existingEmployee.email) {
        const existingEmail = await prisma.employee.findUnique({
          where: {
            email: email,
          },
        });
  
        if (existingEmail) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
  
      // Update employee details
      const updatedEmployee = await prisma.employee.update({
        where: {
          id: parseInt(id),
        },
        data: {
          position: position || existingEmployee.position,
          email: email || existingEmployee.email,
          department: department || existingEmployee.department,
          status: status || existingEmployee.status,
        },
      });
  
      if (updatedEmployee) {
        // Send email notification
        const transporter = nodemailer.createTransport({
          secure: true,
          host: "smtp.gmail.com",
          port: 465,
          auth: {
            user: req.admin.email, 
            pass: process.env.APP_PASSWORD,
          },
        });
  
        const sendMail = async (to, subject, message) => {
          await transporter.sendMail({
            to: to,
            subject: subject,
            html: message,
          });
        };
  
        sendMail(
          updatedEmployee.email,
          "Details Updated",
          "Your details have been successfully updated."
        );
  
        //Log the update in the audit log
        const auditUpdate = await prisma.auditLog.create({
          data: {
            action: action || "Update Employee Details",
            employeeId: parseInt(id),
            performedBy: req.admin.id || null,
            description: description || "No additional details provided",
          },
        });
  
        return res.status(200).json({
          message: "Employee details updated successfully",
          employee: updatedEmployee,
          // audit: auditUpdate,
        });
      } else {
        return res.status(500).json({ message: "Failed to update employee details" });
      }
    } catch (error) {
      console.error("Error in updateEmpData:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

  export const deleteEmpData = async (req,res) => {
    try {
      const {id} = req.params;

      const response = await prisma.employee.delete({
        where:{
          id: parseInt(id)
        }
      });

      if(response){
        res.status(200).json({message:"Deleted Data"});
      }
    } catch (error) {
      console.log("Error in deleteEmpData",error.message);
      res.status(500).json({error:"Internal Server Error"});
    }
  }