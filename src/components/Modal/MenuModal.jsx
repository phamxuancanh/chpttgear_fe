import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { useCategory } from '../../context/CategoryContext';
import SubMenuModal from './SubMenuModal';
import { findAllCategory } from '../../routers/ApiRoutes';
import specDefinitions from "../../assets/Menu/specDefinitions.json";


export default function MenuModal() {
    const { isCategoryOpen, setIsCategoryOpen } = useCategory();
    const dropdownRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoriesFromDB, setCategoriesFromDB] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await findAllCategory();
                setCategoriesFromDB(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCategoryOpen(false); // Click ra ngoài thì menu mờ đi, không ẩn
                setSelectedCategory(null)

            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsCategoryOpen]);

    const handleCategoryClick = (category) => {

        setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
    };
    return (
        <div
            ref={dropdownRef}
            className="w-full bg-white p-4 rounded-lg shadow-md transition-opacity duration-500"
        >

            {categoriesFromDB.map((category) => (
                <div
                    key={category.id}
                    className={`text-sm cursor-pointer font-bold rounded-lg px-4 py-3 flex items-center justify-between
                    ${selectedCategory === category.name ? "text-white bg-red-600" : "text-black hover:text-white hover:bg-red-600 mt-1"}`}
                    onClick={() => handleCategoryClick(category.name)}
                >
                    {category.name_Vi}
                    <IoIosArrowForward className="text-sm" />
                </div>
            ))}
            {selectedCategory && (
                <SubMenuModal specDefinitions={specDefinitions} selectedCategory={selectedCategory} />
            )}
        </div>

    )
}
