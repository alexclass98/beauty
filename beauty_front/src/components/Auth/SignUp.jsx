import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Navigate, Link} from 'react-router-dom';
import {Button, TextField, Container, Typography, Box, MenuItem, Select, FormControl, InputLabel} from '@mui/material';
import {register, login, getUserInfo} from '../../api/api'; // Импортируем API
import {ADD_USER} from '../AuthRedux/actions';
import Cookies from 'js-cookie';
import './SignUp.css';

function SignUp() {
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.user);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [tel, setTel] = useState('');
    const [access, setAccess] = useState(0);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            await register(username, email, password);
            const token = await login(username, password);
            const userInfo = await getUserInfo(token);

            dispatch({
                type: ADD_USER,
                payload: {token, username: userInfo.username},
            });
        } catch (err) {
            setError('Ошибка регистрации');
        }
    };

    if (token || Cookies.get('token')) {
        return <Navigate to="/"/>;
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography component="h1" variant="h5">
                    Регистрация
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
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
                        label="Почта"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Имя"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Фамилия"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Телефон"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Повторите пароль"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                        sx={{mt: 3, mb: 2}}
                    >
                        Зарегистрироваться
                    </Button>
                    <Button
                        component={Link}
                        to="/logIn"
                        fullWidth
                        variant="outlined"
                        sx={{mb: 2}}
                    >
                        Войти
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default SignUp;