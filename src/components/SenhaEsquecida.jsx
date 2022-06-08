import React, {Component} from 'react';
import {Button, Card, Form, Modal} from "react-bootstrap";
import {Link, Navigate} from "react-router-dom";
import axios from "axios";
import {UserContext} from "./UserContext";

class SenhaEsquecida extends Component {

    static contextType = UserContext;

    state = {
        email: '',
        modalShow: false,
        hasError: ''
    }

    formSubmit = (e) => {
        e.preventDefault();

        const data = {
            email: this.state.email
        }

                axios.post('/reset_password', data)
                    .then((response) => {
                        document.getElementById("form-senha-esquecida").reset();
                        this.setState({message: response.data.message});
                        this.setState({hasError: false});
                        this.setState({modalShow: true});
                    })
                    .catch((error) => {
                        try {
                            this.setState({
                                message: error.response.data.errors.password.map((item) => (<p>{item}</p>))
                            });
                        } catch {
                            this.setState({message: error.response.data.message});
                        }
                        this.setState({hasError: true});
                        this.setState({modalShow: true});
                    })
    }

    handleOkButton = () => {
        if (this.state.hasError) {
            this.setState({modalShow:false})
        } else {
            window.location.replace("/");
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
                { modal }
                <br/><br/><br/><br/>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <Card>
                            <Card.Header as="h5" className="bg-primary text-white"><i className="bi bi-file-earmark-lock" /> Recuperar senha</Card.Header>
                            <Form onSubmit={this.formSubmit} id="form-senha-esquecida">
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
                                    <Card.Text className="text-muted">Não possui uma conta? <Link to="/login" style={{textDecoration: "none"}}>Registre-se</Link></Card.Text>
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