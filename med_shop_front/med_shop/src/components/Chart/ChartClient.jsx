import React from 'react';
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {
    PlusOutlined,
    MinusOutlined,
    InboxOutlined,
    UserOutlined,
    LogoutOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {Typography, Card} from 'antd';
import {InputNumber, Select, Space, Input, Layout, Menu, theme} from 'antd';
import {Avatar, Button, List,} from 'antd';
import {useDispatch, useSelector} from 'react-redux'
import {ADD_TO_CHART, REMOVE_FROM_CHART, DELETE_FROM_CHART} from "../ChartRedux/actions";
import {ADD_USER} from "../AuthRedux/actions";
import axios from "axios";

const {Search} = Input;
//import { ADD_TO_CHART, REMOVE_FROM_CHART} from "./actions";
//import addTocChart from "./add";
//import axios from "axios";
const {Header, Content, Footer} = Layout;
const {Text, Title} = Typography;
const {Option} = Select;
const pages = [{
    link: 'main',
    name: 'Главная'
},
    {
        link: 'chart',
        name: 'Корзина'
    },
    {
        link: 'orders',
        name: 'Заказы'
    },
    {
        link: 'logOut',
        name: <LogoutOutlined/>
    }

]

function ChartClient() {
    const dispatch = useDispatch()
    const [rrr, setRrr] = useState([]);
    const [show, setShow] = useState(false);


    const {
        values,
        products,
        productsWithFeatures,
        total
    } = useSelector((state) => state.item);
    const {
        isSubmitted,
        username,
        token
    } = useSelector((state) => state.user);

    const onChartAdd = (e) => {
        e.preventDefault();
        CheckOut(e)


    }

    async function Recomendations(value) {
        await axios.get(`http://127.0.0.1:8000/order/?product=${value}`).catch(function (error) {
            if (error.response) {
                alert(error.response.data);
            } else if (error.request) {
                alert(error.request);
            } else {
                alert('Необработанная ошибка', error.message);
            }
        }).then(async response => {
            console.log('product with 1:', response)
            const res = [];
            response.data.map(order => {
                res.push(Number(order.number_of_order))
            })
            console.log('again', res)
            return res;
        }).then(async res => {
                const val = [];
                res.map(async el => {
                    await axios.get(`http://127.0.0.1:8000/order/?number_of_order=${el}`).catch(function (error) {
                        if (error.response) {
                            alert(error.response.data);
                        } else if (error.request) {
                            alert(error.request);
                        } else {
                            alert('Необработанная ошибка', error.message);
                        }
                    }).then(async response => {
                            response.data.map(order => {
                                val.push(order.product)
                            })
                        }
                    )
                })
                console.log('result', val)//Все товары, где в заказе есть этот id

                console.log('ee', val[1])
                setRrr(val);
                console.log('rrr', Object.values(rrr))
                setShow(true)
                return val;
            }
        )
    }

    const CheckOut = (e) => {
        const ob = {
            //product: name, ///МЯУ АЛАРМ
            auth_user: username,
            quantity: values,
            price: total,
            adress: 'не указан',
            status: 'Сформирован',
            number_of_order: '',
            date_of_delivery: '',
            is_provider: '',


        }
        console.log(ob)
        fetch("http://127.0.0.1:8000/order/", {
            method: "post",
            headers: {
                "Authorization": "Token " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ob)
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
            })

    }

    const GetUser = async (e) => {
        await axios(`http://127.0.0.1:8000/user/`, {
            method: 'GET',
        }).then(async (result) => {
                const res = [];
                console.log(username);
                console.log(result.data)
                result.data.map(order => {
                    if (order.username === username) {
                        res.push(order.pk);
                    }
                })
                console.log(res)
                return res;
            }
        ).then(async (res) => {
            await axios(`http://127.0.0.1:8000/user/${res}/`, {
                method: 'GET',
            }).then(async (result) => {
                console.log(result.data)
            })
        })
    }

    const GetUserOrders = async (e) => {
        await axios(`http://127.0.0.1:8000/user/`, {
            method: 'GET',
        }).then(async (result) => {
                const res = [];
                console.log(username);
                console.log(result.data)
                result.data.map(order => {
                    if (order.username === username) {
                        res.push(order.pk);
                    }
                })
                console.log(res)
                return res;
            }
        ).then(async (res) => {
            await axios(`http://127.0.0.1:8000/order/?auth_user=${res}`, {
                method: 'GET',
            }).then(async (result) => {
                console.log(result.data)
            })
        })
    }


    return (
        <Layout className="layout">
            <Header>
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={pages.map((_, index) => {
                        const key = index;
                        return {
                            key,
                            label: <Link to={`/${pages[index].link}`}>{pages[index].name}</Link>,
                        };
                    })}
                />
                {console.log(productsWithFeatures)}
            </Header>
            <Content
                style={{
                    padding: '0 50px',
                }}
            >
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={productsWithFeatures}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <MinusOutlined onClick={(e) => {
                                    dispatch({
                                        type: REMOVE_FROM_CHART,
                                        payload: item
                                    });
                                }
                                }/>,
                                <a>{item.sum}</a>,
                                <PlusOutlined onClick={(e) => {
                                    dispatch({
                                        type: ADD_TO_CHART,
                                        payload: item
                                    });
                                }
                                }/>,
                                <DeleteOutlined onClick={(e) => {
                                    dispatch({
                                        type: DELETE_FROM_CHART,
                                        payload: item
                                    });
                                }
                                }/>
                            ]}
                        >

                            <List.Item.Meta
                                avatar={<Avatar src={item.img}/>}
                                title={<Link to={`/${item.pk}`}>{item.name}</Link>}
                                description={item.category}
                            />
                            <Text disabled>{'В наличии:'}{item.amount}{' шт'}{' '}</Text>
                            <p>{' '}{item.totprice}{' руб.'}</p>
                        </List.Item>
                    )}
                />
                <p>Всего {values} товаров на сумму: {total} руб.</p>
                <Button>Оформить</Button>
                <Button className='but2' type="primary" htmlType="submit"
                        onClick={() => {
                            setRrr(Recomendations(1))
                        }}
                >
                    Рекомендуй
                </Button>
                <div>
                    <ul>
                        <br/>Дата написания: {rrr[1]}
                    </ul>
                </div>
            </Content>
        </Layout>

    )
}

export default ChartClient;