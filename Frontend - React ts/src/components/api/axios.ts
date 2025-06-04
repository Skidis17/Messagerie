import axios from 'axios';
import {
    User,
    Message,
    Group,
    CreateGroupPayload,
    SendMessagePayload,
    SendGroupMessagePayload
} from '../../types';

const API_BASE = 'http://localhost:8080'; // adjust backend URL if needed

// Create an axios instance with defaults
const axiosInstance = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // important to send cookies (session)
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // for form login
    },
});

// Auth functions
async function login(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const response = await axiosInstance.post('/login', params);
    return response.data;
}

async function getCurrentUser() {
    try {
        const response = await axiosInstance.get('/login/me');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
        }
        throw error;
    }
}

// User functions
async function getAllSoldiers(): Promise<User[]> {
    const response = await axiosInstance.get('/api/users/soldiers');
    return response.data;
}

async function getAllCommandants(): Promise<User[]> {
    const response = await axiosInstance.get('/api/users/commandants');
    return response.data;
}

async function getUserById(id: number): Promise<User> {
    const response = await axiosInstance.get(`/api/users/${id}`);
    return response.data;
}

// Message functions
async function sendMessage(payload: SendMessagePayload): Promise<{ messageId: number }> {
    const response = await axiosInstance.post('/api/messages/send', payload, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

async function getConversation(userId: number): Promise<Message[]> {
    const response = await axiosInstance.get(`/api/messages/conversation/${userId}`);
    return response.data;
}

async function getReceivedMessages(): Promise<Message[]> {
    const response = await axiosInstance.get('/api/messages/received');
    return response.data;
}

// Group functions
async function createGroup(payload: CreateGroupPayload): Promise<Group> {
    const response = await axiosInstance.post('/api/groups', payload, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

async function getGroups(): Promise<Group[]> {
    const response = await axiosInstance.get('/api/groups');
    return response.data;
}

async function sendGroupMessage(groupId: number, payload: SendGroupMessagePayload): Promise<{ messageId: number }> {
    const response = await axiosInstance.post(`/api/groups/${groupId}/messages`, payload, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

async function getGroupMessages(groupId: number): Promise<Message[]> {
    const response = await axiosInstance.get(`/api/groups/${groupId}/messages`);
    return response.data;
}

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

export const API = {
    // Auth
    login,
    getCurrentUser,
    
    // Users
    getAllSoldiers,
    getAllCommandants,
    getUserById,
    
    // Messages
    sendMessage,
    getConversation,
    getReceivedMessages,
    
    // Groups
    createGroup,
    getGroups,
    sendGroupMessage,
    getGroupMessages,
};
