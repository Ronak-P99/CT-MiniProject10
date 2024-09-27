import { Component } from "react";
import axios from 'axios';
import { func, number } from 'prop-types';
import { Form, Button, Alert, Container, Modal } from "react-bootstrap";

class ProductForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            price: '',
            errors: {},
            selectedProductId: null,
            isLoading: false,
            showSuccessModal: false
        };
    }

    componentDidMount() {
        const { id } = this.props.params; 
        console.log(id);
        if (id) {
            this.fetchProductData(id);
        }
    }

    fetchProductData = (id) => {
        axios.get(`http://127.0.0.1:5000/products/${id}`)
        .then(response => {
            const productData = response.data;
            this.setState({
                name: productData.name,
                price: productData.price,
                selectedProductId: id
            });
        })
            .catch(error => {
                console.error('Error fetching product data:', error)
        });
        
    };

    componentDidUpdate(prevProps) {
        if (prevProps.productId !== this.props.productId) {
            this.setState({ selectedProductId: this.props.productId });
            
            if (this.props.productId) {
                axios.get(`http://127.0.0.1:5000/products/${this.props.productId}`)
                    .then(response => {
                        const productData = response.data;
                        this.setState({
                            name: productData.name,
                            price: productData.price,
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching product data:', error);
                        // Handle errors here
                    });
            } else {
                this.setState({
                    name: '',
                    price: '',
                });
            }
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    validateForm = () => {
        const { name, price } = this.state;
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!price) errors.price = 'Price is required';
        return errors;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        if(Object.keys(errors).length === 0) {
            this.setState({ isLoading: true, error: null })
            const productData = {
                name: this.state.name.trim(),
                price: this.state.price.trim(),
            };
            const apiUrl = this.state.selectedProductId
            ? `http://127.0.0.1:5000/products/${this.state.selectedProductId}`
            : 'http://127.0.0.1:5000/products';

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
        this.setState({
            showSuccessModal: false,
            name: '',
            price: '',
            errors: {},
            selectedProductId: null
        });
        this.props.navigate('/products')
    }

    render() {
        const { name, price, errors, error, isLoading, showSuccessModal } = this.state;

        return (
            <Container>
                { isLoading && <Alert variant="info">Submitting product data...</Alert>}
                { error && <Alert variant="danger">Error submitting product data: {error}</Alert>}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formGroupName" >
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={name} onChange={this.handleChange} />
                        {errors.name && <div style={{color: 'red'}}>{errors.name}</div>}
                    </Form.Group>
                    <Form.Group controlId="formGroupPrice" >
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" name="price" value={price} onChange={this.handleChange} />
                        {errors.price && <div style={{color: 'red'}}>{errors.price}</div>}
                    </Form.Group>
                    <Button variant="primary" type="submit" >Submit</Button>
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
ProductForm.protoTypes = {
    productId: number,
    onUpdateProductList: func,
}

export default ProductForm;