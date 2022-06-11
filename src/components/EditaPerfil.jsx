import React, {Fragment, useContext, useEffect, useState, useCallback} from 'react';
import {Button, Card, Col, Form, Modal, Row, Table} from "react-bootstrap";
import {UserContext} from "./UserContext";
import axios from "axios";
import Loading from "./Loading";
import {useNavigate} from "react-router-dom";
import {GoogleMap, Marker, useJsApiLoader} from "@react-google-maps/api";

function EditaPerfil() {

    const {user} = useContext(UserContext);
    const [perfilEnabled, setPerfilEnabled] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirmation, setPasswordConfirmation] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [hasError, setHasError] = useState();
    const [message, setMessage] = useState();
    const [submitting, setSubmitting] = useState(false);
    const [peixes, setPeixes] = useState(null);
    const [pontos, setPontos] = useState(null);
    const [ponto, setPonto] = useState(null);
    const [selectedPonto, setSelectedPonto] = useState(null);
    const [loadingPonto, setLoadingPonto] = useState(false);
    const [pontoNome, setPontoNome] = useState(null);
    const [deletePontoConfirmation, setDeletePontoConfirmation] = useState(false);
    const navigate = useNavigate();

    const containerStyle = {
        height: "50vh",
        borderRadius: "0.25rem"
    };
    const options = {
        disableDefaultUI: true,
        fullscreenControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeId: 'satellite'
    }
    const onMapLoad = useCallback((map) => {
        setMapInstance(map);
    }, []);

    const togglePerfilEdit = () => {
        setPerfilEnabled(!perfilEnabled)
    }

    const togglePasswordEdit = () => {
        setChangePassword(!changePassword);
    }

    const handleOkButton = () => {
        if (hasError) {
            setModalShow(false)
        } else if (deletePontoConfirmation) {
            deletePonto()
            setDeletePontoConfirmation(false);
            setModalShow(false);
        } else {
            setModalShow(false)
            window.location.reload();
        }
    }


    const handleCancelButton = () => {
        setDeletePontoConfirmation(false);
        setModalShow(false);
    }


    const deletePonto = () => {

        axios.post("/delete_ponto/"+ponto.id, {})
            .then((response) => {
                setHasError(false);
                setModalShow(true);
                setMessage(response.data.message)
            })
            .catch((error) => {
                setMessage(error.message)
                setHasError(true);
                setModalShow(true);
            })

    }

    const getPontos = () => {

        axios.get("/pontos")
            .then((response) => {
                setPontos(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const getPonto = (id) => {
        axios.get("/ponto/" + id)
            .then((response) => {
                setPonto(response.data);
                setLoadingPonto(false);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getPeixes = (pontoId) => {
        axios.get("/ponto/" + pontoId + "/pescados")
            .then((response) => {

                if (response.data.length !== 0) {
                    setPeixes(response.data)
                }

            })
            .catch((error) => {
                console.log(error)
            })
    }

    const changePonto = (e) => {
        setPonto(null);
        setSelectedPonto(e);
    }

    const toggleDetelePonto = () => {
        setDeletePontoConfirmation(true);
        setMessage("Tem certeza que deseja excluir o ponto selecionado? Todos os peixes e fotos associados a este ponto também serão apagados!")
        setModalShow(true);
    }

    const togglePontoDetails = () => {
        setLoadingPonto(true);
        setPeixes(null);
        getPonto(selectedPonto);
        getPeixes(selectedPonto);
    }

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API
    })

    useEffect(() => {
        setName(user.name);
        setEmail(user.email);
        getPontos();
    }, [user]);

    const handlePerfilSubmit = (e) => {
        setSubmitting(true);
        e.preventDefault();

        let data = {};

        if (name) {
            data.name = name
        } else {
            data.name = user.name
        }

        if (email) {
            data.email = email
        } else {
            data.email = user.email
        }

        if (password) {
            data.password = password
        }

        if (passwordConfirmation) {
            data.password_confirmation = passwordConfirmation
        }
        axios.post("/update_user", data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
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
                    <Modal.Body
                        style={hasError ? {backgroundColor: "tomato"} : deletePontoConfirmation ? {backgroundColor: "Yellow"} : {backgroundColor: "LightGreen"}}>
                        <h5>{message}</h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <div style={{margin: "auto"}}>
                            <Button className={hasError ? "btn btn-danger btn-md me-5 btn-block" : "btn btn-success btn-md me-5 btn-block"}
                                    onClick={handleOkButton}>OK</Button>
                            {deletePontoConfirmation ? <Button className={"btn-warning btn-md me-5 btn-block"} onClick={handleCancelButton}>Cancelar</Button> : ""}
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
                                    <Form.Control type="text" value={name || ""}
                                                  onChange={e => setName(e.target.value)}
                                                  disabled={perfilEnabled ? false : true}/>
                                </Form.Group>
                            </Card.Text>
                            <Card.Text>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className={"fw-bold"}>Endereço de email</Form.Label>
                                    <Form.Control type="email" value={email || ""}
                                                  onChange={e => setEmail(e.target.value)}
                                                  disabled={perfilEnabled ? false : true}/>
                                </Form.Group>
                            </Card.Text>
                            {perfilEnabled ?
                                <Card.Text>
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
                                        {password ?
                                            <Card.Text>
                                                <Form.Group className="mb-3" controlId="password_confirmation">
                                                    <Form.Label>Confirme a senha digitada</Form.Label>
                                                    <Form.Control type="password"
                                                                  onChange={e => setPasswordConfirmation(e.target.value)}
                                                                  disabled={perfilEnabled ? false : true}/>
                                                </Form.Group>
                                            </Card.Text> : ""}
                                    </Col>
                                </Row> : ""}
                            {
                                perfilEnabled ?
                                    <Button variant="success" type={"submit"} size={"sm"}> <i
                                        className="bi bi-journal-check"></i> Salvar</Button> : ""
                            }
                        </Card.Body>
                    </Form>
                </Card>
            </Col>
            {pontos ?
                <Col className={"py-3"}>
                    <Form>
                        <Card>
                            <Card.Header as="h5">Gerenciar pontos</Card.Header>
                            <Card.Body>

                                <Form.Group controlId="pontos" className="py-2">
                                    <Form.Select aria-label="Selecione um ponto"
                                                 onChange={(e) => changePonto(e.target.value)}>
                                        <option>Selecionar ponto...</option>
                                        {pontos.map((ponto) => (
                                            <option key={ponto.id}
                                                    value={ponto.id}>{ponto.nome}</option>))}
                                    </Form.Select>
                                </Form.Group>
                                {!ponto ?
                                    <Button variant={"outline-success"} size={"sm"} onClick={togglePontoDetails}><i
                                        className={"bi bi-arrow-bar-right"}/> Mostrar detalhes</Button>
                                    : ""}

                                {loadingPonto ?
                                    <Loading/> :
                                    ponto && isLoaded ?
                                        <Col>
                                            <GoogleMap
                                                mapContainerStyle={containerStyle}
                                                center={{
                                                    lat: parseFloat(ponto.latitude),
                                                    lng: parseFloat(ponto.longitude)
                                                }}
                                                zoom={20}
                                                options={options}
                                                onLoad={onMapLoad}
                                            >
                                                { /* Child components, such as markers, info windows, etc.*/}
                                                <Marker key="current-position"
                                                        position={{
                                                            lat: parseFloat(ponto.latitude),
                                                            lng: parseFloat(ponto.longitude)
                                                        }}/>
                                            </GoogleMap>
                                            <Form.Group className="mb-3 py-3" controlId="nome_ponto">
                                                <Form.Label className={"fs-5"}>Nome do local</Form.Label>
                                                <Form.Control type="text" value={ponto.nome}
                                                              onChange={e => setPontoNome(e.target.value)}/>
                                            </Form.Group>

                                            {peixes ?
                                                <>
                                                    <span className={"py-3 fs-5"}>Peixes registrados</span>
                                                    <Table striped bordered responsive>
                                                        <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Peixe</th>
                                                            <th>Data</th>
                                                            <th>Ações</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {peixes.map((peixe, index) => (
                                                            <tr key={peixe.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{peixe.peixe.nome}</td>
                                                                <td>{new Date(peixe.created_at).toUTCString()}</td>
                                                                <td>
                                                                    <Button size={"sm"} variant={"danger"}
                                                                            className={"btn-block p-2 me-3"}
                                                                            title={"Remover"}><i
                                                                        className={"bi bi-x-circle"}/></Button>


                                                                    <Button size={"sm"} variant={"warning"}
                                                                            title={"Editar"}
                                                                            className={"btn-block  p-2 me-3"}><i
                                                                        className={"bi bi-pencil"}/></Button>

                                                                </td>
                                                            </tr>

                                                        ))}
                                                        </tbody>

                                                    </Table></> : <p className={"p-3"}>Não há peixes registrados neste ponto.</p>}
                                            <Row>
                                                <Col>
                                                    <Button variant={"success"} size={"sm"}> Salvar</Button>
                                                </Col>
                                                <Col>
                                                    <Button variant={"danger"} size={"sm"}
                                                            className={"text-end"}
                                                            onClick={toggleDetelePonto}> Excluir ponto</Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                        : ""}
                            </Card.Body>
                        </Card>
                    </Form>
                </Col> : ""}
        </Fragment>
    );
}

export default EditaPerfil;