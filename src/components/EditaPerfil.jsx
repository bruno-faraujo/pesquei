import React, {Fragment, useContext, useEffect, useState, useCallback} from 'react';
import {Button, Card, Col, Form, ListGroup, ListGroupItem, Modal, Row, Stack, Table} from "react-bootstrap";
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
    const [peixe, setPeixe] = useState(null);
    const [pontos, setPontos] = useState(null);
    const [ponto, setPonto] = useState(null);
    const [selectedPonto, setSelectedPonto] = useState(null);
    const [selectedPeixe, setSelectedPeixe] = useState(null);
    const [loadingPonto, setLoadingPonto] = useState(false);
    const [peixeLoading, setPeixeLoading] = useState(false);
    const [pontoNome, setPontoNome] = useState(null);
    const [deletePontoConfirmation, setDeletePontoConfirmation] = useState(false);
    const [deletePeixeConfirmation, setDeletePeixeConfirmation] = useState(false);
    const [defineNewPosition, setDefineNewPosition] = useState(false);
    const [showPeixeDetails, setShowPeixeDetails] = useState(false);
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

    const deletePonto = () => {

        axios.post("/delete_ponto/" + ponto.id, {})
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

        axios.get("/pontos", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                setPontos(response.data)
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    const getPonto = (id) => {
        axios.get("/ponto/" + id)
            .then((response) => {
                setPonto(response.data);
                setPontoNome(response.data.nome)
                setLoadingPonto(false);
            })
            .catch((error) => {
                console.log(error.message);
            })
    }

    const getPeixes = (pontoId) => {
        axios.get("/ponto/" + pontoId + "/pescados")
            .then((response) => {

                if (response.data.length !== 0) {
                    setPeixes(response.data)
                } else {
                    setPeixes(null);
                }

            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    const getPeixe = (peixeId) => {
        setPeixeLoading(true);
        axios.get("/ponto/" + ponto.id + "/pescado/" + peixeId)
            .then((response) => {
                setPeixe(response.data)
                setPeixeLoading(false);
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    const deletaPeixe = (peixeId) => {

        axios.post("/ponto/" + ponto.id + "/pescado_delete/" + peixeId, {})
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

    const editaPeixe = (e) => {

//     Route::post('ponto/{ponto_id}/pescado_update/{pescado_id}', [PescadoController::class, 'updatePescado']);
        console.log("Editar peixe pescado com ID: " + e)


    }

    const changePonto = (e) => {
        setPonto(null);
        setSelectedPonto(e);
    }

    const toggleDetelePonto = () => {
        setHasError(false);
        setDeletePontoConfirmation(true);
        setMessage("Tem certeza que deseja excluir o ponto selecionado? Todos os peixes e fotos associados a este ponto também serão apagados!")
        setModalShow(true);
    }

    const toggleDetelePeixe = (e) => {
        setHasError(false);
        setSelectedPeixe(e);
        setDeletePeixeConfirmation(true);
        setMessage("Tem certeza que deseja excluir o peixe selecionado? As informações e fotos associadas a esse peixe também serão apagadas!")
        setModalShow(true);
    }

    const toggleEditaPeixe = (e) => {
        getPeixe(e)
        setShowPeixeDetails(true);
    }

    const togglePontoDetails = () => {
        setLoadingPonto(true);
        setPeixes(null);
        setSelectedPeixe(null);
        setPeixe(null);
        setShowPeixeDetails(false);
        getPonto(selectedPonto);
        getPeixes(selectedPonto);
    }

    const togglePerfilEdit = () => {
        setPerfilEnabled(!perfilEnabled)
    }

    const togglePasswordEdit = () => {
        setChangePassword(!changePassword);
    }

    const toggleMudarLocal = () => {
        setHasError(false);
        setDefineNewPosition(true);
        setMessage("Marque a nova localização no mapa e depois salve as alterações.")
        setModalShow(true);
    }

    const onMarkerClick = (e) => {
        if (defineNewPosition) {
            setPonto({...ponto, latitude: e.latLng.lat(), longitude: e.latLng.lng()})
        }
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

    const saveAlteracoesPonto = () => {

        const data = {
            id: ponto.id,
            nome: pontoNome,
            latitude: ponto.latitude,
            longitude: ponto.longitude
        }

        axios.post("/update_ponto/" + ponto.id, data)
            .then((response) => {
                setHasError(false);
                setMessage(response.data.message);
                setModalShow(true);
            })
            .catch((error) => {
                setHasError(true);
                setMessage(error.message)
                setModalShow(true);
            })
    }


    const handleOkButton = () => {
        if (hasError) {
            setModalShow(false)
        } else if (deletePontoConfirmation) {
            deletePonto()
            setDeletePontoConfirmation(false);
            setModalShow(false);
        } else if (deletePeixeConfirmation) {
            deletaPeixe(selectedPeixe)
            setDeletePeixeConfirmation(false);
            setModalShow(false);
            setSelectedPeixe(null);
            getPeixes(selectedPonto);
        } else if (defineNewPosition) {
            setModalShow(false);
        } else {
            setModalShow(false)
            //      window.location.reload();
        }
    }

    const handleCancelButton = () => {
        setDeletePontoConfirmation(false);
        setDeletePeixeConfirmation(false);
        setSelectedPeixe(null);
        setShowPeixeDetails(false);
        setModalShow(false);
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
                        style={hasError ? {backgroundColor: "tomato"} : deletePontoConfirmation || deletePeixeConfirmation ?
                            {backgroundColor: "Yellow"} : {backgroundColor: "LightGreen"}}>
                        <h5>{message}</h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <div style={{margin: "auto"}}>
                            <Button
                                className={hasError ? "btn btn-danger btn-md me-5 btn-block" : "btn btn-success btn-md me-5 btn-block"}
                                onClick={handleOkButton}>OK</Button>
                            {deletePontoConfirmation || deletePeixeConfirmation ?
                                <Button className={"btn-warning btn-md me-5 btn-block"}
                                        onClick={handleCancelButton}>Cancelar</Button> : ""}
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
                        <Card.Header as="h5">Dados pessoais</Card.Header>
                        <Card.Body>
                            {!perfilEnabled ?
                                <Card.Title>Habilite a edição para alterar as informações</Card.Title> : ""}
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
                                    <Button variant="success" type={"submit"} size={"md"}> <i
                                        className="bi bi-journal-check"></i> Salvar alterações</Button> : ""
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
                                        <option value={"undefined"}>Selecionar ponto...</option>
                                        {pontos.map((ponto) => (
                                            <option key={ponto.id}
                                                    value={ponto.id}>{ponto.nome}</option>))}
                                    </Form.Select>
                                </Form.Group>
                                {selectedPonto && selectedPonto !== "undefined" ?
                                    <Button variant={"info"} size={"sm"} onClick={togglePontoDetails}><i
                                        className={"bi bi-arrow-bar-right"}/> Mostrar detalhes do ponto</Button>
                                    : ""}
                                {loadingPonto ?
                                    <Loading/> :
                                    ponto && isLoaded ?
                                        <Col className={"py-3"}>
                                            <GoogleMap
                                                mapContainerStyle={containerStyle}
                                                center={{
                                                    lat: parseFloat(ponto.latitude),
                                                    lng: parseFloat(ponto.longitude)
                                                }}
                                                zoom={20}
                                                options={options}
                                                onLoad={onMapLoad}
                                                onClick={onMarkerClick}
                                            >
                                                { /* Child components, such as markers, info windows, etc.*/}
                                                <Marker key="current-position"
                                                        position={{
                                                            lat: parseFloat(ponto.latitude),
                                                            lng: parseFloat(ponto.longitude)
                                                        }}/>
                                            </GoogleMap>
                                            <Col className={"text-center py-2"}>
                                                {defineNewPosition ?
                                                    <Button variant={"success"} size={"sm"} className={"btn-block"}
                                                            onClick={() => setDefineNewPosition(!defineNewPosition)}><i
                                                        className={"bi bi-lock-fill"}/> Travar localização</Button>
                                                    : <Button variant={"warning"} size={"sm"} className={"btn-block"}
                                                              onClick={toggleMudarLocal}><i
                                                        className={"bi bi-bullseye"}/> Redefinir localização do
                                                        ponto</Button>}
                                            </Col>
                                            <Form.Group className="mb-3 py-0" controlId="nome_ponto">
                                                <Form.Label className={"fs-5"}>Alterar nome do local</Form.Label>
                                                <Form.Control type="text" value={pontoNome}
                                                              onChange={e => setPontoNome(e.target.value)}/>
                                            </Form.Group>
                                            <Row>
                                                <Col>
                                                    <Button variant={"success"} size={"md"}
                                                            onClick={saveAlteracoesPonto}><i
                                                        className="bi bi-journal-check"></i> Salvar alterações</Button>
                                                </Col>
                                                <Col className={"text-end"}>
                                                    <Button variant={"danger"} size={"sm"}
                                                            className={"text-end"}
                                                            onClick={toggleDetelePonto}><i
                                                        className="bi bi-x-octagon"></i> Excluir ponto</Button>
                                                </Col>
                                            </Row>

                                            {peixes ?
                                                <Row className={"py-4"}>
                                                    <span className={"py-2 fs-5"}>Peixes registrados</span>
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
                                                                    <Stack direction="horizontal" gap={3}>
                                                                        <Button size={"sm"} variant={"danger"}
                                                                                className={"btn-block"}
                                                                                title={"Remover peixe"}
                                                                                onClick={(e) => toggleDetelePeixe(peixe.id)}><i
                                                                            className={"bi bi-x-circle"}/></Button>

                                                                        <Button size={"sm"} variant={"warning"}
                                                                                title={"Editar informações"}
                                                                                className={"btn-block"}
                                                                                onClick={(e) => toggleEditaPeixe(peixe.id)}><i
                                                                            className={"bi bi-pencil"}/></Button>
                                                                    </Stack>

                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>

                                                    </Table></Row> :
                                                <p className={"p-3"}>Não há peixes registrados neste ponto.</p>}
                                            {showPeixeDetails ?
                                                !peixeLoading ?
                                                    <Row className="justify-content-md-center">
                                                        <Col lg="5" md="9" sm={"12"}>
                                                            {peixe ?
                                                                peixe.media ?
                                                                    <Card>
                                                                        <Card.Img variant="top"
                                                                                  className={"img-thumbnail"}
                                                                                  style={{
                                                                                      objectFit: "cover",
                                                                                      maxHeight: "250px",
                                                                                      maxWidth: "650px"
                                                                                  }}
                                                                                  src={peixe.media.thumb}>
                                                                        </Card.Img>
                                                                        <Card.ImgOverlay>
                                                                            <Stack className={"mt-0"}
                                                                                   direction={"horizontal"}
                                                                                   gap={5}>
                                                                                <Button variant={"warning"} size={"sm"}
                                                                                        title={"Trocar foto"}><i
                                                                                    className="bi bi-pencil"></i></Button>
                                                                                <div className={"vr"}></div>
                                                                                <Button variant={"danger"} size={"sm"}
                                                                                        title={"Excluir foto"}><i
                                                                                    className="bi bi-x-octagon"></i></Button>
                                                                            </Stack>
                                                                        </Card.ImgOverlay>
                                                                    </Card>
                                                                    : "Nenhuma foto registrada." : ""}
                                                            <Card>
                                                                <Card.Body>
                                                                    <Card.Title>{peixe.peixe.nome}</Card.Title>
                                                                    <Card.Text>
                                                                    <span
                                                                        className={"fst-italic"}>{peixe.peixe.nome_cientifico}  </span>

                                                                        <Button variant={"warning"} size={"sm"}
                                                                                title={"Alterar peixe"}><i
                                                                            className="bi bi-pencil"></i> Alterar
                                                                            peixe</Button>
                                                                    </Card.Text>
                                                                </Card.Body>
                                                                <ListGroup className="list-group-flush">
                                                                    <ListGroupItem>Habitat: {peixe.peixe.habitat} </ListGroupItem>
                                                                    <ListGroupItem>Comprimento: {peixe.comprimento ? peixe.comprimento + "cm" : "Não informado"}
                                                                          <Button variant={"warning"} size={"sm"}
                                                                                title={"Editar comprimento"}><i
                                                                            className="bi bi-pencil"></i></Button></ListGroupItem>
                                                                    <ListGroupItem>Peso: {peixe.peso ? peixe.peso + "g" : "Não informado"}
                                                                          <Button variant={"warning"} size={"sm"}
                                                                                title={"Editar peso"}><i
                                                                            className="bi bi-pencil"></i></Button></ListGroupItem>
                                                                </ListGroup>
                                                                <Card.Body>


                                                                    <Stack direction={"horizontal"} gap={5}>
                                                                        <Button variant={"success"} size={"sm"}>
                                                                            <i className="bi bi-journal-check"></i> Salvar
                                                                            alterações</Button>

                                                                        <Button variant={"danger"} size={"sm"}
                                                                                className={"text-end"}>
                                                                            <i className="bi bi-x-octagon"></i> Excluir
                                                                            peixe</Button>

                                                                    </Stack>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                    : <Loading/>
                                                : ""}
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