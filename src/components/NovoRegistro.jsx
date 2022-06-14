import React, {useEffect, useState, useCallback} from 'react';
import {Button, Card, Col, Form, InputGroup, Modal, Row, Stack} from "react-bootstrap";
import axios from "axios";
import {GoogleMap, Marker, MarkerClusterer, useJsApiLoader} from "@react-google-maps/api";
import Loading from "./Loading";
import {useNavigate} from "react-router-dom";

function NovoRegistro() {

    const [modalShow, setModalShow] = useState(false);
    const [hasError, setHasError] = useState();
    const [message, setMessage] = useState();
    const [peixes, setPeixes] = useState();
    const [pontos, setPontos] = useState();
    const [peixeSelected, setPeixeSelected] = useState();
    const [selectedPonto, setSelectedPonto] = useState();
    const [peso, setPeso] = useState();
    const [comprimento, setComprimento] = useState();
    const [foto, setFoto] = useState();
    const [center, setCenter] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(false);
    const [semPontos, setSemPontos] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/pontos", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                setPontos(response.data)
            })
            .catch((error) => {
                setHasError(true);
                setMessage(error.response.data.message);
                setModalShow(true);
                setSemPontos(true);
            })

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition({
                    lat: parseFloat(position.coords.latitude),
                    lng: parseFloat(position.coords.longitude)
                });
                setCenter(currentPosition)
            }
        )
    }, [])


    useEffect(() => {
        axios.get("/peixes")
            .then((response) => {
                setPeixes(response.data)
            })
    }, [])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    setCurrentPosition({
                        lat: parseFloat(position.coords.latitude),
                        lng: parseFloat(position.coords.longitude)
                    });
                    if (!center) {
                        setCenter(currentPosition)
                    }
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setMessage("A Geolocalização foi negada pelo usuário.")
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setMessage("Localização indisponível.")
                            break;
                        case error.TIMEOUT:
                            setMessage("Tempo de espera excedido.")
                            break;
                        case error.UNKNOWN_ERROR:
                            setMessage("Erro desconhecido.")
                            break;
                    }
                    setHasError(true)
                    setModalShow(true)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 300000
                }
            )
        } else {
            setMessage("Para usar esse recurso você precisa permitir a localização do dispositivo pelo navegador.")
            setHasError(true)
            setModalShow(true)
        }
    }, [currentPosition])

    const centerMap = (position) => {
        if (position) {
            mapInstance.panTo(position)
        }
    };

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API
    })

    const onMarkerClick = (e) => {
        setSelectedPonto(e.id)
    }

    const handlePonto = (e) => {
        setSelectedPonto(e.target.value)
        const ponto = pontos.find((ponto) => ponto.id === parseInt(e.target.value, 10))
        if (ponto) {
            centerMap({lat: parseFloat(ponto.latitude), lng: parseFloat(ponto.longitude)})
            mapInstance.setZoom(25)
        }
    }

    const handlePeixe = (e) => {
        setPeixeSelected(e.target.value);
    }

    const handleSubmit = (e) => {
        setSubmitting(true)
        e.preventDefault();


        const formData = new FormData();


        formData.append("ponto_id", selectedPonto);
        formData.append("peixe_id", peixeSelected);

        if (comprimento) {
            formData.append("comprimento", parseInt(comprimento, 10));
        }

        if (peso) {
            formData.append("peso", parseInt(peso, 10));
        }

        if (foto) {
            formData.append("foto", foto);
        }


        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        };
                axios.post('/novo_pescado', formData, config)
                    .then((response) => {
                        setMessage(response.data.message)
                        setHasError(false);
                        setModalShow(true);
                    })
                    .catch((error) => {
                        try {
                            setMessage(error.data.errors.foto.map((item) => (<p>{item}</p>)))
                        } catch {
                            setMessage(error.response.data.message);
                        }
                        setSubmitting(false)
                        setHasError(true);
                        setModalShow(true);
                    })
    }

    const handleOkButton = () => {
        if (semPontos) {
            navigate("/usuario", {replace: true});
        }
        if (hasError) {
            setModalShow(false)
        } else {
            setModalShow(false)
            window.location.reload();
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

    return isLoaded ? (
        <Card>
            {modal}
            <Card.Header as="h5" className="bg-warning text-black">
                <i className="bi bi-file-earmark-plus">
                </i> Registrar
                peixe pescado</Card.Header>
            {center ? (<Row>
                    <Col lg={8}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center ? center : null}
                            zoom={15}
                            options={options}
                            onLoad={onMapLoad}
                        >

                            { /* Child components, such as markers, info windows, etc.*/}
                            {currentPosition ? (<Marker key="current-position"
                                                        position={{lat: currentPosition.lat, lng: currentPosition.lng}}
                                                        icon="https://maps.google.com/mapfiles/kml/pal3/icon28.png"/>) : ""}
                            {pontos ? <MarkerClusterer>
                                {(clusterer) => pontos.map((ponto) => (
                                    <Marker id={ponto.id}
                                            latitude={parseFloat(ponto.latitude)}
                                            longitude={parseFloat(ponto.longitude)}
                                            key={ponto.id}
                                            position={{
                                                lat: parseFloat(ponto.latitude),
                                                lng: parseFloat(ponto.longitude),
                                            }}
                                            title={ponto.nome}
                                            clusterer={clusterer}
                                            onClick={onMarkerClick.bind(this, ponto)}
                                    />
                                ))}
                            </MarkerClusterer> : ""}
                        </GoogleMap>
                        <Row>
                            <Col className={"py-2 text-nowrap"}>
                                {<Button variant="info" size={"sm"} onClick={() => centerMap(currentPosition)}><i
                                    className="bi bi-bullseye"></i> Centralizar
                                    mapa</Button>}
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={4}>
                        <Form onSubmit={handleSubmit}>
                            <Card.Body>
                                {pontos ? (<Form.Group controlId="ponto" className="py-2">
                                    <Form.Label as="h6">Selecione o ponto</Form.Label>
                                    <Form.Select aria-label="Selecione o ponto" value={selectedPonto}
                                                 onChange={handlePonto}>
                                        <option>Ponto...</option>
                                        {pontos.map((ponto) => (
                                            <option key={"ponto-" + ponto.id} value={ponto.id}>{ponto.nome}</option>))}
                                    </Form.Select>
                                </Form.Group>) : <Loading/>}
                                {peixes ? <Form.Group controlId="peixe" className="py-2">
                                    <Form.Label as="h6">Peixe</Form.Label>
                                    <Form.Select aria-label="Selecione o peixe" value={peixeSelected}
                                                 onChange={handlePeixe}>
                                        <option>Peixe...</option>
                                        {peixes.map((peixe) => (
                                            <option key={"peixe-" + peixe.nome}
                                                    value={peixe.id}>{peixe.nome}</option>))}
                                    </Form.Select>
                                </Form.Group> : <Loading/>}
                                <Stack direction="horizontal" gap="2">
                                    <Form.Group controlId="comprimento" className="py-2">
                                        <Card.Title><Form.Label as="h6">Comprimento</Form.Label></Card.Title>
                                        <InputGroup size="sm">
                                            <Form.Control size="sm" type="text"
                                                          onChange={e => setComprimento(e.target.value)}/>
                                            <InputGroup.Text>cm</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="peso" className="py-2">
                                        <Card.Title><Form.Label as="h6">Peso</Form.Label></Card.Title>
                                        <InputGroup size="sm">
                                            <Form.Control size="sm" type="text"
                                                          onChange={e => setPeso(e.target.value)}/>
                                            <InputGroup.Text>g</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                </Stack>
                                <Form.Group controlId="foto" as="h6" className="py-2">
                                    <Form.Label>Foto do peixe</Form.Label>
                                    <Form.Control size="sm" multi="false" type="file"
                                                  onChange={e => setFoto(e.target.files[0])}/>
                                </Form.Group>
                                {!submitting ? (<Form.Group className="py-2">
                                    <Button variant="success" size="lg" type="submit">
                                        <i className="bi bi-journal-check"></i> Salvar
                                    </Button>
                                </Form.Group>) : <Loading/>}

                            </Card.Body>
                        </Form>
                    </Col>
                </Row>
            ) : <Loading/>}
        </Card>
    ) : <Loading/>
}

export default NovoRegistro;