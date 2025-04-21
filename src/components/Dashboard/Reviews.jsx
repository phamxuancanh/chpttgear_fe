import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEdit, FiEye, FiMessageCircle, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import { styled } from '@mui/system';
import { Pagination, Rating } from '@mui/material';
import { classifyReview, countReviewRatingGroups, findProductById, getAllParentReviews, getParentReviewsByProductId } from "../../routers/ApiRoutes";
import Loading from "../../utils/Loading";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Avatar } from "@mui/material";
import { Tooltip } from "@mui/material";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
        // Kiểm tra nếu status null hoặc undefined
        if (!status) return "black";

        const normalized = status.toLowerCase().trim();

        // Kiểm tra theo thứ tự từ phức tạp đến đơn giản
        if (normalized.includes("vừa khen vừa chê")) return "orange";
        if (normalized.includes("không hài lòng")) return "red";
        if (normalized.includes("hài lòng")) return "green";
        if (normalized.includes("trung lập")) return "gray";
        if (normalized.includes("góp ý")) return "blue";
        if (normalized.includes("không xác định")) return "black";

        return "black"; // Mặc định nếu không khớp
    };
    const columns = useMemo(
        () => [
            {
                header: 'STT',
                accessorKey: 'stt',
                enableSorting: false,
                size: 10,
                Cell: ({ row }) => row.index + 1 + (page - 1) * reviewsData.size,
                grow: false,
                justifyContent: 'center',
            },
            {
                accessorKey: 'name',
                header: 'Người đánh giá',
                enableSorting: false,
                Cell: ({ row }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* <Avatar
                            src={row.original.avatarUrl || 'https://via.placeholder.com/40'}
                            alt={row.original.name}
                        /> */}
                        <span>{row.original.name}</span>
                    </Box>
                ),
                grow: 1,
                size: 200,
            },
            {
                accessorKey: 'productId',
                header: 'Sản phẩm',
                enableSorting: false,
                Cell: ({ cell }) => {
                    const productId = cell.getValue();
                    const [productName, setProductName] = useState("Đang tải...");

                    useEffect(() => {
                        // Nếu không có productId, không cần gọi API
                        if (!productId) {
                            setProductName("Không có thông tin");
                            return;
                        }

                        // Hàm gọi API
                        const fetchProductName = async () => {
                            try {
                                const product = await findProductById(productId);
                                setProductName(product.data.name || `Sản phẩm #${productId}`);
                            } catch (error) {
                                console.error(`Error fetching product ${productId}:`, error);
                                setProductName(`Sản phẩm #${productId}`);
                            }
                        };

                        fetchProductName();
                    }, [productId]);

                    return (
                        <Tooltip title={productName} arrow>
                            <Box
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {productName}
                            </Box>
                        </Tooltip>
                    );
                },
                grow: 2,
                size: 250,
            },
            {
                accessorKey: 'review',
                header: 'Nội dung',
                enableSorting: false,
                Cell: ({ cell }) => (
                    <Tooltip title={cell.getValue()} arrow>
                        <Box
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                maxWidth: '300px',
                            }}
                        >
                            {cell.getValue()}
                        </Box>
                    </Tooltip>
                ),
                grow: 3,
                size: 300,
            },
            {
                accessorKey: 'rating',
                header: 'Đánh giá',
                enableSorting: false,
                Cell: ({ cell }) => (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Rating
                            name="read-only"
                            value={cell.getValue() || 0}
                            readOnly
                            precision={0.5}
                        />
                    </Box>
                ),
                grow: 1,
                size: 150,
            },
            {
                accessorKey: 'createDate',
                header: 'Ngày đánh giá',
                enableSorting: false,
                Cell: ({ cell }) => {
                    const date = new Date(cell.getValue());
                    return isNaN(date.getTime()) ? 'N/A' : format(date, 'dd/MM/yyyy HH:mm');
                },
                grow: 1,
                size: 150,
            },
            {
                accessorKey: 'trangThai',
                header: 'Trạng thái',
                enableSorting: false,
                Cell: ({ row }) => {
                    const [status, setStatus] = useState('Đang xử lý...');
                    const content = row.original.review;

                    useEffect(() => {
                        const fetchStatus = async () => {
                            try {
                                const res = await classifyReview(content);
                                setStatus(res.data.result);
                            } catch (error) {
                                console.error('Lỗi phân loại:', error);
                                setStatus('Lỗi phân loại');
                            }
                        };

                        fetchStatus();
                    }, [content]);

                    return (
                        <Box sx={{ fontWeight: 'bold', color: statusColor(status) }}>
                            {status}
                        </Box>
                    );
                },
                grow: 1,
                size: 150,
            },
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
    // Thêm state để quản lý dropdown menu

    // Hàm xuất báo cáo dưới dạng Excel
    const prepareExportData = async () => {
        setLoading(true);
        try {
            // Tạo bản sao của dữ liệu để không ảnh hưởng đến state gốc
            const reviewsToExport = [...reviewsData.content];

            // Lấy tên sản phẩm và trạng thái cho mỗi đánh giá
            const enrichedReviews = await Promise.all(
                reviewsToExport.map(async (review) => {
                    // Lấy tên sản phẩm
                    let productName = `Sản phẩm #${review.productId}`;
                    try {
                        if (review.productId) {
                            const product = await findProductById(review.productId);
                            if (product && product.data) {
                                productName = product.data.name || productName;
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching product ${review.productId}:`, error);
                    }

                    // Lấy trạng thái phân loại
                    let sentiment = 'Chưa phân loại';
                    try {
                        if (review.review) {
                            const res = await classifyReview(review.review);
                            if (res && res.data) {
                                sentiment = res.data.result || sentiment;
                            }
                        }
                    } catch (error) {
                        console.error(`Error classifying review:`, error);
                    }

                    // Trả về đánh giá đã được bổ sung thông tin
                    return {
                        ...review,
                        productName,
                        sentiment
                    };
                })
            );

            return enrichedReviews;
        } catch (error) {
            console.error("Error preparing export data:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật hàm xuất Excel
    const exportToExcel = async () => {
        // Hiển thị loading state
        setTableLoading(true);

        try {
            // Lấy dữ liệu đã được bổ sung thông tin
            const enrichedReviews = await prepareExportData();

            // Tạo dữ liệu cho báo cáo
            const reviewsForExport = enrichedReviews.map((review, index) => {
                return {
                    'STT': index + 1 + (page - 1) * reviewsData.size,
                    'Người đánh giá': review.name,
                    'Sản phẩm': review.productName,
                    'Nội dung': review.review,
                    'Đánh giá': `${review.rating}/5`,
                    'Ngày đánh giá': format(new Date(review.createDate), 'dd/MM/yyyy HH:mm'),
                    'Trạng thái': review.sentiment
                };
            });

            // Tạo workbook và worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(reviewsForExport);

            // Thêm worksheet vào workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Đánh giá');

            // Tạo tên file với timestamp
            const fileName = `Danh_sach_danh_gia_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;

            // Xuất file Excel
            XLSX.writeFile(wb, fileName);
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            alert("Có lỗi khi xuất Excel. Vui lòng thử lại sau.");
        } finally {
            setTableLoading(false);
        }
    };

    // Thêm hàm tính toán tỉ lệ trạng thái đánh giá
    // Thêm state để lưu trữ tỉ lệ trạng thái
    const [statusStats, setStatusStats] = useState([]);
    const [chartLoading, setChartLoading] = useState(true);

    useEffect(() => {
        const reviews = reviewsData.content || [];
        if (reviews.length === 0) {
            setStatusStats([]);
            setChartLoading(false);
            return;
        }

        const calculateStats = async () => {
            // Hiển thị loading trước khi bắt đầu tính toán
            setChartLoading(true);

            try {
                // Khởi tạo đếm số lượng
                const statusCount = {
                    "Hài lòng": 0,
                    "Không hài lòng": 0,
                    "Trung lập": 0,
                    "Vừa khen vừa chê": 0,
                    "Góp ý": 0,
                    "Không xác định": 0
                };

                // Xử lý song song các yêu cầu API thay vì tuần tự
                const reviewPromises = reviews
                    .filter(review => review.review) // Chỉ xử lý các đánh giá có nội dung
                    .map(async (review) => {
                        try {
                            const res = await classifyReview(review.review);
                            return res.data.result;
                        } catch (error) {
                            console.error("Lỗi khi phân loại đánh giá:", error);
                            return "Không xác định";
                        }
                    });

                // Đợi tất cả các yêu cầu hoàn thành
                const results = await Promise.all(reviewPromises);

                // Đếm số lượng mỗi trạng thái
                results.forEach(status => {
                    if (status.includes("hài lòng") && !status.includes("không")) {
                        statusCount["Hài lòng"]++;
                    } else if (status.includes("không hài lòng")) {
                        statusCount["Không hài lòng"]++;
                    } else if (status.includes("trung lập")) {
                        statusCount["Trung lập"]++;
                    } else if (status.includes("vừa khen vừa chê")) {
                        statusCount["Vừa khen vừa chê"]++;
                    } else if (status.includes("góp ý")) {
                        statusCount["Góp ý"]++;
                    } else {
                        statusCount["Không xác định"]++;
                    }
                });

                // Tính phần trăm
                const total = reviews.length;
                const result = Object.entries(statusCount)
                    .map(([label, count]) => ({
                        label,
                        count,
                        percentage: total > 0 ? Math.round((count / total) * 100) : 0
                    }))
                    .filter(item => item.count > 0) // Chỉ hiển thị các trạng thái có đánh giá
                    .sort((a, b) => b.count - a.count); // Sắp xếp theo số lượng giảm dần

                setStatusStats(result);
            } catch (error) {
                console.error("Lỗi khi tính toán thống kê:", error);
                setStatusStats([]);
            } finally {
                // Luôn kết thúc loading, ngay cả khi có lỗi
                setChartLoading(false);
            }
        };

        calculateStats();
    }, [reviewsData.content]);
    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const response = await countReviewRatingGroups(); // Lấy tất cả sản phẩm
    //             console.log("responseeeeeeeeeeeeeeeeeeeeee:", response);
    //         } catch (error) {
    //             console.error("Error fetching products:", error);
    //         }
    //     };

    //     fetchProducts();
    // }
    // , []);
    return (
        <div className="flex-1 p-8">
            {loading ? <Loading /> : <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Phân tích đánh giá</h2>
                    <div className="flex space-x-4 relative">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                            onClick={exportToExcel}
                            disabled={tableLoading}
                        >
                            {tableLoading ? (
                                "Đang xuất..."
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                    </svg>
                                    Xuất báo cáo Excel
                                </>
                            )}
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
                {/* <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Tỉ lệ đánh giá sản phẩm</h3>

                    {chartLoading ? (
                        <div className="py-6 flex justify-center items-center">
                            <div className="space-y-4 w-full">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="animate-pulse">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                                        </div>
                                        <div className="h-5 bg-gray-200 rounded-full w-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : statusStats.length > 0 ? (
                        <div>
                            <div className="flex flex-wrap gap-3 mb-4">
                                {statusStats.map((status) => (
                                    <div key={status.label} className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-1 ${status.label === "Hài lòng" ? "bg-green-500" :
                                                status.label === "Không hài lòng" ? "bg-red-500" :
                                                    status.label === "Trung lập" ? "bg-gray-500" :
                                                        status.label === "Vừa khen vừa chê" ? "bg-orange-500" :
                                                            status.label === "Góp ý" ? "bg-blue-500" :
                                                                "bg-gray-400"
                                            }`}></div>
                                        <span className="text-xs text-gray-600">{status.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                {statusStats.map((status, index) => (
                                    <div key={index}>
                                        <div className="text-sm font-medium mb-1">
                                            {status.label}
                                        </div>

                                        <div className="relative">
                                            <div className="w-full bg-gray-100 rounded-full h-7 flex items-center">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500 flex items-center"
                                                    style={{
                                                        width: `${status.percentage}%`,
                                                        backgroundColor:
                                                            status.label === "Hài lòng" ? "#22c55e" :
                                                                status.label === "Không hài lòng" ? "#ef4444" :
                                                                    status.label === "Trung lập" ? "#94a3b8" :
                                                                        status.label === "Vừa khen vừa chê" ? "#f97316" :
                                                                            status.label === "Góp ý" ? "#3b82f6" :
                                                                                "#9ca3af"
                                                    }}
                                                >
                                                    {status.percentage > 10 && (
                                                        <span className="text-white text-xs font-medium ml-2">
                                                            {status.percentage}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-700">
                                                {status.count}/{reviewsData.totalElements} {status.percentage}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                    Tổng cộng: <span className="font-medium">{reviewsData.totalElements}</span> đánh giá
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>Không có dữ liệu đánh giá nào</p>
                        </div>
                    )}
                </div> */}

                {/* Bộ lọc */}
                {/* <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Bộ lọc đánh giá</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

                        <div className="col-span-1 sm:col-span-2 md:col-span-1 flex items-end">
                            <button
                                onClick={handleFilterClick}
                                className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
                            >
                                Lọc
                            </button>
                        </div>
                    </div>
                </div> */}

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
                        enableColumnActions={false}

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