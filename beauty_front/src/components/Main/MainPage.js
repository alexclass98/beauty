import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Box, Card, CardContent, CardMedia, Pagination, IconButton, Snackbar } from '@mui/material';
import axios from 'axios';
import { AccountCircle, ShoppingCart } from '@mui/icons-material';

function MainPage() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6; // Specify how many items per page
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };
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

    // Calculate current items for the current page
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Container sx={{ flexGrow: 1, py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '600'}}>
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
                    {currentItems.map((item) => (
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
                            <CardContent >
                                <Typography variant="h6" gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
                                    {item.description}
                                </Typography>
                                <Typography variant="h6" color="primary" gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}>
                                    ${item.price}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2 }}>
                            
                                <Button
                                    component={Link}
                                    to={`/items/${item.Item_ID}`}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                ><Typography gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '500'}}>
                                    подробнее
                                    </Typography>
                                    
                                </Button>
                            </Box>
                            <Box  sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', 
                                marginBottom: 2, 
                                
                            }}>
                                <Button variant="contained" color="primary" onClick={handleClick}>
                                    -
                                </Button>
                                <Snackbar
                                    open={open}
                                    autoHideDuration={5000}
                                    onClose={handleClose}
                                    message="Товар удалён корзину"
                                />
                                <Typography gutterBottom sx={{ fontFamily: 'Scada, sans-serif', fontWeight: '400', mx: 2 , color: '#A8A8A8',}}>
                                   кол-во
                                </Typography>
                                <Button variant="contained" color="primary" onClick={handleClick}>
                                    +
                                </Button>
                                <Snackbar
                                    open={open}
                                    autoHideDuration={5000}
                                    onClose={handleClose}
                                    message="Товар добавлен в корзину"
                                />
                                <IconButton color="inherit" sx={{ ml: 2, }}>
                                    <ShoppingCart sx={{ color: '#A8A8A8' }} /> {/* Фиолетовый цвет */}
                                </IconButton>

                            </Box>

                        </Card>
                    ))}
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={Math.ceil(items.length / itemsPerPage)} // Calculate the number of pages
                        page={page}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="primary"
                    />
                </Box>
            </Container>
        </Box>
    );
}

export default MainPage;
