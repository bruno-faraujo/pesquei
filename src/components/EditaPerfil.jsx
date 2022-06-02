import React, {Fragment, useContext, useState} from 'react';
import {Button, Card, Col, Form, Modal, Row} from "react-bootstrap";
import {UserContext} from "./UserContext";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function EditaPerfil() {

    const user = useContext(UserContext);
    const [perfilEnabled, setPerfilEnabled] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirmation, setPasswordConfirmation] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [hasError,setHasError] = useState();
    const [message, setMessage] = useState();
    const [submitting, setSubmitting] = useState(false);

    const togglePerfilEdit = () => {
        setPerfilEnabled(!perfilEnabled)
    }

    const togglePasswordEdit = () => {
        setChangePassword(!changePassword);
    }

    const handleOkButton = () => {
        document.documentElement.scrollTo(0, 0)
        if (hasError) {
            setModalShow(false)
        } else {
            setModalShow(false)
            window.location.reload();
        }
    }

    const handlePerfilSubmit = (e) => {
        setSubmitting(true);
        e.preventDefault();

        let data = {};

        if (name) {
            data.name = name
        } else {
            data.name = user.user.name
        }

        if (email) {
            data.email = email
        } else {
            data.email = user.user.email
        }

        if (password) {
            data.password = password
        }

        if (passwordConfirmation) {
            data.password_confirmation = passwordConfirmation
        }

            axios.post("/update_user", data)
                .then((response) => {
                    setHasError(false);
                    setMessage(response.data.message);
                    setModalShow(true);
                    setSubmitting(false);

                })
                .catch((error) => {
                    setHasError(true);
                    setMessage(error.response.data.message)
                    setModalShow(true)
                })

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
                    <Modal.Body style={hasError ? {backgroundColor: "tomato"} : {backgroundColor: "LightGreen"}}>
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
    }

    return (
        <Fragment>
            {modal}
            <Col>
                <Card>
                    <Form onSubmit={handlePerfilSubmit}>
                        <Card.Header as="h5">Perfil</Card.Header>
                        <Card.Body>
                            {!perfilEnabled ?
                                <Card.Title>Habilite a edição para alterar seus dados pessoais</Card.Title> : ""}
                            <Card.Text><Button variant={perfilEnabled ? "secondary" : "warning"} size={"sm"}
                                               onClick={togglePerfilEdit}>{perfilEnabled ? "Desativar edição" : "Habilitar edição"}</Button>
                            </Card.Text>
                            <Card.Text>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label className={"fw-bold"}>Seu nome</Form.Label>
                                    <Form.Control type="text" value={name ? name : user.user.name}
                                                  onChange={e=>setName(e.target.value)}
                                                  disabled={perfilEnabled ? false : true}/>
                                </Form.Group>
                            </Card.Text>
                            <Card.Text>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className={"fw-bold"}>Endereço de email</Form.Label>
                                    <Form.Control type="email" value={email ? email : user.user.email}
                                                  onChange={e=>setEmail(e.target.value)}
                                                  disabled={perfilEnabled ? false : true}/>
                                </Form.Group>
                            </Card.Text>
                            {perfilEnabled ? <Card.Text>
                                <Form.Check
                                    type={"checkbox"}
                                    label={"Quer alterar a senha?"}
                                    onClick={togglePasswordEdit}
                                />
                            </Card.Text> : ""}
                            {changePassword ?
                                <Row>
                                    <Col>
                                        <Card.Text>
                                            <Form.Group className="mb-3" controlId="password">
                                                <Form.Label>Alterar senha de acesso</Form.Label>
                                                <Form.Control type="password"
                                                              onChange={e => setPassword(e.target.value)}
                                                              disabled={perfilEnabled ? false : true}/>
                                            </Form.Group>
                                        </Card.Text>
                                    </Col>
                                    <Col>
                                        {password ? <Card.Text>
                                            <Form.Group className="mb-3" controlId="password_confirmation">
                                                <Form.Label>Confirme a senha digitada</Form.Label>
                                                <Form.Control type="password"
                                                              onChange={e=>setPasswordConfirmation(e.target.value)}
                                                              disabled={perfilEnabled ? false : true}/>
                                            </Form.Group>
                                        </Card.Text> : ""}
                                    </Col>
                                </Row> : ""}
                            {
                                perfilEnabled ?
                                    <Button variant="success" type={"submit"}> <i
                                        className="bi bi-journal-check"></i> Salvar</Button> : ""
                            }
                        </Card.Body>
                    </Form>
                </Card>
            </Col>
            <Col className={"py-5"}>
                <Card>
                    <Card.Header as="h5">Pontos de pesca</Card.Header>
                    <Card.Body>
                        <Card.Title>Special title treatment</Card.Title>
                        <Card.Text>
                            With supporting text below as a natural lead-in to additional content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Fragment>
    )
        ;
}

export default EditaPerfil;