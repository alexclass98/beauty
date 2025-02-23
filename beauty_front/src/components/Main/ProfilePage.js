import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Card, CardContent, Button } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import {useParams} from 'react-router-dom';

function ProfilePage() {
    const {id} = useParams();
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [fullOrders, setFullOrders] = useState([]);
    const [openOrder, setOpenOrder] = useState({});

    const handleClick = (id) => {
        setOpenOrder((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                    headers: {
                        Authorization: `JWT ${Cookies.get('token')}`
                    }
                });
                setUserData(userResponse.data);

                const ordersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders/`, {
                    headers: {
                        Authorization: `JWT ${Cookies.get('token')}`
                    }
                });
                setOrders(ordersResponse.data);
                const ordersFullResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/order_summary/`, {
                    headers: {
                        Authorization: `JWT ${Cookies.get('token')}`
                    }
                });
                setFullOrders(ordersFullResponse.data);
                console.log(fullOrders)
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '500'}}>Профиль пользователя</Typography>

            {userData && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>Ник: {userData.username} </Typography>
                    <Typography variant="h6" sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>Email: {userData.email}</Typography>
                    
                </Box>
            )}

            <Typography variant="h5" gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '500'}}>История заказов:</Typography>
            <List>
                {orders.map(order => (
                    <ListItem key={order.Order_ID}>
                        <Card sx={{display: 'flex', mt: 1, width: '90%', flexDirection: 'column'}}>
                            <CardContent sx={{display: 'flex'}}>
                                <Typography sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400', mt: 1, mx:4}}>
                                    Заказ #{order.number_of_order}
                                </Typography>  
                                <Typography sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400', mt: 1, mx:4}}>
                                    Статус: {order.status} 
                                </Typography>  
                                <Typography sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400', mt: 1, mx:4}}>
                                Сумма: {order.total}
                                </Typography>  
                                <Button variant="contained" color="primary" size="small" type="button" sx={{marginLeft: 4, height: '30px', width: '70px', mt: 1, marginRight: '10px'}} onClick={() => handleClick(order.Order_ID)}>
                                детали
                                </Button>
                            </CardContent>
                            <CardContent sx={{display: 'block'}}>
                                {openOrder[order.Order_ID] === true ? (
                                 <>
                                {Object.values(fullOrders).map((orderItems, index) => (
                                    orderItems.filter(orderItem=>orderItem.order_id===order.Order_ID).map((orderItem, itemIndex) => (
                                        <div key={itemIndex}>
                                            <Typography sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400', mt: 1, mx: 4}}>
                                            №{itemIndex+1} - {orderItem.item_name} - {orderItem.item_count} шт.
                                            </Typography> 
                                    </div>
                                    ))
                                ))}
                                 </>
                                    
                                ) : null}
                            </CardContent>
                        </Card>

                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default ProfilePage;