import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import { AccountCircle, ShoppingCart } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Header({ cartCount }) {
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
        <AppBar position="sticky">
            <Toolbar>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{ flexGrow: 1, fontFamily: 'Pattaya, sans-serif', fontWeight: '500' }}
                >
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                        Beauty 4U
                    </Link>
                </Typography>

                <IconButton color="inherit" component={Link} to="/profile">
                    <AccountCircle />
                </IconButton>

                <IconButton color="inherit" component={Link} to="/cart">
                    <Badge badgeContent={cartCount} color="secondary">
                        <ShoppingCart />
                    </Badge>
                </IconButton>

                {isAuthenticated ? (
                    <Button color="inherit" component={Link} to="/" onClick={handleLogout} >
                        выход
                    </Button>
                ) : (
                    <Button color="inherit" component={Link} to="/login">
                        авторизация
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
