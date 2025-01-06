import { createContext, useState } from 'react';

export const EmployeeDataContext = createContext();

const EmployeeContext = ({ children }) => {
    const [employee, setEmployee] = useState({
        id: null,
        name: '',
        email: '',
        position: '',
        department: '',
        dateOfJoining: '',
        status: '',
        profilePic: '',
    });

    return (
        <EmployeeDataContext.Provider value={{ employee, setEmployee }}>
            {children}
        </EmployeeDataContext.Provider>
    );
};

export default EmployeeContext;
