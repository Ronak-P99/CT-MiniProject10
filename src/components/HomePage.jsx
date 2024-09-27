import image from './tech.jpg';
import { Button, Image, Container, Card, Row, Col } from "react-bootstrap";


function HomePage() {
    return (
        <Container className="bg-info border border-dash border-5" border-style="dashed">
            <h1 className="mt-3 mb-3 text-center text-light">Welcome to Our E-Commerce App</h1>
            <Row>
                <Col xs={12} md={4} sm={4} className='m-auto'>
                    <Image className="d-block mx-auto img-fluid w-100 rounded" src= {image} />
                </Col>
            </Row>
            <p className="mt-3 mb-3 text-center text-light">This is the place to find all your needs at one click.</p>
            <Button className="btn shadow" variant="primary" type="shop" >Shop Now</Button>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>I-Phone</Card.Title>
                    <Card.Text>
                    Newest design and slimmer than ever!
                    </Card.Text>
                    <Button variant="primary">Check it out</Button>
                </Card.Body>
            </Card>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>I-Pad</Card.Title>
                    <Card.Text>
                    Newest design and slimmer than ever!
                    </Card.Text>
                    <Button variant="primary">Check it out</Button>
                </Card.Body>
            </Card>
       </Container>
       
       
       
    )
}

export default HomePage