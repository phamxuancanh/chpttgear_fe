import React from "react";
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { styled } from '@mui/system'
import { Pagination, Slider } from '@mui/material'
import { findAllCategory, findAllSpecification, searchProducts } from "../routers/ApiRoutes";
import ProductCard from "../components/ProductCard";
import { ClockLoader } from "react-spinners"

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};
export default function SearchResult() {
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
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [specifications01, setSpecifications01] = useState([]);
    const [specsFields, setSpecsFields] = useState([]);
    const [productData, setProductData] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await findAllCategory();
                setCategories(response.data);
                console.log("Danh sách loại sản phẩm:");
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        const fetchSpecifications = async () => {
            try {
                const response = await findAllSpecification();
                setSpecifications01(response.data);
                console.log("Danh sách thông số kỹ thuật:");
            } catch (error) {
                console.error('Error fetching specifications:', error);
            }
        };
        fetchCategories();
        fetchSpecifications();
    }, []);
    const handleCategoryChange = (e) => {
        const selectedIndex = e.target.selectedIndex;
        const selectedId = e.target.value;
        const selectedName = e.target.options[selectedIndex].text;
        setSelectedCategory({ id: selectedId, name: selectedName });
    };
    useEffect(() => {
        if (selectedCategory.name) {
            setSpecsFields(specDefinitions[selectedCategory.name] || []);
        } else {
            setSpecsFields([]);
        }
    }, [selectedCategory]);
    const colors = [
        { key: "black", value: "Đen" },
        { key: "white", value: "Trắng" },
        { key: "red", value: "Đỏ" },
        { key: "blue", value: "Xanh" },
        { key: "green", value: "Xanh lá" },
        { key: "yellow", value: "Vàng" },
        { key: "purple", value: "Tím" },
        { key: "gray", value: "Xám" },
        { key: "brown", value: "Nâu" },
        { key: "pink", value: "Hồng" },
        { key: "orange", value: "Cam" }
      ];
    const specDefinitions = {
        Headphones: [
            { key: "model", value: "Mẫu", options: [] },
            { key: "warranty", value: "Bảo hành", options: [] },
            { key: "type", value: "Kiểu", options: ["Over-ear", "In-ear"] },
            { key: "connection", value: "Kết nối", options: ["Wired", "Wireless", "Bluetooth"] },
            { key: "battery_life", value: "Thời lượng pin", options: [] },
            { key: "noise_cancellation", value: "Khử tiếng ồn chủ động", options: ["Có", "Không"] },
            { key: "microphone", value: "Microphone", options: ["Có", "Không"] },
            { key: "frequency_response", value: "Dải tần số", options: [] },
        ],
        Keyboards: [
            { key: "model", value: "Mẫu", options: [] },
            { key: "warranty", value: "Bảo hành", options: [] },
            { key: "switch_type", value: "Loại switch", options: ["Mechanical", "Membrane", "Optical"] },
            { key: "connection", value: "Kết nối", options: ["Wired", "Wireless", "Bluetooth"] },
            { key: "backlight", value: "Đèn nền", options: ["Có", "Không", "RGB"] },
            { key: "key_rollover", value: "Số lượng phím nhận diện cùng lúc", options: [] },
        ],
        Mice: [
            { key: "model", value: "Mẫu", options: [] },
            { key: "warranty", value: "Bảo hành", options: [] },
            { key: "sensor_type", value: "Loại cảm biến", options: ["Optical", "Laser"] },
            { key: "dpi", value: "Độ phân giải DPI", options: [] },
            { key: "connection", value: "Kết nối", options: ["Wired", "Wireless", "Bluetooth"] },
            { key: "buttons", value: "Số nút", options: [] },
            { key: "battery_life", value: "Thời lượng pin", options: [] },
        ],
        RAM: [
            { key: "model", value: "Mẫu", options: [] },
            { key: "warranty", value: "Bảo hành", options: [] },
            { key: "capacity", value: "Dung lượng", options: ["4GB", "8GB", "16GB", "32GB", "64GB"] },
            { key: "speed", value: "Tốc độ bus", options: [] },
            { key: "latency", value: "Độ trễ CAS", options: [] },
            { key: "voltage", value: "Điện áp", options: [] },
            { key: "type", value: "Loại RAM", options: ["DDR3", "DDR4", "DDR5"] },
        ],
        CPUs: [
            { key: "model", value: "Mẫu", options: [] },
            { key: "warranty", value: "Bảo hành", options: [] },
            { key: "cores", value: "Số nhân", options: [] },
            { key: "threads", value: "Số luồng", options: [] },
            { key: "base_clock", value: "Xung nhịp cơ bản", options: [] },
            { key: "boost_clock", value: "Xung nhịp tối đa", options: [] },
            { key: "socket", value: "Socket tương thích", options: ["LGA1200", "LGA1700", "AM4", "AM5"] },
            { key: "tdp", value: "Công suất tiêu thụ (TDP)", options: [] }
        ]
    };

    const navigate = useNavigate();
    const query = useQuery();
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [showPriceSlider, setShowPriceSlider] = useState(false);

    const initialPage = parseInt(query.get('page') || '1', 10);
    const [page, setPage] = useState(initialPage);
    const location = useLocation();
    const [results, setResults] = useState(null);
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');
    useEffect(() => {
        // Reset các combobox về giá trị mặc định khi search param "name" thay đổi
        setSelectedCategory({ id: "all", name: "" });
        setSelectedColor("");
        setProductData({});
        setPriceRange([0, 100000000]);
    }, [name]);
    const fetchResults = async (params) => {
        try {
          const response = await searchProducts({ params });
          setResults(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching results:", error);
        }
      };
      useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const allParams = {};
        const initialData = {};
    
        // Chuyển toàn bộ query param thành object
        for (const [key, value] of queryParams.entries()) {
            allParams[key] = value;
        }
        if (allParams.page) {
            allParams.page = parseInt(allParams.page, 10);
            if (isNaN(allParams.page)) {
                allParams.page = 1;
            }
        } else {
            allParams.page = 1; // giá trị mặc định
        }

        if (allParams.price_gte) {
            const num = parseFloat(allParams.price_gte);
            allParams.price_gte = isNaN(num) ? undefined : num;
        }
        if (allParams.price_lte) {
            const num = parseFloat(allParams.price_lte);
            allParams.price_lte = isNaN(num) ? undefined : num;
        }

        // Parse các giá trị cần thiết
        allParams.page = parseInt(allParams.page, 10) || 1;
        allParams.price_gte = parseFloat(allParams.price_gte) || 0;
        allParams.price_lte = parseFloat(allParams.price_lte) || 100000000;
    
        const matchedCategory = categories.find(
            (cat) => cat.name.toLowerCase() === allParams.category?.toLowerCase()
        );
        setSelectedCategory(matchedCategory ? matchedCategory.id : "");
        setSelectedColor(allParams.color || "");
        setPriceRange([allParams.price_gte, allParams.price_lte]);
    
        // Lấy thông tin specsFields
        specsFields.forEach((spec) => {
            if (allParams[spec.key]) {
                initialData[spec.key] = allParams[spec.key];
            }
        });
        setProductData(initialData);
    
        console.log("All params:", allParams);
        fetchResults(allParams);
    }, [location.search, specsFields]);


    const totalPage = useMemo(() => {
        const size = (results?.data != null) ? results?.size : 5;
        const totalRecord = (results?.data != null) ? results?.totalRecords : 5;
        return Math.ceil(totalRecord / size);
    }, [results?.data]);
    const handleChangeResultPagination = (value) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('page', value.toString());
        navigate(`?${queryParams.toString()}`);
    };
    const handleFilterClick = () => {
        setLoading(true);
        try {
          const queryParams = new URLSearchParams(location.search);
          // Cập nhật/Thêm các param thông thường
          queryParams.set("page", 1);
          if (name) {
            queryParams.set("search", name);
          }
          if (selectedCategory && selectedCategory.name) {
            queryParams.set("category", selectedCategory.name);
          }
          if (selectedColor) {
            queryParams.set("color", selectedColor);
          }
          queryParams.set("price_gte", priceRange[0]);
          queryParams.set("price_lte", priceRange[1]);
      
          for (const key in productData) {
            if (productData[key]) {
              queryParams.set(`spec_${key}`, productData[key]);
            }
          }
          navigate(`?${queryParams.toString()}`);
        } finally {
          setLoading(false);
        }
      };
      
    
    const handleSpecChange = (key, value) => {
        setProductData(prevData => ({
            ...prevData,
            [key]: value,
        }));
    };
    return (
        <div className="min-h-screen bg-background">
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50">
                    <div className="flex justify-center items-center w-full h-140 mt-20">
                        <ClockLoader
                            className='flex justify-center items-center w-full mt-20'
                            color='#5EEAD4'
                            cssOverride={{
                                display: 'block',
                                margin: '0 auto',
                                borderColor: 'blue'
                            }}
                            loading
                            speedMultiplier={3}
                            size={40}
                        />
                    </div>
                </div>
            )}
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">Kết quả tìm kiếm</h1>
                <p className="text-lg text-center text-gray-600 mb-6">
                    Tìm kiếm theo từ khóa: <span className="font-semibold">{name}</span>
                </p>

                {/* Filter Panel */}
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Bộ lọc sản phẩm</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Loại sản phẩm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại Sản Phẩm</label>
                            <select
                                id="productType"
                                name="productType"
                                value={selectedCategory.id}
                                onChange={handleCategoryChange}
                                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Tất cả sản phẩm</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Màu sắc */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                            <select
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">Tất cả màu sắc</option>
                                {colors.map((color) => (
                                    <option key={color.key} value={color.key}>
                                        {color.value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Khoảng giá */}
                        <div className="col-span-2 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng Giá</label>
                            <div
                                className="w-full border border-gray-300 rounded-md p-2 cursor-pointer flex justify-between items-center"
                                onClick={() => setShowPriceSlider(!showPriceSlider)}
                            >
                                <span>{priceRange[0]} - {priceRange[1]}</span>
                                <span>{showPriceSlider ? "▲" : "▼"}</span>
                            </div>
                            {showPriceSlider && (
                                <div className="mt-2">
                                    <Slider
                                        value={priceRange}
                                        onChange={(e, newValue) => setPriceRange(newValue)}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={100000000}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Thông số kỹ thuật */}
                        {specsFields.length > 0 && specsFields.map((spec) => (
                            <div key={spec.key}>
                                <label htmlFor={spec.key} className="block text-sm font-medium text-gray-700">{spec.value}</label>
                                <select
                                    id={spec.key}
                                    name={spec.key}
                                    value={productData[spec.key] || ''}
                                    onChange={(e) => handleSpecChange(spec.key, e.target.value)}
                                    className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="" disabled>Chọn {spec.value}</option>
                                    {spec.options.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        ))}

                        {/* Nút lọc */}
                        <div className="col-span-1 sm:col-span-2 md:col-span-1 flex items-end">
                            <button
                                onClick={handleFilterClick}
                                className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
                            >
                                Lọc
                            </button>
                        </div>
                    </div>
                </div>

                {results?.data && results.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                        {results.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-lg text-gray-600 mb-6">
                        Không có sản phẩm hợp lệ
                    </div>
                )}
                <div className="flex justify-center">
                    <CustomPagination
                        count={totalPage}
                        page={page}
                        onChange={(_, page) => handleChangeResultPagination(page)}
                        boundaryCount={1}
                        siblingCount={1}
                    />
                </div>
            </div>
        </div>
    );
};
