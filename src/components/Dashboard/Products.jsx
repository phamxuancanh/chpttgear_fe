import { useState } from "react";
import { FiHome, FiUsers, FiBox, FiShoppingCart, FiEdit, FiTrash2, FiLogOut, FiPackage, FiEye, FiX } from "react-icons/fi";


export default function Products() {
    const [showProductModal, setShowProductModal] = useState(false);
    const [productForm, setProductForm] = useState({
        name: "",
        category: "",
        price: "",
        stock: ""
    });
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

    const Modal = ({ show, onClose, title, children }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        setShowProductModal(false);
    };
    return (
        <div className="flex-1 p-8">
            <Modal
                show={showProductModal}
                onClose={() => setShowProductModal(false)}
                title="Add/Edit Product"
            >
                <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="text"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                        Save Product
                    </button>
                </form>
            </Modal>
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


