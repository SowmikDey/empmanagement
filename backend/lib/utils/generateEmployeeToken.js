import jwt from 'jsonwebtoken';

export const generateEmployeeTokenAndSetCookie = (userId,res) =>{
  const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn: '15d'
  })

  console.log("Generated Employee Token:", token);

  res.cookie("employee_jwt",token,{
    maxAge: 15*24*60*60*1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  })
}