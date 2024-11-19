import { createContext, useEffect, useState, useContext } from 'react';
import { categoryService } from '../services/categoryService';
import { languageService } from '../services/languageService';
import { bookCoverTypeService } from '../services/bookCoverTypeService';

const CategoryContext = createContext();
export const useCategories = () => useContext(CategoryContext);
export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [bookCoverTypes, setBookCoverTypes] = useState([]);
    useEffect(() => {
        const getCategory = async () => {
            const rs = await categoryService.get();
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

        getCategory();
        getLanguage();
        getBoookCoverType();
    }, []);
    return (
        <CategoryContext.Provider value={{ categories, bookCoverTypes, languages }}>
            {children}
        </CategoryContext.Provider>
    );
};
