import React, {Component} from 'react';
import {Button, Card, Form} from "react-bootstrap";
import {Link, Navigate } from "react-router-dom";
import axios from "axios";
import {UserContext} from "./UserContext";

class Login extends Component {

    static contextType = UserContext;

    state = {
        email: '',
        password: '',
        user: {}
    }

    defineUser = (data) => {
        const context = this.context;
        context.setUser(data);
        context.setLoggedIn(true);
    }

    formSubmit = (e) => {

        e.preventDefault();

        const data = {
            email: this.state.email,
            password: this.state.password
        }

        axios.post('/login', data)
                    .then((response) => {
                        localStorage.setItem('token', response.data.token);
                        this.setState({loggedIn: true});
             //           this.setState({user:response.data});
                        this.defineUser(response.data);
                    })
                    .catch((error) => {
                        //console.log(error.response.data.message);
                        console.log(error)
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
                            <Card.Header as="h5" className="bg-primary text-white"><i className="bi bi-box-arrow-in-right" /> Login</Card.Header>
                            <Form onSubmit={this.formSubmit}>
                                <Card.Body>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Card.Title><Form.Label>Endereço de e-mail</Form.Label></Card.Title>
                                        <Form.Control type="email" placeholder="Seu e-mail..." required onChange={(e)=>{this.setState({email:e.target.value})}} />
                                        <Card.Text><Form.Text className="text-muted">
                                            Seu endereço de e-mail não será compartilhado com ninguem.
                                        </Form.Text></Card.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="password">
                                        <Card.Title><Form.Label>Senha</Form.Label></Card.Title>
                                        <Form.Control type="password" placeholder="Sua senha..." required onChange={(e)=>{this.setState({password:e.target.value})}} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="lembrar">
                                        <Form.Check type="checkbox" label="Lembrar" />
                                    </Form.Group>
                                    <div className="d-grid gap-2">
                                        <Button variant="success" size="lg" type="submit">
                                            Entrar
                                        </Button>
                                    </div>
                                    <br/>
                                    <Form.Text as={Link} to="/recuperar_senha" style={{textDecoration: "none"}}>
                                        Esqueceu a senha?</Form.Text>
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

export default Login;