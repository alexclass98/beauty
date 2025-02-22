import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import { AccountCircle, ShoppingCart } from '@mui/icons-material';
import {Link, useNavigate,} from 'react-router-dom';
import Cookies from 'js-cookie';

function Header({ cartCount }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{ flexGrow: 1, fontFamily: 'Pattaya, sans-serif', fontWeight: '500' }} // Измените здесь
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

                <Button color="inherit" onClick={handleLogout}>
                    Выйти
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;