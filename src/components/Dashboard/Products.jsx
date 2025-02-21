import { use, useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";

import AddProductModal from "../Modal/AddProductModal";
import { findAllProduct, findAllCategory, findAllSpecification } from "../../routers/ApiRoutes";

export default function Products() {

    const quantityInStock = 100;
    const imageTemp = "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-1.2.1";
    const [showProductModal, setShowProductModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await findAllProduct();
                setProducts(response.data);
                console.log("Đây là ds productx")
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const ActionButton = ({ icon: Icon, onClick, color }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded-full ${color} text-white hover:opacity-80 transition-opacity mr-2`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    const handleActionButton = ({product}) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    }


    return (
        <div className="flex-1 p-8">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Danh sách sản phẩm</h2>
                    <button
                        onClick={() => setShowProductModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Thêm sản phẩm
                    </button>
                </div>
                {
                    showProductModal && 
                    <AddProductModal 
                        setShowProductModal={setShowProductModal} 
                        length={products.length} 
                        productId={selectedProduct.id}/>
                }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={imageTemp}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="text-gray-600">{product.category.name}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-blue-600 font-bold">{product.price}</span>
                                    <span className="text-gray-500">Số lượng tồn: {quantityInStock}</span>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <ActionButton icon={FiEdit} color="bg-blue-500" onClick={() => handleActionButton({product})} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


