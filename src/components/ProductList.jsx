import { Component } from "react";
import { func } from 'prop-types';
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Alert, Container, ListGroup } from "react-bootstrap";


class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          products: [],
          selectedProductId: null,
          error: null
        };
    }

    componentDidMount() {
        this.fetchProducts();
    }

    fetchProducts = () => {
        axios.get('http://127.0.0.1:5000/products')
        .then(response => {
            this.setState({ products: response.data });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            this.setState({ error: `Error fetching products. Please try again later.` })
        });
    }

    selectProducts = (id) => {
        this.setState({ selectedProductId: id });
        this.props.onProductSelect(id);
    }

    deleteProducts = (productId) => {
        axios.delete(`http://127.0.0.1:5000/products/${productId}`)
            .then(() => {
                this.fetchProducts();
            })
            .catch(error => {
                console.error('Error deleting products:', error);
                this.setState({ error: `Error deleting product. Please try again.` })
            });
    }

    render() {
        const { products, error } = this.state;

        return (
            <Container>
                {error && <Alert variant="danger">{error}</Alert>}
                <h3 className="mt-3 mb-3 text-center">Products</h3>
                <ListGroup>
                    {products.map(product => (
                        <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 bg-white rounded">
                            <Link to={`/edit-product/${product.id}`} className="text-primary">{product.name}</Link>
                            <Button variant="danger" size="sm" onClick={() => this.deleteProduct(product.id)}>Delete</Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
        )
    }
}
ProductList.propTypes = {
    onProductSelect: func
}

export default ProductList;