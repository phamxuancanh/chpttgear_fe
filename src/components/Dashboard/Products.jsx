import { use, useState, useEffect, useMemo } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { styled } from '@mui/system'
import { Pagination } from '@mui/material'

import AddProductModal from "../Modal/AddProductModal";
import { findAllProduct, getProductsManagementPage } from "../../routers/ApiRoutes";
import { current } from "@reduxjs/toolkit";
import AddCategoryModal from "../Modal/AddCategoryModal";
import { FaDongSign } from "react-icons/fa6";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export default function Products() {
    const quantityInStock = 100;
    const imageTemp = "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-1.2.1";
    const [showProductModal, setShowProductModal] = useState({ show: false, productId: "" });
    const [showCategoryModal, setShowCategoryModal] = useState({ show: false });
    const [products, setProducts] = useState(null);
    const [results, setResults] = useState(null);
    const navigate = useNavigate();
    const query = useQuery();
    const location = useLocation();
    const initialPage = parseInt(query.get('page') || '1', 10);
    const [page, setPage] = useState(initialPage);

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

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get('page') || '1', 10);
        setPage(currentPage);
        fetchProducts({ page: currentPage });
    }, [location.search]);

    const totalPage = useMemo(() => {
        const size = (products?.data != null) ? products?.size : 5;
        const totalRecord = (products?.data != null) ? products?.totalRecords : 5;
        return Math.ceil(totalRecord / size);
    }, [products?.data]);

    const handleChangeResultPagination = (value) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('page', value.toString());
        navigate(`?${queryParams.toString()}`);
    };

    const fetchProducts = async (params) => {
        try {
            const response = await getProductsManagementPage({ params });
            setProducts(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
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
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Danh sách sản phẩm</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowProductModal({ show: true, productId: "" })}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Thêm sản phẩm
                        </button>
                        <button
                            onClick={() => setShowCategoryModal({ show: true })}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Thêm loại sản phẩm
                        </button>
                    </div>
                </div>
                {showProductModal.show && <AddProductModal setShowProductModal={setShowProductModal} product_id={showProductModal.productId} />}
                {showCategoryModal.show && <AddCategoryModal setShowCategoryModal={setShowCategoryModal} />}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products?.data
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
            </div>
        </div>
    );
};


