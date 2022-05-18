import React, {Component} from 'react';
import {Button, Card, Form} from "react-bootstrap";

class SenhaEsquecida extends Component {
    render() {
        return (
            <div className="container-sm">
                <br/><br/><br/><br/>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <Card>
                            <Card.Header as="h5" className="bg-primary text-white"><i className="bi bi-file-earmark-lock" /> Recuperar senha</Card.Header>
                            <Form>
                                <Card.Body>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Card.Title><Form.Label>Endereço de e-mail</Form.Label></Card.Title>
                                        <Form.Control type="email" placeholder="Seu e-mail..." />
                                        <Card.Text><Form.Text className="text-muted">
                                            Digite o seu e-mail cadastrado para iniciar o processo de redefinição de senha.
                                        </Form.Text></Card.Text>
                                    </Form.Group>

                                    <div className="d-grid gap-2">
                                        <Button variant="success" size="lg" type="submit">
                                            Enviar
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Form>
                        </Card>
                    </div>
                </div>
                <br/><br/><br/><br/>
            </div>
        );
    }
}

export default SenhaEsquecida;