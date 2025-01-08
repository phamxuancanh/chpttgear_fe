import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar, FaStarHalf } from "react-icons/fa";
import ProductCard from "../components/ProductCard";


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
        }
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
        reviews: [
            { id: 1, name: "John Doe", rating: 5, comment: "Amazing performance!", date: "2024-01-15" },
            { id: 2, name: "Jane Smith", rating: 4.5, comment: "Great card but runs hot.", date: "2024-01-10" }
        ]
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
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalf key="half-star" className="text-yellow-400" />);
        }
        return stars;
    };

    return (
        <div className="min-h-screen bg-gray-50">

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
                    <div className="grid md:grid-cols-3 gap-6">
                        {similarProducts.map((similarProduct) => (
                            <ProductCard key={similarProduct.id} product={similarProduct} />
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Customer Reviews</h2>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border rounded-md px-3 py-2"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4 mb-8">
                        {product.reviews.map((review) => (
                            <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center mb-2">
                                    <span className="font-semibold mr-2">{review.name}</span>
                                    <div className="flex">{renderStars(review.rating)}</div>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                                <span className="text-sm text-gray-400">{review.date}</span>
                            </div>
                        ))}
                    </div>

                    {/* Add Review Form */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block mb-1">Name</label>
                                <input
                                    type="text"
                                    value={newReview.name}
                                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Rating</label>
                                <select
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                    className="border rounded-md px-3 py-2"
                                >
                                    {[5, 4, 3, 2, 1].map((num) => (
                                        <option key={num} value={num}>{num} Stars</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Comment</label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="w-full border rounded-md px-3 py-2 h-24"
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            </main>


        </div>
    );
};
