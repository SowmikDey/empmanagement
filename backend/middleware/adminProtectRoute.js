import prisma from "../db/db.config.js";
import jwt from "jsonwebtoken";

export const adminProtectRoute = async (req,res,next) => {
  try {
    const token = req.cookies?.admin_jwt || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    if(!decoded){
   return res.status(401).json({error: "Unauthorized: Invalid Token"});
    }

    console.log("Decoded token:", decoded);

    const admin = await prisma.admin.findUnique({
      where : {id: decoded.userId},
      select: {
				id: true,
				name: true,
				email: true,
			},
    })

    if(!admin){
   return res.status(404).json({error: "User Not Found"});
    }
   
  req.admin = admin;
  next();

  } catch (error) {
    console.log("Error Occured in adminProtectRoute",error.message);
    return res.status(500).json({error: "Internal Server Error"})
  }
}
