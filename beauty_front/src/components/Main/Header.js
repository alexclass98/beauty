import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AccountCircle, ShoppingCart } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Header({ cartCount }) {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    const handleSearch = (event) => {
        event.preventDefault();
        // Логика поиска
        console.log('Searching for:', searchTerm);
        // Здесь можно добавить логику для перенаправления на страницу результатов поиска
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

                <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        label="Поиск..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ backgroundColor: 'white' }}
                    />
                    <IconButton color="inherit" type="submit">
                        <SearchIcon />
                    </IconButton>
                </form>

                <IconButton color="inherit" component={Link} to="/profile">
                    <AccountCircle />
                </IconButton>

                <IconButton color="inherit" component={Link} to="/cart">
                    <Badge badgeContent={cartCount} color="secondary">
                        <ShoppingCart />
                    </Badge>
                </IconButton>

                <Button color="inherit" onClick={handleLogout}>
                    Авторизация
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
