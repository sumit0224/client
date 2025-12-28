import axiosClient from './axiosClient';

export const authApi = {
    sendOtp: async (mobileNumber) => {
        try {
            const response = await axiosClient.post('/auth/send-otp', { mobileNumber });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    verifyOtp: async (mobileNumber, otp) => {
        try {
            const response = await axiosClient.post('/auth/verify-otp', { mobileNumber, otp });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
