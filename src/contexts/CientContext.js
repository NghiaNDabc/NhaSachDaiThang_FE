import { createContext, useEffect, useState, useContext } from 'react';
import { categoryService } from '../services/categoryService';
import { languageService } from '../services/languageService';
import { bookCoverTypeService } from '../services/bookCoverTypeService';
import { supplierService } from '../services/supplierService';

const ClientContext = createContext();
export const useClientContext = () => useContext(ClientContext);
export const ClientContextProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const getCategory = async () => {
            const rs = await categoryService.get(null, null, null, null, true);

            setCategories(rs);
        };

        getCategory();
    }, []);
    return <ClientContext.Provider value={{ categories }}>{children}</ClientContext.Provider>;
};
