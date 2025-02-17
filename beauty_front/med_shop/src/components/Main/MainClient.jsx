import React from 'react';
import { Link  } from 'react-router-dom';
import {useState, useEffect} from 'react';
import { PlusOutlined,MinusOutlined, InboxOutlined, UserOutlined, LogoutOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Typography, Card } from 'antd';
import {  InputNumber, Select, Space,Input, Layout, Menu, theme  } from 'antd';
import './Main.css'
import { useDispatch, useSelector} from 'react-redux'
import { ADD_TO_CHART, REMOVE_FROM_CHART} from "../ChartRedux/actions";
const { Search } = Input;

//import addTocChart from "./add";
//import axios from "axios";
const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;
const { Option } = Select;
const pages =[{
    link: '',
    name: 'Главная'},
    {link: 'chart',
    name:'Корзина'}, 
    {link: 'orders',
    name:  'Заказы'},
    {link: 'logOut',
    name:  <LogoutOutlined />}

]
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
function MainClient () {

    const [max_pr, setMax_pr] = useState('');
    const [min_pr, setMin_pr] = useState('');
    const [loading,setLoading] = useState(false);
    const [items, setItems] = useState([])
    const [search, setSearch] = useState('');

    const onChartAdd =(e) =>
    {
        e.preventDefault(); 
    }

    const dispatch = useDispatch()



    const{
      values,
      products,
      productsWithFeatures,
      total
    } = useSelector((state)=> state.item);

    function getFilter (max_pr, min_pr) {
        if (max_pr && min_pr ) {
            return `?max_pr=${max_pr}&min_pr=${min_pr}`
        }
        if (max_pr) {
            return `?max_pr=${max_pr}`
        }
        if (min_pr) {
            return `?min_pr=${min_pr}`
        }
        return ('')
    }

  


  useEffect(() => {
    setLoading(true)
    fetch(`http://127.0.0.1:8000/drugs/${getFilter(max_pr, min_pr)}`, {
      method: "GET"})
        .then(response => response.json())
        .then((result) => {
          setItems(result);
            console.log(result);
        })
        setLoading(false)
  }, [max_pr, min_pr]);

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
    <Title level={4}>Выбрать категории</Title>
        <Select
    mode="multiple"
    style={{
      width: '50%',
    }}
    placeholder="выберете категории"
    defaultValue={['china']}
    onChange={handleChange}
    optionLabelProp="label"
  >
  
    <Option value="china" label="China">
      <Space>
        <span role="img" aria-label="China">
          🇨🇳
        </span>
        China (中国)
      </Space>
    </Option>
    <Option value="usa" label="USA">
      <Space>
        <span role="img" aria-label="USA">
          🇺🇸
        </span>
        USA (美国)
      </Space>
    </Option>
    <Option value="japan" label="Japan">
      <Space>
        <span role="img" aria-label="Japan">
          🇯🇵
        </span>
        Japan (日本)
      </Space>
    </Option>
    <Option value="korea" label="Korea">
      <Space>
        <span role="img" aria-label="Korea">
          🇰🇷
        </span>
        Korea (韩国)
      </Space>
    </Option>
  </Select>
    <Title level={4}>Отфильровать по цене</Title>
     <Space direction="vertical">
        <Input
            value={min_pr}
            placeholder='мин цена' 
            onChange={(e)=>setMin_pr(e.currentTarget.value)} />
        <Input
            value={max_pr}
            placeholder='макс цена' 
            onChange={(e)=>setMax_pr(e.currentTarget.value)} />
    </Space>
    
      {
        Object.entries(items).map(([id, drug]) => (
            <div key={id}>
            <Card
                title={drug.name}
                style={{
                    width: 300,
                         }}
                         extra={<Link to={`/${drug.pk}`}>Подробнее</Link>}
                cover={
                    <img
                        alt="лекарство"
                        src={drug.img}
                    />} 
                actions={[
                    <MinusOutlined onClick={(e) => {
                      dispatch({
                     type:REMOVE_FROM_CHART,
                    payload: drug
                   });}
                    }/>,
                	  <a>{ products.includes(drug.name) ? <> {products.filter(item=>item===drug.name).length}</> : <>0</>}</a>,
                    <>{products.filter(item=>item===drug.name).length<drug.amount? <PlusOutlined  onClick={(e) => {
                      dispatch({
                     type:ADD_TO_CHART,
                    payload: drug
                   });}
                  }/> : <Text type="danger">товар закончился</Text>}</>,
                 ]}
                 >
                <Text type="secondary">{drug.category}</Text>
                <p>{onChild(drug.for_children)}</p>
                <Text strong>{drug.price} {' руб.'} </Text>
                <p><Text disabled>{'В наличии: '}{drug.amount}{' шт.'}</Text></p>
                
            </Card>
            </div>
        ))
      }
    
    </Content>
    </Layout>
    
  )
}

export default MainClient;