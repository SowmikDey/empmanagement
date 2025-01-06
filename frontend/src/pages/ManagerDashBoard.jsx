import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [managerDetails, setManagerDetails] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    position: "",
    department: "",
    dateOfJoining: '',
    status: "Active",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchManagerDetails();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/emp/getEmployee`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.employees) {
        setEmployees(response.data.employees);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  const fetchManagerDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/emp/getMe`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setManagerDetails(response.data);
    } catch (error) {
      console.error("Error fetching manager details:", error);
      setError("Failed to fetch manager details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/delete/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/update/${formData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmployees();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to update employee details.");
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      email: "",
      position: "",
      department: "",
      dateOfJoining: "",
      status: "Active",
    });
    setEditing(false);
  };

  const handleEdit = (employee) => {
    setFormData(employee);
    setEditing(true);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(employees.length / employeesPerPage);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/emp/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token");
      // Redirect to login or home page
      navigate('/'); // Redirect to the login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <div className="block mb-4 mx-auto border-b border-slate-300 pb-2 max-w-[360px] text-center text-[40px]">
        <b>Manager Dashboard</b>
      </div>

      {/* Manager Details Section */}
      {managerDetails && (
        <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold">Your Details</h3>
          <p><strong>Name:</strong> {managerDetails.name}</p>
          <p><strong>Email:</strong> {managerDetails.email}</p>
          <p><strong>Position:</strong> {managerDetails.position}</p>
          <p><strong>Department:</strong> {managerDetails.department}</p>
          <p><strong>Status:</strong> {managerDetails.status}</p>
          <p><strong>Date of Joining:</strong> {managerDetails.dateOfJoining}</p>
        </div>
      )}

      <button onClick={handleLogout} className="mb-4 bg-red-500 text-white rounded py-2 px-4">
        Logout
      </button>

      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
          <div className="flex items-center justify-between ">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Employees List</h3>
              <p className=" text-slate-500">Review each person before edit</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
              <button
                className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={() => setCurrentPage(1)} 
              >
                View All
              </button>
            </div>
          </div>
        </div>
        <div className="p-0 overflow-scroll">
          <form onSubmit={handleSubmit} className="mx-4 my-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border border-slate-300 rounded p-2 mb-2 w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border border-slate-300 rounded p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
              className="border border-slate-300 rounded p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
              className="border border-slate-300 rounded p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Date Of Join"
              value={formData.dateOfJoining}
              onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
              required
              className="border border-slate-300 rounded p-2 mb-2 w-full"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="border border -slate-300 rounded p-2 mb-2 w-full"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button type="submit" className="bg-slate-800 text-white rounded py-2 px-4">
              {editing ? "Update" : "Create"} Employee
            </button>
            {editing && <button type="button" onClick={resetForm} className="ml-2 text-red-500">Cancel</button>}
          </form>

          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">Name</th>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">Email</th>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">Position</th>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">Department</th>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">Status</th>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td className="p-4 border-b border-slate-200">{emp.name}</td>
                  <td className="p-4 border-b border-slate-200">{emp.email}</td>
                  <td className="p-4 border-b border-slate-200">{emp.position}</td>
                  <td className="p-4 border-b border-slate-200">{emp.department}</td>
                  <td className="p-4 border-b border-slate-200">{emp.status}</td>
                  <td className="p-4 border-b border-slate-200">
                    <button onClick={() => handleEdit(emp)} className="text-blue-500">Edit</button>
                    <button onClick={() => handleDelete(emp.id)} className="text-red-500 ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3">
          <p className="block text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;