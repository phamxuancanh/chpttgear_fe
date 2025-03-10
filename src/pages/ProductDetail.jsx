import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar, FaStarHalfAlt } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { BiSolidStar, BiStar } from "react-icons/bi";
import { DateConverter } from './../utils/DateConverter';
import { BiSolidCommentEdit } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { findProductById, getQuantityInStock, getStockInByProductId, getStockOutByProductId } from "../routers/ApiRoutes";


export default function ProductDetail() {
    const [userRating, setUserRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [sortBy, setSortBy] = useState("recent");
    const [review, setReview] = useState([]);
    const { id } = useParams();
    const [product, setProduct] = useState({})
    const [quantityInStock, setQuantityInStock] = useState(0)
    const [stockIns, setStockIns] = useState([]);
    const [stockOuts, setStockOuts] = useState([]);
    const [rating, setRating] = useState(0);
    const reviewsRef = useRef(null);
    const API_URL = process.env.REACT_APP_API_URL;

    const dispatch = useDispatch();
    const user_id = useSelector((state) => {
        console.log("Redux state:", state);
        return state.auth.user.id;
      });

    const scrollToReviews = () => {
        console.log("a")
        if (reviewsRef.current) {
            reviewsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [productRes, stockInRes, stockOutRes] = await Promise.all([
    //                 findProductById(id),
    //                 getStockInByProductId(id),
    //                 getStockOutByProductId(id),
    //             ]);

    //             if (productRes?.data) setProduct(productRes.data);
    //             if (Array.isArray(stockInRes)) setStockIns(stockInRes);
    //             if (Array.isArray(stockOutRes)) setStockOuts(stockOutRes);
    //             setQuantityInStock(getProductStock())
    //             console.log(getProductStock())
    //         } catch (error) {
    //             console.error("Error fetching product data:", error);
    //         }
    //     };

    //     if (id) fetchData();
    // }, [id]); // Gọi lại khi id thay đổi

    const fetchData = async () => {
        try {
            fetch(`${process.env.REACT_APP_REVIEW_BASE_URL}/review/${id}`)
            .then(response => response.json()) // Chuyển đổi JSON
            .then(data => {
                setReview(data); // Lưu vào state
                const total = data.reduce((sum, r) => sum + (r.rating ?? 0), 0);
                const average = total / data.length;
                setRating(Math.round(average)); 
                console.log("Fetched data:", data);
            })
            .catch(error => console.error("Error:", error));

            const [productRes, quantityInStockRes] = await Promise.all([
                findProductById(id),
                getQuantityInStock(id)
            ]);

            if (productRes?.data) setProduct(productRes.data);
            if (quantityInStockRes) setQuantityInStock(quantityInStockRes.quantityInStock);            
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    if (id) fetchData();
    useEffect(() => {
        fetchData() 
    }, [id]); // Gọi lại khi id thay đổi
    useEffect(() => {
        console.log("Updated rating:", rating);
    }, [rating]);

    const getProductStock = () => {
        return (
            stockIns.reduce(
                (acc, item) => (item.product_id === id ? acc + item.quantity : acc),
                0
            ) -
            stockOuts.reduce(
                (acc, item) => (item.product_id === id ? acc + item.quantity : acc),
                0
            )
        );
    };

    // Added similar products data
    const similarProducts = [
        {
            id: 1,
            name: "NVIDIA GeForce RTX 4080",
            price: 1199.99,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1587202372774-3c678030ef4f"
        },
        {
            id: 2,
            name: "NVIDIA GeForce RTX 4070",
            price: 999.99,
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1587202372162-638fa6e4e327"
        },
        {
            id: 3,
            name: "NVIDIA GeForce RTX 3090",
            price: 1299.99,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1587202372599-36e756f1a00e"
        },
        {
            id: 3,
            name: "NVIDIA GeForce RTX 3090",
            price: 1299.99,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1587202372599-36e756f1a00e"
        },
        {
            id: 3,
            name: "NVIDIA GeForce RTX 3090",
            price: 1299.99,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1587202372599-36e756f1a00e"
        }
    ];

    const ratings = [
        { product_id: 4090, user: "John Doe", score: 2, comment: "được tặng 2 thanh ram là có lắp vô máy chưa ad, nếu mua thêm ổ cứng ssd thì có gắn vô dùm không? hay phải tự mình gắn, còn cài win nữa?", date: "2024-01-15" },
        { product_id: 4090, user: "Jane Smith", score: 2.5, comment: "Lên tảng nước aio thì sao admin nhỉ", date: "2024-01-10" },
        { product_id: 4090, user: "Alice Johnson", score: 4.8, comment: "Nâng lên i512400 được k ạ", date: "2024-02-05" },
        { product_id: 4090, user: "Bob Williams", score: 2.2, comment: "Good but a bit pricey.", date: "2024-02-01" },
        { product_id: 4090, user: "Charlie Brown", score: 2, comment: "Worth every penny!", date: "2024-02-08" }
    ];

    const images = [
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c",
        "https://images.unsplash.com/photo-1591488320449-011701bb6704",
        "https://images.unsplash.com/photo-1592664474505-51c549ad15c5"
    ]

    const handleImageNavigation = (direction) => {
        if (direction === "next") {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        } else {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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

    const calculateAverageScore = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const totalScore = ratings.reduce((sum, { score }) => sum + score, 0);
        return totalScore / ratings.length;
    };

    const calculateStarDistribution = (ratings) => {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach(({ rating }) => {
            distribution[Math.round(rating)] += 1;
        });
        return distribution;
    };

    const handleIncrease = () => setQuantity((prev) => Math.min(prev + 1, quantityInStock));
    const handleDecrease = () => setQuantity((prev) => Math.max(prev - 1, 1));


    return (
        <div className="min-h-screen bg-gray-50 -mt-20">

            <main className="container mx-auto px-4 pt-24 pb-12">
                {/* Product Information */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Image Carousel */}
                    <div className="relative">
                        <img
                            src={images[currentImageIndex]}
                            alt={`Product view ${currentImageIndex + 1}`}
                            className="w-full h-[400px] object-cover rounded-lg"
                        />
                        <button
                            onClick={() => handleImageNavigation("prev")}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
                        >
                            <FaArrowLeft />
                        </button>
                        <button
                            onClick={() => handleImageNavigation("next")}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
                        >
                            <FaArrowRight />
                        </button>
                    </div>

                    {/* Product Details */}
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                        <div className="flex items-center mb-4 text-lg text-orange-400">
                            <p className="font-bold mr-1 ">{rating}</p>
                            <FaStar className="mr-10 " />
                            <p
                                className="font-bold text-blue-500 cursor-pointer "
                                onClick={() => scrollToReviews()}
                            >
                                Xem đánh giá
                            </p>
                        </div>
                        <p className="text-3xl font-bold text-blue-600 mb-4">${product.price}</p>
                        <p className="text-gray-600 mb-6 ">{product.description}</p>
                        <p className={`text-gray-600 mb-6 text-lg`}>Tình trạng: <span className={`font-semibold text-base ${quantityInStock > 0 ? "text-green-500" : "text-red-500"}`}>{quantityInStock > 0 ? "Còn hàng" : "Hết hàng"}</span></p>

                        {/* Add to Cart Section */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center border rounded-md">
                                <button
                                    onClick={handleDecrease}
                                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        let val = Number(e.target.value);
                                        if (val >= 1 && val <= 5) setQuantity(val);
                                    }}
                                    className="w-12 text-center border-none outline-none"
                                />
                                <button
                                    onClick={handleIncrease}
                                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300"
                                >
                                    +
                                </button>
                            </div>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Add to Cart
                            </button>
                            <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            {/* <tbody>
                                {product.specs.map((spec, index) => (
                                    <tr key={index} className="even:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2 font-semibold">{spec.label}</td>
                                        <td className="border border-gray-300 px-4 py-2">{spec.value}</td>
                                    </tr>
                                ))}
                            </tbody> */}
                        </table>
                    </div>
                </div>

                {/* Similar Products Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
                    <div className="grid md:grid-cols-5 gap-6">
                        {similarProducts.map((similarProduct) => (
                            <ProductCard key={similarProduct.id} product={similarProduct} />
                        ))}
                    </div>
                </div>

                {/* overall review */}
                <div className="w-full  shadow-lg bg-gray-50 rounded-sm py-10 px-7 " >
                    <h2 className="text-2xl font-bold mb-6 ">Đánh giá & Nhận xét PC GVN Intel i5-12400F/ VGA RTX 4060</h2>
                    <div className="w-full flex flex-col  items-center border-b border-gray-200 ">
                        <div className="w-full  p-6 shadow-sm text-center ">
                            <h2 className="text-2xl font-bold mb-6">Đánh giá & Nhận xét</h2>
                            <div className="flex flex-col items-center">
                                <h2 className="text-4xl font-bold text-red-500">{rating}/5</h2>
                                <div className="flex justify-center my-2">{renderStars(rating)}</div>
                                <h2 className="text-sm font-bold">({review.length}) đánh giá & nhận xét</h2>
                            </div>
                            <div className="w-full mt-6 ">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className="flex items-center mb-2 justify-center">
                                        <span className="w-10 text-right mr-2">{star} ⭐</span>
                                        <div className="w-3/4 h-4 bg-gray-200 rounded overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400"
                                                style={{
                                                    width: `${(calculateStarDistribution(review)[star] / ratings.length) * 100 || 0
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="ml-4">{calculateStarDistribution(review)[star]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="py-10 " ref={reviewsRef}>
                        {review.map((rating, index) => (
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
                                        <p className="text-sm">{rating.review}</p>
                                        <div className="mt-3 rounded-md bg-gray-200 w-full p-3">
                                            <div className="w-full flex justify-start items-center">
                                                <p className="mr-3 font-semibold text-red-500">{"Admin"}</p>
                                                <p className="text-gray-400">{"26-11-2024"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm leading-6 mt-3">{"Dạ RAM mới lúc lắp máy mình cho lắp luôn ạ, hoặc nếu Anh Minh Tiến có nhu cầu nâng cấp mình có thể nâng cấp ngay lúc lắp máy, về việc gắn thêm ổ cứng GEARVN sẽ hộ trợ mình gắn luôn, cài win cũng vậy ạ. Anh Tiến để lại thông tin (SĐT ...) để GEARVN gọi lại tư vấn cho mình rõ hơn ạ."}</p>
                                            </div>
                                        </div>
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
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="text-2xl text-yellow-400 mx-1"
                                    >
                                        {star <= (hover || rating) ? <BiSolidStar /> : <BiStar />}
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
                            <div className="flex justify-end">
                                <button
                                    className="bg-blue-500 text-white text-sm font-semibold rounded-md flex justify-center items-center px-3 py-1"
                                    onClick={() => fetch(`${process.env.REACT_APP_REVIEW_BASE_URL}/review`, {
                                            method: "POST",
                                            headers: {
                                            "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                            productId: id,
                                            userId: user_id,
                                            rating: rating,
                                            review: comment,
                                            createDate: new Date()
                                            }),
                                        })
                                        .then(response => response.text())
                                        .then(data => {
                                            alert(`Bạn đã đánh giá ${rating} sao với nội dung: ${comment}`);
                                            fetchData();
                                        })
                                        .catch(error => {
                                            alert("Error: " + error.message);
                                        })}
                                >
                                    <BiSolidCommentEdit className="text-xl mr-2" />Gửi đánh giá của bạn.
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


        </div>
    );
};
