import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/jwt/create/`, formData);
        const { access } = response.data;
        Cookies.set('token', access, { expires: 1 });
        return access;
    } catch (error) {
        throw new Error('Ошибка авторизации');
    }
};

export const register = async (username, email, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/users/`, formData);
        return response.data;
    } catch (error) {
        throw new Error('Ошибка регистрации');
    }
};

export const getUserInfo = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/users/me/`, {
            headers: {
                Authorization: `JWT ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Ошибка получения данных пользователя');
    }
};