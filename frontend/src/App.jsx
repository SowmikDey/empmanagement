import { Routes,Route } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManagerDashBoard from "./pages/ManagerDashBoard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";

const App = () => {

  return (
    <>
    <Routes>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/" element={<Login/>}/>
      <Route path="/admin" element={<AdminDashboard/>}/>
      <Route path="/manager" element={<ManagerDashBoard/>}/>
      <Route path="/emp" element={<EmployeeDashboard/>}/>
    </Routes>
    </>
  )
}

export default App
