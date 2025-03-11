import { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    return (
        <CategoryContext.Provider value={{ isCategoryOpen, setIsCategoryOpen }}>
            {children}
        </CategoryContext.Provider>
    );
};

// Hook để dùng dễ dàng hơn
export const useCategory = () => useContext(CategoryContext);