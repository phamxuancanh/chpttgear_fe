import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaDongSign } from "react-icons/fa6";

export default function ProductCard({ product }) {
    return (
        <div className="bg-card rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col h-[65vh] mb-4">
            <Link to={`/product/${product.id}`}>
                <div className="flex justify-center items-center h-[30vh]">
                    <img
                        src={product.image.split(',')[0]}
                        alt={product.name}
                        loading="lazy"
                        className="w-[30vh] h-[30vh] object-cover rounded-lg"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3";
                        }}
                    />
                </div>
            </Link>

            {/* Nội dung sản phẩm */}
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold text-foreground mb-2 h-[5vh]">{product.name}</h3>
                </Link>

                {/* Giá sản phẩm */}
                <div className="flex items-center mb-2 h-[4vh]">
                    <p className="text-accent text-xl font-bold mr-1">{product.price.toLocaleString('en-US')}</p>
                    <FaDongSign />
                </div>

                {/* Danh mục sản phẩm */}
                <p className="text-accent text-sm font-medium mb-2 h-[3vh]">{product?.category?.name}</p>

                {/* Màu sắc sản phẩm */}
                <div className="h-[4vh] flex items-center">
                    <div
                        className={`w-[3vh] h-[3vh] rounded-lg shadow-xl ${["black", "white"].includes(product.color)
                            ? `bg-${product.color}`
                            : `bg-${product.color}-400`
                            }`}
                    ></div>
                </div>
            </div>

            {/* Nút Thêm vào giỏ hàng - luôn nằm dưới */}
            <div className="p-4">
                <button className="w-full py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-300 flex items-center justify-center gap-2 h-[5vh]">
                    <FiShoppingCart />
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
}
