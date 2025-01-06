import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { AdminDataContext } from "../context/AdminContext";
import { EmployeeDataContext } from "../context/EmployeeContext";

const Login = () => {

  const [position,setPosition] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  
  const navigate = useNavigate();
  
  const {admin, setAdmin} = useContext(AdminDataContext);
    const {employee, setEmployee} = useContext(EmployeeDataContext);

  const handleSubmit = async(e)=>{
  e.preventDefault();
  try {
    if(position == 'admin'){
      const userData = { email, password };
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/login`, userData);
      if (response.status === 201) {
        const data = response.data;
        console.log("User data:", data); 
        setAdmin(data.admin); 
        localStorage.setItem("token", data.token); 
        console.log("Token from storage:", localStorage.getItem("token"));
        navigate("/admin");
      }
    }else{
      if(position == 'manager'){
        const userData = { email, password };
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/emp/login`, userData);
        if (response.status === 201) {
          const data = response.data;
          console.log("User data:", data); 
          setEmployee(data.user); 
          localStorage.setItem("token", data.token);
          console.log("Token from storage:", localStorage.getItem("token")); 
          navigate("/manager");
      }
      }else{
        const userData = { email, password };
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/emp/login`, userData);
        if (response.status === 201) {
          const data = response.data;
          console.log("User data:", data); 
          setEmployee(data.user); 
          localStorage.setItem("token", data.token); 
          console.log("Token from storage:", localStorage.getItem("token"));
          navigate("/emp");
      }
    }
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
  }


  return (
    <div>
       <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">

          <div>
              <label htmlFor="position" className="block text-sm/6 font-medium text-gray-900">
                Position
              </label>
              <div className="mt-2">
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value.toLowerCase()); // Convert to lowercase
                  }}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  required
                  autoComplete="email"
                  onChange={(e)=>{setEmail(e.target.value)}}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e)=>{setPassword(e.target.value)}}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Don't have an account?{' '}
            <Link to='/signup' className="font-semibold text-indigo-600 hover:text-indigo-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
