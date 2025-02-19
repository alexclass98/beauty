import React, {useEffect, useState} from 'react';
import {Container, Typography, Box, Button, List, ListItem, ListItemText} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Link} from 'react-router-dom';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chart/`, {
                    headers: {
                        Authorization: `JWT ${Cookies.get('token')}`
                    }
                });
                setCartItems(response.data);
            } catch (error) {
                console.error('Ошибка загрузки корзины:', error);
            }
        };

        fetchCart();
    }, []);

    const handleCheckout = async () => {
        try {
            // Получаем данные текущего пользователя
            const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });

            const orderResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/orders/`, {
                items: cartItems.map(item => item.product),
                total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                auth_user: userResponse.data.id,
                address: "Адрес доставки",
                status: "В обработке",
                number_of_order: `ORDER-${Date.now()}`,
                date_of_delivery:  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                date_made: new Date().toISOString().split('T')[0],
                delivery_mode: "Стандартная доставка",
                chart_id: cartItems.map(item => item.Chart_ID)
            }, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });

            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/chart/`, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });

            // Очищаем состояние корзины
            setCartItems([]);

            alert('Заказ успешно оформлен!');
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            alert('Ошибка при оформлении заказа. Проверьте консоль для подробностей.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Корзина</Typography>

            <List>
                {cartItems.map(item => (
                    <ListItem key={item.Chart_ID}>
                        <ListItemText
                            primary={item.product.name}
                            secondary={`Количество: ${item.quantity} | Цена: ${item.price}`}
                        />
                    </ListItem>
                ))}
            </List>

            <Box sx={{mt: 3}}>
                <Typography variant="h6">
                    Итого: {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)} руб.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                >
                    Оформить заказ
                </Button>

                <Button
                    component={Link}
                    to="/"
                    variant="outlined"
                    sx={{ml: 2}}
                >
                    Продолжить покупки
                </Button>
            </Box>
        </Container>
    );
}

export default CartPage;