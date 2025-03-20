import React, {useEffect, useState} from 'react';
import {Container, Typography, Box, Button, Card, CardContent, CardMedia, Snackbar} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Link} from 'react-router-dom';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [update, setUpdate] = useState(false);
    const [topItems, setTopItems] = useState([]);

    const handleClick = () => {
        setOpen(true);
        handleCloseDel();
    };

    const handleOpenDel = () => {
        setOpenDel(true);
        handleClose();
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const handleCloseDel = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenDel(false);
    };

    const fetchPopularItems = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/order_items/`);
            const orderItems = response.data;

            const itemCounts = orderItems.reduce((acc, item) => {
                acc[item.item] = (acc[item.item] || 0) + 1;
                return acc;
            }, {});

            const popularItemIds = Object.entries(itemCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([id]) => parseInt(id));

            const popularItems = popularItemIds
                .map(id => items.find(item => item.Item_ID === id))
                .filter(Boolean);

            setTopItems(popularItems);
        } catch (error) {
            console.error('Ошибка загрузки популярных товаров:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                    headers: {Authorization: `JWT ${Cookies.get('token')}`}
                });
                setUser(userResponse.data);

                const cartResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chart_summary/`, {
                    headers: {Authorization: `JWT ${Cookies.get('token')}`}
                });

                const userCart = cartResponse.data[userResponse.data.id] || [];
                setCartItems(userCart);

                const itemsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/items/`, {
                    headers: {Authorization: `JWT ${Cookies.get('token')}`}
                });
                setItems(itemsResponse.data);

                await fetchPopularItems();
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };
        fetchData();
    }, [update]);

    const getItemInfo = (itemName) => items.find(item => item.name === itemName);

    const addToCart = async (it) => {
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                headers: {Authorization: `JWT ${Cookies.get('token')}`}
            });

            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add_to_cart/`, {
                user: userResponse.data.id,
                item: it.Item_ID,
            }, {
                headers: {Authorization: `JWT ${Cookies.get('token')}`}
            });

            const updatedItem = {...it, amount: it.amount - 1};
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/items/${it.Item_ID}/`, updatedItem, {
                headers: {Authorization: `JWT ${Cookies.get('token')}`}
            });

            handleClick();
            setUpdate(!update);
        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };

    const removeFromCart = async (it) => {
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                headers: {Authorization: `JWT ${Cookies.get('token')}`}
            });

            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/remove_from_chart/`, {
                user: userResponse.data.id,
                item: it.Item_ID,
            }, {
                headers: {Authorization: `JWT ${Cookies.get('token')}`}
            });

            if (response.data.status === "Item not found in the chart.") return;

            const updatedItem = {...it, amount: it.amount + 1};
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/items/${it.Item_ID}/`, updatedItem, {
                headers: {Authorization: `JWT ${Cookies.get('token')}`}
            });

            setUpdate(!update);
            handleOpenDel();
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    };

    const placeOrder = async () => {
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                headers: {Authorization: `JWT ${Cookies.get('token')}`}
            });

            const number_of_order_my = parseInt(Date.now() / 1000000).toFixed();

            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/orders/`, {
                user: userResponse.data.id,
                address: "Адрес доставки",
                status: "В обработке",
                number_of_order: number_of_order_my,
                date_of_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                date_made: new Date().toISOString().split('T')[0],
                delivery_mode: "Стандартная доставка",
                total: cartItems.reduce((sum, item) => {
                    const itemInfo = getItemInfo(item.item_name);
                    return sum + (itemInfo ? itemInfo.price * item.item_count : 0);
                }, 0)
            }, {
                headers: {Authorization: `JWT ${Cookies.get('token')}`}
            });

            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/make_order/`, {
                order: number_of_order_my,
                items: cartItems,
                user: userResponse.data.id
            }, {
                headers: {Authorization: `JWT ${Cookies.get('token')}`}
            });

            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/chart/${cartItems[0].chart_id}/`, {
                headers: {Authorization: `JWT ${Cookies.get('token')}`}
            });

            setCartItems([]);
        } catch (error) {
            console.error('Error placing the order:', error);
        }
    };

    return (
        <Container component="main" role="region" aria-labelledby="cart-heading">
            <Typography variant="h4" gutterBottom id="cart-heading" role="heading" aria-level="1">
                Корзина
            </Typography>

            <Box role="list" aria-label="Список товаров в корзине">
                {cartItems.sort((a, b) => a.item_name.localeCompare(b.item_name)).map((cartItem, index) => {
                    const itemInfo = getItemInfo(cartItem.item_name) || {};
                    return (
                        <Card key={index} sx={{display: 'flex', mt: 2, width: '60%'}} role="listitem"
                              aria-labelledby={`item-${index}-name`}>
                            <CardMedia
                                component="img"
                                sx={{width: 120, height: 100, objectFit: 'cover', marginLeft: 2}}
                                image={itemInfo.img || 'https://via.placeholder.com/300'}
                                alt={`Изображение товара: ${itemInfo.name}`}
                                aria-describedby={`item-${index}-desc`}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => removeFromCart(itemInfo)}
                                sx={{marginLeft: 20, height: '30px', width: '30px', mt: 4}}
                                aria-label={`Удалить один ${itemInfo.name} из корзины`}
                            >
                                -
                            </Button>

                            <Snackbar
                                open={openDel}
                                autoHideDuration={5000}
                                onClose={handleCloseDel}
                                message="Товар удалён из корзины"
                                role="alert"
                                aria-live="assertive"
                            />

                            <Typography
                                gutterBottom
                                sx={{
                                    fontFamily: 'Scada, sans-serif',
                                    fontWeight: '400',
                                    marginLeft: 4,
                                    color: '#A8A8A8',
                                    mt: 4
                                }}
                                aria-label="Количество товара"
                                aria-live="polite"
                            >
                                {cartItem.item_count}
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => addToCart(itemInfo)}
                                sx={{marginLeft: 4, height: '30px', width: '30px', mt: 4}}
                                aria-label={`Добавить один ${itemInfo.name} в корзину`}
                            >
                                +
                            </Button>

                            <Snackbar
                                open={open}
                                autoHideDuration={5000}
                                onClose={handleClose}
                                message="Товар добавлен в корзину"
                                role="status"
                                aria-live="polite"
                            />

                            <CardContent sx={{
                                display: 'flex',
                                mt: 3,
                                fontFamily: 'Scada, sans-serif',
                                fontWeight: '400',
                                paddingLeft: 10
                            }}>
                                <Typography
                                    component="div"
                                    variant="h6"
                                    sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400', mt: -1}}
                                    id={`item-${index}-desc`}
                                    aria-label={`Цена: ${itemInfo.price || 'недоступно'} долларов`}
                                >
                                    {` ${itemInfo.price || 'N/A'} $`}
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            {topItems.length > 0 && (
                <Box sx={{mt: 4}} role="region" aria-labelledby="recommendations-heading">
                    <Typography variant="h5" id="recommendations-heading"
                                sx={{fontFamily: 'Scada, sans-serif', fontWeight: '500', mb: 2}}>
                        Часто покупают вместе:
                    </Typography>

                    <Box sx={{display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center'}} role="list"
                         aria-label="Рекомендуемые товары">
                        {topItems.map((item) => (
                            <Card key={item.Item_ID} sx={{width: 300}} role="listitem"
                                  aria-labelledby={`recommended-${item.Item_ID}-title`}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={item.img || 'https://via.placeholder.com/300'}
                                    alt={`Изображение товара: ${item.name}`}
                                    aria-describedby={`recommended-${item.Item_ID}-desc`}
                                />
                                <CardContent>
                                    <Typography variant="h6" id={`recommended-${item.Item_ID}-title`}
                                                sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary"
                                                id={`recommended-${item.Item_ID}-desc`}
                                                sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
                                        {item.description}
                                    </Typography>
                                    <Typography variant="h6" sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}
                                                aria-label={`Цена: ${item.price} долларов`}>
                                        ${item.price}
                                    </Typography>
                                </CardContent>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => addToCart(item)}
                                    aria-label={`Добавить ${item.name} в корзину`}
                                    sx={{mb: 2}}
                                >
                                    Добавить в корзину
                                </Button>
                            </Card>
                        ))}
                    </Box>
                </Box>
            )}

            <Box sx={{mt: 3}} role="region" aria-label="Итоговая информация">
                <Typography
                    variant="h6"
                    sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}
                    aria-live="polite"
                    aria-atomic="true"
                >
                    Итого: {cartItems.reduce((sum, item) => {
                    const itemInfo = getItemInfo(item.item_name);
                    return sum + (itemInfo ? itemInfo.price * item.item_count : 0);
                }, 0)} $
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={placeOrder}
                    disabled={cartItems.length === 0}
                    aria-disabled={cartItems.length === 0}
                    aria-label={cartItems.length === 0 ? "Нет товаров для оформления заказа" : "Оформить заказ"}
                >
                    Оформить заказ
                </Button>

                <Button
                    component={Link}
                    to="/"
                    variant="outlined"
                    sx={{ml: 2}}
                    aria-label="Продолжить покупки"
                >
                    Продолжить покупки
                </Button>
            </Box>
        </Container>
    );
}

export default CartPage;