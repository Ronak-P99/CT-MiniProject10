import { Component } from "react";
import axios from 'axios';
import { func, number } from 'prop-types';
import { Form, Button, Alert, Container, Modal } from "react-bootstrap";

const API_URL = 'http://127.0.0.1:5000/products';

class ProductForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            price: '',
            errors: {},
            selectedProductId: null,
            isLoading: false,
            showSuccessModal: false,
            error: null
        };
    }

    componentDidMount() {
        const { id } = this.props.params; 
        if (id) {
            this.fetchProductData(id);
        }
    }

    fetchProductData = (id) => {
        axios.get(`${API_URL}/${id}`)
            .then(response => {
                const productData = response.data;
                this.setState({
                    name: productData.name,
                    price: productData.price,
                    selectedProductId: id,
                    error: null
                });
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
                this.setState({ error: 'Failed to fetch product data. Please try again later.' });
            });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.productId !== this.props.productId) {
            this.setState({ selectedProductId: this.props.productId });
            
            if (this.props.productId) {
                this.fetchProductData(this.props.productId);
            } else {
                this.resetForm();
            }
        }
    }

    resetForm = () => {
        this.setState({
            name: '',
            price: '',
            errors: {},
            selectedProductId: null,
            error: null
        });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    validateForm = () => {
        const { name, price } = this.state;
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!price) {
            errors.price = 'Price is required';
        } else if (isNaN(price) || parseFloat(price) <= 0) {
            errors.price = 'Price must be a positive number';
        }
        return errors;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        if (Object.keys(errors).length === 0) {
            this.setState({ isLoading: true, error: null });
            const productData = {
                name: this.state.name.trim(),
                price: this.state.price.trim(),
            };
            const apiUrl = this.state.selectedProductId
                ? `${API_URL}/${this.state.selectedProductId}`
                : API_URL;

            const httpMethod = this.state.selectedProductId ? axios.put : axios.post;

            httpMethod(apiUrl, productData)
                .then(() => {
                    this.setState({
                        name: '',
                        price: '',
                        errors: {},
                        selectedProductId: null,
                        isLoading: false,
                        showSuccessModal: true
                    });
                })
                .catch(error => {
                    this.setState({ error: error.toString(), isLoading: false });
                });
        } else {
            this.setState({ errors });
        }
    };

    closeModal = () => {
        this.setState({ showSuccessModal: false });
        this.resetForm();
        this.props.navigate('/products');
    }

    render() {
        const { name, price, errors, error, isLoading, showSuccessModal } = this.state;

        return (
            <Container>
                {isLoading && <Alert variant="info">Submitting product data...</Alert>}
                {error && <Alert variant="danger">Error: {error}</Alert>}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formGroupName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={name} onChange={this.handleChange} />
                        {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                    </Form.Group>
                    <Form.Group controlId="formGroupPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" name="price" value={price} onChange={this.handleChange} />
                        {errors.price && <div style={{ color: 'red' }}>{errors.price}</div>}
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isLoading}>Submit</Button>
                </Form>

                <Modal show={showSuccessModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        The product has been successfully {this.state.selectedProductId ? 'updated' : 'added'}.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

ProductForm.propTypes = {
    productId: number,
    onUpdateProductList: func,
}

export default ProductForm;