import React, {Component} from 'react';
import {Button, Card, Form} from "react-bootstrap";
import {Link, Navigate} from "react-router-dom";
import axios from "axios";
import {UserContext} from "./UserContext";

class SenhaEsquecida extends Component {

    static contextType = UserContext;

    state = {
        email: ''
    }



    formSubmit = (e) => {
        e.preventDefault();

        const data = {
            email: this.state.email
        }
        axios.post('/reset_password', data)
            .then((response) => {
                console.log(response.data.message)
            })
            .catch((error) => {
                //   console.log(error.response.data.message);
                console.log(error.response.data.message);
            })
    }

    render() {

        if (this.context.loggedIn)
        {
            return (
                <Navigate to="/perfil" />
            );
        }

        return (
            <div className="container-sm">
                <br/><br/><br/><br/>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <Card>
                            <Card.Header as="h5" className="bg-primary text-white"><i className="bi bi-file-earmark-lock" /> Recuperar senha</Card.Header>
                            <Form onSubmit={this.formSubmit}>
                                <Card.Body>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Card.Title><Form.Label>Endereço de e-mail</Form.Label></Card.Title>
                                        <Form.Control type="email" placeholder="Seu e-mail..." onChange={(e) => this.setState({email:e.target.value})} required />
                                        <Card.Text><Form.Text className="text-muted">
                                            Digite o seu e-mail cadastrado para iniciar o processo de redefinição de senha.
                                        </Form.Text></Card.Text>
                                    </Form.Group>

                                    <div className="d-grid gap-2">
                                        <Button variant="success" size="lg" type="submit">
                                            Enviar
                                        </Button>
                                    </div>
                                    <br/>
                                    <Card.Text className="text-muted">Não possui conta? <Link to="/login" style={{textDecoration: "none"}}>Registre-se</Link></Card.Text>
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