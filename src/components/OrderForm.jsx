import { Component } from "react";
import axios from 'axios';
import { func, number } from 'prop-types';
import { Form, Button, Alert, Container, Modal } from "react-bootstrap";

class OrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            errors: {},
            customerID: this.props.customerID || '',
            selectedOrderId: null,
            isLoading: false,
            showSuccessModal: false
        };
    }

    componentDidMount() {
        const { id } = this.props.params; 
        console.log(id);
        if (id) {
            this.fetchOrderData(id);
        }
    }

    fetchOrderData = (id) => {
        axios.get(`http://127.0.0.1:5000/orders/${id}`)
        .then(response => {
            const orderData = response.data;
            this.setState({
                date: orderData.date,
                selectedOrderId: id
            });
        })
            .catch(error => {
                console.error('Error fetching order data:', error)
        });
        
    };

    componentDidUpdate(prevProps) {
        if (prevProps.orderId !== this.props.orderId) {
            this.setState({ selectedOrderId: this.props.orderId });
            
            if (this.props.orderId) {
                axios.get(`http://127.0.0.1:5000/orders/${this.props.orderId}`)
                    .then(response => {
                        const orderData = response.data;
                        this.setState({
                            date: orderData.date,
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching order data:', error);
                        // Handle errors here
                    });
            } else {
                this.setState({
                    date: ''
                });
            }
        }
    }

    handleChange = (event) => {
        const { date, value } = event.target;
        this.setState({ [date]: value });
    };

    validateForm = () => {
        const { date } = this.state;
        const errors = {};
        if (!date) errors.date = 'date is required';
        return errors;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        if(Object.keys(errors).length === 0) {
            this.setState({ isLoading: true, error: null })
            const orderData = {
                date: this.state.date.trim(),
                customerID: this.state.customerID,
            };
            const apiUrl = this.state.selectedOrderId
            ? `http://127.0.0.1:5000/orders/${this.state.selectedOrderId}`
            : 'http://127.0.0.1:5000/orders';

            const httpMethod = this.state.selectedOrderId ? axios.put : axios.post;

            httpMethod(apiUrl, orderData)
                .then(() => {

                    this.setState({
                        date: '',
                        errors: {},
                        customerID: '',
                        selectedOrderId: null,
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
            date: '',
            errors: {},
            customerID: this.props.customerID || '',
            selectedOrderId: null
        });
        this.props.navigate('/orders')
    }

    render() {
        const { date, errors, error, isLoading, showSuccessModal } = this.state;

        return (
            <Container>
                { isLoading && <Alert variant="info">Submitting order data...</Alert>}
                { error && <Alert variant="danger">Error submitting order data: {error}</Alert>}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formGroupdate" >
                        <Form.Label>date</Form.Label>
                        <Form.Control type="text" date="date" value={date} onChange={this.handleChange} />
                        {errors.date && <div style={{color: 'red'}}>{errors.date}</div>}
                    </Form.Group>
                    <Button variant="primary" type="submit" >Submit</Button>
                </Form>

                <Modal show={showSuccessModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        The order has been successfully {this.state.selectedOrderId ? 'updated' : 'added'}.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}
OrderForm.protoTypes = {
    orderId: number,
    onUpdateOrderList: func,
}

export default OrderForm;