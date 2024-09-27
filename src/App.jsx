import { Routes, Route } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import NavigationBar from './components/NavigationBar';
import CustomerFormWrapper from './components/CustomerFormWrapper';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList'
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';
import './AppStyles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App(){
  // get request for a specific id
    return (
      <div className='app-container'>
        <NavigationBar />
        <Routes>
           <Route path='/' element={<HomePage />} />
           <Route path='/add-customer' element={<CustomerFormWrapper />} />
           {/* path=URL element=Component */}
           <Route path='/edit-customer/:id' element={<CustomerFormWrapper />} />
           <Route path='/customers' element={<CustomerList />} />
           <Route path='/add-product' element={<ProductForm />} />
           <Route path='/edit-product/:id' element={<ProductForm />} />
           <Route path='/products' element={<ProductList />} />
           <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    );
  }


export default App;
