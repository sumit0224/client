import axiosClient from './axiosClient';

export const profileApi = {
    updateProfile: async (profileData, token) => {
        try {
            const response = await axiosClient.patch('/profile/update', profileData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
