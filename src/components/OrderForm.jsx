import { useEffect, useState } from "react";
import axios from "axios";
import { number } from "prop-types";
import { Form, Button, Alert, Container, Modal, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState(null);

    const handleClickProduct = (id) => {
        setProductId(id);
    
    };

    const handleClickCustomer = (id) => {
        setCustomerId(id);
    };

    useEffect(() => {
       fetchCustomers()
    }, []);

    useEffect(() => {
        fetchProducts()
     }, []);

    const fetchProducts = () => {
        axios.get('http://127.0.0.1:5000/products')
        .then(response => {
            setProducts(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const fetchCustomers = () => {
        axios.get('http://127.0.0.1:5000/customers')
        .then(response => {
            setCustomers(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const validateForm = () => {
        const errors = {};
        if (!date) errors.date = 'Date is required';
        return errors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            const orderData = {
                date: date.trim(),
                customer_id: customerId.toString(),
                product_id: productId.toString(),
            };
            const apiUrl = selectedOrderId
                ? `http://127.0.0.1:5000/orders/${selectedOrderId}`
                : 'http://127.0.0.1:5000/orders';

            const httpMethod = selectedOrderId ? axios.put : axios.post;

            httpMethod(apiUrl, orderData)
                .then(() => {
                    setDate('');
                    setErrors({});
                    setSelectedOrderId(null);
                    setIsLoading(false);
                    setShowSuccessModal(true);
                })
                .catch(error => {
                    setError(error.toString());
                    setIsLoading(false);
                });
        } else {
            setErrors(validationErrors);
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        setDate('');
        setErrors({});
        setSelectedOrderId(null);
        navigate('/orders');
    };

    return (
        <Container>
            {isLoading && <Alert variant="info">Submitting order data...</Alert>}
            {error && <Alert variant="danger">Error submitting order data: {error}</Alert>}
            {
                customers && <ListGroup>
                <h1>Select a Customer:</h1>
                {customers.map(customer => (
                    <ListGroup.Item key={customer.id} className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 bg-white rounded">
                        <p className="text-primary">{customer.name}</p>
                        <Button key={customer.id} size="sm" onClick={() => handleClickCustomer(customer.id)} 
                        style={{ backgroundColor: customerId === customer.id ? 'darkgray' : 'lightgray', }} > Select </Button>                    </ListGroup.Item>
                ))}
            </ListGroup>
            }
            {   
                products && <ListGroup>
                <h1>Select a Product:</h1>
                {products.map(product => (
                    <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 bg-white rounded">
                        <p className="text-primary">{product.name}</p>
                        <Button key={product.id} size="sm" onClick={() => handleClickProduct(product.id)} 
                        style={{ backgroundColor: productId === product.id ? 'darkgray' : 'lightgray', }} > Select </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            }
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formGroupDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                    />
                    {errors.date && <div style={{ color: 'red' }}>{errors.date}</div>}
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
            </Form>

            <Modal show={showSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The order has been successfully {selectedOrderId ? 'updated' : 'added'}.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default OrderForm;