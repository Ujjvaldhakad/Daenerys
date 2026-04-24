import React, { createContext, useState, useEffect } from 'react';

export const OrderContext = createContext();

const ORDER_STATUSES = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('daenerys-orders');
        if (saved) {
            try { setOrders(JSON.parse(saved)); } catch (e) {}
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('daenerys-orders', JSON.stringify(orders));
    }, [orders]);

    const placeOrder = (cartItems, cartTotal, address, paymentMethod) => {
        const order = {
            id: 'ORD-' + Date.now().toString(36).toUpperCase(),
            items: cartItems,
            total: cartTotal,
            address,
            paymentMethod,
            date: new Date().toISOString(),
            status: ORDER_STATUSES[0],
            statusIndex: 0,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        setOrders(prev => [order, ...prev]);
        return order;
    };

    return (
        <OrderContext.Provider value={{ orders, placeOrder, ORDER_STATUSES }}>
            {children}
        </OrderContext.Provider>
    );
};
