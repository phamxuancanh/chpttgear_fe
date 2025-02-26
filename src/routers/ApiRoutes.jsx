import { requestWithJwt, requestWithoutJwt } from './request'
import { toast } from 'react-toastify';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth'
import axios, { AxiosResponse } from 'axios'
const firebaseConfig = {
    apiKey: "AIzaSyAN42yRxXQdumIT187N_rXW-60zCcjg3e8",
    authDomain: "authenqc.firebaseapp.com",
    projectId: "authenqc",
    storageBucket: "authenqc.appspot.com",
    messagingSenderId: "937494844026",
    appId: "1:937494844026:web:90eb6cd27bb70aa9cee1c3",
    measurementId: "G-V30ZQYBLQ3"
};
const app = initializeApp(firebaseConfig);

// userService

export const verifyToken = async (payload) => {
    return await requestWithoutJwt.post('/users/verifyToken', {
        token: payload,
    });
};
export const signIn = async (payload) => {
    return await requestWithoutJwt.post('/users/signIn', { data: payload }, { withCredentials: true })
}
export const signUp = async (payload) => {
    return await requestWithoutJwt.post('/users/signUp', { data: payload }, { withCredentials: true });
};
export const findUserById = async (id) => {
    return await requestWithJwt.get(`/users/${id}`);
};
export const editUserById = async (id, payload) => {
    return await requestWithJwt.put(`/users/${id}`, { data: payload });
};
export const refresh = async () => {
    return await requestWithJwt.post('/users/refreshToken', {}, { withCredentials: true });
};

export const signOut = async () => {
    return await requestWithJwt.post('/users/signOut', {}, { withCredentials: true });
};

export const checkEmail = async (payload) => {
    return await requestWithJwt.post('/users/checkEmail', { data: payload }, { withCredentials: true });
};

export const sendOTP = async (payload) => {
    return await requestWithoutJwt.post('/users/sendOTP', { data: payload }, { withCredentials: true });
};

export const resetPassword = async (payload) => {
    return await requestWithoutJwt.post('/users/resetPassword', { data: payload }, { withCredentials: true });
};

export const verifyEmail = async (token) => {
    console.log(token);
    return await requestWithoutJwt.post('/users/verifyEmail', {
        params: { token },
    });
};

export const verifyOTP = async (payload) => {
    return await requestWithoutJwt.post('/users/verifyOTP', { data: payload }, { withCredentials: true });
};
export const changePassword = async (id, payload) => {
    return await requestWithJwt.put(`/users/${id}/changePassword`, { data: payload });
};
export const changeAVT = async (id, payload) => {
    return await requestWithJwt.put(`/users/${id}/changeAVT`, payload);
};

export const googleSignIn = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        console.log(result)
        const token = await result.user.getIdToken();
        console.log('Token:', token);
        const response = await fetch('http://localhost:6868/api/v1/users/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken: token }),
            credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Đăng nhập thành công:', data);

            const currentUser = {
                accessToken: data.accessToken, // Sử dụng accessToken từ response
                currentUser: data.user,
            };

            return currentUser;
        } else {
            console.error('Đăng nhập thất bại:', data);
            toast.error(data.message);
            return null;
        }
    } catch (error) {
        // console.error('Lỗi khi đăng nhập với Google:', error);

        if (error.code === 'auth/account-exists-with-different-credential') {
            toast.error('Email này đã được đăng ký bằng phương thức khác. Vui lòng thử đăng nhập bằng phương thức đó.');
        } else {
            toast.error('Đã xảy ra lỗi khi đăng nhập với Google.');
        }

        return null;
    }
};


// productService
export const findAllCategory = async () => {
    return await requestWithJwt.get(`/products/categories/findAllCategories`);
};
export const searchProducts = async ({ params } = {}) => {
    return await requestWithJwt.get('/products/products/searchProducts', { params });
};
export const getSuggestions = async (search) => {
    return await requestWithJwt.get('/products/products/getSuggestions', { params: { search } });
};

export const findAllProduct = async () => {
    return await requestWithJwt.get('/products/products/findAllProducts');
};

export const findAllSpecification = async () => {
    return await requestWithJwt.get('/products/specifications/findAllSpecifications');
};
export const createProduct = async (payload) => {
    try {
        return await requestWithJwt.post(`/products/products/createProduct`, payload);
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};
export const createCategory = async (payload) => {
    try {
        return await requestWithJwt.post('/products/categories/createCategory', payload);
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    };
};
export const createSpecification = async (payload) => {
    try {
        return await requestWithJwt.post(`/products/specifications/createSpecification`, payload);
    } catch (error) {
        console.error('Error creating specification:', error);
        throw error;
    }
};
export const findProductById = async (productId) => {
    try {
        return await requestWithJwt.get(`/products/products/findById/${productId}`);
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};
export const findSpecificationsByProductId = async (productId) => {
    console.log(productId);
    try {
        return await requestWithJwt.get(`/products/specifications/findByProductId//${productId}`);
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};
export const updateProduct = async (productId, payload) => {
    try {
        return await requestWithJwt.put(`/products/products/updateProduct/${productId}`, payload);
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};
export const updateSpecification = async (specificationId, payload) => {
    try {
        return await requestWithJwt.put(`/specifications/${specificationId}`, payload);
    } catch (error) {
        console.error('Error updating specification:', error);
        throw error;
    }
};
export const uploadImagesToCloudinary = async (payload) => {
    const cloud_name = 'chaamz03';
    try {
        return await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
            method: 'POST',
            body: payload,
        });
    } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
    }
};
export const getProductsManagementPage = async ({ params } = {}) => {
    return await requestWithJwt.get('/products/products/managementPage', { params });
};
export const updatePriceByProductId = async (productId, payload) => {
    try {
        const response = await requestWithJwt.put(`/products/${productId}/price`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating price:', error);
        throw error;
    }
};

export const getProductsByListId = async (productIds) => {
    return await requestWithJwt.get('/products/products/findByIds', { params: { productIds } });
};

export const getAllProduct = async () => {
    return await requestWithJwt.get('/products/products');
};


// inventoryService
export const createInventory = async (payload) => {
    return await requestWithJwt.post(`/inventory/`, {
        data: payload,
    });
};
export const getAllInventory = async () => {
    return await requestWithJwt.get(`/inventory`);
};
export const createStockIn = async (payload) => {
    console.log(payload)
    return await requestWithJwt.post(`/inventory/stock-in`, {
        data: payload,
    });
};
export const increaseQuantity = async (inventory_id, payload) => {

    try {
        const response = await requestWithJwt.put(`/inventory/${inventory_id}/increase`, {
            quantity: payload,
        });
        return response.data; // Trả về dữ liệu từ phản hồi của API
    } catch (error) {
        console.error('Error increasing quantity:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const getProductsByInventoryId = async (inventory_id) => {
    try {
        const response = await requestWithJwt.get(`/inventory/${inventory_id}/products`);
        return response.data.data; // Trả về dữ liệu từ phản hồi của API
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return []; // Trả về mảng rỗng nếu API trả về 404
        }
        console.error('Error get products: ', error);
        throw error; // Ném lỗi nếu không phải lỗi 404
    }
};

export const getStockInByInventoryId = async (inventory_id) => {
    try {
        const response = await requestWithJwt.get(`/inventory/stock-in/getByInventoryId/${inventory_id}`);
        return response.data; // Trả về dữ liệu từ phản hồi của API
    } catch (error) {
        console.log(error)
        if (error && error.status === 404) {
            return []; // Trả về mảng rỗng nếu API trả về 404
        }
        console.error('Error get stock-in: ', error);
        throw error; // Ném lỗi nếu không phải lỗi 404
    }
};

export const getStockInByProductId = async (product_id) => {
    try {
        console.log(product_id)
        const response = await requestWithJwt.get(`/inventory/stock-in/getByProductId/${product_id}`);
        return response.data; // Trả về dữ liệu từ phản hồi của API
    } catch (error) {
        console.log(error)
        if (error && error.status === 404) {
            return []; // Trả về mảng rỗng nếu API trả về 404
        }
        console.error('Error get stock-in: ', error);
        throw error; // Ném lỗi nếu không phải lỗi 404
    }
};
export const getStockOutByProductId = async (product_id) => {
    try {
        console.log(product_id)
        const response = await requestWithJwt.get(`/inventory/stock-out/getByProductId/${product_id}`);
        return response.data; // Trả về dữ liệu từ phản hồi của API
    } catch (error) {
        console.log(error)
        if (error && error.status === 404) {
            return []; // Trả về mảng rỗng nếu API trả về 404
        }
        console.error('Error get stock-in: ', error);
        throw error; // Ném lỗi nếu không phải lỗi 404
    }
};

export const getStockOutByInventoryId = async (inventory_id) => {
    try {
        const response = await requestWithJwt.get(`/inventory/stock-out/getByInventoryId/${inventory_id}`);
        return response.data; // Trả về dữ liệu từ phản hồi của API
    } catch (error) {
        if (error && error.status === 404) {
            return []; // Trả về mảng rỗng nếu API trả về 404
        }
        console.error('Error get stock-out: ', error);
        throw error; // Ném lỗi nếu không phải lỗi 404
    }
};
export const getQuantityInStock = async (product_id) => {
    try {
        const response = await requestWithJwt.get(`/inventory/getQuantityInStockByProductId/${product_id}`);
        return response.data; // Trả về dữ liệu từ phản hồi của API
    } catch (error) {
        if (error && error.status === 404) {
            return []; // Trả về mảng rỗng nếu API trả về 404
        }
        console.error('Error get stock-out: ', error);
        throw error; // Ném lỗi nếu không phải lỗi 404
    }
};

// cartService

export const findCartByUserId = async (userId) => {
    return await requestWithJwt.get(`/carts/findByUserId/${userId}`);
};
export const findCartItemsByCartId = async (cartId) => { 
    return await requestWithJwt.get(`/carts/cart_items/findByCartId/${cartId}`);
};
export const updateQuantityCartItem = async (cartItemId, payload) => {
    try {
        console.log("1234", cartItemId, payload);
        return await requestWithJwt.put(`/carts/cart_items/updateQuantityByCartItemId/${cartItemId}`, 
            payload.toString(), // Chuyển số thành chuỗi
            { headers: { "Content-Type": "text/plain" } } 
        );
    } catch (error) {
        console.error('Error updating quantity:', error);
        throw error;
    }
};
export const deleteCartItem = async (cartItemId) => {
    try {
        return await requestWithJwt.delete(`/carts/cart_items/deleteByCartItemId/${cartItemId}`);
    } catch (error) {
        console.error('Error deleting cart item:', error);
        throw error;
    }
};

// orderService
export const getAllOrders = async () => {
    return await requestWithJwt.get(`/orders/`);
};

export const getOrderById = async (orderId) => {
    return await requestWithJwt.get(`/orders/${orderId}`);
};

export const getOrdersByUserId = async (userId) => {
    return await requestWithJwt.get(`/orders/orders/${userId}`);
};

export const createOrder = async (payload) => {
    return await requestWithJwt.post(`/orders/`, payload);
};


export const updateOrder = async (orderId, payload) => {
    return await requestWithJwt.put(`/orders/${orderId}`, payload);
};

export const deleteOrder = async (orderId) => {
    return await requestWithJwt.delete(`/orders/${orderId}`);
};


export const getOrderItemById = async (orderItemId) => {
    return await requestWithJwt.get(`/orders/order-items${orderItemId}`);
};

export const createOrderItem = async (payload) => {
    return await requestWithJwt.post(`/orders/order-items/`, payload);
};

export const updateOrderItem = async (orderItemId, payload) => {
    return await requestWithJwt.put(`/orders/order-items/${orderItemId}`, payload);
};

export const deleteOrderItem = async (orderItemId) => {
    return await requestWithJwt.delete(`/orders/order-items/${orderItemId}`);
};

// import axios from "axios";

export const calculateShippingFee = async () => {
    try {
        const response = await axios.post(
            "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
            {
                service_id: 53321,
                insurance_value: 500000,
                coupon: null,
                from_district_id: 1542,
                to_district_id: 1444,
                to_ward_code: 20314,
                height: 15,
                length: 15,
                weight: 1000,
                width: 15
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Token": "aa43f060-d157-11ef-b2e4-6ec7c647cc27",
                    "ShopId": "195800"
                }
            }
        );

        return response.data?.data?.total || 0;
    } catch (error) {
        console.error("Error calculating shipping fee:", error);
        return 0;
    }
};




// paymentService

// shippingService

// reviewService

// notificationService

// recommendationService