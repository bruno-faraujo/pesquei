import React, {useContext, useState} from 'react';
import {Button, Card, Form, Modal} from "react-bootstrap";
import {Link, Navigate} from "react-router-dom";
import axios from "axios";
import {UserContext} from "./UserContext";
import Loading from "./Loading";

function Registro() {

    const [name, setName] = useState();
    const [firstname, setFirstname] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [password_confirmation, setPassword_confirmation] = useState();
    const [message, setMessage] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [hasError, setHasError] = useState(false);

    const {login, userLoading, setUserLoading, loggedIn} = useContext(UserContext);

    const formSubmit = (e) => {

        setUserLoading(true);

        e.preventDefault();

        const data = {
            name: name,
            email: email,
            password: password,
            password_confirmation: password_confirmation
        }
        axios.post('/register', data)
            .then((response) => {
                login(response.data)
                let fname = response.data.name.split(' ');
                setFirstname(fname[0]);
                setMessage("");
                setHasError(false);
                setModalShow(true);
            })
            .catch((error) => {
                try {
                    setMessage(error.response.data.message);
                } catch {

                }
                setUserLoading(false);
                setHasError(true);
                setModalShow(true);
            })
    }

    const handleOkButton = () => {
        if (hasError) {
            setModalShow(false)
        } else {
            return <Navigate to="/usuario"/>
        }
    }


    if (loggedIn) {
        return <Navigate to="/usuario"/>
    }

    const modal = (
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modalShow}
        >
            <Modal.Body style={hasError ? {backgroundColor: "tomato"} : {backgroundColor: "LightGreen"}}>
                {!hasError ? <h4>Bem vindo, {firstname}!</h4> : ''}
                {!hasError ? <h5>Sua conta foi criada com sucesso.<br/>Boa sorte em suas pescarias!</h5> : ''}
                <h5>{message}</h5>
            </Modal.Body>
            <Modal.Footer>
                <div style={{margin: "auto"}}>
                    <Button className={hasError ? "btn btn-danger btn-lg" : "btn btn-success btn-lg"}
                            onClick={handleOkButton}>OK</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )

    return (
        <div className="container-sm">
            {modal}
            {userLoading ? <Loading/> :
                <>
                    <br/><br/><br/><br/>
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <Card>
                                <Card.Header as="h5" className="bg-warning text-black"><i
                                    className="bi bi-person-plus-fill"/> Criar nova conta de acesso</Card.Header>
                                <Form onSubmit={formSubmit}>
                                    <Card.Body>
                                        <Form.Group className="mb-3" controlId="name">
                                            <Card.Title><Form.Label>Nome</Form.Label></Card.Title>
                                            <Form.Control type="text" placeholder="Digite o seu nome..." required
                                                          onChange={(e) => {
                                                              setName(e.target.value)
                                                          }}/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="email">
                                            <Card.Title><Form.Label>Endereço de e-mail</Form.Label></Card.Title>
                                            <Form.Control type="email" placeholder="Seu e-mail..." required
                                                          onChange={(e) => {
                                                              setEmail(e.target.value)
                                                          }}/>
                                            <Card.Text><Form.Text className="text-muted">
                                                Seu endereço de e-mail não será compartilhado com ninguem.
                                            </Form.Text></Card.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="password">
                                            <Card.Title><Form.Label>Senha</Form.Label></Card.Title>
                                            <Form.Control type="password" placeholder="Sua senha..." required
                                                          onChange={(e) => {
                                                              setPassword(e.target.value)
                                                          }}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="password_confirmation">
                                            <Card.Title><Form.Label>Confirme a senha</Form.Label></Card.Title>
                                            <Form.Control type="password" placeholder="Digite a senha novamente..."
                                                          required onChange={(e) => {
                                                setPassword_confirmation(e.target.value)
                                            }}/>
                                        </Form.Group>

                                        <div className="d-grid gap-2">
                                            <Button variant="success" size="lg" type="submit">
                                                Enviar
                                            </Button>
                                        </div>
                                        <br/>
                                        <Card.Text>Já possui uma conta? Faça o <Link to="/login"
                                                                                     style={{textDecoration: "none"}}>login</Link></Card.Text>
                                    </Card.Body>
                                </Form>
                            </Card>
                        </div>
                    </div>
                    <br/><br/><br/><br/></>}

        </div>
    );
}

export default Registro;