import axios from "axios";
import { useContext, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import {AdminDataContext} from "../context/AdminContext";
import { EmployeeDataContext } from "../context/EmployeeContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [dateofjoin, setDateofjoin] = useState("");
  const [img, setImg] = useState("");
  const [password,setPassword] = useState("");
  const [preview,setPreview] = useState('');
  const navigate = useNavigate();

  const {admin, setAdmin} = useContext(AdminDataContext);
  const {employee, setEmployee} = useContext(EmployeeDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (position === 'admin') {
      const admin = {
        name: name,
        email: email,
        password: password
      };
  
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/signup`, admin);
      if (response.status === 201) {
        const data = response.data;
        setAdmin(data.user);
        navigate('/');
      }
    } else {
      const employee = {
        name: name,
        email: email,
        position: position,
        department: department,
        dateOfJoining: dateofjoin,
        password: password,
        profilePic : preview
      };
  
  
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/emp/signup`,
        employee,
      );
      
      if (response.status === 201) {
        const data = response.data;
        setEmployee(data.user);
        navigate('/');
      }
    }
  
    // Reset the form state after successful submission
    setEmail('');
    setDateofjoin('');
    setDepartment('');
    setName('');
    setPosition('');
  };
  
  const handleImg = (e)=>{
  e.preventDefault();
  const file = e.target.files[0];

  var reader = new FileReader();
  reader.onloadend = () => setPreview(reader.result);
  reader.readAsDataURL(file);
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                FullName
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="fullname"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  required
                  autoComplete="name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

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

            {position !== "admin" && (
              <>
                <div>
                  <label htmlFor="department" className="block text-sm/6 font-medium text-gray-900">
                    Department
                  </label>
                  <div className="mt-2">
                    <input
                      id="department"
                      name="department"
                      type="text"
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                      }}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dateofjoin" className="block text-sm/6 font-medium text-gray-900">
                    Date Of Join
                  </label>
                  <div className="mt-2">
                    <input
                      id="dateofjoin"
                      name="dateofjoin"
                      type="date"
                      value={dateofjoin}
                      onChange={(e) => {
                        setDateofjoin(e.target.value);
                      }}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="profilepic" className="block text-sm/6 font-medium text-gray-900">
                    Profile Picture
                  </label>
                  <div className="mt-2">
                    <input
                      id="profilepic"
                      name="profilepic"
                      type="file"
                      onChange={handleImg}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <img src={preview} />
                  </div>
                </div>
              </>
            )}

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
                Create Account
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already have an account?{" "}
            <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
