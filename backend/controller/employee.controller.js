import prisma from '../db/db.config.js';
import bcrypt from 'bcryptjs';
import env from 'dotenv'
import jwt from "jsonwebtoken";
import { generateEmployeeTokenAndSetCookie } from '../lib/utils/generateEmployeeToken.js';
import { v2 as cloudinary } from "cloudinary";


env.config();

export const signupEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      position,
      department,
      dateOfJoining,
      status,
      profilePic
    } = req.body;

    console.log(profilePic);

    // Validate input fields
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let profilePicUrl = profilePic;

    // Upload profilePic if provided
    if (profilePic) {
      const uploadedResponse = await cloudinary.uploader.upload(profilePic,{
        folder:'/emp-management'
      });
      profilePicUrl = uploadedResponse.secure_url;
      console.log(uploadedResponse);
    }

    // Create new employee
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        department,
        profilePic: profilePicUrl,
        dateOfJoining,
        status,
        position,
      },
    });

    // If employee creation succeeds
    if (newEmployee) {
      generateEmployeeTokenAndSetCookie(newEmployee.id, res);
      return res.status(201).json({
        id: newEmployee.id,
        name: newEmployee.name,
        email: newEmployee.email,
        department: newEmployee.department,
        profilePic: newEmployee.profilePic,
        dateOfJoining: newEmployee.dateOfJoining,
        status: newEmployee.status,
        position: newEmployee.position,
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signupEmployee:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const loginEmployee = async (req,res) => {
  try {
    const {email,password} = req.body;
    const employee = await prisma.employee.findUnique({
      where: {
        email : email
      }
    })

    const isPasswordCorrect = await bcrypt.compare(password,employee.password);
    if(!employee || !isPasswordCorrect){
      return res.status(500).json({error: "Invalid username or password"});
    }

    generateEmployeeTokenAndSetCookie(employee.id,res);

    const token = jwt.sign({userId:employee.id},process.env.JWT_SECRET,{
        expiresIn: '15d'
      })

    res.status(201).json({
      employee: {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        department : employee.department,
        profilePic : employee.profilePic,
        dateOfJoining : employee.dateOfJoining,
        status: employee.status,
        position: employee.position
      },
      token,
    });

  } catch (error) {
    res.status(500).json({error:"Internal server error"});
    console.log("Error in loginEmployee",error);
  }
}

export const logout = async (req,res)=>{

  try {
   res.cookie("employee_jwt","",{maxAge:0});
  res.status(200).json({message:"Logged out successfully"});
  } catch (error) {
   console.log("Error in logout",error.message);
   res.status(500).json({error:"Internal Server Error"});
  }
  }


  export const updateEmpData = async (req,res) => {
    try {
     const {id} = req.params;
     const {position,email,department, status,action,description,profilePic} = req.body;
     const userId = req.emp.id;
     
     const user = await prisma.employee.findUnique({
      where:{
        id : userId
      }
     })

     
      const empDepartment = await prisma.employee.findUnique({
        where:{
          id : parseInt(id)
        }
      })

      if(user.position == "manager" && user.department == empDepartment.department){
        const existingEmail = await prisma.employee.findUnique({
          where:{
            email : email
          }
         })
    
         if(existingEmail){res.status(400).json({message:"Email Already Exists"})};
    
         let profilePicUrl = profilePic;

    // Upload profilePic if provided
    if (profilePic) {
      const uploadedResponse = await cloudinary.uploader.upload(profilePic,{
        folder:'/emp-management'
      });
      profilePicUrl = uploadedResponse.secure_url;
      console.log(uploadedResponse);
    }

        const updatedEmployee =  await prisma.employee.update({
          where:{
            id: parseInt(id)
          },
          data:{
            position: position,
            email : email,
            department: department,
            status : status,
            profilePic: profilePic
          }
         })
    
         if(updatedEmployee){
          res.status(200).json({message:"Employee Details Updated"});
          const auditUpdate = await prisma.auditLog.create({
            data:{
           action : action,
           employeeId: parseInt(id),
           performedBy: req.admin.id,
           description : description
            }
          })
    
          if(auditUpdate){
            res.status(201).json({message:"Audit Updated"});
          }
        }
         else{
         res.status(500).json({message:"Couldn't update"});
         }
      }
     
    } catch (error) {
      console.log("Error in updateEmpData",error.message);
      res.status(500).json({error:"Internal Server Error"});  
    }
  }

  export const getEmployees = async (req,res) => {
    try {
      const userId = req.emp.id;
     
     const user = await prisma.employee.findUnique({
      where:{
        id : userId
      }
     })

     if(user.position == 'manager'){
      const employees = await prisma.employee.findMany({
        select:{
          id: true,
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
     }
      
    } catch (error) {
      console.log("Error in getEmployees",error.message);
     res.status(500).json({error:"Internal Server Error"});
    }
  }


  export const getMe = async (req,res) => {
    try {
    const userId = req.emp.id;

    const user = await prisma.employee.findUnique({
      where:{
        id: userId
      },
      select:{
        id: true,
        name: true,
        position: true,
        department: true,
        status: true,
        dateOfJoining: true,
        profilePic: true,
      }
    })

    if(user){
      res.status(200).json(user);
    }

    } catch (error) {
      console.log("Error in getMe",error.message);
      res.status(500).json({error:"Internal Server Error"}); 
    }
  }

  export const deleteEmpData = async (req,res) => {
    try {
      const {id} = req.params;
      if(user.position == 'manager'){
        const response = await prisma.employee.delete({
          where:{
            id: parseInt(id)
          }
        });
  
        if(response){
          res.status(200).json({message:"Deleted Data"});
        }
      }
      
    } catch (error) {
      console.log("Error in deleteEmpData",error.message);
      res.status(500).json({error:"Internal Server Error"});
    }
  }