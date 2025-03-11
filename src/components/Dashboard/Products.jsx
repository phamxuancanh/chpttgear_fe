import { use, useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { styled } from '@mui/system'
import { Pagination, Slider } from '@mui/material'
import AddProductModal from "../Modal/AddProductModal";
import { findAllCategory, getProductsManagementPage, searchProducts } from "../../routers/ApiRoutes";
import AddCategoryModal from "../Modal/AddCategoryModal";
import { FaDongSign } from "react-icons/fa6";
import Loading from "../../utils/Loading";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export default function Products() {
    const quantityInStock = 100;
    const imageTemp = "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-1.2.1";
    const [showProductModal, setShowProductModal] = useState({ show: false, productId: "" });
    const [showCategoryModal, setShowCategoryModal] = useState({ show: false });
    const [results, setResults] = useState(null);
    const navigate = useNavigate();
    const query = useQuery();
    const location = useLocation();
    const initialPage = parseInt(query.get('page') || '1', 10);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState([])
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
        SPEAKER: [
            { key: "warranty", value: "BẢO HÀNH", options: ["6 THÁNG", "12 THÁNG", "24 THÁNG"] },
            { key: "type", value: "LOẠI", options: ["2.0", "2.1", "5.1", "7.1", "SOUNDBAR"] },
            { key: "connection", value: "KẾT NỐI", options: ["BLUETOOTH", "AUX", "USB", "HDMI", "OPTICAL"] },
            { key: "power", value: "CÔNG SUẤT", options: ["5W", "10W", "20W", "50W", "100W+"] }
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
    const [selectedCategory, setSelectedCategory] = useState("");
    const [specsFields, setSpecsFields] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedColor, setSelectedColor] = useState("");
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [showPriceSlider, setShowPriceSlider] = useState(false);
    const [productData, setProductData] = useState({});
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');
    const [searchTerm, setSearchTerm] = useState('');

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
        fetchCategories();
    }, []);
    const handleCategoryChange = (e) => {
        const selectedIndex = e.target.selectedIndex;
        const selectedId = e.target.value;
        const selectedName = e.target.options[selectedIndex].text;
        if (selectedId === "") {
            setSelectedCategory("");
        } else {
            setSelectedCategory({ id: selectedId, name: selectedName });
        }
    };
    useEffect(() => {
        if (selectedCategory.id) {
            console.log("Selected category:", selectedCategory);
            setSpecsFields(specDefinitions[selectedCategory.name] || []);
        }
        else {
            setSpecsFields([]);
        }

    }, [selectedCategory]);
    useEffect(() => {
        // Reset các combobox về giá trị mặc định khi search param "name" thay đổi
        setSelectedCategory({ id: "", name: "" });
        setSelectedColor("");
        setProductData({});
        setPriceRange([0, 100000000]);
    }, [name]);
    const fetchResults = async (params) => {
        try {
            setLoading(true);
            const response = await searchProducts({ params });
            setResults(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get("category") || "";
        if (categoryParam !== "" && categories.length > 0) {
            const categoryFound = categories.find(
                (c) => c.name.trim().toLowerCase() === categoryParam.trim().toLowerCase()
            );
            if (categoryFound) {
                setSelectedCategory({ id: categoryFound.id, name: categoryFound.name });
            } else {
                setSelectedCategory({ id: "", name: categoryParam });
            }
        } else {
            setSelectedCategory({ id: "", name: "" });
        }
    }, [location.search, categories]);
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const allParams = {};
        const initialData = {};
        setSearchTerm(queryParams.get("name") || "");
        setSelectedColor(queryParams.get("color") || "all");
        setPriceRange([parseFloat(queryParams.get("price_gte")) || 0, parseFloat(queryParams.get("price_lte")) || 100000000]);
        for (const [key, value] of queryParams.entries()) {
            allParams[key] = value;
        }
        if (allParams.page) {
            allParams.page = parseInt(allParams.page, 10);
            if (isNaN(allParams.page)) {
                allParams.page = 1;
            }
            setPage(allParams.page);
        } else {
            allParams.page = 1;
        }
        if (selectedCategory && selectedCategory.name.trim() !== "") {
            queryParams.set("category", selectedCategory.name);
        } else {
            queryParams.delete("category");
        }
        allParams.search = name || "";

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

        if (selectedColor && selectedColor !== "all") {
            queryParams.set("color", selectedColor);
        } else {
            queryParams.delete("color");
        }
        setPriceRange([allParams.price_gte, allParams.price_lte]);

        // Lấy thông tin specsFields
        specsFields.forEach((spec) => {
            if (allParams[`spec_${spec.key}`] && allParams[`spec_${spec.key}`] !== "all") {
                initialData[spec.key] = allParams[`spec_${spec.key}`];
            }
        });
        setProductData(initialData);

        console.log("All params:", allParams);
        fetchResults(allParams);
    }, [location.search]);

    const handleSpecChange = (key, value) => {
        setProductData(prevData => ({
            ...prevData,
            [key]: value,
        }));
    };
    const handleFilterClick = () => {
        setLoading(true);
        console.log("Filtering...");
        try {
            const queryParams = new URLSearchParams(location.search);

            queryParams.set("page", 1);

            if (searchTerm !== "") {
                queryParams.set("name", searchTerm);
            } else {
                queryParams.delete("name");
            }
            // Kiểm tra category
            if (selectedCategory && selectedCategory.name !== "") {
                queryParams.set("category", selectedCategory.name);
            } else {
                queryParams.delete("category");

                // Xóa tất cả các spec_* nếu category rỗng
                [...queryParams.keys()].forEach((key) => {
                    if (key.startsWith("spec_")) {
                        queryParams.delete(key);
                    }
                });
            }

            // Kiểm tra color
            if (selectedColor && selectedColor !== "all") {
                queryParams.set("color", selectedColor);
            } else {
                queryParams.delete("color");
            }

            // Cập nhật khoảng giá
            queryParams.set("price_gte", priceRange[0]);
            queryParams.set("price_lte", priceRange[1]);

            // Cập nhật spec_* nếu có category
            if (selectedCategory && selectedCategory !== "") {
                for (const key in productData) {
                    if (productData[key] && productData[key] !== "all") {
                        queryParams.set(`spec_${key}`, productData[key]);
                    } else {
                        queryParams.delete(`spec_${key}`);
                    }
                }
            }

            navigate(`?${queryParams.toString()}`);
        } finally {
            setLoading(false);
        }
    };
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
            },
        },
        '.MuiPaginationItem-page.Mui-selected': {
            color: '#667eea',
            fontWeight: 'bold',
            border: '2px solid #667eea',
            '&:hover': {
                backgroundColor: '#667eea',
                color: 'black'
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
    });

    // useEffect(() => {
    //     const queryParams = new URLSearchParams(location.search);
    //     const currentPage = parseInt(queryParams.get('page') || '1', 10);
    //     setPage(currentPage);
    //     fetchProducts({ page: currentPage });
    // }, [location.search]);

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

    const ActionButton = ({ icon: Icon, onClick, color }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded-full ${color} text-white hover:opacity-80 transition-opacity mr-2`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    const handleActionButton = (product_id) => {
        console.log(product_id);
        setShowProductModal({ show: true, productId: product_id });
    }

    return (
        <div className="flex-1 p-8">
            {loading ? <Loading /> : <div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Danh sách sản phẩm</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowProductModal({ show: true, productId: "" })}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Thêm sản phẩm
                        </button>
                    </div>
                </div>

                {showProductModal.show && <AddProductModal setShowProductModal={setShowProductModal} product_id={showProductModal.productId} />}
                {showCategoryModal.show && <AddCategoryModal setShowCategoryModal={setShowCategoryModal} />}
                {/* bộ lọc */}
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Bộ lọc sản phẩm</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tìm theo tên</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nhập tên sản phẩm..."
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
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
                                    <option value="all">Tất cả</option> {/* Thêm tùy chọn "Tất cả" */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results?.data
                        ?.slice() // Tạo bản sao để tránh thay đổi mảng gốc
                        .sort((a, b) => {
                            const dateA = a.modifiedDate ? Date.parse(a.modifiedDate) : 0;
                            const dateB = b.modifiedDate ? Date.parse(b.modifiedDate) : 0;
                            return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
                        })
                        .map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img
                                    src={product.image ? product.image.split(",")[0] : imageTemp}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex justify-start text-blue-600 font-bold">
                                            <span className=" mr-1">
                                                {product.price.toLocaleString('en-US')}
                                            </span>
                                            <FaDongSign />
                                        </div>
                                        <span className="text-gray-500">Số lượng tồn: {quantityInStock}</span>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <ActionButton
                                            icon={FiEdit}
                                            color="bg-blue-500"
                                            onClick={() => handleActionButton(product.id)}
                                        />
                                    </div>
                                </div>
                            </div>
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
            </div>}

        </div>
    );
};


