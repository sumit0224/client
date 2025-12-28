import axiosClient from './axiosClient';

export const userApi = {
    // Feed
    getFeed: async (token) => {
        try {
            const response = await axiosClient.get('/user/feed', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Swipe Action
    swipe: async (swipedId, action, token) => {
        try {
            const response = await axiosClient.post('/action/swipe',
                { swipedId, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    swipeLike: async (targetUserId, token) => {
        return axiosClient.post('/action/like', { targetUserId }, { headers: { Authorization: `Bearer ${token}` } });
    },

    swipeDislike: async (targetUserId, token) => {
        return axiosClient.post('/action/dislike', { targetUserId }, { headers: { Authorization: `Bearer ${token}` } });
    },

    swipeSuperLike: async (targetUserId, token) => {
        return axiosClient.post('/action/super-like', { targetUserId }, { headers: { Authorization: `Bearer ${token}` } });
    },

    // Upload Photo
    addPhoto: async (url, isPrimary, token) => {
        try {
            const response = await axiosClient.post('/user/photo',
                { url, isPrimary },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update Profile (with location)
    updateProfile: async (data, token) => {
        try {
            const response = await axiosClient.patch('/user/update', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
