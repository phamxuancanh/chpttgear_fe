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
    return await requestWithoutJwt.get('/users/verifyEmail', {
        params: { token },
    });
};

export const verifyOTP = async (payload) => {
    return await requestWithoutJwt.post('/users/verifyOTP', { data: payload }, { withCredentials: true });
};
export const changePassword = async (id, payload) => {
    return await requestWithJwt.put(`/users/${id}/changePassword`, payload);
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

// cartService

// orderService

// paymentService

// shippingService

// reviewService

// notificationService

// recommendationService