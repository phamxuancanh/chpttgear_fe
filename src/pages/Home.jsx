import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { findAllCategory, getAllProduct, getAllProductWithCategory, getAllStockIn, getAllStockOut, getSuggestions } from "../routers/ApiRoutes";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Loading from "../utils/Loading";
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
import TYPE15 from "../assets/type15.webp"
import TYPE17 from "../assets/type17.webp"
import ProductCarousel from "../components/ProductCarousel";
import { useCategory } from "../context/CategoryContext";
import MenuModal from "../components/Modal/MenuModal";
import { useDispatch, useSelector } from "react-redux";
import { setStockInsInInventory, setStockOutsInInventory } from "../redux/inventorySlice";



export default function Home() {
    const { isCategoryOpen, setIsCategoryOpen } = useCategory();
    const navigate = useNavigate();
    const stockIns = useSelector(state => state.inventory.stockIns)
    const stockOuts = useSelector(state => state.inventory.stockOuts)
    const dispatch = useDispatch()
    const categories = [
        { name: "LAPTOP", name_vi: "Laptop", img: TYPE1 },
        { name: "SCREEN", name_vi: "Màn hình", img: TYPE3 },
        { name: "MAINBOARD", name_vi: "Bo mạch chủ", img: TYPE4 },
        { name: "CPU", name_vi: "Vi xử lý", img: TYPE5 },
        { name: "VGA", name_vi: "Card màn hình", img: TYPE6 },
        { name: "RAM", name_vi: "RAM", img: TYPE7 },
        { name: "SSD/HDD", name_vi: "Bộ nhớ", img: TYPE8 },
        { name: "CASE", name_vi: "Vỏ máy tính", img: TYPE9 },
        { name: "HEATSINK", name_vi: "Tản nhiệt", img: TYPE10 },
        { name: "PSU", name_vi: "Nguồn", img: TYPE11 },
        { name: "KEYBOARD", name_vi: "Bàn phím", img: TYPE12 },
        { name: "MOUSE", name_vi: "Chuột", img: TYPE13 },
        { name: "HEADPHONE", name_vi: "Tai nghe", img: TYPE15 },
        { name: "MICRO", name_vi: "Micro", img: 'https://product.hstatic.net/200000722513/product/mic-thu-am-hyperx-quadcast-s-white-3_31cdfa22396b4a8daba71248fef3cf70_65798c8da56445cdad4c0f13af095f1b_compact.jpg' },
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

    const handleProductClick = (categoty) => {
        navigate(`/products?category=${categoty}`); // Chuyển đến URL mới với ID sản phẩm

    };

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
                const [allProductWithCategory, stockIns, stockOuts] = await Promise.all([
                    getAllProductWithCategory(),
                    getAllStockIn(),
                    getAllStockOut()

                ]);
                setProducts(allProductWithCategory.data);
                dispatch(setStockInsInInventory(stockIns || []))
                dispatch(setStockOutsInInventory(stockOuts || []))

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


    const getProductStock = (productId) => {
        const stockIn = stockIns
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => acc + item.quantity, 0);

        const stockOut = stockOuts
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => acc + item.quantity, 0);

        return stockIn - stockOut;
    };


    return (
        <div className="min-h-screen bg-gray-100 py-10">
            {isCategoryOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-500"></div>
            )}

            {loading ? <Loading /> :
                <div className="container mx-auto bg-white  w-11/12 rounded-lg  px-4 py-1">
                    <div className="w-full flex justify-center px-5 py-2 relative">
                        <div className="w-2/12 flex relative z-50 mr-5">
                            <MenuModal />
                        </div>
                        <div className="w-8/12 relative z-10">
                            <div className="relative w-full h-[40vh] flex items-center justify-center rounded-lg overflow-hidden shadow-lg bg-black">
                                {isCategoryOpen && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-500"></div>
                                )}
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
                        <div className="w-2/12 flex justify-center ml-5 relative z-10">
                            {isCategoryOpen && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-500"></div>
                            )}
                            <img src={BANNER2} alt="" className="w-fit h-[80vh] rounded-lg mr-4" />
                        </div>
                    </div>
                    <section className="mb-12">

                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-5">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Danh mục sản phẩm</h2>
                            <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-6 text-center">
                                {categories.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center space-y-2 cursor-pointer"
                                        onClick={() => handleProductClick(item.name)}
                                    >
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-16 h-16 object-contain rounded-lg "
                                        />
                                        <span className="text-sm font-medium">{item.name_vi}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <img src={BANNER4} alt="" />
                        <ProductCarousel products={products.filter(p => p.category_type == 'VGA' && getProductStock(p.id) > 0)} />
                        <div className="w-full  flex justify-center items-center py-2">
                            <button className="shadow-lg rounded-lg border px-5 py-3 hover:bg-black hover:text-white"
                                onClick={() => handleProductClick('VGA')}
                            >Xem thêm</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER5} alt="" />
                        <ProductCarousel products={products.filter(p => p.category_type == 'CPU' && getProductStock(p.id) > 0)} />
                        <div className="w-full  flex justify-center items-center py-2">
                            <button className="shadow-lg rounded-lg border px-5 py-3 hover:bg-black hover:text-white"
                                onClick={() => handleProductClick('CPU')}
                            >Xem thêm</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER6} alt="" className="mb-10" />
                        <ProductCarousel products={products.filter(p => p.category_type == 'MAINBOARD' && getProductStock(p.id) > 0)} />
                        <div className="w-full  flex justify-center items-center py-2">
                            <button className="shadow-lg rounded-lg border px-5 py-3 hover:bg-black hover:text-white"
                                onClick={() => handleProductClick('MAINBOARD')}
                            >Xem thêm</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER7} alt="" className="mb-10" />
                        <ProductCarousel products={products.filter(p => p.category_type == 'RAM' && getProductStock(p.id) > 0)} />
                        <div className="w-full  flex justify-center items-center py-2">
                            <button className="shadow-lg rounded-lg border px-5 py-3 hover:bg-black hover:text-white"
                                onClick={() => handleProductClick('RAM')}
                            >Xem thêm</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER8} alt="" className="mb-10" />
                        <ProductCarousel products={products.filter(p => p.category_type == 'SSD/HDD' && getProductStock(p.id) > 0)} />
                        <div className="w-full  flex justify-center items-center py-2">
                            <button className="shadow-lg rounded-lg border px-5 py-3 hover:bg-black hover:text-white"
                                onClick={() => handleProductClick('SSD/HDD')}
                            >Xem thêm</button>
                        </div>
                    </section>

                    <section className="mb-12">
                        <img src={BANNER10} alt="" className="mb-10" />
                        <ProductCarousel products={products.filter(p => p.category_type == 'CASE' && getProductStock(p.id) > 0)} />
                        <div className="w-full  flex justify-center items-center py-2">
                            <button className="shadow-lg rounded-lg border px-5 py-3 hover:bg-black hover:text-white"
                                onClick={() => handleProductClick('CASE')}
                            >Xem thêm</button>
                        </div>
                    </section>
                    <section className="mb-12">
                        <img src={BANNER11} alt="" className="mb-10" />
                        <ProductCarousel products={products.filter(p => p.category_type == 'PSU' && getProductStock(p.id) > 0)} />
                        <div className="w-full  flex justify-center items-center py-2">
                            <button className="shadow-lg rounded-lg border px-5 py-3 hover:bg-black hover:text-white"
                                onClick={() => handleProductClick('PSU')}
                            >Xem thêm</button>
                        </div>
                    </section>
                </div>}

        </div>
    );
};