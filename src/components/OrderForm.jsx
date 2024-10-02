import { useEffect, useState } from "react";
import axios from "axios";
import { func, number } from "prop-types";
import { Form, Button, Alert, Container, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const OrderForm = ({ customerID }) => {
    const { id } = useParams(); // Use the useParams hook to get the ID from the URL
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchOrderData(id);
        }
    }, [id]);

    const fetchOrderData = (orderId) => {
        axios.get(`http://127.0.0.1:5000/orders/${orderId}`)
            .then(response => {
                const orderData = response.data;
                setDate(orderData.date);
                setSelectedOrderId(orderId);
            })
            .catch(error => {
                console.error('Error fetching order data:', error);
            });
    };

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
                customerID: customerID,
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

OrderForm.propTypes = {
    customerID: number.isRequired,
}

export default OrderForm;