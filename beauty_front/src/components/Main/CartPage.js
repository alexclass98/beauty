import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                    headers: {
                        Authorization: `JWT ${Cookies.get('token')}`
                    }
                });
                setUser(userResponse.data);

                const cartResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chart_summary/`, {
                    headers: {
                        Authorization: `JWT ${Cookies.get('token')}`
                    }
                });

                console.log('Cart Response:', cartResponse.data);

                const userCart = cartResponse.data[userResponse.data.id] || [];
                console.log('User Cart:', userCart);

                setCartItems(userCart);

                const itemsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/items/`, {
                    headers: {
                        Authorization: `JWT ${Cookies.get('token')}`
                    }
                });
                setItems(itemsResponse.data);

            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        fetchData();
    }, []);

    const getItemInfo = (itemName) => {
        return items.find(item => item.name === itemName);
    };

    const handleCheckout = async () => {
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });

            const orderResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/orders/`, {
                items: cartItems.map(item => item.item_name), // Используем item_name
                total: cartItems.reduce((sum, item) => {
                    const itemInfo = getItemInfo(item.item_name);
                    return sum + (itemInfo ? itemInfo.price * item.item_count : 0);
                }, 0),
                auth_user: userResponse.data.id,
                address: "Адрес доставки",
                status: "В обработке",
                number_of_order: `ORDER-${Date.now()}`,
                date_of_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                date_made: new Date().toISOString().split('T')[0],
                delivery_mode: "Стандартная доставка",
                chart_id: cartItems.map(item => item.Chart_ID) // Если есть Chart_ID
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
                {cartItems.map((cartItem, index) => {
                    const itemInfo = getItemInfo(cartItem.item_name); // Ищем товар по item_name
                    return (
                        <ListItem key={index}>
                            <ListItemText
                                primary={itemInfo ? itemInfo.name : 'Товар не найден'}
                                secondary={`Количество: ${cartItem.item_count}, Цена: ${itemInfo ? itemInfo.price : 'N/A'} руб.`}
                            />
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h6">
                    Итого: {cartItems.reduce((sum, item) => {
                    const itemInfo = getItemInfo(item.item_name);
                    return sum + (itemInfo ? itemInfo.price * item.item_count : 0);
                }, 0)} руб.
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
                    sx={{ ml: 2 }}
                >
                    Продолжить покупки
                </Button>
            </Box>
        </Container>
    );
}

export default CartPage;