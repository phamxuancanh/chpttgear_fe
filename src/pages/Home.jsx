import React, { useState, useRef } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { useEffect } from "react";
import { findAllCategory, getAllProduct, getSuggestions } from "../routers/ApiRoutes";
import { Pagination } from '@mui/material'
import { styled } from '@mui/system'
import { useLocation, useNavigate } from 'react-router-dom'
import ROUTES from '../constants/Page';
import { debounce, set } from 'lodash'
import Loading from "../utils/Loading";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

import { motion, AnimatePresence } from "framer-motion";
import { GrPrevious, GrNext } from "react-icons/gr";
import SLIDE1 from "../assets/slide1.webp"
import SLIDE2 from "../assets/slide2.webp"
import SLIDE3 from "../assets/slide3.webp"
import SLIDE5 from "../assets/slide5.webp"
import SLIDE6 from "../assets/slide6.webp"
import BANNER2 from "../assets/banner2.webp"
import BANNER3 from "../assets/banner3.webp"
import BANNER4 from "../assets/banner4.webp"
import BANNER5 from "../assets/banner5.webp"
import BANNER6 from "../assets/banner6.webp"
import BANNER7 from "../assets/banner7.webp"
import BANNER8 from "../assets/banner8.webp"
import BANNER9 from "../assets/banner9.webp"
import BANNER10 from "../assets/banner10.webp"
import BANNER11 from "../assets/banner11.webp"
import TYPE1 from "../assets/type1.webp"
import TYPE2 from "../assets/type2.webp"
import TYPE3 from "../assets/type3.webp"
import TYPE4 from "../assets/type4.webp"
import TYPE5 from "../assets/type5.webp"
import TYPE6 from "../assets/type6.webp"
import TYPE7 from "../assets/type7.webp"
import TYPE8 from "../assets/type8.webp"
import TYPE9 from "../assets/type9.webp"
import TYPE10 from "../assets/type10.webp"
import TYPE11 from "../assets/type11.webp"
import TYPE12 from "../assets/type12.webp"
import TYPE13 from "../assets/type13.jpg"
import TYPE14 from "../assets/type14.webp"
import TYPE15 from "../assets/type15.webp"
import TYPE16 from "../assets/type16.webp"
import TYPE17 from "../assets/type17.webp"
import TYPE18 from "../assets/type18.webp"
import TYPE19 from "../assets/type19.webp"
import TYPE20 from "../assets/type20.webp"
import ProductCarousel from "../components/ProductCarousel";
import { useCategory } from "../context/CategoryContext";

export default function Home() {
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
    const { isCategoryOpen, setIsCategoryOpen } = useCategory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await findAllCategory();
                console.log(res.data);
                setCategoriesFromDB(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchData();
    }, []);

    const [hoveredCategory, setHoveredCategory] = useState(null);

    const categories = [
        { name: "Laptop", img: TYPE1 },
        { name: "PC", img: TYPE2 },
        { name: "Màn hình", img: TYPE3 },
        { name: "Mainboard", img: TYPE4 },
        { name: "CPU", img: TYPE5 },
        { name: "VGA", img: TYPE6 },
        { name: "RAM", img: TYPE7 },
        { name: "Ổ cứng", img: TYPE8 },
        { name: "Case", img: TYPE9 },
        { name: "Tản nhiệt", img: TYPE10 },
        { name: "Nguồn", img: TYPE11 },
        { name: "Bàn phím", img: TYPE12 },
        { name: "Chuột", img: TYPE13 },
        { name: "Ghế", img: TYPE14 },
        { name: "Tai nghe", img: TYPE15 },
        { name: "Loa", img: TYPE16 },
        { name: "Console", img: TYPE17 },
        { name: "Phụ kiện", img: TYPE18 },
        { name: "Thiết bị VP", img: TYPE19 },
        { name: "Apple", img: TYPE20 },
    ];
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        SLIDE1,
        SLIDE2,
        SLIDE3,
        SLIDE5,
        SLIDE6,
    ];

    const handleImageNavigation = (direction) => {
        setCurrentImageIndex((prevIndex) => {
            if (direction === "next") {
                return (prevIndex + 1) % images.length;
            } else {
                return (prevIndex - 1 + images.length) % images.length;
            }
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res1 = await getAllProduct();
                setProducts(res1.data);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const interval = setInterval(() => {
            handleImageNavigation("next");
        }, 5000); // Chuyển ảnh sau mỗi 5 giây

        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, []); // Dependency array rỗng, chạy 1 lần sau khi component mount

    const dropdownRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCategoryOpen(false); // Click ra ngoài thì menu mờ đi, không ẩn
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsCategoryOpen]);

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            {isCategoryOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-500"></div>
            )}
            {loading ? <Loading /> :
                <div className="container mx-auto bg-white  w-11/12 rounded-lg  px-4 py-1">
                    <div className="w-full flex justify-center px-5 py-2" onMouseLeave={() => setHoveredCategory(null)}>
                        <div className="w-2/12 flex justify-center ">
                            <img src={BANNER2} alt="" className="w-fit h-[80vh] rounded-lg mr-4" />
                        </div>
                        <div
                            ref={dropdownRef}
                            className={`w-2/12 bg-white p-4 rounded-lg shadow-md relative z-20 transition-opacity duration-500 
                        ${isCategoryOpen ? "opacity-100" : "opacity-100"}`}
                        >
                            {categoriesFromDB.map((category) => (
                                <div
                                    key={category.id}
                                    className={`text-sm cursor-pointer font-bold rounded-lg px-4 py-3 flex items-center justify-between
                    ${hoveredCategory === category.name ? "text-white bg-red-600" : "text-black hover:text-white hover:bg-red-600"}`}
                                    onMouseEnter={() => setHoveredCategory(category.name)}
                                >
                                    {category.name}
                                    <IoIosArrowForward className="text-sm" />
                                </div>
                            ))}
                        </div>
                        <div className="w-8/12 relative">
                            {hoveredCategory && (
                                <div className="absolute inset-0 bg-white text-black font-medium z-10 p-6 rounded-lg shadow-lg">
                                    <div className="grid grid-cols-5 gap-6">
                                        {specDefinitions[hoveredCategory] && specDefinitions[hoveredCategory].length > 0 ? (
                                            specDefinitions[hoveredCategory].map(({ key, value, options }) => (
                                                <div key={key} className="flex flex-col space-y-2">
                                                    <span className="font-bold text-red-600">{value}</span>
                                                    <div className="flex flex-col space-y-1">
                                                        {options.map((option) => (
                                                            <span key={option} className="text-gray-700 hover:text-red-600 duration-300 cursor-pointer">
                                                                {option}
                                                            </span>
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


                            <div className="relative w-full h-[40vh] flex items-center justify-center rounded-lg overflow-hidden shadow-lg bg-black">
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60"></div>

                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={images[currentImageIndex]}
                                        alt={`Product view ${currentImageIndex + 1}`}
                                        className="w-auto h-full object-contain"
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.7 }}
                                    />
                                </AnimatePresence>

                                <button
                                    onClick={() => handleImageNavigation("prev")}
                                    className="absolute left-4 text-white p-3 bg-gray-900/50 rounded-full hover:bg-gray-800 transition"
                                >
                                    <GrPrevious size={24} />
                                </button>

                                <button
                                    onClick={() => handleImageNavigation("next")}
                                    className="absolute right-4 text-white p-3 bg-gray-900/50 rounded-full hover:bg-gray-800 transition"
                                >
                                    <GrNext size={24} />
                                </button>
                            </div>

                            <div className="w-full">
                                <img src={BANNER3} alt="" className="w-full h-fit rounded-lg mt-10" />
                            </div>
                        </div>

                    </div>
                    <section className="mb-12">

                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-5">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Danh mục sản phẩm</h2>
                            <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-6 text-center">
                                {categories.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center space-y-2 cursor-pointer">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-16 h-16 object-contain rounded-lg "
                                        />
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <img src={BANNER4} alt="" />
                        <ProductCarousel products={products} />
                        <div className="flex justify-center items-end ">
                            <button className="px-4 py-2 rounded-xl text-base font-semibold mt-3 shadow-lg  hover:bg-black hover:text-white">Xem thêm VGA</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER5} alt="" />
                        <ProductCarousel products={products} />
                        <div className="flex justify-center items-end ">
                            <button className="px-4 py-2 rounded-xl text-base font-semibold mt-3 shadow-lg  hover:bg-black hover:text-white">Xem thêm CPU</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER6} alt="" className="mb-10" />
                        <ProductCarousel products={products} />
                        <div className="flex justify-center items-end ">
                            <button className="px-4 py-2 rounded-xl text-base font-semibold mt-3 shadow-lg  hover:bg-black hover:text-white">Xem thêm MAINBOARD</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER7} alt="" className="mb-10" />
                        <ProductCarousel products={products} />
                        <div className="flex justify-center items-end ">
                            <button className="px-4 py-2 rounded-xl text-base font-semibold mt-3 shadow-lg  hover:bg-black hover:text-white">Xem thêm RAM</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER8} alt="" className="mb-10" />
                        <ProductCarousel products={products} />
                        <div className="flex justify-center items-end ">
                            <button className="px-4 py-2 rounded-xl text-base font-semibold mt-3 shadow-lg  hover:bg-black hover:text-white">Xem thêm HDD</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER9} alt="" className="mb-10" />
                        <ProductCarousel products={products} />
                        <div className="flex justify-center items-end ">
                            <button className="px-4 py-2 rounded-xl text-base font-semibold mt-3 shadow-lg  hover:bg-black hover:text-white">Xem thêm SSD</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER10} alt="" className="mb-10" />
                        <ProductCarousel products={products} />
                        <div className="flex justify-center items-end ">
                            <button className="px-4 py-2 rounded-xl text-base font-semibold mt-3 shadow-lg  hover:bg-black hover:text-white">Xem thêm CASE</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER11} alt="" className="mb-10" />
                        <ProductCarousel products={products} />
                        <div className="flex justify-center items-end ">
                            <button className="px-4 py-2 rounded-xl text-base font-semibold mt-3 shadow-lg  hover:bg-black hover:text-white">Xem thêm PSU</button>
                        </div>
                    </section>
                </div>}
        </div>
    );
};
