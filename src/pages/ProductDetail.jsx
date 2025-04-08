/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar, FaStarHalfAlt } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { BiSolidStar, BiStar } from "react-icons/bi";
import { DateConverter } from './../utils/DateConverter';
import { BiSolidCommentEdit } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { findProductById, findSpecificationsByProductId, getQuantityInStock, getStockInByProductId, getStockOutByProductId, createCartItem, updateQuantityCartItem, getRatingById, postReview, getSimilarProducts } from "../routers/ApiRoutes";
import { setCartItemsRedux, increaseQuantityItem, setSelectedItemsRedux } from "../redux/cartSlice";
import { FaDongSign, FaCashRegister } from "react-icons/fa6";
import Loading from "../utils/Loading";
import { FiShoppingCart } from "react-icons/fi";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import CryptoJS from 'crypto-js';
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import lgThumbnail from "lightgallery/plugins/thumbnail"
import lgZoom from "lightgallery/plugins/zoom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import translationMap from "../assets/Menu/translate.json";
import { toast } from "react-toastify";
import { useModal } from "../context/ModalProvider";
import { getFromLocalStorage } from "../utils/functions";
import { FaReplyAll } from "react-icons/fa";

export default function ProductDetail() {

    const [isReply, setIsReply] = useState(null);
    const [comment, setComment] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [review, setReview] = useState([]);
    const { id } = useParams();
    const [product, setProduct] = useState({})
    const [quantityInStock, setQuantityInStock] = useState(0)
    const [totalRating, setTotalRating] = useState(0);
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();
    const cart = useSelector(state => state.shoppingCart.cart);
    const cartItems = useSelector(state => state.shoppingCart.items);
    const selectedItems = useSelector(state => state.shoppingCart.selectItems);
    const stockIns = useSelector(state => state.inventory.stockIns)
    const stockOuts = useSelector(state => state.inventory.stockOuts)
    const user = useSelector(state => state.auth.user)
    const { openModal } = useModal();
    const [user_role, setUserRole] = useState("")
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [specs, setspecs] = useState([])

    const scrollToReviews = () => {
        if (review.current) {
            review.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const translate = (key) => translationMap[key] || key;

    const setRatingStar = (star) => {
        console.log(star)
        setRating(star);
    };

    const fetchRating = async () => {
        try {
            const ratingRes = await getRatingById(id)
            console.log("rating: " + ratingRes)
            if (ratingRes?.data) {
                const data = ratingRes?.data

                setReview(data); // Lưu vào state
                const total = data.reduce((sum, r) => r.replyId == null ? sum + (r.rating ?? 0) : sum, 0);
                console.log(total)
                const average = total / data.filter(r => r.replyId == null).length;
                setTotalRating(parseFloat(average.toFixed(1)));
                console.log("Fetched data:", data);
            }
        } catch (err) {
            console.log("Lỗi lấy rating")
        }
    }


    const fetchData = async () => {
        try {
            setLoading(true)
            console.log(user)
            const [productRes, specRes] = await Promise.all([
                findProductById(id),
                findSpecificationsByProductId(id),
            ]);
            await fetchRating()
            if (productRes?.data) {
                setProduct(productRes.data);
                console.log("image: " + productRes.data.image.split(','))
                setImages(productRes.data.image.split(','))
                setspecs(specRes.data)
            }
            const stockIn = stockIns
                .filter(item => item.product_id === id)
                .reduce((acc, item) => acc + item.quantity, 0);

            const stockOut = stockOuts
                .filter(item => item.product_id === id)
                .reduce((acc, item) => acc + item.quantity, 0);
            setQuantityInStock(stockIn - stockOut);
            const authen = getFromLocalStorage('persist:auth');
            const user1 = authen?.user ? JSON.parse(authen.user) : null;
            const userRoleEncrypted = user1?.key;
            let userRole;
            if (userRoleEncrypted) {
                try {
                    const decrypted = CryptoJS.AES.decrypt(
                        userRoleEncrypted,
                        process.env.REACT_APP_CRYPTO
                    );
                    userRole = decrypted.toString(CryptoJS.enc.Utf8);
                    setUserRole(userRole)
                } catch (error) {
                    console.error('Decryption error:', error);
                }
            }
            setLoading(false)
        } catch (error) {
            console.error("Error fetching product data:", error);
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        if (id) {
            fetchData()
            console.log("Fetching")
        }
    }, [id]); // Gọi lại khi id thay đổi
    useEffect(() => {
        console.log("Updated rating:", rating);
    }, [rating]);



    // Added similar products data
    const [similarProducts, setSimilarProducts] = useState([]);
    const filterProductsInStock = similarProducts.filter((product) => {
        const stockIn = stockIns
            .filter(item => item.product_id === product.id)
            .reduce((acc, item) => acc + item.quantity, 0);

        const stockOut = stockOuts
            .filter(item => item.product_id === product.id)
            .reduce((acc, item) => acc + item.quantity, 0);

        return stockIn - stockOut > 0;  // Nếu còn hàng
    });
    useEffect(() => {
        const fetchDataSimilarProducts = async () => {
            try {
                const response = await getSimilarProducts(id);
                console.log("Similar products response:", response);
                if (response.data) {
                    setSimilarProducts(response.data);
                }
            } catch (error) {
                console.error("Error fetching similar products:", error);
            }
        };
        fetchDataSimilarProducts();
    }, [id]);
    const handleSubmit = async (reply, type) => {
        try {
            const newReview = {
                productId: id,
                userId: user?.id,
                rating: rating,
                review: comment,
                name: user?.firstName + " " + user?.lastName,
                replyId: reply || null,
                createDate: new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })).toISOString(), // Định dạng chuẩn
            };
            // Gửi đánh giá lên server
            await postReview(newReview);
            setReview(prevReviews => [...prevReviews, newReview]);
            const updatedReviews = [...review, newReview];
            const total = updatedReviews.reduce((sum, r) => r.replyId === null ? sum + (r.rating ?? 0) : sum, 0);

            const average = total / updatedReviews.filter(r => r.replyId == null).length;
            setTotalRating(parseFloat(average.toFixed(1)));
            // Hiển thị thông báo
            if (type == 'reply') {
                openModal(`Bạn đã phản hồi thành công`);
            }
            if (type == 'rating') {
                openModal(`Bạn đã đánh giá ${rating} sao thành công`);
            }
            // ✅ Reset lại comment và rating
            setComment("");
            setRating(0);
            setIsReply(null);

        } catch (error) {
            alert("Lỗi khi gửi đánh giá: " + error.message);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                // Full star
                stars.push(
                    <FaStar
                        key={i}
                        className="inline-block text-sm text-yellow-400"
                    />
                );
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                // Half star
                stars.push(
                    <FaStarHalfAlt
                        key={i}
                        className="inline-block text-sm text-yellow-400"
                    />
                );
            } else {
                // Empty star
                stars.push(
                    <FaStar
                        key={i}
                        className="inline-block text-sm text-gray-300"
                    />
                );
            }
        }
        return stars;
    };

    const calculateStarDistribution = (ratings) => {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach(({ rating }) => {
            distribution[Math.round(rating)] += 1;
        });
        return distribution;
    };

    const handlerAddToCart = async ({ product }) => {
        const item = cartItems.find(item => item.productId === product.id);
        if (item) {
            const updatedItems = selectedItems.map(i =>
                i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
            );
            if (!selectedItems.some(i => i.itemId === item.itemId)) {
                updatedItems.push({ ...item, quantity: 1 });
            }
            // dispatch(setSelectedItemsRedux({ selectItems: updatedItems }));
            try {
                const updateItemResponse = await updateQuantityCartItem(item.itemId, item.quantity + 1);
                if (updateItemResponse.data) {
                    dispatch(increaseQuantityItem({ itemId: item.itemId }));
                    openModal("Sản phẩm đã được thêm vào Giỏ hàng!");
                } else {
                    toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
                }
            } catch (error) {
                toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
            }
            return;
        }
        try {
            const newCartItem = {
                productId: product.id,
                quantity: 1,
                cart: cart
            };
            const createItemResponse = await createCartItem(newCartItem);
            if (createItemResponse.status === 201 && createItemResponse.data) {
                const newItem = {
                    itemId: createItemResponse.data.id,
                    productId: createItemResponse.data.productId,
                    name: product.name,
                    price: product.price,
                    quantity: createItemResponse.data.quantity,
                    image: product.image
                };
                const updatedCartItems = cartItems ? [...cartItems, newItem] : [newItem];
                dispatch(setCartItemsRedux({ items: updatedCartItems }));
                openModal("Sản phẩm đã được thêm vào Giỏ hàng!");
            } else {
                toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
            }
        } catch (error) {
            console.error("Lỗi trong quá trình thêm sản phẩm:", error);
            toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
        }
    };


    return (

        <div className="min-h-screen bg-gray-50 -mt-20">
            {loading ? <Loading /> : <main className="container mx-auto px-4 pt-24 pb-12 w-10/12">
                {/* Product Information */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* <ImageGallery items={images} /> */}
                    <div className="w-full max-w-3xl mx-auto">
                        {/* Hình ảnh lớn */}
                        <div className="relative w-full h-[50vh] flex items-center justify-center rounded-xl overflow-hidden shadow-xl mb-6 bg-gray-100">
                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:scale-110 transition-all duration-200 z-10"
                            >
                                <FaArrowLeft className="text-gray-600 text-xl" />
                            </button>

                            <LightGallery plugins={[lgThumbnail, lgZoom]}>
                                {images.map((src, index) => (
                                    <a key={index} href={src} className={index === currentImageIndex ? "block" : "hidden"}>
                                        <img
                                            src={src}
                                            alt={`Ảnh ${index + 1}`}
                                            className="w-full h-[50vh] object-contain rounded-xl transition-all duration-300 flex items-center justify-center"
                                        />
                                    </a>
                                ))}
                            </LightGallery>

                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:scale-110 transition-all duration-200 z-10"
                            >
                                <FaArrowRight className="text-gray-600 text-xl" />
                            </button>
                        </div>

                        {/* Slider Thumbnail */}
                        <Swiper
                            spaceBetween={10} // Giữ khoảng cách hợp lý
                            slidesPerView={4}
                            navigation
                            modules={[Navigation]}
                            className="mt-3 px-4"
                        >
                            {images.map((src, index) => (
                                <SwiperSlide key={index} className="flex items-center justify-center">
                                    <div className="flex items-center justify-center w-full h-24">
                                        <img
                                            src={src}
                                            className={`max-w-24 max-h-24 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 ${index === currentImageIndex
                                                ? "border-blue-500"
                                                : "border-gray-300 hover:border-gray-400"
                                                }`}
                                            onClick={() => setCurrentImageIndex(index)}
                                            alt={`Thumbnail ${index + 1}`}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>


                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                        <div className="flex items-center mb-4 text-lg text-orange-400">
                            <p className="font-bold mr-1 ">{totalRating || 0}</p>
                            <FaStar className="mr-10 " />
                            <p
                                className="font-bold text-blue-500 cursor-pointer "
                                onClick={() => scrollToReviews()}
                            >
                                Xem đánh giá
                            </p>
                        </div>
                        <div className="text-3xl font-bold text-blue-600 mb-4 flex justify-start">
                            {/* <p className="">{product.price.toLocaleString('en-US')}</p> */}
                            <p className="">  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                        </div>

                        <p className="text-gray-600 mb-6 ">{product.description}</p>
                        <p className={`text-gray-600 mb-6 text-lg`}>Tình trạng: <span className={`font-semibold text-base ${quantityInStock > 0 ? "text-green-500" : "text-red-500"}`}>{quantityInStock > 0 ? "Còn hàng" : "Hết hàng"}</span></p>

                        {/* Thêm vào giỏ hàng Section */}
                        <div className="flex items-center space-x-4 mb-6">

                            <button className={`gap-2 flex items-center justify-center ${quantityInStock == 0 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white px-6 py-2 rounded-md  transition-colors`} disabled={quantityInStock == 0}
                                onClick={() => handlerAddToCart({ product })}
                            >
                                <FiShoppingCart />
                                Thêm vào giỏ hàng
                            </button>
                            <button className={`gap-2 flex items-center justify-center ${quantityInStock == 0 ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"} text-white px-6 py-2 rounded-md  transition-colors`} disabled={quantityInStock == 0}>
                                <FaCashRegister />
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Thông số kỹ thuật</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <tbody>
                                {specs.map((spec, index) => (
                                    <tr key={index} className="even:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2 font-semibold">{spec.name_vi}</td>
                                        <td className="border border-gray-300 px-4 py-2">{translate(spec.value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Similar Products Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Sản phẩm tương tự</h2>
                    <div className="grid md:grid-cols-5 gap-6">
                        {filterProductsInStock.map((similarProduct) => (
                            <ProductCard key={similarProduct.id} product={similarProduct} />
                        ))}
                    </div>
                </div>

                {/* overall review */}
                <div className="w-full  shadow-lg bg-gray-50 rounded-sm py-10 px-7 " >
                    <h2 className="text-2xl font-bold mb-6 ">Đánh giá & Nhận xét {product.name}</h2>
                    <div className="w-full flex flex-col  items-center border-b border-gray-200 ">
                        <div className="w-full  p-6 shadow-sm text-center ">
                            <h2 className="text-2xl font-bold mb-6">Đánh giá & Nhận xét</h2>
                            <div className="flex flex-col items-center">
                                <h2 className="text-4xl font-bold text-red-500">{totalRating || 0}/5</h2>
                                <div className="flex justify-center my-2">{renderStars(totalRating)}</div>
                                <h2 className="text-sm font-bold">
                                    ({review.filter(rating => rating.parentId === null || rating.parentId === 0).length}) đánh giá & nhận xét
                                </h2>
                            </div>
                            <div className="w-full mt-6 ">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className="flex items-center mb-2 justify-center">
                                        <span className="w-10 text-right mr-2">{star} ⭐</span>
                                        <div className="w-3/4 h-4 bg-gray-200 rounded overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400"
                                                style={{
                                                    width: `${(calculateStarDistribution(review)[star] / review.filter(rating => rating.parentId === null || rating.parentId === 0).length) * 100 || 0}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="ml-4">{calculateStarDistribution(review)[star]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="py-10 " ref={review}>
                        {review.filter(rating => rating.replyId === null || rating.replyId === 0) //Đánh giá & nhận xét
                            .map((rating, index) => (
                                <div key={index} className="w-8/12 border-b border-gray-200">
                                    <div className="w-full flex justify-start items-center">
                                        <p className="mr-3 font-semibold">{rating.name}</p>
                                        <p className="text-gray-400">{DateConverter(rating.createDate)}</p>
                                    </div>
                                    <div className="w-full flex justify-start my-3">
                                        <div className="w-1/6">
                                            {renderStars(rating.rating)}
                                        </div>
                                        <div className="w-10/12">
                                            <div className="flex">
                                                <p className="text-sm mr-6">{rating.review}</p>
                                                {!review.some(reply => reply.replyId === rating.id) && isReply !== rating.id && ( //Hiện nếu chưa có Reply
                                                    <button
                                                        className="  text-base font-semibold rounded-md flex justify-center items-center px-2 py-1 text-gray-500"
                                                        onClick={() => { setIsReply(rating.id) }} //Mở ô Reply
                                                    >
                                                        <FaReplyAll />

                                                    </button>
                                                )}
                                            </div>


                                            {user_role == 'R1' && ( //Chỉ Admin được phản hồi
                                                <div>
                                                    {isReply === rating.id && ( //Reply
                                                        <div className="mt-2">
                                                            <textarea
                                                                className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Nhập đánh giá của bạn..."
                                                                rows="4"
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                            ></textarea>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    className="bg-red-500 text-white text-sm font-semibold rounded-md flex justify-center items-center px-2 py-1"
                                                                    onClick={() => { setIsReply(null) }}
                                                                >
                                                                    <div className="text-l mr-1" />Hủy
                                                                </button>
                                                                <button
                                                                    className="bg-blue-500 text-white text-sm font-semibold rounded-md flex justify-center items-center px-2 py-1"
                                                                    onClick={() => { handleSubmit(rating.id, 'reply') }}
                                                                >
                                                                    <div className="text-l mr-1" />Phản hồi
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* <p className="text-sm leading-6 mt-3">{"Dạ RAM mới lúc lắp máy mình cho lắp luôn ạ, hoặc nếu Anh Minh Tiến có nhu cầu nâng cấp mình có thể nâng cấp ngay lúc lắp máy, về việc gắn thêm ổ cứng GEARVN sẽ hộ trợ mình gắn luôn, cài win cũng vậy ạ. Anh Tiến để lại thông tin (SĐT ...) để GEARVN gọi lại tư vấn cho mình rõ hơn ạ."}</p> */}

                                                    {review.some(reply => reply.replyId === rating.id) && ( //Hiện Reply
                                                        <div className=" mt-4">
                                                            {review
                                                                .filter(reply => reply.replyId === rating.id) // Lọc các phản hồi của đánh giá này
                                                                .map((reply, replyIndex) => (
                                                                    <div key={replyIndex} className="mt-3 rounded-md bg-gray-200 w-full p-3">
                                                                        <div className="w-full flex justify-start items-center">
                                                                            <p className="mr-3 font-semibold text-red-500">{"Admin"}</p>
                                                                            <p className="text-gray-400">{DateConverter(reply.createDate)}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm leading-6 mt-3">{reply.review}</p>
                                                                        </div>
                                                                    </div>

                                                                ))}
                                                        </div>
                                                    )}

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="w-full">
                        {/* <button className="bg-blue-500 text-white text-sm font-semibold rounded-md flex justify-center items-center px-4 py-2 w-4/12">
                            <BiSolidCommentEdit className="text-2xl mr-2" />Gửi đánh giá của bạn
                        </button> */}
                        <div className="w-full mx-auto p-4 border rounded-lg shadow-md bg-white">
                            <h2 className="text-lg font-semibold mb-2">Gửi đánh giá của bạn</h2>
                            <div className="flex mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRatingStar(star)}
                                        className="text-2xl text-yellow-400 mx-1"
                                    >
                                        {star <= (rating) ? <BiSolidStar /> : <BiStar />}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập đánh giá của bạn..."
                                rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                            <button
                                className="bg-blue-500 text-white text-sm font-semibold rounded-md flex justify-center items-center px-3 py-1"
                                onClick={() => { handleSubmit(null, 'rating') }}
                            >
                                <BiSolidCommentEdit className="text-xl mr-2" />Gửi đánh giá của bạn.
                            </button>
                        </div>
                    </div>
                </div>
            </main>}
        </div>
    );
};
