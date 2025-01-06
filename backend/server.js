import express from "express";
import env from "dotenv";
import cors from 'cors';
import cookieParser from "cookie-parser";
import adminRoutes from './routes/admin.routes.js'
import employeeRoutes from './routes/employee.routes.js'
import {v2 as cloudinary} from "cloudinary";


env.config();
const app = express();
const port = process.env.PORT || 3000;



//middlewares
app.use(cors({ origin: 'http://localhost:5173',
  credentials: true
 }));
 cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


//routes
app.use('/api/admin',adminRoutes);
app.use('/api/emp',employeeRoutes);


app.listen(port,()=> console.log(`server is running on ${port}`));