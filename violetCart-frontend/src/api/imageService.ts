import { api } from './axios';

export const imageService = {

    fetchImageBlob: async (filename: string): Promise<string> => {
        // If it's already an absolute URL (e.g., Unsplash mock data), return directly
        if (!filename || filename.startsWith('http://') || filename.startsWith('https://')) {
            return filename;
        }

        // Axios fetches image binary data with auth headers attached
        const response = await api.get(`/images/${filename}`, {
            responseType: 'blob',
        });

        // Convert binary blob to temporary object URL for <img> tags
        return URL.createObjectURL(response.data);
    },

};
