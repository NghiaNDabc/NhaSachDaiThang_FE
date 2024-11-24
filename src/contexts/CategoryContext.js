import { createContext, useEffect, useState, useContext } from 'react';
import { categoryService } from '../services/categoryService';
import { languageService } from '../services/languageService';
import { bookCoverTypeService } from '../services/bookCoverTypeService';
import { supplierService } from '../services/supplierService';

const CategoryContext = createContext();
export const useCategories = () => useContext(CategoryContext);
export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [bookCoverTypes, setBookCoverTypes] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    useEffect(() => {
        const getCategory = async () => {
            const rs = await categoryService.get();
            debugger;
            setCategories(rs);
        };
        const getLanguage = async () => {
            const rs = await languageService.get();
            setLanguages(rs);
        };
        const getBoookCoverType = async () => {
            const rs = await bookCoverTypeService.get();
            setBookCoverTypes(rs);
        };
        const getSupplier = async () => {
            const isDel = false;
            const rs = await supplierService.get(null, null, isDel);
            setSuppliers(rs);
        };
        getCategory();
        getLanguage();
        getBoookCoverType();
        getSupplier();
        debugger;
    }, []);
    return (
        <CategoryContext.Provider value={{ categories, suppliers, bookCoverTypes, languages }}>
            {children}
        </CategoryContext.Provider>
    );
};
