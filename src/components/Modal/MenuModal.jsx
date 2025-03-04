import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { useCategory } from '../../context/CategoryContext';
import SubMenuModal from './SubMenuModal';
import { findAllCategory } from '../../routers/ApiRoutes';

export default function MenuModal() {
    const { isCategoryOpen, setIsCategoryOpen } = useCategory();
    const dropdownRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const specDefinitions = {
        Headphones: [
            { key: "warranty", value: "Bảo hành", options: ["6 tháng", "12 tháng", "24 tháng"] },
            { key: "type", value: "Kiểu", options: ["Over-ear", "On-ear", "In-ear", "True Wireless"] },
            { key: "connection", value: "Kết nối", options: ["Wired", "Wireless", "Bluetooth", "USB-C"] },
            { key: "battery_life", value: "Thời lượng pin", options: ["4 giờ", "8 giờ", "12 giờ", "24 giờ", "40 giờ"] },
            { key: "noise_cancellation", value: "Khử tiếng ồn chủ động", options: ["Có", "Không"] },
            { key: "microphone", value: "Microphone", options: ["Có", "Không", "Đa hướng"] },
            { key: "frequency_response", value: "Dải tần số", options: ["20Hz - 20kHz", "15Hz - 25kHz", "5Hz - 40kHz"] },
        ],
        Keyboards: [
            { key: "warranty", value: "Bảo hành", options: ["12 tháng", "24 tháng", "36 tháng"] },
            { key: "switch_type", value: "Loại switch", options: ["Mechanical", "Membrane", "Optical", "Hybrid"] },
            { key: "connection", value: "Kết nối", options: ["Wired", "Wireless", "Bluetooth", "USB-C"] },
            { key: "backlight", value: "Đèn nền", options: ["Có", "Không", "RGB", "Single-color"] },
            { key: "key_rollover", value: "Số lượng phím nhận diện cùng lúc", options: ["6-key", "N-key"] },
        ],
        Mice: [
            { key: "warranty", value: "Bảo hành", options: ["12 tháng", "24 tháng"] },
            { key: "sensor_type", value: "Loại cảm biến", options: ["Optical", "Laser", "Infrared"] },
            { key: "dpi", value: "Độ phân giải DPI", options: ["800", "1600", "3200", "6400", "12000", "16000"] },
            { key: "connection", value: "Kết nối", options: ["Wired", "Wireless", "Bluetooth", "USB-C"] },
            { key: "buttons", value: "Số nút", options: ["3", "5", "7", "10", "12+"] },
            { key: "battery_life", value: "Thời lượng pin", options: ["20 giờ", "50 giờ", "100 giờ"] },
        ],
        RAM: [
            { key: "warranty", value: "Bảo hành", options: ["36 tháng", "60 tháng", "Trọn đời"] },
            { key: "capacity", value: "Dung lượng", options: ["4GB", "8GB", "16GB", "32GB", "64GB", "128GB"] },
            { key: "speed", value: "Tốc độ bus", options: ["2133MHz", "2666MHz", "3200MHz", "3600MHz", "4000MHz+"] },
            { key: "latency", value: "Độ trễ CAS", options: ["CL14", "CL16", "CL18", "CL20"] },
            { key: "voltage", value: "Điện áp", options: ["1.2V", "1.35V", "1.5V"] },
            { key: "type", value: "Loại RAM", options: ["DDR3", "DDR4", "DDR5", "LPDDR5"] },
        ],
        Storage: [
            { key: "warranty", value: "Bảo hành", options: ["12 tháng", "24 tháng", "36 tháng", "60 tháng"] },
            { key: "type", value: "Loại ổ", options: ["SSD", "HDD", "NVMe", "Hybrid"] },
            { key: "capacity", value: "Dung lượng", options: ["256GB", "512GB", "1TB", "2TB", "4TB", "8TB"] },
            { key: "interface", value: "Giao tiếp", options: ["SATA", "NVMe", "PCIe", "USB 3.2"] },
            { key: "speed", value: "Tốc độ đọc/ghi", options: ["500MB/s", "1000MB/s", "2000MB/s", "5000MB/s"] },
        ],
        PowerSupply: [
            { key: "warranty", value: "Bảo hành", options: ["36 tháng", "60 tháng"] },
            { key: "wattage", value: "Công suất", options: ["400W", "500W", "600W", "750W", "850W", "1000W", "1200W+"] },
            { key: "efficiency", value: "Chứng nhận hiệu suất", options: ["80 Plus", "80 Plus Bronze", "80 Plus Gold", "80 Plus Platinum", "80 Plus Titanium"] },
            { key: "modular", value: "Dây cáp rời", options: ["Có", "Không", "Semi-Modular"] },
        ],
        Motherboards: [
            { key: "warranty", value: "Bảo hành", options: ["12 tháng", "24 tháng", "36 tháng"] },
            { key: "socket", value: "Socket", options: ["LGA1200", "LGA1700", "AM4", "AM5"] },
            { key: "chipset", value: "Chipset", options: ["B460", "B560", "Z490", "Z590", "X570", "B550"] },
            { key: "form_factor", value: "Kích thước", options: ["ATX", "Micro-ATX", "Mini-ITX"] },
            { key: "ram_slots", value: "Số khe RAM", options: ["2", "4", "8"] },
            { key: "max_memory", value: "Dung lượng RAM tối đa", options: ["32GB", "64GB", "128GB"] },
            { key: "storage_interfaces", value: "Giao tiếp lưu trữ", options: ["SATA", "NVMe", "PCIe 4.0"] },
            { key: "expansion_slots", value: "Khe mở rộng", options: ["PCIe x16", "PCIe x8", "PCIe x4"] },
            { key: "usb_ports", value: "Cổng USB", options: ["USB 2.0", "USB 3.0", "USB 3.1", "USB-C"] },
            { key: "network", value: "Kết nối mạng", options: ["Ethernet", "Wi-Fi 6", "Bluetooth"] },
        ]
    };
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
            {categoriesFromDB.slice(10, 20).map((category) => (
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
            {selectedCategory && (
                <SubMenuModal specDefinitions={specDefinitions} selectedCategory={selectedCategory} />
            )}
        </div>

    )
}
