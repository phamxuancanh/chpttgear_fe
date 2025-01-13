import axios from 'axios'
import { getFromLocalStorage, setToLocalStorage, removeAllLocalStorage, reload } from '../utils/functions'
import { refresh } from './ApiRoutes'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
const gatewayURL = 'http://localhost:6868/api/v1'
export const requestWithJwt = axios.create({
  baseURL: process.env.REACT_APP_API,
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
  console.log('Refreshing token')
  const tokens = getFromLocalStorage('persist:auth')
  const currentUser = tokens?.currentUser
  console.log(tokens)
  if (tokens?.accessToken && checkTokenValidity(tokens.accessToken)) {
    return tokens.accessToken
  }
  if (!tokens) {
    return null
  }
  try {
    console.log('Refreshing token2')
    const response = await refresh()
    const newAccessToken = response.data.accessToken
    const updatedTokens = {
      currentUser: currentUser,
      accessToken: newAccessToken
    }

    setToLocalStorage('persist:auth', JSON.stringify(updatedTokens))
    return newAccessToken
  } catch (error) {
    Swal.fire({
      title: 'Warning',
      text: 'Your session has expired. Please log in again.',
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        removeAllLocalStorage()
        reload()
      }
    })
    return null
  }
}

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
    return response
  },
  async (error) => {
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
