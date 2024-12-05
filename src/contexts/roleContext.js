import { createContext, useEffect, useState, useContext } from 'react';
import { roleService } from '../services/roleService';

const RoleContext = createContext();
export const useRole = () => useContext(RoleContext);
export const RoleProvider = ({ children }) => {
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        const getRoles = async () => {
            const rs = await roleService.get();
           
            setRoles(rs);
        };
        getRoles();
    }, []);
    return <RoleContext.Provider value={{ roles }}>{children}</RoleContext.Provider>;
};
