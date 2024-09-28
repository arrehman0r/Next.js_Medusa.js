import axios from 'axios';
import { NEXT_PUBLIC_PROD_URL } from '../env';
// import { ToastNotification } from '../Utils/ToastNotifications';
import Cookies from 'js-cookie';

export const baseURL = NEXT_PUBLIC_PROD_URL;

export const instance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const makeRequest = async (type, path, body = null, options = {}) => {
  console.log("path is ====", path)
  try {
    // Retrieve token from cookies
    const cookiesSid = Cookies.get('connect.sid');
    const token = Cookies.get('auth-token');

console.log("ssid and token is", cookiesSid, token)
    // Setup headers
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'connect.sid': cookiesSid ? cookiesSid : null,
    };

    // If the body is an instance of FormData, set the appropriate Content-Type
    if (body instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    } else if (body) {
      headers['Content-Type'] = 'application/json';
    }

    // Create the config object
    const config = {
      timeout: 30000,
      headers,
      ...options,
    };

    let response;

    // Perform the request based on the type
    switch (type.toUpperCase()) {
      case 'GET':
        response = await instance.get(path, config);
        break;
      case 'POST':
        response = await instance.post(path, body, config);
        break;
      case 'PUT':
        response = await instance.put(path, body, config);
        break;
      case 'DELETE':
        response = await instance.delete(path, config);
        break;
      default:
        throw new Error('Unsupported request type');
    }

    return response;
  } catch (error) {
    console.error('Error making request:', error);

    // Handle specific errors
    if (error.response?.status === 401) {
      // Handle unauthorized error, such as refreshing tokens or redirecting
      // ToastNotification('error', 'Session expired. Please login again');
    } else if (error.code === 'ECONNABORTED') {
      // Handle timeout
      // ToastNotification('error', 'Request timed out');
    }

    throw error; // Re-throw error after logging/handling
  }
};


// Optional: Request interceptor for adding authentication or other common headers
instance.interceptors.request.use(
  (config) => {
    // Example: Add basic auth or other configuration if needed
    // config.auth = { username, password };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for handling global responses or errors
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Return the error message so it can be handled by the calling component
    return Promise.reject(error.response?.data?.error || "Something went wrong");
  }
)