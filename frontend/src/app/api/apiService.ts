import axios from 'axios';

// Create an axios instance with default settings
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
axiosInstance.interceptors.request.use(request => {
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
