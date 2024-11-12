import { createContext, useEffect, useState, useContext } from 'react';
import { categoryService } from '../services/categoryService';

const CategoryContext = createContext();
export const useCategories = () => useContext(CategoryContext);
export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const getCategory = async () => {
            const rs = await categoryService.getActive();
            setCategories(rs);
        };

        getCategory();
    }, []);
    return <CategoryContext.Provider value={categories}>{children}</CategoryContext.Provider>;
};
