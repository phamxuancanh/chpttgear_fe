import { requestWithJwt, requestWithoutJwt } from './request'
// userService
export const signIn = async (payload) => {
    return await requestWithoutJwt.post('/users/signIn', { data: payload }, { withCredentials: true })
}
export const signUp = async (payload) => {
    return await requestWithoutJwt.post('/users/signUp', { data: payload }, { withCredentials: true });
};
export const findUserById = async (id) => {
    console.log(id, 'id');
    return await requestWithJwt.get(`/users/${id}`)
}
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
// productService

// inventoryService

// cartService

// orderService

// paymentService

// shippingService

// reviewService

// notificationService

// recommendationService