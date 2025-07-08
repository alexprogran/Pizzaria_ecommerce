import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Orders } from './pages/Orders';
import { Register } from './pages/Register';
import { RegisterPizza } from './pages/RegisterPizza';
import { Admin } from './pages/Admin';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-pizza" element={<RegisterPizza />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
    );
} 