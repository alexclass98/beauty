import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { login, getUserInfo } from '../../api/api'; // Импортируем API
import { ADD_USER } from '../AuthRedux/actions';
import Cookies from 'js-cookie';
import './LogIn.css';

function LogIn() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.user);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await login(username, password);
            const userInfo = await getUserInfo(token);

            dispatch({
                type: ADD_USER,
                payload: { token, username: userInfo.username },
            });
        } catch (err) {
            setError('Неверный логин или пароль');
        }
    };

    if (token || Cookies.get('token')) {
        return <Navigate to="/" />;
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Авторизация
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Логин"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Войти
                    </Button>
                    <Button
                        component={Link}
                        to="/register"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                    >
                        Регистрация
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default LogIn;