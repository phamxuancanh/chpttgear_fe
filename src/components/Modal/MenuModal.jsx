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
        HEADPHONE: [
            { key: "warranty", value: "Bảo hành", options: ["6 tháng", "12 tháng", "24 tháng"] },
            { key: "type", value: "Kiểu", options: ["Over-ear", "On-ear", "In-ear", "True Wireless"] },
            { key: "connection", value: "Kết nối", options: ["Wired", "Wireless", "Bluetooth", "USB-C"] },
            { key: "battery_life", value: "Thời lượng pin", options: ["4 giờ", "8 giờ", "12 giờ", "24 giờ", "40 giờ"] },
            { key: "noise_cancellation", value: "Khử tiếng ồn chủ động", options: ["Có", "Không"] },
            { key: "microphone", value: "Microphone", options: ["Có", "Không", "Đa hướng"] },
            { key: "frequency_response", value: "Dải tần số", options: ["20Hz - 20kHz", "15Hz - 25kHz", "5Hz - 40kHz"] },
        ],
        KEYBOARD: [
            { key: "warranty", value: "Bảo hành", options: ["12 tháng", "24 tháng", "36 tháng"] },
            { key: "switch_type", value: "Loại switch", options: ["Mechanical", "Membrane", "Optical", "Hybrid"] },
            { key: "connection", value: "Kết nối", options: ["Wired", "Wireless", "Bluetooth", "USB-C"] },
            { key: "backlight", value: "Đèn nền", options: ["Có", "Không", "RGB", "Single-color"] },
            { key: "key_rollover", value: "Số lượng phím nhận diện cùng lúc", options: ["6-key", "N-key"] },
        ],
        MOUSE: [
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
        SSD_HDD: [
            { key: "warranty", value: "Bảo hành", options: ["12 tháng", "24 tháng", "36 tháng", "60 tháng"] },
            { key: "type", value: "Loại ổ", options: ["SSD", "HDD", "NVMe", "Hybrid"] },
            { key: "capacity", value: "Dung lượng", options: ["256GB", "512GB", "1TB", "2TB", "4TB", "8TB"] },
            { key: "interface", value: "Giao tiếp", options: ["SATA", "NVMe", "PCIe", "USB 3.2"] },
            { key: "speed", value: "Tốc độ đọc/ghi", options: ["500MB/s", "1000MB/s", "2000MB/s", "5000MB/s"] },
        ],
        PSU: [
            { key: "warranty", value: "Bảo hành", options: ["36 tháng", "60 tháng"] },
            { key: "wattage", value: "Công suất", options: ["400W", "500W", "600W", "750W", "850W", "1000W", "1200W+"] },
            { key: "efficiency", value: "Chứng nhận hiệu suất", options: ["80 Plus", "80 Plus Bronze", "80 Plus Gold", "80 Plus Platinum", "80 Plus Titanium"] },
            { key: "modular", value: "Dây cáp rời", options: ["Có", "Không", "Semi-Modular"] },
        ],
        MAINBOARD: [
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
        ],
        HEATSINK: [
            { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "24 THÁNG", "36 THÁNG"] },
            { key: "type", value: "LOẠI", options: ["TẢN NHIỆT KHÍ", "TẢN NHIỆT NƯỚC"] },
            { key: "fan_size", value: "KÍCH THƯỚC QUẠT", options: ["92MM", "120MM", "140MM"] },
            { key: "heat_pipes", value: "SỐ ỐNG DẪN NHIỆT", options: ["2", "4", "6"] },
            { key: "compatibility", value: "TƯƠNG THÍCH CPU", options: ["INTEL", "AMD", "CẢ HAI"] }
        ],
        RAM: [
            { key: "warranty", value: "BẢO HÀNH", options: ["36 THÁNG", "60 THÁNG", "TRỌN ĐỜI"] },
            { key: "capacity", value: "DUNG LƯỢNG", options: ["4GB", "8GB", "16GB", "32GB", "64GB", "128GB"] },
            { key: "speed", value: "TỐC ĐỘ BUS", options: ["2133MHZ", "2666MHZ", "3200MHZ", "3600MHZ", "4000MHZ+"] },
            { key: "latency", value: "ĐỘ TRỄ CAS", options: ["CL14", "CL16", "CL18", "CL20"] },
            { key: "voltage", value: "ĐIỆN ÁP", options: ["1.2V", "1.35V", "1.5V"] },
            { key: "type", value: "LOẠI RAM", options: ["DDR3", "DDR4", "DDR5", "LPDDR5"] }
        ],
        CASE: [
            { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "24 THÁNG"] },
            { key: "form_factor", value: "KÍCH THƯỚC", options: ["MINI ITX", "MICRO ATX", "MID TOWER", "FULL TOWER"] },
            { key: "material", value: "CHẤT LIỆU", options: ["THÉP", "NHÔM", "KÍNH CƯỜNG LỰC"] },
            { key: "fan_support", value: "HỖ TRỢ QUẠT", options: ["120MM", "140MM", "200MM"] }
        ],
        CPU: [
            { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "36 THÁNG"] },
            { key: "brand", value: "HÃNG", options: ["INTEL", "AMD"] },
            { key: "core_count", value: "SỐ NHÂN", options: ["2", "4", "6", "8", "12", "16", "32+"] },
            { key: "thread_count", value: "SỐ LUỒNG", options: ["4", "8", "12", "16", "24", "32", "64+"] },
            { key: "base_clock", value: "XUNG NHỊP CƠ BẢN", options: ["2.5GHZ", "3.0GHZ", "3.5GHZ", "4.0GHZ+"] },
            { key: "boost_clock", value: "XUNG NHỊP BOOST", options: ["3.5GHZ", "4.0GHZ", "4.5GHZ", "5.0GHZ+"] }
        ],
        MICRO: [
            { key: "warranty", value: "BẢO HÀNH", options: ["6 THÁNG", "12 THÁNG", "24 THÁNG"] },
            { key: "type", value: "LOẠI", options: ["MIC CÀI ÁO", "MIC ĐỂ BÀN", "MIC THU ÂM", "MIC KHÔNG DÂY"] },
            { key: "connection", value: "KẾT NỐI", options: ["USB", "JACK 3.5MM", "XLR", "BLUETOOTH"] },
            { key: "directionality", value: "HƯỚNG THU", options: ["OMNIDIRECTIONAL", "CARDIOID", "BIDIRECTIONAL", "SHOTGUN"] }
        ],
        LAPTOP: [
            { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "24 THÁNG"] },
            { key: "brand", value: "HÃNG", options: ["DELL", "HP", "ASUS", "LENOVO", "MSI", "APPLE"] },
            { key: "screen_size", value: "KÍCH THƯỚC MÀN HÌNH", options: ["13.3\"", "14\"", "15.6\"", "16\"", "17.3\""] },
            { key: "cpu", value: "CPU", options: ["INTEL CORE I3", "INTEL CORE I5", "INTEL CORE I7", "INTEL CORE I9", "AMD RYZEN 5", "AMD RYZEN 7", "AMD RYZEN 9"] },
            { key: "ram", value: "RAM", options: ["4GB", "8GB", "16GB", "32GB", "64GB"] },
            { key: "storage", value: "Ổ CỨNG", options: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB HDD"] }
        ],
        VGA: [
            { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "36 THÁNG"] },
            { key: "brand", value: "HÃNG", options: ["NVIDIA", "AMD"] },
            { key: "model", value: "DÒNG CHIP", options: ["GTX 1650", "RTX 3060", "RTX 4070", "RX 6600", "RX 7900 XTX"] },
            { key: "vram", value: "DUNG LƯỢNG VRAM", options: ["4GB", "6GB", "8GB", "12GB", "16GB"] },
            { key: "power_requirement", value: "CÔNG SUẤT YÊU CẦU", options: ["300W", "450W", "650W", "850W+"] }
        ],
        SCREEN: [
            { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "24 THÁNG"] },
            { key: "size", value: "KÍCH THƯỚC", options: ["21.5\"", "24\"", "27\"", "32\"", "34\"", "49\""] },
            { key: "resolution", value: "ĐỘ PHÂN GIẢI", options: ["1080P", "1440P", "4K", "8K"] },
            { key: "refresh_rate", value: "TẦN SỐ QUÉT", options: ["60HZ", "75HZ", "120HZ", "144HZ", "165HZ", "240HZ"] },
            { key: "panel_type", value: "LOẠI TẤM NỀN", options: ["IPS", "VA", "TN", "OLED"] }
        ]
    };

    const [categoriesFromDB, setCategoriesFromDB] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await findAllCategory();
                console.log(res)
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
