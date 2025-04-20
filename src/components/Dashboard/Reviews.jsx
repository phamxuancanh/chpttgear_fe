import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEdit, FiEye, FiMessageCircle, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import { styled } from '@mui/system';
import { Pagination, Rating } from '@mui/material';
import { classifyReview, getAllParentReviews, getParentReviewsByProductId } from "../../routers/ApiRoutes";
import Loading from "../../utils/Loading";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Avatar } from "@mui/material";
import { Tooltip } from "@mui/material";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export default function Reviews() {
    const [reviewsData, setReviewsData] = useState({ content: [], totalElements: 0, size: 5, totalPages: 0 });
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productList, setProductList] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const query = useQuery();
    const initialPage = parseInt(query.get('page') || '1', 10);
    const [page, setPage] = useState(initialPage);
    const [showReviewDetailModal, setShowReviewDetailModal] = useState({ show: false, reviewId: "" });
    const [showReplyModal, setShowReplyModal] = useState({ show: false, reviewId: "" });

    // Fetch reviews data
    const fetchReviews = async (params = {}) => {
        try {
            setLoading(true);
            const pageNumber = (params.page || 1) - 1; // API uses 0-based pagination
            const pageSize = 5;

            let response;
            if (params.productId) {
                response = await getParentReviewsByProductId(params.productId, pageNumber, pageSize);
            } else {
                response = await getAllParentReviews(pageNumber, pageSize);
            }

            setReviewsData(response);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const allParams = {};

        setSearchTerm(queryParams.get("search") || "");
        setSelectedRating(queryParams.get("rating") || "");
        setSelectedProduct(queryParams.get("productId") || "");

        if (queryParams.get("page")) {
            allParams.page = parseInt(queryParams.get("page"), 10);
            if (isNaN(allParams.page)) {
                allParams.page = 1;
            }
            setPage(allParams.page);
        } else {
            allParams.page = 1;
        }

        if (queryParams.get("productId")) {
            allParams.productId = queryParams.get("productId");
        }

        if (queryParams.get("rating")) {
            allParams.rating = queryParams.get("rating");
        }

        if (queryParams.get("search")) {
            allParams.search = queryParams.get("search");
        }

        fetchReviews(allParams);
    }, [location.search]);

    const handleFilterClick = () => {
        setLoading(true);

        try {
            const queryParams = new URLSearchParams(location.search);

            queryParams.set("page", 1);

            if (searchTerm !== "") {
                queryParams.set("search", searchTerm);
            } else {
                queryParams.delete("search");
            }

            if (selectedRating !== "") {
                queryParams.set("rating", selectedRating);
            } else {
                queryParams.delete("rating");
            }

            if (selectedProduct !== "") {
                queryParams.set("productId", selectedProduct);
            } else {
                queryParams.delete("productId");
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

    const handleChangeResultPagination = (value) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('page', value.toString());
        navigate(`?${queryParams.toString()}`);
    };

    const handleViewReviewDetails = (reviewId) => {
        setShowReviewDetailModal({ show: true, reviewId });
    };

    const handleReplyReview = (reviewId) => {
        setShowReplyModal({ show: true, reviewId });
    };
    const statusColor = (status) => {
        const normalized = status?.toLowerCase();
        if (normalized?.includes("hài lòng")) return "green";
        if (normalized?.includes("không hài lòng")) return "red";
        if (normalized?.includes("trung lập")) return "gray";
        if (normalized?.includes("vừa khen vừa chê")) return "orange";
        if (normalized?.includes("góp ý")) return "blue";
        return "black"; // mặc định nếu không khớp
      };
    const columns = useMemo(
        () => [
            {
                header: "STT",
                enableColumnResizing: false,
                size: 10,
                Cell: ({ row }) => row.index + 1 + (page - 1) * reviewsData.size,
                grow: false,
                justifyContent: "center",
            },
            {
                accessorKey: "name",
                header: "Người đánh giá",
                Cell: ({ row }) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Avatar
                            src={row.original.avatarUrl || "https://via.placeholder.com/40"}
                            alt={row.original.name}
                        />
                        <span>{row.original.name}</span>
                    </Box>
                ),
                grow: 1,
                size: 200
            },
            {
                accessorKey: "productName",
                header: "Sản phẩm",
                Cell: ({ cell }) => (
                    <Tooltip title={cell.getValue() || "Không có thông tin"} arrow>
                        <Box sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                            wordBreak: "break-word"
                        }}>
                            {cell.getValue() || "Không có thông tin"}
                        </Box>
                    </Tooltip>
                ),
                grow: 2,
                size: 250
            },
            {
                accessorKey: "review",
                header: "Nội dung",
                Cell: ({ cell }) => (
                    <Tooltip title={cell.getValue()} arrow>
                        <Box sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            maxWidth: "300px"
                        }}>
                            {cell.getValue()}
                        </Box>
                    </Tooltip>
                ),
                grow: 3,
                size: 300
            },
            {
                accessorKey: "rating",
                header: "Đánh giá",
                Cell: ({ cell }) => (
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <Rating
                            name="read-only"
                            value={cell.getValue() || 0}
                            readOnly
                            precision={0.5}
                        />
                    </Box>
                ),
                grow: 1,
                size: 150
            },
            {
                accessorKey: "createdDate",
                header: "Ngày đánh giá",
                Cell: ({ cell }) => {
                    const date = new Date(cell.getValue());
                    return isNaN(date.getTime()) ? "N/A" : format(date, "dd/MM/yyyy HH:mm");
                },
                grow: 1,
                size: 150
            },
            {
                accessorKey: "trangThai",
                header: "Trạng thái",
                Cell: ({ row }) => {
                    const [status, setStatus] = useState("Đang xử lý...");
                    const content = row.original.review;
                    console.log("Nội dung đánh giá:", content); 
                    useEffect(() => {
                        const fetchStatus = async () => {
                            try {
                                const res = await classifyReview( content );
                                console.log("Kết quả phân loại:", res);
                                setStatus(res.data.result);
                            } catch (error) {
                                console.error("Lỗi phân loại:", error);
                                setStatus("Lỗi phân loại");
                            }
                        };

                        fetchStatus();
                    }, [content]);

                    return (
                        <Box sx={{ fontWeight: "bold", color: statusColor(status) }}>
                            {status}
                        </Box>
                    );
                },
                grow: 1,
                size: 150
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
                            startIcon={<FiMessageCircle />}
                            onClick={() => handleReplyReview(row.original.id)}
                        >
                            Phản hồi
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<FiEye />}
                            onClick={() => handleViewReviewDetails(row.original.id)}
                        >
                            Chi tiết
                        </Button>
                    </div>
                ),
                size: 50,
                grow: false,
                flexGrow: 1
            }
        ],
        [page, reviewsData.size]
    );

    // Calculate ratings statistics
    const ratingsStats = useMemo(() => {
        const reviews = reviewsData.content || [];
        return {
            fiveStar: reviews.filter(r => r.rating === 5).length,
            threeToFourStar: reviews.filter(r => r.rating >= 3 && r.rating < 5).length,
            oneToTwoStar: reviews.filter(r => r.rating >= 1 && r.rating < 3).length
        };
    }, [reviewsData.content]);

    return (
        <div className="flex-1 p-8">
            {loading ? <Loading /> : <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Phân tích đánh giá</h2>
                    <div className="flex space-x-4">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Xuất báo cáo
                        </button>
                    </div>
                </div>

                {/* Bảng tóm tắt */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h4 className="text-gray-500">Tổng đánh giá</h4>
                        <p className="text-2xl font-bold">{reviewsData.totalElements || 0}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                        <h4 className="text-gray-500">Đánh giá 5 sao</h4>
                        <p className="text-2xl font-bold">{ratingsStats.fiveStar}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
                        <h4 className="text-gray-500">Đánh giá 3-4 sao</h4>
                        <p className="text-2xl font-bold">{ratingsStats.threeToFourStar}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
                        <h4 className="text-gray-500">Đánh giá 1-2 sao</h4>
                        <p className="text-2xl font-bold">{ratingsStats.oneToTwoStar}</p>
                    </div>
                </div>

                {/* Bộ lọc */}
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Bộ lọc đánh giá</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Tìm kiếm */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm theo nội dung..."
                                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Lọc theo sản phẩm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Tất cả sản phẩm</option>
                                {productList.map(product => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Lọc theo số sao */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số sao</label>
                            <select
                                value={selectedRating}
                                onChange={(e) => setSelectedRating(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Tất cả</option>
                                <option value="5">5 sao</option>
                                <option value="4">4 sao</option>
                                <option value="3">3 sao</option>
                                <option value="2">2 sao</option>
                                <option value="1">1 sao</option>
                            </select>
                        </div>

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

                {/* Bảng đánh giá */}
                <Box sx={{ overflowX: "auto", position: "relative" }}>
                    {loading && (
                        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-10">
                            <div className="p-4 rounded-md">
                                <Loading />
                            </div>
                        </div>
                    )}
                    <MaterialReactTable
                        columns={columns}
                        data={reviewsData.content || []}
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
                            sx: {
                                fontWeight: "bold",
                                backgroundColor: "#f1f5f9",
                                textAlign: "center"
                            }
                        }}
                        muiTableBodyCellProps={{
                            sx: {
                                textAlign: "center"
                            }
                        }}
                        renderEmptyRowsFallback={() => (
                            <tr>
                                <td colSpan={7} style={{ padding: "20px", textAlign: "center" }}>
                                    Không tìm thấy đánh giá nào
                                </td>
                            </tr>
                        )}
                    />
                </Box>

                {/* Phân trang */}
                <div className="flex justify-center mt-4">
                    <CustomPagination
                        count={reviewsData.totalPages || 0}
                        page={page}
                        onChange={(_, page) => handleChangeResultPagination(page)}
                        boundaryCount={1}
                        siblingCount={1}
                    />
                </div>
            </div>}
        </div>
    );
}