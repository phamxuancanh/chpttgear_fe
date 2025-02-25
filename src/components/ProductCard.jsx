import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaDongSign } from "react-icons/fa6";
export default function ProductCard({ product }) {
    return (
        <div className="bg-card rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            <Link to={`/product/${product.id}`}>
                <img
                    src="/aa.jpg"
                    alt={product.name}
                    loading="lazy" // Lazy load the image
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3";
                    }}
                />
            </Link>

            <div className="p-4">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold text-foreground mb-2 cursor-pointer">{product.name}</h3>
                </Link>

                <div className="flex justify-start">
                    <p className="text-accent text-xl font-bold mb-4 mr-2">{product.price.toLocaleString('en-US')} </p>< FaDongSign />
                </div>
                <p className="text-accent text-xl font-bold mb-4">{product?.category?.name}</p>
                <p className="text-gray-500">{product.color}</p>
                <p className="text-gray-500">{product.id}</p>

                <button className="w-full   py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-300 flex items-center justify-center gap-2">
                    <FiShoppingCart />
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
