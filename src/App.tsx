import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Orders from './pages/Orders';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/pedidos" element={<Orders />} />
              </Routes>
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;