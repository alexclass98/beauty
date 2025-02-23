import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {useParams} from 'react-router-dom';
import { Button, Container, Typography, Box, Card, CardContent, CardMedia, Pagination, IconButton, Snackbar,TextField, Drawer } from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import {  ShoppingCart } from '@mui/icons-material';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import Cookies from 'js-cookie';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';


function MainPage() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6; // Specify how many items per page
    const [open, setOpen] = useState(false);
    const {id} = useParams();
    const [item, setItem] = useState(null);
    const [chartItems, setChartItems] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [smallCats, setSmallCats] = useState([]);
    const [bigCats, setBigCats] = useState([]);
    const [categories, setCategories] = useState([]);

    const toggleDrawer = (newOpen) => () => {
        setOpenDrawer(newOpen);
    };
    
    const handleClick = () => {
        setOpen(true);
      };
    
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };
    const handleSearch = (event) => {
        event.preventDefault();
        console.log('Searching for:', searchTerm);
        
    };

    const addToCart = async (Item_ID) => {
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
                item: Item_ID,
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


   const removeFromCart = async Item_ID => {
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/remove_from_chart/`, {
                user: userResponse.data.id,
                item: Item_ID,
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
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/items/?price=&name=&category=&max_pr=&min_pr=&search= ${searchTerm}`);
                setItems(response.data);
            } catch (error) {
                console.error('Ошибка загрузки товаров:', error);
            }
        };

        fetchItems();
    }, [searchTerm]);

    useEffect(() => {
        const fetchCats= async () => {
            try {
                // const bigCatsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/big_cat/`);
                // setBigCats(bigCatsResponse.data);
                // const smallCatsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/small_cat/`);
                // setSmallCats(smallCatsResponse.data);
                const categoryResp = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get_categories/`);
                setCategories(categoryResp.data);
                console.log(categories)
            } catch (error) {
                console.error('Ошибка загрузки категорий:', error);
            }
        };

        fetchCats();
    }, []);

    // const renderTree = (nodes) => (
    //     <TreeItem key={nodes.big_cat} nodeId={nodes.id} label={nodes.big_cat}>
    //         {Array.isArray(nodes.small_cats) ? nodes.small_cats.map((child, index) => (
    //             <TreeItem key={`${nodes.big_cat}-${index}`} nodeId={`${nodes.big_cat}-${index}`} label={child.name} />
    //         )) : null}
    //     </TreeItem>
    // );
    

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Container sx={{ flexGrow: 1, py: 3,  }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '600', mt:1}}>
                    Главная страница
                    </Typography>
                    <Button onClick={toggleDrawer(true)} variant="outlined" size="small">Фильтры <FilterListOutlinedIcon/></Button>
                        <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
                            <Container sx={{display: 'flex', flexDirection: 'row'}}>
                                <Typography  gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400', mt:2,}}>
                                    Цена от:
                                </Typography>
                            <TextField id="filled-basic" label="Filled" variant="filled" />
                                <Typography  gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400', mt:2}}>
                                    до:
                                </Typography>
                            <TextField id="filled-basic" label="Filled" variant="filled" />
                            </Container>
                            <Typography  gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '500', mt:1, mx:3}}>
                                    Категории
                            </Typography>
                            <SimpleTreeView >
                                {/* {Object.values(cats).map((category, index) => renderTree(category, index))} */}
                            </SimpleTreeView>
                        </Drawer>
                    <TextField
                        variant="outlined"
                        size="small"
                        label="Поиск..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ backgroundColor: 'white', mx:3 }}
                    />
                    <IconButton color="inherit" type="submit">
                        <SearchIcon />
                    </IconButton>
                </form>               
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                        justifyContent: 'center',
                        mt:3
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
                                <Button variant="contained" color="primary" value= {item.Item_ID} onClick={(e) => removeFromCart(e.currentTarget.value)}>
                                    -
                                </Button>
                                <Typography gutterBottom sx={{ fontFamily: 'Scada, sans-serif', fontWeight: '400', mx: 2 , color: '#A8A8A8',}}>
                                   
                                </Typography>
                                <Button variant="contained" color="primary" value= {item.Item_ID} onClick={(e) => addToCart(e.currentTarget.value)}>
                                    +
                                </Button>
                                <Snackbar
                                    open={open}
                                    autoHideDuration={5000}
                                    onClose={handleClose}
                                    message="Товар добавлен в корзину"
                                />
                                <IconButton color="inherit" sx={{ ml: 2, }}>
                                    <ShoppingCart sx={{ color: '#A8A8A8' }} /> 
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
