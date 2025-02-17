import React from "react";
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { styled } from '@mui/system'
import { Pagination, Slider } from '@mui/material'
import { searchProducts } from "../routers/ApiRoutes";
import ProductCard from "../components/ProductCard";

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
    const categories = [
        { value: "laptop", label: "Laptop" },
        { value: "pc", label: "PC" },
        { value: "components", label: "Linh kiện" },
        { value: "case_psu_cooling", label: "Vỏ máy, PSU & Tản nhiệt" },
        { value: "storage", label: "Ổ cứng & Lưu trữ" },
        { value: "audio_video", label: "Thiết bị âm thanh & Video" },
        { value: "monitor", label: "Màn hình" },
        { value: "keyboard", label: "Bàn phím" },
        { value: "mouse_pad", label: "Chuột & Bàn di chuột" },
        { value: "headphone", label: "Tai nghe" },
        { value: "furniture", label: "Bàn & Ghế gaming" },
        { value: "accessories", label: "Phụ kiện khác" },
    ];
    const filterOptions = {
        laptop: {
            "CPU": ["Intel i5", "Intel i7", "AMD Ryzen 5", "AMD Ryzen 7"],
            "Kích thước màn hình": ["13 inch", "14 inch", "15.6 inch", "17 inch"],
            "Nhu cầu sử dụng": ["Học tập", "Văn phòng", "Gaming", "Đồ họa"],
            "RAM": ["8GB", "16GB", "32GB"],
            "SSD": ["256GB", "512GB", "1TB"],
            "VGA": ["Intel Iris Xe", "NVIDIA RTX 3050", "NVIDIA RTX 4060"]
        },
        pc: {
            "CPU": ["Intel i5", "Intel i7", "AMD Ryzen 5", "AMD Ryzen 9"],
            "RAM": ["16GB", "32GB", "64GB"],
            "SSD": ["512GB", "1TB", "2TB"],
            "VGA": ["RTX 3060", "RTX 3070", "RTX 4080"]
        },
        components: {
            "Dòng": ["Core i3", "Core i5", "Ryzen 5", "Ryzen 7"],
            "Thế hệ": ["Gen 10", "Gen 11", "Gen 12", "Gen 13"],
            "Nhân": ["4 nhân", "6 nhân", "8 nhân", "12 nhân"],
            "Dung lượng bộ nhớ": ["8GB", "16GB", "32GB"]
        },
        case_psu_cooling: {
            "Công suất": ["500W", "600W", "750W"],
            "Loại tản nhiệt": ["Khí", "Nước"],
            "RGB": ["Có", "Không"]
        },
        storage: {
            "Bus": ["3200MHz", "3600MHz", "4000MHz"],
            "Dung lượng": ["256GB", "512GB", "1TB", "2TB"],
            "Đèn LED": ["Có", "Không"]
        },
        audio_video: {
            "Bluetooth": ["Có", "Không"],
            "Nhu cầu sử dụng": ["Nghe nhạc", "Xem phim", "Chơi game"]
        },
        monitor: {
            "Độ phân giải": ["1080p", "1440p", "4K", "8K"],
            "Kích thước": ["24 inch", "27 inch", "32 inch"],
            "Tần số quét": ["60Hz", "120Hz", "144Hz", "240Hz"]
        },
        keyboard: {
            "Kết nối": ["Có dây", "Không dây"],
            "Key Cap": ["PBT", "ABS"],
            "LED": ["RGB", "Đơn sắc", "Không có"]
        },
        mouse_pad: {
            "Kết nối": ["Có dây", "Không dây"],
            "LED": ["RGB", "Không có"]
        },
        headphone: {
            "Kết nối": ["3.5mm", "USB", "Bluetooth"],
            "Kiểu tai nghe": ["In-ear", "Over-ear", "On-ear"]
        },
        furniture: {
            "Chất liệu": ["Gỗ", "Kim loại", "Nhựa"],
            "Chiều cao": ["1m", "1.2m", "1.5m"],
            "Tải trọng": ["50kg", "100kg", "150kg"]
        },
        accessories: {
            "Loại phụ kiện": ["Dây cáp", "Adapter", "Pin dự phòng"]
        }
    };
    const brandOptions = [
            "Dell",
            "Corsair",
            "ASUS",
            "Logitech",
            "Samsung",
            "MSI",
            "Gigabyte",
            "AMD",
            "Intel",
            "NVIDIA",
            "Kingston",
            "Crucial",
            "Shure",
            "Western Digital",
            "APC",
            "Lian Li",
            "NZXT",
            "Elgato",
            "Netgear",
            "Razer",
            "Garmin",
            "JBL",
            "Sony",
            "G-Skill",
            "SteelSeries",
            "HyperX",
            "Netgear"
    ];
    const colorOptions = [
        "Đỏ",
        "Xanh",
        "Đen",
        "Trắng",
        "Vàng",
        "Hồng",
        "Xám",
        "Nâu",
        "Cam",
        "Tím"
    ];
    const navigate = useNavigate();
    const query = useQuery();
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [showPriceSlider, setShowPriceSlider] = useState(false);

    const initialPage = parseInt(query.get('page') || '1', 10);
    const [page, setPage] = useState(initialPage);
    const location = useLocation();
    const [results, setResults] = useState(null);
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');
    const fetchResults = async (params) => {

        const response = await searchProducts({ params });
        setResults(response.data);
        console.log(response.data);
    }
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get('page') || '1', 10);
        setPage(currentPage);
        console.log(currentPage);
        fetchResults({ page: currentPage, search: name || undefined });
    }, [location.search]);
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
        alert('Lọc sản phẩm');
    }
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">Kết quả tìm kiếm</h1>
                <p className="text-lg text-center text-gray-600 mb-6">
                    Tìm kiếm theo từ khóa: <span className="font-semibold">{name}</span>
                </p>

                {/* Filter Panel */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {/* Chọn loại sản phẩm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại Sản Phẩm</label>
                            <select
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Chọn Loại Sản Phẩm</option>
                                {categories.map((category) => (
                                    <option key={category.value} value={category.value}>{category.label}</option>
                                ))}
                            </select>
                        </div>
                        {/* Bộ lọc hãng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hãng</label>
                            <select className="w-full border border-gray-300 rounded-md p-2">
                                <option value="">Hãng</option>
                                {brandOptions.map((brand, index) => (
                                    <option key={index} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                        {/* Bộ lọc màu sắc */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                            <select className="w-full border border-gray-300 rounded-md p-2">
                                <option value="">Màu sắc</option>
                                <option value="red">Đỏ</option>
                                <option value="blue">Xanh</option>
                                <option value="black">Đen</option>
                            </select>
                        </div>
                        {/* Bộ lọc khoảng giá */}
                        <div className="lg:col-span-2 relative">
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
                                        max={10000}
                                    />
                                </div>
                            )}
                        </div>
                        {selectedCategory && filterOptions[selectedCategory] && (
                            <div className="col-span-full">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tìm kiếm nâng cao</h3>
                            </div>
                        )}
                        {/* Hiển thị các bộ lọc theo danh mục */}
                        {selectedCategory && filterOptions[selectedCategory] &&
                            Object.entries(filterOptions[selectedCategory]).map(([filterName, values]) => (
                                <div key={filterName}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{filterName}</label>
                                    <select className="w-full border border-gray-300 rounded-md p-2">
                                        <option value="">{filterName}</option>
                                        {values.map((value, index) => (
                                            <option key={index} value={value}>{value}</option>
                                        ))}
                                    </select>
                                </div>
                            ))
                        }
                        {/* Nút lọc */}
                        <div className="sm:col-span-2 md:col-span-1 flex items-end">
                            <button onClick={handleFilterClick} className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                                Lọc
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                    {results?.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
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
