import axios from 'axios';
import { Platform } from 'react-native';

// Production URL
const BASE_URL = 'https://matchingo-backend.onrender.com';
// Local Development URLs (for reference)
// const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
