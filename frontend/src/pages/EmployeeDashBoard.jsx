import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    position: "",
    department: "",
    dateOfJoining: "",
    status: "Active",
    profilePic: "",
    phone: "",
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/emp/getMe`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployeeDetails(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        setError('Failed to fetch employee details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/emp/update/${formData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployeeDetails(formData);
      setEditing(false);
    } catch (error) {
      console.error("Error updating employee details:", error);
      setError('Failed to update employee details.');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/emp/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token"); // Remove token from local storage
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Employee Dashboard</h1>
      
      {/* Employee Details Section */}
      <div className="flex items-center mb-4">
        <img
          src={employeeDetails.profilePic || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-24 h-24 rounded-full mr-4 shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-semibold">{employeeDetails.name}</h2>
          <p className="text-gray-600"><strong>Position:</strong> {employeeDetails.position}</p>
          <p className="text-gray-600"><strong>Department:</strong> {employeeDetails.department}</p>
          <p className="text-gray-600"><strong>Date of Joining:</strong> {employeeDetails.dateOfJoining}</p>
          <p className="text-gray-600"><strong>Status:</strong> {employeeDetails.status}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <p><strong>Email:</strong> {employeeDetails.email}</p>
        <p><strong>Phone:</strong> {employeeDetails.phone || 'N/A'}</p>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="Position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="Date Of Joining"
            value={formData.dateOfJoining}
            onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white rounded py-2 px-4">
            Update Employee
          </button>
          <button type="button" onClick={() => setEditing(false)} className="ml-2 text-red-500">Cancel</button>
        </form>
      ) : (
        <button onClick={handleEdit} className="mt-4 bg-blue-500 text-white rounded py-2 px-4">
          Edit Details
        </button>
      )}
      <button onClick={handleLogout} className="mt-4 bg-red-500 text-white rounded py-2 px-4">
        Logout
      </button>
    </div>
  );
};

export default EmployeeDashboard;