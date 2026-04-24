import React from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';
import AuthModal from './components/AuthModal';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <ReviewProvider>
            <Home />
            <AuthModal />
            <ToastContainer 
              theme="dark" 
              position="top-center" 
              autoClose={2500} 
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              style={{ zIndex: 9999999 }}
            />
          </ReviewProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;