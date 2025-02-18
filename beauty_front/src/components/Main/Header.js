import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import { AccountCircle, ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function Header({ onLogout, cartCount }) {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                        Интернет-магазин
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

                <Button color="inherit" onClick={onLogout}>
                    Выйти
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;