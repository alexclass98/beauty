import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, CardMedia, Button } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

function ItemPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const addToCart = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chart/`, {
                product: id,
                quantity: quantity
            }, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            alert('Товар добавлен в корзину!');
        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/items/${id}/`);
                setItem(response.data);
            } catch (error) {
                console.error('Ошибка загрузки товара:', error);
            }
        };

        fetchItem();
    }, [id]);

    if (!item) {
        return <Typography>Загрузка...</Typography>;
    }

    return (
        <Container>
            <Box sx={{ marginTop: 4 }}>
                <Card>
                    <CardMedia
                        component="img"
                        height="300"
                        image={item.img || 'https://via.placeholder.com/300'}
                        alt={item.name}
                    />
                    <CardContent>
                        <Typography variant="h4" component="h1">
                            {item.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {item.description}
                        </Typography>
                        <Typography variant="h5" color="primary">
                            ${item.price}
                        </Typography>
                        <Typography variant="body2">
                            Количество: {item.amount}
                        </Typography>
                        <Button variant="contained" color="primary"
                                onClick={addToCart} sx={{ mt: 2 }}>
                            Добавить в корзину
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default ItemPage;