import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategory } from '../../context/CategoryContext';
import translationMap from "../../assets/Menu/translate.json";

export default function SubMenuModal({ specDefinitions, selectedCategory }) {
    const { isCategoryOpen, setIsCategoryOpen } = useCategory();
    const navigate = useNavigate()

    const handleSubMenuClick = (spec, value_spec) => {
        setIsCategoryOpen(false);
        navigate(`/products?category=${selectedCategory}&spec=${spec}&value_spec=${value_spec}`); // Chuyển đến URL mới với ID sản phẩm

    };

    const translate = (key) => translationMap[key] || key;

    return (
        <div className="absolute left-full top-0 w-[68vw] h-full ml-2 bg-white text-black font-medium p-6 rounded-lg shadow-2xl z-50 
        transition-all duration-300 scale-100 overflow-auto">
            <div className="grid grid-cols-5 gap-5">
                {specDefinitions[selectedCategory]?.length > 0 ? (
                    specDefinitions[selectedCategory].map(({ key, value, options }) => (
                        <div key={key} className="flex flex-col space-y-2">
                            <span className="font-bold text-red-600 text-base">{translate(key)}</span>
                            <div className="flex flex-col space-y-3">
                                {options.map((option) => (
                                    <div
                                        key={option}
                                        className="text-gray-700 hover:text-red-600 duration-300 cursor-pointer block text-sm"
                                        onClick={() => handleSubMenuClick(key, option)}
                                    >
                                        {translate(option)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-5 text-center text-gray-500">Không có dữ liệu</div>
                )}
            </div>
        </div>
    );
}