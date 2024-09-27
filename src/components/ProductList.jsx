import { number } from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = ({ orderId }) => {
    const [products, setProducts] = useState([]);
//          [{ id: 'A123', name: 'Coffee' }, { id: 'B456', name: 'Croissant' }]
    useEffect(() => {
        // if (orderId) {
        //     // Make an api call to get all of our products asscociated with our order id
        //     const fetchedProducts = [
        //         { id: 'A123', name: 'Coffee' },
        //         { id: 'B456', name: 'Croissant' },
        //     ];
        //     // Set our products array to be equal to our fetched products
        //     setProducts(fetchedProducts);
        // }

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error)
            }
        }

        if (orderId) {
            fetchProducts()
        }
    }, [orderId]);

    return (
        <div className='product-list'>
            <h3>Products</h3>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name} (ID: {product.id})
                    </li>
                ))}
            </ul>
        </div>
    );
};

ProductList.protoTypes = {
    orderId: number
}

export default ProductList;