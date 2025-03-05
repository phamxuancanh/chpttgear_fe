import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

export default function DropdownMenu() {
    const categories = [
        { id: 1, name: "Điện thoại" },
        { id: 2, name: "Laptop" },
        { id: 3, name: "Máy tính bảng" },
        { id: 4, name: "Tai nghe" },
        { id: 5, name: "Đồng hồ" },
        { id: 6, name: "Máy ảnh" },
        { id: 7, name: "Tivi" },
        { id: 8, name: "Loa" },
        { id: 9, name: "Phụ kiện" },
        { id: 10, name: "Màn hình" },
        { id: 11, name: "Bàn phím" },
        { id: 12, name: "Chuột" },
        { id: 13, name: "Ổ cứng" },
        { id: 14, name: "Máy in" },
        { id: 15, name: "Gaming Gear" },
        { id: 16, name: "PC Gaming" },
        { id: 17, name: "Router Wifi" },
        { id: 18, name: "Phần mềm" },
        { id: 19, name: "Thiết bị văn phòng" },
        { id: 20, name: "Máy lạnh" },
    ];

    const specDefinitions = {
        "Điện thoại": [
            { key: "brand", value: "Thương hiệu", options: ["Apple", "Samsung", "Xiaomi", "Oppo"] },
            { key: "ram", value: "Dung lượng RAM", options: ["4GB", "6GB", "8GB", "12GB"] },
            { key: "storage", value: "Bộ nhớ trong", options: ["64GB", "128GB", "256GB", "512GB"] },
        ],
        "Laptop": [
            { key: "brand", value: "Thương hiệu", options: ["Dell", "HP", "Lenovo", "Asus", "Apple"] },
            { key: "cpu", value: "Vi xử lý", options: ["Intel Core i5", "Intel Core i7", "Ryzen 5", "Ryzen 7"] },
            { key: "ram", value: "Dung lượng RAM", options: ["8GB", "16GB", "32GB"] },
        ],
        "Máy tính bảng": [
            { key: "brand", value: "Thương hiệu", options: ["Apple", "Samsung", "Huawei", "Lenovo"] },
            { key: "screen", value: "Kích thước màn hình", options: ["8 inch", "10 inch", "12 inch"] },
        ],
        "Tai nghe": [
            { key: "type", value: "Loại tai nghe", options: ["In-ear", "Over-ear", "On-ear", "True Wireless"] },
            { key: "brand", value: "Thương hiệu", options: ["Sony", "Apple", "JBL", "Sennheiser"] },
        ],
        "Đồng hồ": [
            { key: "type", value: "Loại đồng hồ", options: ["Cơ", "Điện tử", "Smartwatch"] },
            { key: "brand", value: "Thương hiệu", options: ["Casio", "G-Shock", "Apple", "Garmin"] },
        ],
    };

    const [selectedCategory, setSelectedCategory] = useState(null);
    const dropdownRef = useRef(null);

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
    };

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSelectedCategory(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full flex relative z-50 mr-5">
            <div ref={dropdownRef} className="w-full bg-white p-4 rounded-lg shadow-md transition-opacity duration-500">
                {categories.slice(10, 20).map((category) => (
                    <div
                        key={category.id}
                        className={`text-sm cursor-pointer font-bold rounded-lg px-4 py-3 flex items-center justify-between
                            ${selectedCategory === category.name ? "text-white bg-red-600" : "text-black hover:text-white hover:bg-red-600 mt-1"}`}
                        onClick={() => handleCategoryClick(category.name)}
                    >
                        {category.name}
                        <IoIosArrowForward className="text-sm" />
                    </div>
                ))}
            </div>

            {selectedCategory && (
                <div className="absolute left-full top-0 w-[75vw] h-full ml-2 bg-white text-black font-medium p-6 rounded-lg shadow-2xl z-50 
                    transition-all duration-300 scale-100 overflow-auto">
                    <div className="grid grid-cols-5 gap-6">
                        {specDefinitions[selectedCategory] && specDefinitions[selectedCategory].length > 0 ? (
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
                            <div className="col-span-5 text-center text-gray-500">Không có dữ liệu</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
