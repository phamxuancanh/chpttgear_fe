/* eslint-disable no-unused-vars */
import { use, useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { FiEye } from "react-icons/fi";

import { styled } from '@mui/system'
import { Pagination, Slider } from '@mui/material'
import AddProductModal from "../Modal/AddProductModal";
import DetailProductModal from "../Modal/DetailProductModal";
import { findAllCategory, getAllInventory, getProductsManagementPage, searchProducts } from "../../routers/ApiRoutes";
import AddCategoryModal from "../Modal/AddCategoryModal";
import { FaDongSign } from "react-icons/fa6";
import Loading from "../../utils/Loading";
import specDefinitions from "../../assets/Menu/specDefinitions.json";
import translationMap from "../../assets/Menu/translate.json";
import { MaterialReactTable } from "material-react-table"
import { Box, Button, Avatar } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};
const translate = (key) => translationMap[key] || key;

export default function Products() {
    const quantityInStock = 100;
    const imageTemp = "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-1.2.1";
    const [showProductModal, setShowProductModal] = useState({ show: false, productId: "" });
    const [showProducDetailtModal, setShowProducDetailtModal] = useState({ show: false, productId: "" });
    const [showCategoryModal, setShowCategoryModal] = useState({ show: false });
    const [results, setResults] = useState(null);
    const navigate = useNavigate();
    const query = useQuery();
    const location = useLocation();
    const initialPage = parseInt(query.get('page') || '1', 10);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState([])
    const stockIns = useSelector(state => state.inventory.stockIns)
    const stockOuts = useSelector(state => state.inventory.stockOuts)
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
                console.log()
                const response = await findAllCategory();
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const getProductStock = (productId) => {
        const stockIn = stockIns
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => acc + item.quantity, 0);

        const stockOut = stockOuts
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => acc + item.quantity, 0);

        return stockIn - stockOut;
    };

    const handleCategoryChange = (e) => {
        const selectedIndex = e.target.selectedIndex;
        const selectedId = e.target.value;
        const selectedCategory = categories.find(cat => cat.id === selectedId);
        if (selectedId === "") {
            setSelectedCategory("");
        } else {
            setSelectedCategory({ id: selectedId, name: selectedCategory.name });
        }
    };
    useEffect(() => {
        if (selectedCategory.id) {

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
            console.log(response.data)
            setResults(response.data);

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

        setShowProductModal({ show: true, productId: product_id });
    }
    const handleViewDetails = (product_id) => {
        console.log(product_id);
        setShowProducDetailtModal({ show: true, productId: product_id });
    }
    const columns = useMemo(
        () => [
            {
                header: "STT",
                enableColumnResizing: false,
                size: 10,
                Cell: ({ row }) => row.index + 1,
                grow: false,
                justifyContent: "center",
                headerAlign: "center",
                headerProps: { sx: { textAlign: "center" } }

            },
            {
                accessorKey: "image",
                header: "Hình ảnh",
                enableSorting: false,
                enableColumnResizing: false,
                Cell: ({ cell }) => (
                    <img
                        src={cell.getValue()?.split(",")[0] || "/placeholder.png"}
                        alt="Product"
                        className="w-32 h-32 object-cover rounded-md"
                    />
                ),
                justifyContent: "center",
                size: 150,
                grow: false,
            },
            {
                accessorKey: "name",
                header: "Tên sản phẩm",
                enableSorting: false,
                Cell: ({ cell }) => (
                    <Tooltip title={cell.getValue()} arrow>
                        <Box sx={{
                            //whiteSpace: "nowrap", // Không cho phép tự động xuống dòng
                            overflow: "hidden", // Ẩn phần vượt quá khung
                            textOverflow: "ellipsis", // Hiển thị "..." khi quá dài
                            //maxWidth: "100%", // Đảm bảo không bị giới hạn cứng
                            display: "block",
                            wordBreak: "break-word"
                        }}>
                            {cell.getValue()}
                        </Box>
                    </Tooltip>
                ),
                headerProps: { sx: { textAlign: "center" } }, // Căn giữa tiêu đề của cột này
                grow: 2,
                size: 360
            },

            {
                accessorKey: "color",
                header: "Màu sắc",
                enableSorting: false,
                Cell: ({ cell }) => {
                    const colorData = cell.getValue();
                    const colorKey = typeof colorData === "string" ? colorData : colorData?.key;
                    const colorObj = colors.find(c => c.key === colorKey);
                    return colorObj ? colorObj.value : colorKey;
                },
                grow: 1,
                size: 10
            },
            {
                accessorKey: "price",
                header: "Giá",
                Cell: ({ cell }) => (
                    <Box sx={{ color: "green", fontWeight: "bold", display: "flex", alignItems: "center" }}>

                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cell.getValue())}
                    </Box>
                ),
                grow: 1,
                size: 50
            },
            {
                accessorKey: "quantityInStock",
                header: "Tồn kho",
                enableSorting: false, // Cho phép sắp xếp
                sortingFn: "alphanumeric", // Đảm bảo sắp xếp đúng nếu là số
                Cell: ({ row }) => {
                    const stock = parseInt(getProductStock(row.original.id) || row.original.quantityInStock) || 0;
                    return (
                        <Box sx={{ fontWeight: "bold" }}>
                            {stock}
                        </Box>
                    );
                },
                grow: 1,
                size: 20
            },
            {
                accessorKey: "actions",
                header: "Hành động",
                enableSorting: false,
                enableColumnFilter: false,
                Cell: ({ row }) => (
                    <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={() => handleActionButton(row.original.id)}
                        >
                            Sửa
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<FiEye />}
                            onClick={() => handleViewDetails(row.original.id)}
                        >
                            Xem
                        </Button>
                    </div>
                ),
                size: 50,
                grow: false,
                flexGrow: 1
            }

        ],
        [results]
    );



    return (
        <div className="flex-1 p-8">
            {loading ? <Loading /> : <div>

                <div className="flex justify-between items-center mb-6 ">
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
                {showProducDetailtModal.show && <DetailProductModal setShowProductModal={setShowProducDetailtModal} product_id={showProducDetailtModal.productId} />}
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
                                        {category.name_Vi}
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
                                <label htmlFor={spec.key} className="block text-sm font-medium text-gray-700">{translate(spec.key)}</label>
                                <select
                                    id={spec.key}
                                    name={spec.key}
                                    value={productData[spec.key] || ''}
                                    onChange={(e) => handleSpecChange(spec.key, e.target.value)}
                                    className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">Tất cả</option> {/* Thêm tùy chọn "Tất cả" */}
                                    {spec.options.map((option) => (
                                        <option key={option} value={option}>{translate(option)}</option>
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
                <Box sx={{ overflowX: "auto" }}>
                    <MaterialReactTable
                        columns={columns}
                        data={results?.data || []}
                        enablePagination={false}
                        enableSorting={true}
                        muiTableProps={{
                            sx: {
                                backgroundColor: "#fafafa",
                                borderRadius: "8px",
                                "& td, & th": {
                                    borderRight: "1px solid #ddd"
                                },
                                "& th:last-child, & td:last-child": {
                                    borderRight: "none"
                                },
                                textAlign: "center"
                            }
                        }}
                        muiTableHeadCellProps={{
                            align: 'center', // Thêm thuộc tính này
                            sx: {
                                fontWeight: "bold",
                                backgroundColor: "#f1f5f9",
                                textAlign: "center",
                                // Xóa display: "flex" nếu nó gây xung đột
                                justifyContent: "center",
                                alignItems: "center",
                                "& .MRT-column-header-content": { // Thay đổi selector này
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                },
                                "& .MRT-column-title": { // Thêm selector này
                                    textAlign: "center",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center"
                                }
                            }
                        }}
                        muiTableBodyCellProps={{
                            sx: {
                                textAlign: "center" // Căn giữa nội dung của các ô dữ liệu
                            }
                        }}
                    />
                </Box>
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
