import React, {useContext, useEffect, useState} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import {Button, Card, Form, Modal} from "react-bootstrap";
import axios from "axios";
import {UserContext} from "./UserContext";

export default function ResetSenha(props) {

    const userContext = useContext(UserContext);
    const params = useParams();
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);
    const [message, setMessage] = useState([]);
    const [hasError, setHasError] = useState(false);

    const data = {
        token: params.token,
        password: '',
        password_confirmation: '',
    }

    const formSubmit = (e) => {
        e.preventDefault();
        axios.get('../sanctum/csrf-cookie')
            .then(()=> {
                axios.post('/change_password', data)
                    .then((response) => {
                        document.getElementById('reset-senha-form').reset();
                        setMessage(response.data.message);
                        setHasError(false);
                        setModalShow(true);
                    })
                    .catch((error) => {
                        document.getElementById('reset-senha-form').reset();
                        try {
                            setMessage(error.response.data.errors.password.map((item) => (<p>{item}</p>)));
                        } catch {
                            setMessage(error.response.data.message);
                        }
                        setHasError(true)
                        setModalShow(true);
                    })
            })

    }

    const handleOkButton = () => {
        if (hasError) {
            setModalShow(false)
        } else {
            navigate("/login", {replace: true});
        }
    }

    let modal = '';
    if (modalShow){
        modal =
            (
                <Modal
                    {...props}
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
                            <Button className={hasError ? "btn btn-danger btn-lg" : "btn btn-success btn-lg"} onClick={handleOkButton}>OK</Button>
                        </div>
                        </Modal.Footer>

                </Modal>
            )
    }

    useEffect(() => {
        if (userContext.loggedIn) {
            navigate("/login", { replace: true });
        }
    })

    return (
        <>
            <div className="container-sm">
                { modal }
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

                                    <div className="d-grid gap-2 text-center">
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
