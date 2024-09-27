import { Container, Row, Col, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import image from './error.jpg';


function NotFound() {
    return (
        <Container className="bg-secondary border border-dash border-5" border-style="dashed" fluid>
            <Col>
                <Row>
                    <h2 className="mt-3 mb-3 text-center text-danger">404 - Not Found</h2>
                </Row>
                <Row xs={12} md={4} sm={4} className='m-auto'>
                    <Image className="d-block mx-auto img-fluid w-25 rounded" src= {image} />
                </Row>
                <Row>
                    <p className="mt-3 mb-3 text-center text-danger">Sorry, the page you are looking for does not exist.</p>
                </Row>
                <Row>
                    <p className="mt-3 mb-3 text-center text-danger">
                        You can always go back to the <NavLink to="/" activeStyle={{ color: 'red', fontWeight: 'bold' }}>homepage</NavLink>.
                    </p>
                </Row>
            </Col>
        </Container>
    )
}

export default NotFound;