/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios'
import { getFromLocalStorage, removeAllLocalStorage, reload } from '../utils/functions'
import { refresh } from './ApiRoutes'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'
import { logout, setToken } from '../redux/authSlice'
import { store } from '../redux/store'; // Import your Redux store
const gatewayURL = 'http://localhost:6868/api/v1'
export const requestWithJwt = axios.create({
  baseURL: gatewayURL,
  timeout: 10000,
  withCredentials: true
})

const checkTokenValidity = (token) => {
  try {
    const decodedToken = jwtDecode(token)
    if (decodedToken.exp * 1000 < Date.now()) {
      return false
    }
    return true
  } catch (error) {
    console.error('Token is invalid:', error)
    return false
  }
}
const handleTokenRefresh = async () => {
  console.log('Refreshing token');
  const persistedAuthString = getFromLocalStorage('persist:auth'); // Retrieve persisted data

  if (!persistedAuthString) {
      console.log('No persisted auth data found');
      return null;
  }

  try {
      const persistedAuth = (persistedAuthString)
      const isLoggedIn = persistedAuth.isLoggedIn === 'true';
      const user = JSON.parse(persistedAuth.user); // Parse user JSON string
      console.log('Persisted User:', user);
      console.log('Is logged in:', isLoggedIn);
      const token = JSON.parse(persistedAuth.token); // Parse token JSON string (removes double quotes)
      console.log('Persisted Auth:', persistedAuth);

      if (token && checkTokenValidity(token)) {
          console.log('Token is valid')
          return token;
      }

      console.log('Refreshing token...');
      const response = await refresh();
      const newAccessToken = response.data.accessToken;
      // Dispatch the setToken action to update Redux state with new token
      store.dispatch(setToken(newAccessToken));

      console.log('New access token:', newAccessToken);
      return newAccessToken;
  } catch (error) {
      console.error('Token refresh failed:', error);
      Swal.fire({
          title: 'Warning',
          text: 'Your session has expired. Please log in again.',
          icon: 'warning',
          confirmButtonText: 'OK',
          allowOutsideClick: false
      }).then((result) => {
          if (result.isConfirmed) {
              store.dispatch(logout()); // Clear auth state
              removeAllLocalStorage();
              window.location.reload()
          }
      });
      return null;
  }
};


requestWithJwt.interceptors.request.use(async (config) => {
  const persistAuthData = getFromLocalStorage('persist:auth')
  if (persistAuthData) {
    const accessToken = persistAuthData.accessToken
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
  }
  return config
})

requestWithJwt.interceptors.response.use(
  (response) => {
    console.log('day la requestWithJwt')
    return response
  },
  async (error) => {
    console.log('day la chuan bi REFRESH')
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('401 error')
      originalRequest._retry = true

      try {
        const newAccessToken = await handleTokenRefresh()
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return requestWithJwt(originalRequest)
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError)
        return Promise.reject(refreshError)
      }
    }

    if (!error.response?.data) {
      console.error('Unknown server error')
      return Promise.reject({
        code: 'Unknown',
        status: 500,
        message: 'Server error'
      })
    }
    return Promise.reject(error.response?.data)
  }
)

export const requestWithoutJwt = axios.create({
  baseURL: gatewayURL,
  timeout: 10000,
  withCredentials: false
})

requestWithoutJwt.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    return await Promise.reject({
      ...error.response?.data
    })
  }
)
