import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button,   Card, CardContent, CardMedia, Snackbar} from '@mui/material';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Link} from 'react-router-dom';

function CartPage() {
    const {id} = useParams();
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);

    const handleClick = () => {
        setOpen(true);
        handleCloseDel()
    };

    const handleOpenDel = () => {
        setOpenDel(true);
        handleClose()
    };


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleCloseDel = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenDel(false);
    };


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
                console.log(cartItems)

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
    const addToCart = async (it) => {
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chart/`, {
                    user: userResponse.data.id,
                    // Chart_ID: 1,
                    // price: item.price,
                    // count: quantity
                }, {
                    headers: {
                        Authorization: `JWT ${Cookies.get('token')}`
                    }
                });
            
                // Обработка успешного ответа
                console.log('Chart created successfully:', response.data);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.user) {
                    // Проверка на наличие ошибки "chart with this user already exists"
                    console.error('Error:', error.response.data.user[0]);
                    // Здесь можно добавить логику, чтобы уведомить пользователя о существующем графике
                } else {
                    // Обработка других ошибок
                    console.error('An error occurred:', error.message);
                }
            }
            
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add_to_cart/`, {
                user: userResponse.data.id,
                item: id,
                // price: item.price,
                // count: quantity
            }, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            // const updatedItem = { ...item, amount: item.amount - quantity };
            // await axios.put(`${process.env.REACT_APP_API_BASE_URL}/items/${id}/`, updatedItem, {
            //     headers: {
            //         Authorization: `JWT ${Cookies.get('token')}`
            //     }
            // });
            // setItem(updatedItem);
            // handleClick()
        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };

const placeOrder = async () => {
    try {
        const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
            headers: {
                Authorization: `JWT ${Cookies.get('token')}`
            }
        });
        const number_of_order_my = parseInt(Date.now() / 1000000).toFixed();

        // Создание заказа
        const orderResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/orders/`, {
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
            headers: {
                Authorization: `JWT ${Cookies.get('token')}`
            }
        });

        // Добавление элементов заказа
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/make_order/`, {
            order: number_of_order_my,
            items: cartItems,
            user: userResponse.data.id
        }, {
            headers: {
                Authorization: `JWT ${Cookies.get('token')}`
            }
        });

        console.log('Order placed successfully!');

    } catch (error) {
        console.error('Error placing the order:', error);
    }
    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/chart/${cartItems[0].chart_id}/`, {
        headers: {
            Authorization: `JWT ${Cookies.get('token')}`
        }
    });

    setCartItems([]);
};

    
    return (
        <Container>
            <Typography variant="h4" gutterBottom>Корзина</Typography>
            {cartItems.map((cartItem, index) => {
                const itemInfo = getItemInfo(cartItem.item_name) || {}; // Убедитесь, что itemInfo является объектом
                return (
                    <Card key={index} sx={{display: 'flex', mt: 2, width: '60%'}}>
                        <CardMedia
                            component="img"
                            sx={{width: 120, height: 100, objectFit: 'cover', marginLeft: 2}}
                            image={itemInfo.img || 'https://via.placeholder.com/300'}
                            alt={itemInfo.name}
                        />
                        <Button variant="contained" color="primary" size="small" onClick={handleOpenDel}
                                sx={{marginLeft: 20, height: '30px', width: '30px', mt: 4}}>
                            -
                        </Button>
                        <Snackbar
                            open={openDel}
                            autoHideDuration={5000}
                            onClose={handleCloseDel}
                            message="Товар удалён из корзины"
                        />
                        <Typography gutterBottom sx={{
                            fontFamily: 'Scada, sans-serif',
                            fontWeight: '400',
                            marginLeft: 4,
                            color: '#A8A8A8',
                            mt: 4
                        }}>
                            {cartItem.item_count}
                        </Typography>
                        <Button variant="contained" color="primary" size="small" onClick={handleClick}
                                sx={{marginLeft: 4, height: '30px', width: '30px', mt: 4}}>
                            +
                        </Button>
                        <Snackbar
                            open={open}
                            autoHideDuration={5000}
                            onClose={handleClose}
                            message="Товар добавлен в корзину"
                        />
                        <CardContent sx={{
                            display: 'flex',
                            mt: 3,
                            fontFamily: 'Scada, sans-serif',
                            fontWeight: '400',
                            paddingLeft: 10
                        }}> {/* Добавлен отступ слева для CardContent */}
                            <Typography component="div" variant="h6"
                                        sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400', mt: -1}}>
                                {` ${itemInfo.price || 'N/A'} $`}
                            </Typography>
                        </CardContent>
                    </Card>
                );
            })}

            <Box sx={{mt: 3}}>
                <Typography variant="h6" sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
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