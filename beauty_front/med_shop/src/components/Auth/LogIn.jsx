import { Button, Form, Input } from 'antd'; 
import { Link, Navigate  } from 'react-router-dom'; 
import { useState } from "react";
import { useDispatch, useSelector} from 'react-redux'
import { ADD_USER } from "../AuthRedux/actions";
import React from 'react'; 
import './LogIn.css' 
import axios from "axios";
const onFinish = (values) => { 
  console.log('Success:', values); 
}; 
 
const onFinishFailed = (errorInfo) => { 
  console.log('Failed:', errorInfo); 
}; 
 


function LogIn() { 

  const dispatch = useDispatch()
  const{
    isSubmitted,
    token
  } = useSelector((state)=> state.user);


  const [errorMessages, setErrorMessages] = useState({});
  const [user, setUser] = useState(0); 
  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('');
  const renderErrorMessage = (name) =>
      name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
);
  async function Authorization1(e){
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    console.log(password,username)

    setUsername(JSON.stringify(username));
  // Вызов API login
  e.preventDefault();
  await axios(`http://127.0.0.1:8000/auth/jwt/create/`, {
    method: 'POST',
    data: formData,
  })
      .then((result) => {
        console.log(123, result)
          dispatch({
            type:ADD_USER,
            payload: {token: result.data.access, username:username}
          })
          return result;
      })
  .then(async (result) => {
  await axios(`http://127.0.0.1:8000/auth/users/me/`, {
    method: 'GET',
    headers:{
      "Authorization": "JWT "+result.data.access,
    }
  })
      .then((result) => {
        setUser(result.data.id);
        console.log(result.data);
        console.log(user);
    })})}

const errors = {
pass: "Неверно введен пароль"
};

const handleSubmit = (e) => {
e.preventDefault();
Authorization1(e);

};


  return(  
    <div className="logIN" >
         
           { token !== '' ? 
           <div> <Navigate to="/main" /></div>:
          
    <Form 
    className='form' 
    name="basic" 
    labelCol={{ 
      span: 5, 
    }} 
    wrapperCol={{ 
      span: 15, 
    }} 
    style={{ 
      maxWidth: 600, 
    }} 
     
    onFinish={onFinish} 
    onFinishFailed={onFinishFailed} 
    autoComplete="off" 
  > 
    <div> 
   <h1 className='text1'>Авторизация</h1> 
    <Form.Item 
      label="Логин" 
      rules={[ 
        { 
          required: true, 
          message: 'Введите логин', 
        }, 
      ]} 
    > 
      <Input value={username} onChange={(e)=> setUsername(e.currentTarget.value)}/> 
    </Form.Item> 
     
     
       
    <Form.Item 
 
      label="Пароль" 
      name="password" 
      rules={[ 
        { 
          required: true, 
          message: 'Введите пароль', 
        }, 
      ]} 
    > 
      <Input.Password value={password} onChange={(e)=> setPassword(e.currentTarget.value)}/> 
    </Form.Item> 
 
      </div>   
 
    <Form.Item 
 
      wrapperCol={{ 
        offset: 16, 
        span: 16, 
         
      }} 
    > 
        <Link to= '/signUp'> 
      <Button className='but1' type="primary" htmlType="submit"> 
        Регистрация 
      </Button> 
      </Link> 
 
      <Link to= '/main'> 
      <Button className='but2' type="primary" htmlType="submit"
       onClick={(e)=>handleSubmit(e)}> 
        Войти 
      </Button> 
      </Link> 
    </Form.Item> 
 
  </Form>}
        
        </div>
  ) 
  
}; 
export default LogIn;