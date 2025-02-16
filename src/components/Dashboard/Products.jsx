import { useState } from "react";
import { FiEdit } from "react-icons/fi";

import AddProductModal from "../Modal/AddProductModal";

export default function Products() {

    const [showProductModal, setShowProductModal] = useState(false);

    const products = [
        { id: 1, name: "Product 1", category: "Electronics", price: "$999", stock: 50, image: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-1.2.1" },
        { id: 2, name: "Product 2", category: "Clothing", price: "$59", stock: 100, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-1.2.1" },
        { id: 3, name: "Product 3", category: "Accessories", price: "$29", stock: 75, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1" }
    ];
    const ActionButton = ({ icon: Icon, onClick, color }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded-full ${color} text-white hover:opacity-80 transition-opacity mr-2`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );


    return (
        <div className="flex-1 p-8">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Products</h2>
                    <button
                        onClick={() => setShowProductModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add Product
                    </button>
                </div>
                {showProductModal && <AddProductModal setShowProductModal={setShowProductModal} />}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="text-gray-600">{product.category}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-blue-600 font-bold">{product.price}</span>
                                    <span className="text-gray-500">Stock: {product.stock}</span>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <ActionButton icon={FiEdit} color="bg-blue-500" onClick={() => setShowProductModal(true)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


