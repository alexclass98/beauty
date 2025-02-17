import React from 'react';
import { Link  } from 'react-router-dom';
import {useState, useEffect} from 'react';
import { PlusOutlined,MinusOutlined, InboxOutlined, UserOutlined, LogoutOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Typography, Card } from 'antd';
import {  InputNumber, Select, Space,Input, Layout, Menu, theme  } from 'antd';

const { Search } = Input;
//import { ADD_TO_CHART, REMOVE_FROM_CHART} from "./actions";
//import addTocChart from "./add";
//import axios from "axios";
const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;
const { Option } = Select;
const pages =[{
    link: 'main',
    name: 'Главная'},
    {link: 'chart',
    name:'Корзина'}, 
    {link: 'orders',
    name:  'Заказы'},
    {link: 'logOut',
    name:  <LogoutOutlined />}

]

function Orders () {
  
  return(
  <Layout className="layout" >
  <Header>
    <div className="logo" />
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={['2']}
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

</Content>
</Layout>

)
}

export default Orders;