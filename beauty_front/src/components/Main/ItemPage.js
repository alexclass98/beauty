import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Container, Typography, Box, Card, CardContent, CardMedia, Button} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

function ItemPage() {
    const {id} = useParams();
    const [item, setItem] = useState(null);
    const [chartItems, setChartItems] = useState([]);
    const [quantity, setQuantity] = useState(1);



    const addToCart = async () => {
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chart/`, {
                    user: userResponse.data.id,
                    Chart_ID: 1,
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
            const updatedItem = { ...item, amount: item.amount - quantity };
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/items/${id}/`, updatedItem, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            setItem(updatedItem);
            alert('Товар добавлен в корзину!');
        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };
   const removeFromCart = async () => {
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/remove_from_chart/`, {
                user: userResponse.data.id,
                item: id,
                // price: item.price,
                // count: quantity
            }, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            const updatedItem = { ...item, amount: item.amount + quantity };
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/items/${id}/`, updatedItem, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            setItem(updatedItem);
            alert('Товар удалён из корзины!');
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    };

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/items/${id}/`);
                setItem(response.data);
            } catch (error) {
                console.error('Ошибка загрузки товаров:', error);
            }
        };

        fetchItem();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chart_items/`);
                setChartItems((response.data).filter((it=> it.item.toString()=== item.Item_ID)));
            } catch (error) {
                console.error('Ошибка загрузки товаров:', error);
            }
        };

        fetchItems();
    }, []);



    if (!item) {
        return <Typography>Загрузка...</Typography>;
    }

    else return (
        <Container>
            <Box sx={{marginTop: 4}}>
                <Card>
                    <CardMedia
                        component="img"
                        height="300"
                        image={item.img || 'https://via.placeholder.com/300'}
                        alt={item.name}
                    />
                    <CardContent>
                        <Typography variant="h4" component="h1" sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
                            {item.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
                            {item.description}
                        </Typography>
                        <Typography variant="h5" color="primary" sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
                            ${item.price}
                        </Typography>
                        <Typography variant="body2" sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
                            Количество: {item.amount}
                        </Typography>
                        <Button variant="contained" color="primary"
                                onClick={addToCart} sx={{mt: 2}}>
                            Добавить в корзину
                        </Button>
                        <Typography variant="body2" sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
                           {console.log(chartItems.filter(i => i.item.toString()===item.Item_ID).count)}
                           {console.log(chartItems)}
                        </Typography>
                        
                        <Button variant="contained" color="primary"
                                onClick={removeFromCart} sx={{mt: 2}}>
                            -
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default ItemPage;