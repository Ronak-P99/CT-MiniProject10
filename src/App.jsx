import { Routes, Route } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import NavigationBar from './components/NavigationBar';
import CustomerFormWrapper from './components/CustomerFormWrapper';
import ProductFormWrapper from './components/ProductFormWrapper';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import ProductList from './components/ProductList';
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';
import './AppStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';


function App(){
    const [customerID, setCustomerID] = useState(null);
    return (
      <div className='app-container'>
        <NavigationBar />
        <Routes>
           <Route path='/' element={<HomePage />} />
           <Route path='/add-customer' element={<CustomerFormWrapper />} />
           <Route path='/edit-customer/:id' element={<CustomerFormWrapper />} />
           <Route path='/customers' element={<CustomerList />} />
           <Route path='/add-product' element={<ProductFormWrapper />} />
           <Route path='/edit-product/:id' element={<ProductFormWrapper />} />
           <Route path='/products' element={<ProductList />} />
           <Route path='/orders' element={<OrderList customerID={customerID} />} />
           <Route path='/add-order' element={<OrderForm customerID={customerID} />} />
           <Route path='/edit-order/:id' element={<OrderForm customerID={customerID} />} />
           <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    );
  }


export default App;
