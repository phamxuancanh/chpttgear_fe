import React from 'react';
import { Link } from 'react-router-dom';

export default function SubMenuModal({ specDefinitions, selectedCategory }) {
    return (
        <div className="absolute left-full top-0 w-[75vw] h-full ml-2 bg-white text-black font-medium p-6 rounded-lg shadow-2xl z-50 
        transition-all duration-300 scale-100 overflow-auto">
            <div className="grid grid-cols-5 gap-6">
                {specDefinitions[selectedCategory]?.length > 0 ? (
                    specDefinitions[selectedCategory].map(({ key, value, options }) => (
                        <div key={key} className="flex flex-col space-y-2">
                            <span className="font-bold text-red-600">{value}</span>
                            <div className="flex flex-col space-y-1">
                                {options.map((option) => (
                                    <Link
                                        key={option}
                                        to="/products"
                                        className="text-gray-700 hover:text-red-600 duration-300 cursor-pointer block"
                                    >
                                        {option}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-5 text-center text-gray-500">No data available</div>
                )}
            </div>
        </div>
    );
}
