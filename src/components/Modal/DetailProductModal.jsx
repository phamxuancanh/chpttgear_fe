import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { findProductById } from "../../routers/ApiRoutes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";


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

export default function AddProductModal({ setShowProductModal, product_id }) {
    const [product, setProduct] = useState(null);
    const stockIns = useSelector(state => state.inventory.stockIns)
    const stockOuts = useSelector(state => state.inventory.stockOuts)

    useEffect(() => {
        if (product_id) {
            const fetchProduct = async () => {
                try {

                    const response = await findProductById(product_id);
                    if (response.data) {
                        setProduct(response.data);
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchProduct();
        }
    }, [product_id]);

    if (!product) return null;

    const images = product.image ? product.image.split(",") : [];
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const colorName = colors.find(c => c.key === product.color)?.value || product.color;

    const getProductStock = (productId) => {
        // Nhóm số lượng nhập kho theo inventory_id
        const stockInMap = stockIns
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => {
                acc[item.inventory_id] = acc[item.inventory_id] || { stock: 0, name: item?.inventory?.name };
                acc[item.inventory_id].stock += item.quantity;
                return acc;
            }, {});

        // Nhóm số lượng xuất kho theo inventory_id
        const stockOutMap = stockOuts
            .filter(item => item.product_id === productId)
            .reduce((acc, item) => {
                acc[item?.inventory_id] = acc[item?.inventory_id] || { stock: 0, name: item?.inventory?.name };
                acc[item?.inventory_id].stock += item?.quantity;
                return acc;
            }, {});

        // Lấy danh sách tất cả inventory_id liên quan đến productId
        const allInventoryIds = new Set([
            ...Object.keys(stockInMap),
            ...Object.keys(stockOutMap)
        ]);



        return Array.from(allInventoryIds).map(inventory_id => ({
            name: stockInMap[inventory_id]?.name || stockOutMap[inventory_id]?.name, // Lấy name từ bất kỳ object nào có inventory_id
            stock: (stockInMap[inventory_id]?.stock || 0) - (stockOutMap[inventory_id]?.stock || 0)
        }))
    };

    const stockList = getProductStock(product.id);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative">
                {/* Close Button */}
                <button
                    onClick={() => setShowProductModal({ show: false, productId: "" })}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
                >
                    <FaTimes size={24} />
                </button>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div>
                        <Slider {...sliderSettings} className="rounded-xl overflow-hidden">
                            {images.map((img, index) => (
                                <div key={index} className="flex justify-center">
                                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-full  rounded-lg" />
                                </div>
                            ))}
                        </Slider>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">{product.name}</h2>
                            <p className="text-gray-600 mt-2">Thương hiệu: <strong>{product.brand.toUpperCase()}</strong></p>
                            <p className="text-gray-600">Màu sắc: <strong>{colorName}</strong></p>
                            <p className="text-gray-600">Bảo hành: <strong>{product.guaranteePeriod} tháng</strong></p>
                            <p className="text-gray-600">Danh mục: <strong>{product.category?.name_Vi || product.category?.name}</strong></p>
                            <p className="text-gray-600">Kích thước: <strong>{product.size}</strong></p>
                            <p className="text-gray-600">Trọng lượng: <strong>{product.weight} </strong></p>
                            <p className="text-gray-600">Tồn kho: </p>
                            <ul className="mt-1 ml-12 text-gray-600 leading-relaxed">
                                {Array.isArray(stockList) && stockList.length > 0 ? (
                                    stockList.map((item, index) => (
                                        <li key={index}>
                                            {item.name}: <strong>{item.stock} sản phẩm</strong>

                                        </li>
                                    ))
                                ) : (
                                    <li>Không có dữ liệu tồn kho</li>
                                )}
                            </ul>
                            <p className="text-gray-600 leading-relaxed mt-1">{product.description || "Không có mô tả chi tiết."}</p>

                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-2xl font-bold text-red-500">{product.price.toLocaleString()} VND</span>
                            <button
                                onClick={() => setShowProductModal({ show: false, productId: "" })}
                                className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
