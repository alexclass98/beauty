import {Button, Select, Form, Input} from 'antd';
import {Link, Navigate} from 'react-router-dom';
//import './SignUp.css' 
import axios from "axios";
import {useState} from "react";
import {ADD_USER} from "../AuthRedux/actions";
import {useDispatch} from "react-redux";

const onFinish = (values) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};


function SignUp() {

    const [firstName, setFirstName] = useState(null);
    const [access, setAccess] = useState(0);
    const [tel, setTel] = useState(0);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [username, setUsername] = useState('');
    const [test, setTest] = useState(0);
    const [isReg, setIsReg] = useState(false);
    const dispatch = useDispatch()


    async function SignUp(e) {
        const formData1 = new FormData()
        formData1.append('username', username)
        formData1.append('email', email)
        formData1.append('password', password)

        // Вызов API login
        e.preventDefault();
        await axios(`http://127.0.0.1:8000/auth/users/`, {
            method: 'POST',
            data: formData1,
        })
            .then(async (result) => {
                await axios(`http://127.0.0.1:8000/auth/jwt/create/`, {
                    method: 'POST',
                    data: formData1,
                })
                    .then((result) => {
                        console.log(123, result)
                        dispatch({
                            type: ADD_USER,
                            payload: {token: result.data.access, username: username}
                        })
                        return result;
                    })
                    .then(async (result) => {
                        await axios(`http://127.0.0.1:8000/auth/users/me/`, {
                            method: 'GET',
                            headers: {
                                "Authorization": "JWT " + result.data.access,
                            }
                        })
                            .then((result) => {
                                console.log(result.data);
                            })
                    })
            })
    };
    const handleSubmit = (e) => {
        e.preventDefault()
        SignUp(e)
    }
    const handleChange = (value) => {
        setAccess(value)
    };

    return (

        <Form
            className='form'
            name="basic"
            labelCol={{
                span: 6,
            }}
            wrapperCol={{
                span: 15,
            }}
            style={{
                maxWidth: 600,
            }}

            onFinish={onFinish}
            onSubmit={(e) => SignUp(e)}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <h1 className='text1'>Регистрация</h1>
            <Form.Item
                label="Тип пользователя"
                rules={[
                    {
                        required: true,
                        message: 'Выберете тип пользователя',
                    },
                ]}
            >
                <Select
                    placeholder='выберете тип'
                    onChange={handleChange}
                    options={[
                        {
                            value: 0,
                            label: 'Я покупатель',
                        },
                        {
                            value: 1,
                            label: 'Я продавец',
                        },
                    ]}
                />
            </Form.Item>
            <Form.Item
                name='username'
                label="Логин"
                rules={[
                    {
                        required: true,
                        message: 'Придумайте логин',
                    },
                ]}
            >
                <Input value={username} onChange={(e) => setUsername(e.currentTarget.value)}/>
            </Form.Item>

            <Form.Item
                name='email'
                label="Почта"
                rules={[
                    {
                        required: true,
                        type: 'email',
                        message: 'Введите почту',
                    },
                ]}
            >
                <Input value={email} onChange={(e) => setEmail(e.currentTarget.value)}/>
            </Form.Item>

            <Form.Item

                label="Имя"
                name="firstName"
                rules={[
                    {
                        required: true,
                        message: 'Введите своё имя',
                    },
                ]}
            >
                <Input value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)}/>
            </Form.Item>

            <Form.Item

                label="Фамилия"
                name="lastName"
                rules={[
                    {
                        required: true,
                        message: 'Введите свою фамилию',
                    },
                ]}
            >
                <Input value={lastName} onChange={(e) => setLastName(e.currentTarget.value)}/>
            </Form.Item>

            <Form.Item
                label="Введите телефон"
                name="tel"

                rules={[
                    {
                        required: true,
                        message: 'Введите свой телефон',
                    },
                ]}
            >
                <Input value={tel} onChange={(e) => setTel(e.currentTarget.value)}/>
            </Form.Item>

            <Form.Item

                label="Пароль"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Придумайте пароль',
                    },
                ]}
            >
                <Input.Password value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>
            </Form.Item>

            <Form.Item
                label="Пароль повторно"

                rules={[
                    {
                        required: true,
                        message: 'Повторите пароль',
                    },
                ]}
            >
                <Input.Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)}/>
            </Form.Item>


            <Form.Item
                wrapperCol={{
                    offset: 15,
                    span: 8,
                }}
            >
                <Link to='/logIn'>
                    <Button className='but1' type="primary" htmlType="submit">
                        Войти
                    </Button>
                </Link>
                <Button className='but2' type="primary" htmlType="submit"
                        onClick={(e) => {
                            if ((password !== confirmPassword)) alert('Пароли не совпадают:('); else handleSubmit(e)
                        }}
                >
                    Зарегистрироваться
                </Button>
            </Form.Item>
        </Form>

    )

};
export default SignUp;