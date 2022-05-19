import React from 'react';
import {Navigate, useParams} from "react-router-dom";
import {Button, Card, Form} from "react-bootstrap";
import axios from "axios";


export default function ResetSenha(props) {

    const params = useParams();

    const data = {
        token: params.token,
        password: '',
        password_confirmation: '',
    }

    const formSubmit = (e) => {
        e.preventDefault();

        axios.post('/change_password', data)
            .then((response) => {
                document.getElementById('reset-senha-form').reset();
                console.log(response.data.message);


            })
            .catch((error) => {
                console.log(error.response.data.message);
            })

    }

    if (props.loggedIn) {
        return <Navigate to="/perfil" />
    }

    return (
            <>
            <div className="container-sm">

                <br/><br/><br/><br/>

                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <Card>
                            <Card.Header as="h5" className="bg-warning text-black"><i className="bi bi-file-earmark-medical" /> Redefinir senha</Card.Header>
                            <Form onSubmit={formSubmit} id="reset-senha-form">
                                <Card.Body>
                                      <Form.Group className="mb-3" controlId="password">
                                        <Card.Title><Form.Label>Nova senha</Form.Label></Card.Title>
                                        <Form.Control type="password" placeholder="Sua nova senha..." required onChange={(e)=>{data.password = e.target.value}} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="password_confirmation">
                                        <Card.Title><Form.Label>Confirme a senha</Form.Label></Card.Title>
                                        <Form.Control type="password" placeholder="Digite a senha novamente..." required onChange={(e)=>{data.password_confirmation = e.target.value}} />
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
            </>
        );
}
