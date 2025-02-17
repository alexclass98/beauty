import React from 'react';
import { Link , useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import { PlusOutlined,MinusOutlined, UserOutlined, LogoutOutlined, MedicineBoxOutlined} from '@ant-design/icons';
import { Typography, Image, Divider, Space} from 'antd';
import { Select,Input, Breadcrumb, Layout, Menu, List  } from 'antd';
import { useDispatch, useSelector} from 'react-redux'

import { ADD_TO_CHART, REMOVE_FROM_CHART} from "../ChartRedux/actions";
//import addTocChart from "./add";
//import axios from "axios";
const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

const pages =[{
  link: '',
  name: 'Главная'},
  {link: 'chart',
  name:'Корзина'}, 
  {link: 'orders',
  name:  'Заказы'},
  {link: 'logIn',
  name:  <UserOutlined />},
  {link: 'logOut',
  name:  <LogoutOutlined />}

]
function SingleDrug () {

    const {drId} = useParams()
    
    const [item, setItem] = useState([])
    const dispatch = useDispatch()

    const{ 
      products,
    } = useSelector((state)=> state.item);
    
  
    const onChartAdd =(e) =>
    {
      e.preventDefault(); 
      
    }
  
    useEffect(() => {
      fetch(`http://127.0.0.1:8000/drugs/${drId}/`, {
        method: "GET"})
          .then(response => response.json())
          .then((result) => {
            setItem(result);
              console.log(result);
          })
    
    }, [drId]);
  
 
    const onChild =(for_children)=>{
      if (for_children ===0)
      return <Text type="warning">Только для взрослых</Text>
      else
      return <Text type="success">Подходит для детей</Text>
    }
  


  return (
    <Layout className="layout" onSubmit={onChartAdd}>
      <Header>
    <div className="logo" />
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={['0']}
      items={pages.map(( _, index) => {
        const key = index;
        return {
        key,
          label: <Link to={`/${pages[index].link}`}>{pages[index].name}</Link>,
        };
      })}
    />
    
  </Header>

      <Content
        style={{
          padding: '0 50px',
        }}
      > 
      <Breadcrumb
    items={[
      {
        title: 'Главная',
      },
      {
        title: <a href={`/${item.pk}`}>О лекарстве</a>,
      },
    ]}/>
   
    <Divider plain> <Title level={2}>{item.name}</Title></Divider>
    <MedicineBoxOutlined /><b>{' '}{item.category}</b>
    <p><Image src={item.image} alt="лекарство"/></p>
    <Divider orientation="left" plain>
    <Title level={5}>Информация</Title>
    </Divider>
    <Space direction="vertical">
    <Text>Описание: {item.description}</Text>
    <Text>Действующие вещество: {item.active_substance}</Text>
    <Text>{onChild(item.for_children)}</Text>
    </Space>
    <Divider orientation="left" plain>
    <Title level={5}>В наличии: {item.amount} шт.</Title>
    </Divider>
    <Space direction="vertical">
    <Text>{item.price}{' руб.'}</Text>
    </Space>
    <p></p>
      <MinusOutlined onClick={(e) => {
                      dispatch({
                     type:REMOVE_FROM_CHART,
                    payload: item
                   });}
                    }/>
      <a>{ products.includes(item.name) ? <> {products.filter(it=>it===item.name).length}</> : <>0</>}</a>
          <>{products.filter(it=>it===item.name).length<item.amount? 
      <PlusOutlined  onClick={(e) => {
                      dispatch({
                        type:ADD_TO_CHART,
                        payload: item
                      });}
                  }/> : <Text type="danger">товар закончился</Text>}</>
                

    </Content>
    </Layout>
    
  )
}

export default SingleDrug;