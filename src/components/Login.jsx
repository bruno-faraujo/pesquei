import React, {Component} from 'react';
import {Button, Card, Form, Modal} from "react-bootstrap";
import {Link, Navigate } from "react-router-dom";
import axios from "axios";
import {UserContext} from "./UserContext";

class Login extends Component {

    static contextType = UserContext;

    state = {
        email: '',
        password: '',
        user: {},
        modalShow: false,
        hasError: '',
        message:''
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

        axios.get('../sanctum/csrf-cookie')
            .then(()=>{
                axios.post('/login', data)
                    .then((response) => {
                        localStorage.setItem('token', response.data.token);
                        this.setState({loggedIn: true});
                        this.defineUser(response.data);
                    })
                    .catch((error) => {
                        try {
                            this.setState({message:error.response.data.errors.password.map((item)=>(<p>{item}</p>))});
                        } catch {
                            this.setState({message:error.response.data.message});
                        }
                        this.setState({hasError:true});
                        this.setState({modalShow:true});
                    })
            })
            .catch((error)=>{
                this.setState({message: error.response.data.message});
                this.setState({hasError:true});
                this.setState({modalShow:true});
            })
    }

    handleOkButton = () => {
        if (this.state.hasError) {
            this.setState({modalShow:false})
        }
    }

    render() {

        if (this.context.loggedIn)
        {
            return (
                <Navigate to="/usuario" />
            );
        }

        let modal = '';
        if (this.state.modalShow){
            modal =
                (
                    <Modal
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        show={this.state.modalShow}
                    >
                        <Modal.Body style={this.state.hasError ? {backgroundColor: "tomato"} : {backgroundColor: "LightGreen"}}>
                            <h5>{this.state.message}</h5>
                        </Modal.Body>
                        <Modal.Footer>
                            <div style={{margin: "auto"}}>
                                <Button className={this.state.hasError ? "btn btn-danger btn-lg" : "btn btn-success btn-lg"} onClick={this.handleOkButton}>OK</Button>
                            </div>
                        </Modal.Footer>

                    </Modal>
                )
        }

        return (
            <div className="container-sm">
                {modal}
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
                                            Seu endereço de e-mail não será compartilhado com ningúem.
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
                                    <Card.Text><Link to="/recuperar_senha" style={{textDecoration: "none"}}>
                                        Esqueceu a senha?</Link></Card.Text>
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