import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, Card, CardContent, CardMedia } from '@mui/material';
import Cookies from 'js-cookie';
import Header from './Header';
import { useEffect, useState } from 'react';
import axios from 'axios';

function MainPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/items/`);
                setItems(response.data);
            } catch (error) {
                console.error('Ошибка загрузки товаров:', error);
            }
        };

        fetchItems();
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Container sx={{ flexGrow: 1, py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Главная страница
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                        justifyContent: 'center',
                    }}
                >
                    {items.map((item) => (
                        <Card
                            key={item.Item_ID}
                            sx={{
                                width: 300,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.img || 'https://via.placeholder.com/300'}
                                alt={item.name}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {item.description}
                                </Typography>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    ${item.price}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2 }}>
                                <Button
                                    component={Link}
                                    to={`/item/${item.Item_ID}`}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Подробнее
                                </Button>
                            </Box>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}

export default MainPage;