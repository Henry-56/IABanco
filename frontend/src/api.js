import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const evaluateClient = async (clientData) => {
    try {
        const response = await api.post('/evaluate', clientData);
        return response.data;
    } catch (error) {
        console.error("Error evaluating client:", error);
        throw error;
    }
};

export const uploadHistory = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await api.post('/upload_history', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading history:", error);
        throw error;
    }
};

export default api;
