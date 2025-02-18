import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);

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
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Профиль пользователя</Typography>

            {userData && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6">Имя: {userData.first_name} {userData.last_name}</Typography>
                    <Typography variant="h6">Email: {userData.email}</Typography>
                    <Typography variant="h6">Телефон: {userData.tel}</Typography>
                </Box>
            )}

            <Typography variant="h5" gutterBottom>История заказов:</Typography>
            <List>
                {orders.map(order => (
                    <ListItem key={order.Order_ID}>
                        <ListItemText
                            primary={`Заказ #${order.Order_ID}`}
                            secondary={`Статус: ${order.status} | Сумма: ${order.total}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default ProfilePage;