import { requestWithJwt, requestWithoutJwt } from './request'
import { toast } from 'react-toastify';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { AxiosResponse } from 'axios'
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

// inventoryService
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
        const response = await requestWithJwt.get(`/inventory/${inventory_id}/products`)
        return response.data; // Trả về dữ liệu từ phản hồi của API
    } catch (error) {
        console.error('Error get products: ', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
export const getStockInByInventoryId = async (inventory_id) => {

    try {
        const response = await requestWithJwt.get(`/inventory/stock-in/getByInventoryId/${inventory_id}`)
        return response.data; // Trả về dữ liệu từ phản hồi của API
    } catch (error) {
        console.error('Error get products: ', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
export const getStockOutByInventoryId = async (inventory_id) => {

    try {
        const response = await requestWithJwt.get(`/inventory/stock-out/getByInventoryId/${inventory_id}`)
        return response.data; // Trả về dữ liệu từ phản hồi của API
    } catch (error) {
        console.error('Error get products: ', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
// cartService

// orderService

// paymentService

// shippingService

// reviewService

// notificationService

// recommendationService