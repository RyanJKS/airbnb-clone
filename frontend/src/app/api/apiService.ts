import axios from 'axios';
import { getAccessToken } from '../lib/actions';


let axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Function to set the Authorization header
const setAuthorizationHeader = async (config: any) => {
    const token = await getAccessToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    } else {
        delete config.headers['Authorization'];
    }
    return config;
};

// Request interceptor for logging and setting the Authorization header
axiosInstance.interceptors.request.use(async (request) => {
    await setAuthorizationHeader(request);
    console.log('Starting Request', request);
    return request;
}, error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
});

// Response interceptor for logging
axiosInstance.interceptors.response.use(response => {
    console.log('Response:', response);
    return response;
}, error => {
    console.error('Response Error:', error);
    return Promise.reject(error);
});

const apiService = {
    get: async function (url: string): Promise<any> {
        try {
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error('Error in GET request:', error);
            throw error;
        }
    },

    post: async function (url: string, data: any): Promise<any> {
        try {
            const response = await axiosInstance.post(url, data);
            console.log("Response: ", response)
            return response.data;
        } catch (error) {
            console.error('Error in POST request:', error);
            throw error;
        }
    },

    postWithFiles: async function (url: string, data: any): Promise<any> {
        try {
            const response = await axiosInstance.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Response: ", response);
            return response.data;
        } catch (error) {
            console.error('Error in POST request with files:', error);
            throw error;
        }
    },

    put: async function (url: string, data: any): Promise<any> {
        try {
            const response = await axiosInstance.put(url, data);
            return response.data;
        } catch (error) {
            console.error('Error in PUT request:', error);
            throw error;
        }
    },

    delete: async function (url: string): Promise<any> {
        try {
            const response = await axiosInstance.delete(url);
            return response.data;
        } catch (error) {
            console.error('Error in DELETE request:', error);
            throw error;
        }
    }
};

export default apiService;
