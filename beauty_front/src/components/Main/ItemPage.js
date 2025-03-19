import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Container, Typography, Box, Card, CardContent, CardMedia, Button, Snackbar} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

function ItemPage() {
    const {id} = useParams();
    const [item, setItem] = useState(null);
    const [chartItems, setChartItems] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [quantity, setQuantity] = useState(1);
    const [openDel, setOpenDel] = useState(false);
    const [openNF, setOpenNF] = useState(false);
    
    const handleClick = () => {
        setOpen(true);
        handleCloseDel()
    };

    const handleOpenDel = () => {
        setOpenDel(true);
        handleClose()
    };

    const handleOpenNF = () => {
        setOpenNF(true);
        handleNotFound()
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setOpenNF(false)
    };

    const handleCloseDel = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenDel(false);
        setOpenNF(false)
    };

    
    const handleNotFound = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenDel(false);
        setOpen(false);
    };

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
            const updatedItem = { ...item, amount: item.amount - quantity };
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/items/${id}/`, updatedItem, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            setItem(updatedItem);
            handleClick()
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
            
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/remove_from_chart/`, {
                user: userResponse.data.id,
                item: id,
            }, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            
            if (response.data.status === "Item not found in the chart.") {
                console.warn("Item not found in the chart. Skipping update.");
                handleOpenNF()
                return;
            }
            
            const updatedItem = { ...item, amount: item.amount + quantity };
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/items/${id}/`, updatedItem, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            
            setItem(updatedItem);
            handleOpenDel();
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
                         <Box  sx={{
                                                        p: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'left', 
                                                        marginBottom: 2, 
                                                        
                                                    }}>
                        <Button variant="contained" color="primary"
                                onClick={addToCart} sx={{mt: 2}}>
                            Добавить в корзину
                        </Button>
                        <Snackbar
                                open={open}
                                autoHideDuration={5000}
                                onClose={handleClose}
                                message="Товар добавлен в корзину" />
                        <Typography variant="body2" sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
                           {console.log(chartItems.filter(i => i.item.toString()===item.Item_ID).count)}
                           {console.log(chartItems)}
                        </Typography>
                        <Button variant="contained" color="primary"
                                onClick={removeFromCart} sx={{mt: 2, mx: 2}}>
                            -
                        </Button>
                         <Snackbar
                                open={openDel}
                                autoHideDuration={5000}
                                onClose={handleCloseDel}
                                message="Товар удалён из корзины"/>
                         <Snackbar
                            open={openNF}
                            autoHideDuration={5000}
                            onClose={handleNotFound}
                            message="Товар не найден в корзине"/>
                    </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default ItemPage;