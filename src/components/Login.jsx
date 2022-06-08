import React, {useContext, useState} from 'react';
import {Button, Card, Form, Modal} from "react-bootstrap";
import {Link, Navigate} from "react-router-dom";
import axios from "axios";
import {UserContext} from "./UserContext";
import Loading from "./Loading";

function Login() {

    const {loggedIn, login, logout, userLoading, setUserLoading} = useContext(UserContext);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [hasError, setHasError] = useState(false);
    const [message, setMessage] = useState();
    const [modalShow, setModalShow] = useState(false);

    const formSubmit = (e) => {
        setUserLoading(true);
        e.preventDefault();

        const data = {
            email: email,
            password: password
        }
        axios.post('/login', data)
            .then((response) => {
                localStorage.setItem('token', response.data.token)
                login(response.data.user)
            })
            .catch((error) => {
                logout();
                setMessage(error.message);
                setHasError(true);
                setModalShow(true);
            })
    }

    const handleOkButton = () => {
        if (hasError) {
            setModalShow(false)
        }
    }
    let modal = '';
    if (modalShow) {
        modal =
            (
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={modalShow}
                >
                    <Modal.Body
                        style={hasError ? {backgroundColor: "tomato"} : {backgroundColor: "LightGreen"}}>
                        <h5>{message}</h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <div style={{margin: "auto"}}>
                            <Button
                                className={hasError ? "btn btn-danger btn-lg" : "btn btn-success btn-lg"}
                                onClick={handleOkButton}>OK</Button>
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
                    {loggedIn ? <Navigate to={"/usuario"} replace={true}/> : userLoading && !loggedIn ? <Loading/> :  <Card>
                        <Card.Header as="h5" className="bg-primary text-white"><i
                            className="bi bi-box-arrow-in-right"/> Login</Card.Header>
                        <Form onSubmit={formSubmit}>
                            <Card.Body>
                                <Form.Group className="mb-3" controlId="email">
                                    <Card.Title><Form.Label>Endereço de e-mail</Form.Label></Card.Title>
                                    <Form.Control type="email" placeholder="Seu e-mail..." required
                                                  onChange={(e) => {
                                                      setEmail(e.target.value)
                                                  }}/>
                                    <Card.Text><Form.Text className="text-muted">
                                        Seu endereço de e-mail não será compartilhado com ningúem.
                                    </Form.Text></Card.Text>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Card.Title><Form.Label>Senha</Form.Label></Card.Title>
                                    <Form.Control type="password" placeholder="Sua senha..." required
                                                  onChange={(e) => {
                                                      setPassword(e.target.value)
                                                  }}/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="lembrar">
                                    <Form.Check type="checkbox" label="Lembrar"/>
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
                    </Card>}

                </div>
            </div>
            <br/><br/><br/><br/>
        </div>
    );
}

export default Login;