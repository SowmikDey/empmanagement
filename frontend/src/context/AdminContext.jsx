import { createContext, useState } from 'react';

export const AdminDataContext = createContext();

const AdminContext = ({ children }) => {
    const [admin, setAdmin] = useState({
        id: null,
        name: '',
        email: '',
    });

    return (
        <AdminDataContext.Provider value={{ admin, setAdmin }}>
            {children}
        </AdminDataContext.Provider>
    );
};

export default AdminContext;
