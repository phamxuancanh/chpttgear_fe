import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar, FaStarHalfAlt } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { DateConverter } from './../utils/DateConverter';
import { BiSolidCommentEdit } from "react-icons/bi";


export default function ProductDetail() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [sortBy, setSortBy] = useState("recent");
    const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

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

    const product = {
        name: "NVIDIA GeForce RTX 4090 Graphics Card",
        price: 1599.99,
        rating: 4.8,
        description: "Experience unprecedented gaming performance with the NVIDIA GeForce RTX 4090, featuring next-gen ray tracing capabilities and advanced AI-powered graphics.",
        images: [
            "https://images.unsplash.com/photo-1587202372634-32705e3bf49c",
            "https://images.unsplash.com/photo-1591488320449-011701bb6704",
            "https://images.unsplash.com/photo-1592664474505-51c549ad15c5"
        ],
        specs: [
            { label: "CUDA Cores", value: "16384" },
            { label: "Memory", value: "24GB GDDR6X" },
            { label: "Clock Speed", value: "2.52 GHz" },
            { label: "Ray Tracing Cores", value: "128" },
            { label: "Power Consumption", value: "450W" },
            { label: "Manufacturing Process", value: "4nm" }
        ],
    };

    const handleImageNavigation = (direction) => {
        if (direction === "next") {
            setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        } else {
            setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
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
        ratings.forEach(({ score }) => {
            distribution[Math.round(score)] += 1;
        });
        return distribution;
    };


    return (
        <div className="min-h-screen bg-gray-50 -mt-20">

            <main className="container mx-auto px-4 pt-24 pb-12">
                {/* Product Information */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Image Carousel */}
                    <div className="relative">
                        <img
                            src={product.images[currentImageIndex]}
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
                        <div className="flex items-center mb-4">
                            {renderStars(product.rating)}
                            <span className="ml-2 text-gray-600">({product.rating})</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>
                        <p className="text-gray-600 mb-6">{product.description}</p>

                        {/* Add to Cart Section */}
                        <div className="flex items-center space-x-4 mb-6">
                            <select
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="border rounded-md px-3 py-2"
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Add to Cart
                            </button>
                            <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                                By Now
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <tbody>
                                {product.specs.map((spec, index) => (
                                    <tr key={index} className="even:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2 font-semibold">{spec.label}</td>
                                        <td className="border border-gray-300 px-4 py-2">{spec.value}</td>
                                    </tr>
                                ))}
                            </tbody>
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
                <div className="w-full  shadow-lg bg-gray-50 rounded-sm py-10 px-7">
                    <h2 className="text-2xl font-bold mb-6 ">Đánh giá & Nhận xét PC GVN Intel i5-12400F/ VGA RTX 4060</h2>
                    <div className="w-full flex flex-col  items-center border-b border-gray-200 ">
                        <div className="w-full  p-6 shadow-sm text-center ">
                            <h2 className="text-2xl font-bold mb-6">Đánh giá & Nhận xét</h2>
                            <div className="flex flex-col items-center">
                                <h2 className="text-4xl font-bold text-red-500">{calculateAverageScore(ratings).toFixed(1)}/5</h2>
                                <div className="flex justify-center my-2">{renderStars(calculateAverageScore(ratings))}</div>
                                <h2 className="text-sm font-bold">({ratings.length}) đánh giá & nhận xét</h2>
                            </div>
                            <div className="w-full mt-6 ">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className="flex items-center mb-2 justify-center">
                                        <span className="w-10 text-right mr-2">{star} ⭐</span>
                                        <div className="w-3/4 h-4 bg-gray-200 rounded overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400"
                                                style={{
                                                    width: `${(calculateStarDistribution(ratings)[star] / ratings.length) * 100 || 0
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="ml-4">{calculateStarDistribution(ratings)[star]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="py-10 ">
                        {ratings.map((rating, index) => (
                            <div key={index} className="w-8/12 border-b border-gray-200">
                                <div className="w-full flex justify-start items-center">
                                    <p className="mr-3 font-semibold">{rating.user}</p>
                                    <p className="text-gray-400">{DateConverter(rating.date)}</p>
                                </div>
                                <div className="w-full flex justify-start my-3">
                                    <div className="w-1/6">
                                        {renderStars(rating.score)}
                                    </div>
                                    <div className="w-10/12">
                                        <p className="text-sm">{rating.comment}</p>
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
                        <button className="bg-blue-500 text-white text-sm font-semibold rounded-md flex justify-center items-center px-4 py-2 w-4/12">
                            <BiSolidCommentEdit className="text-2xl mr-2" />Gửi đánh giá của bạn
                        </button>
                    </div>
                </div>
            </main>


        </div>
    );
};
