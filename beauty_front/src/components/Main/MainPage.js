import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Drawer,
    IconButton,
    Pagination,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import {ShoppingCart} from '@mui/icons-material';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import Cookies from 'js-cookie';
import {RichTreeView} from '@mui/x-tree-view/RichTreeView';


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
    const [openDel, setOpenDel] = useState(false);
    const [openNF, setOpenNF] = useState(false);


    const toggleDrawer = (newOpen) => () => {
        setOpenDrawer(newOpen);
    };

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


    const handleSearch = (event) => {
        event.preventDefault();
        console.log('Searching for:', searchTerm);

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
                item: it.Item_ID,
                // price: item.price,
                // count: quantity
            }, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            const updatedItem = {...it, amount: it.amount - 1};
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/items/${it.Item_ID}/`, updatedItem, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            handleClick()
        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };


    const removeFromCart = async (it) => {
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/remove_from_chart/`, {
                user: userResponse.data.id,
                item: it.Item_ID,
                // price: item.price,
                // count: quantity
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

            const updatedItem = {...it, amount: it.amount + 1};
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/items/${it.Item_ID}/`, updatedItem, {
                headers: {
                    Authorization: `JWT ${Cookies.get('token')}`
                }
            });

            handleOpenDel()
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/items/?price=&name=&category=${smallCats}&max_pr=&min_pr=&search= ${searchTerm}`);
                setItems(response.data);
            } catch (error) {
                console.error('Ошибка загрузки товаров:', error);
            }
        };

        fetchItems();
    }, [searchTerm, smallCats]);

    useEffect(() => {
        const fetchCats = async () => {
            try {

                const categoryResp = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get_categories/`);
                setCategories(categoryResp.data.categories);
                console.log(categories)

            } catch (error) {
                console.error('Ошибка загрузки категорий:', error);
            }
        };

        fetchCats();
    }, []);


    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (event, value) => {
        setPage(value);
    };


    return (
        <Box component="main" sx={{display: 'flex', flexDirection: 'column'}}>
            <Container
                sx={{flexGrow: 1, py: 3}}
                role="region"
                aria-labelledby="main-heading"
            >
                <Typography
                    variant="h4"
                    component="h1"
                    id="main-heading"
                    gutterBottom
                    sx={{fontFamily: 'Scada, sans-serif', fontWeight: '600', mt: 1, textAlign: 'center'}}
                >
                    Главная страница
                </Typography>

                <form
                    onSubmit={handleSearch}
                    role="search"
                    aria-label="Поиск товаров"
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px'}}
                >
                    <Button
                        onClick={toggleDrawer(true)}
                        variant="outlined"
                        size="small"
                        aria-label="Открыть фильтры"
                        aria-haspopup="dialog"
                    >
                        Фильтры
                        <FilterListOutlinedIcon aria-hidden="true"/>
                    </Button>

                    <Drawer
                        open={openDrawer}
                        onClose={toggleDrawer(false)}
                        role="dialog"
                        aria-labelledby="filter-heading"
                        aria-modal="true"
                    >
                        <Container sx={{display: 'flex', flexDirection: 'row', mt: 1}}>
                            <Typography
                                id="filter-heading"
                                gutterBottom
                                sx={{fontFamily: 'Scada, sans-serif', fontWeight: '500', mt: 1, mx: 3}}
                            >
                                Категории
                            </Typography>
                        </Container>
                        <RichTreeView
                            items={categories}
                            aria-label="Дерево категорий"
                            onItemClick={(event, itemId) => ((itemId > 999) ? setSmallCats(itemId) : (setSmallCats('')))}
                        />
                    </Drawer>

                    <TextField
                        variant="outlined"
                        size="small"
                        label="Поиск..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{backgroundColor: 'white', mx: 3}}
                        id="search-input"
                        aria-labelledby="search-label"
                    />
                    <Typography id="search-label" hidden>Поле поиска товаров</Typography>

                    <IconButton
                        color="inherit"
                        type="submit"
                        aria-label="Выполнить поиск"
                    >
                        <SearchIcon aria-hidden="true"/>
                    </IconButton>
                </form>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                        justifyContent: 'center',
                        mt: 3
                    }}
                    role="list"
                    aria-label="Список товаров"
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
                            role="listitem"
                            aria-labelledby={`item-${item.Item_ID}-title`}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.img || 'https://via.placeholder.com/300'}
                                alt={`Изображение товара: ${item.name}`}
                                aria-describedby={`item-${item.Item_ID}-desc`}
                            />
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    id={`item-${item.Item_ID}-title`}
                                    sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}
                                >
                                    {item.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                    id={`item-${item.Item_ID}-desc`}
                                    sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}
                                >
                                    {item.description}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="primary"
                                    gutterBottom
                                    aria-label={`Цена: ${item.price} долларов`}
                                    sx={{fontFamily: 'Scada, sans-serif', fontWeight: '400'}}
                                >
                                    ${item.price}
                                </Typography>
                            </CardContent>
                            <Box sx={{p: 2}}>
                                <Button
                                    component={Link}
                                    to={`/items/${item.Item_ID}`}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    aria-label={`Подробнее о товаре ${item.name}`}
                                >
                                    <Typography gutterBottom sx={{fontFamily: 'Scada, sans-serif', fontWeight: '500'}}>
                                        подробнее
                                    </Typography>
                                </Button>
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 2,
                                    gap: 2
                                }}
                                role="group"
                                aria-label="Управление корзиной"
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    value={item.Item_ID}
                                    onClick={() => removeFromCart(item)}
                                    aria-label={`Удалить ${item.name} из корзины`}
                                >
                                    -
                                </Button>
                                <Snackbar
                                    open={openDel}
                                    autoHideDuration={5000}
                                    onClose={handleCloseDel}
                                    message="Товар удалён из корзины"
                                    aria-live="polite"
                                />
                                <Snackbar
                                    open={openNF}
                                    autoHideDuration={5000}
                                    onClose={handleNotFound}
                                    message="Товар не найден в корзине"
                                    aria-live="assertive"
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    value={item.Item_ID}
                                    onClick={() => addToCart(item)}
                                    aria-label={`Добавить ${item.name} в корзину`}
                                >
                                    +
                                </Button>
                                <Snackbar
                                    open={open}
                                    autoHideDuration={5000}
                                    onClose={handleClose}
                                    message="Товар добавлен в корзину"
                                />
                                <IconButton
                                    color="inherit"
                                    sx={{ml: 2}}
                                    aria-label="Перейти в корзину"
                                >
                                    <ShoppingCart sx={{color: '#A8A8A8'}} aria-hidden="true"/>
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Box>

                <Box
                    sx={{mt: 4, display: 'flex', justifyContent: 'center'}}
                    role="navigation"
                    aria-label="Навигация по страницам"
                >
                    <Pagination
                        count={Math.ceil(items.length / itemsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="primary"
                        aria-label="Выбор страницы"
                    />
                </Box>
            </Container>
        </Box>
    );
}

export default MainPage;
