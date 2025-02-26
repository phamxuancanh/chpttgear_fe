import React, { useState } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { useEffect } from "react";
import { findAllCategory, getAllProduct, getSuggestions } from "../routers/ApiRoutes";
import { Pagination } from '@mui/material'
import { styled } from '@mui/system'
import { useLocation, useNavigate } from 'react-router-dom'
import ROUTES from '../constants/Page';
import { debounce } from 'lodash'
import Loading from "../utils/Loading";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { GrPrevious, GrNext } from "react-icons/gr";
import SLIDE1 from "../assets/slide1.webp"
import SLIDE2 from "../assets/slide2.webp"
import SLIDE3 from "../assets/slide3.webp"
import SLIDE5 from "../assets/slide5.webp"
import SLIDE6 from "../assets/slide6.webp"
import BANNER2 from "../assets/banner2.webp"
import BANNER3 from "../assets/banner3.webp"
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

export default function Home() {
    const navigate = useNavigate()
    const CustomPagination = styled(Pagination)({
        '.MuiPagination-ul': {
            display: 'inline-flex',
            fontSize: 'large',
            listStyle: 'none',
            margin: '10px',
            '@media (max-width: 600px)': {
                margin: '5px'
            }
        },
        '.MuiPaginationItem-root': {
            fontSize: 'large',
            fontWeight: 'bold',
            borderRadius: '4px',
            margin: '2px',
            border: '1px solid #cbd5e0',
            backgroundColor: 'white',
            color: '#718096',
            '&:hover': {
                backgroundColor: '#667eea',
                color: 'white'
            },
            '@media (max-width: 600px)': {
                margin: '0px'
            }
        },
        '.MuiPaginationItem-firstLast': {
            borderRadius: '4px'
        },
        '.MuiPaginationItem-previousNext': {
            borderRadius: '4px',
            margin: '10px',
            '@media (min-width: 600px)': {
                margin: '20px'
            },
            '@media (max-width: 600px)': {
                fontSize: 'medium',
                margin: '0px'
            }
        },
        '.MuiPaginationItem-page.Mui-selected': {
            color: '#667eea',
            fontWeight: 'bold',
            border: '2px solid #667eea',
            backgroundColor: 'white',
            '&:hover': {
                backgroundColor: '#667eea',
                color: 'white'
            }
        },
        '.MuiPaginationItem-ellipsis': {
            color: '#a0aec0',
            border: '1px solid #cbd5e0',
            backgroundColor: 'white',
            padding: '2px',
            margin: '0',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    })
    const [selectedCategories, setSelectedCategories] = useState([]);
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

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
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


    const fetchSuggestions = debounce(async (value) => {
        try {
            const response = await getSuggestions(value);
            console.log(response);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }, 300);
    console.log(suggestions);
    useEffect(() => {



        const fetchData = async () => {
            try {
                const res1 = await getAllProduct();

                setProducts(res1.data)

            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        setLoading(true)
        fetchData();
        setLoading(false)
        const interval = setInterval(() => {
            handleImageNavigation("next");
        }, 5000); // Chuyển ảnh sau mỗi 5 giây

        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, []);

    const handleCategoryChange = (categoryName) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryName)
                ? prev.filter((name) => name !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handleSearchClick = async () => {
        // const response = await searchProducts({ params: { search: searchTerm } });
        // console.log(response.data);
        setSuggestions([])
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        navigate(`${ROUTES.SEARCH_RESULTS.path}?name=${encodedSearchTerm}`);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 1) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 py-10">
            {loading ? <Loading /> :
                <div className="container mx-auto bg-white  w-10/12 rounded-lg  px-4 py-1">
                    <div className="w-full flex justify-center px-5 py-2">
                        <div className="w-3/12 flex justify-center ">
                            <img src={BANNER2} alt="" className="w-fit h-[80vh] rounded-lg mr-4" />
                        </div>
                        <div className="w-9/12">
                            <div className="relative w-full h-[40vh] flex items-center justify-center rounded-lg overflow-hidden shadow-lg bg-black">
                                {/* Background Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60"></div>

                                {/* Image Transition */}
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

                                {/* Nút chuyển ảnh */}
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
                            <div className="w-full ">
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
                        <h2 className="text-2xl font-bold text-foreground mb-6">Sản phẩm đề xuất</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Sản phẩm nổi bật</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Sản phẩm bán chạy</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                    {/* <div className="flex justify-center">
                    <CustomPagination
                        count={10}
                        page={1}
                        // onChange={(_, page) => handleChangePaginationNew(page)}
                        boundaryCount={1}
                        siblingCount={1}
                    />
                </div> */}
                </div>}


        </div>
    );
};
