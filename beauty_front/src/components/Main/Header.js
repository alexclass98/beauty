import React, {useState, useEffect} from 'react';
import {AppBar, Toolbar, Typography, Button, IconButton, Badge} from '@mui/material';
import {AccountCircle, ShoppingCart} from '@mui/icons-material';
import {Link, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';

function Header({cartCount}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsAuthenticated(!!Cookies.get('token'));
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AppBar
            position="sticky"
            role="navigation"
            aria-label="Основная навигация"
        >
            <Toolbar>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{flexGrow: 1, fontFamily: 'Pattaya, sans-serif', fontWeight: '500'}}
                    aria-label="Логотип сайта"
                >
                    <Link
                        to="/"
                        style={{color: 'white', textDecoration: 'none'}}
                        aria-label="Перейти на главную страницу"
                    >
                        Beauty 4U
                    </Link>
                </Typography>

                <IconButton
                    color="inherit"
                    component={Link}
                    to="/profile"
                    aria-label="Личный кабинет"
                >
                    <AccountCircle aria-hidden="true"/>
                </IconButton>

                <IconButton
                    color="inherit"
                    component={Link}
                    to="/cart"
                    aria-label="Корзина покупок"
                    aria-describedby="cart-badge"
                >
                    <Badge
                        badgeContent={cartCount}
                        color="secondary"
                        aria-label={`Товаров в корзине: ${cartCount}`}
                        id="cart-badge"
                    >
                        <ShoppingCart aria-hidden="true"/>
                    </Badge>
                </IconButton>

                {isAuthenticated ? (
                    <Button
                        color="inherit"
                        component={Link}
                        to="/"
                        onClick={handleLogout}
                        aria-label="Выйти из системы"
                    >
                        выход
                    </Button>
                ) : (
                    <Button
                        color="inherit"
                        component={Link}
                        to="/login"
                        aria-label="Авторизация на сайте"
                    >
                        авторизация
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
