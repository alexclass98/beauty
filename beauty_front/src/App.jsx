// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Auth/LogIn';
import SignUp from './components/Auth/SignUp';
import ProfilePage from './components/Main/ProfilePage';
import CartPage from './components/Main/CartPage';
import Header from './components/Main/Header';
import MainPage from "./components/Main/MainPage";
import ItemPage from "./components/Main/ItemPage";
import { CookiesProvider } from 'react-cookie';

function App() {
    return (
        <CookiesProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/register" element={<SignUp />} />
                    <Route path="/" element={<MainPage />} />
                    <Route path="/item/:id" element={<ItemPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/cart" element={<CartPage />} />
                </Routes>
            </Router>
        </CookiesProvider>
    );
}

export default App;