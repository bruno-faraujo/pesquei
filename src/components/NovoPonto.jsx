import React from 'react';
import {Button, Card, Col, Form, Row, Stack} from "react-bootstrap";
import Mapa from "./MapaPontos";

function NovoPonto(props) {

    const modal = ""

    return (

        <Card>
            <Card.Header as="h5" className="bg-warning text-black"><i className="bi bi-person-plus-fill"/> Incluir novo
                ponto de pesca</Card.Header>
            <Row>
                <Col lg={8}>
                    <Mapa/>
                </Col>
                <Col lg={4}>
                    <Form>
                        <Card.Body>
                            <Card.Text as="h5">Marque no mapa</Card.Text>
                            <Stack direction="horizontal" gap="5">
                            <Form.Group controlId="lat" className="py-2">
                                <Card.Title><Form.Label as="h6">Latitude</Form.Label></Card.Title>
                                <Form.Control size="sm" type="text" disabled  required/>
                            </Form.Group>
                            <Form.Group controlId="lng" className="py-2">
                                <Card.Title><Form.Label as="h6">Longitude</Form.Label></Card.Title>
                                <Form.Control size="sm" type="text" disabled  required/>
                            </Form.Group>
                            </Stack>
                            <Form.Group controlId="nome" className="py-2">
                                <Card.Title><Form.Label as="h6">Nome do ponto</Form.Label></Card.Title>
                                <Form.Control size="sm" type="text" required/>
                            </Form.Group>
                            <Form.Group controlId="descricao" className="py-2">
                                <Card.Title><Form.Label as="h6">Descrição</Form.Label></Card.Title>
                                <Form.Control size="sm" as="textarea" rows={3}/>
                            </Form.Group>
                            <Form.Group className="py-2">
                                <Button variant="success" size="lg" type="submit">
                                    Salvar
                                </Button>

                            </Form.Group>
                        </Card.Body>
                    </Form>
                </Col>
            </Row>
        </Card>
    );
}

export default NovoPonto;