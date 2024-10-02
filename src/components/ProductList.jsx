import { Component } from "react";
import { func } from 'prop-types';
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Alert, Container, ListGroup, Spinner } from "react-bootstrap";

const API_URL = 'http://127.0.0.1:5000/products';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            selectedProductId: null,
            error: null,
            isLoading: false,
        };
    }

    componentDidMount() {
        this.fetchProducts();
    }

    fetchProducts = () => {
        this.setState({ isLoading: true });
        axios.get(API_URL)
            .then(response => {
                this.setState({ products: response.data, isLoading: false });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                this.setState({ error: `Error fetching products: ${error.response?.data?.message || 'Please try again later.'}`, isLoading: false });
            });
    }

    selectProducts = (id) => {
        this.setState({ selectedProductId: id });
        this.props.onProductSelect(id);
    }

    deleteProducts = (productId) => {
        axios.delete(`${API_URL}/${productId}`)
            .then(() => {
                this.fetchProducts();
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                this.setState({ error: `Error deleting product: ${error.response?.data?.message || 'Please try again.'}` });
            });
    }

    render() {
        const { products, error, isLoading } = this.state;

        return (
            <Container>
                {error && <Alert variant="danger">{error}</Alert>}
                {isLoading && <Spinner animation="border" />}
                <h3 className="mt-3 mb-3 text-center">Products</h3>
                <ListGroup>
                    {products.map(product => (
                        <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 bg-white rounded">
                            <Link to={`/edit-product/${product.id}`} className="text-primary">{product.name}</Link>
                            <Button variant="danger" size="sm" onClick={() => this.deleteProducts(product.id)}>Delete</Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
        );
    }
}

ProductList.propTypes = {
    onProductSelect: func,
}

export default ProductList;