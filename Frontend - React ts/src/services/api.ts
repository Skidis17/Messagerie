import axios from 'axios';
import { User, Message, Group, Conversation, MessageType } from '../types';

const API_BASE = 'http://localhost:8080'; // adjust backend URL if needed

// Create an axios instance with defaults
const axiosInstance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth endpoints
export const login = async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const response = await axiosInstance.post('/login', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
};

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('/login/me');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
        }
        throw error;
    }
};

// User endpoints
export const getAllSoldiers = async (): Promise<User[]> => {
    const response = await axiosInstance.get('/api/users/soldiers');
    return response.data;
};

export const getAllCommandants = async (): Promise<User[]> => {
    const response = await axiosInstance.get('/api/users/commandants');
    return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/api/users/${id}`);
    return response.data;
};

// Message endpoints
export const sendMessage = async (payload: {
    contenu: string;
    destinataireId: number;
    type: MessageType;
}): Promise<Message> => {
    const response = await axiosInstance.post('/api/messages/send', {
        content: payload.contenu,
        destinataireId: payload.destinataireId,
        type: payload.type
    });
    return response.data;
};

export const getConversations = async (): Promise<Message[]> => {
    const response = await axiosInstance.get('/api/messages/received');
    return response.data;
};

export const getConversationMessages = async (userId: number): Promise<Message[]> => {
    const response = await axiosInstance.get(`/api/messages/conversation/${userId}`);
    return response.data;
};

// Group endpoints
export const createGroup = async (payload: {
    name: string;
    description: string;
    code: string;
    members: number[];
}): Promise<Group> => {
    const response = await axiosInstance.post('/api/groups', payload);
    return response.data;
};

export const getGroups = async (): Promise<Group[]> => {
    const response = await axiosInstance.get('/api/groups');
    return response.data;
};

export const sendGroupMessage = async (
    groupId: number,
    payload: { contenu: string }
): Promise<Message> => {
    const response = await axiosInstance.post(`/api/groups/${groupId}/messages`, {
        content: payload.contenu
    });
    return response.data;
};

export const getGroupMessages = async (groupId: number): Promise<Message[]> => {
    const response = await axiosInstance.get(`/api/groups/${groupId}/messages`);
    return response.data;
};

// Error interceptor
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const api = {
    // Auth
    login,
    getCurrentUser,
    
    // Users
    getAllSoldiers,
    getAllCommandants,
    getUserById,
    
    // Messages
    sendMessage,
    getConversations,
    getConversationMessages,
    
    // Groups
    createGroup,
    getGroups,
    sendGroupMessage,
    getGroupMessages,
}; 