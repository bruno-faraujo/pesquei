import React, {useState, useCallback, useEffect} from 'react';
import {Button, Card, Col, Form, Modal, Row, Stack} from "react-bootstrap";
import {GoogleMap, Marker, MarkerClusterer, useJsApiLoader} from "@react-google-maps/api";
import Loading from "./Loading";
import axios from "axios";

function NovoPonto() {

    const [modalShow, setModalShow] = useState(false);
    const [hasError, setHasError] = useState();
    const [message, setMessage] = useState();
    const [center, setCenter] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(false);
    const [pontos, setPontos] = useState();
    const [selectedPonto, setSelectedPonto] = useState();
    const [submitting, setSubmitting] = useState(false);

    const [mapInstance, setMapInstance] = useState(null);

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

    useEffect(() => {
        axios.get("/pontos")
            .then((response) => {
                setPontos(response.data)
            })
            .catch((error) => {
                //
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
                    switch(error.code) {
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
                    timeout: 100000
                }
            )
        } else {
            setMessage("Para usar esse recurso você precisa autorizar a localização do dispositivo pelo navegador.")
            setHasError(true)
            setModalShow(true)
        }
    }, [currentPosition])

    const handleOkButton = () => {
        if (hasError) {
            setModalShow(false)
        } else {
            setModalShow(false)
            window.location.reload();
        }
    }

    const onMarkerClick = (e) => {
        setSelectedPonto({lat: e.latLng.lat(), lng: e.latLng.lng()});
    }

    const centerMap = (position) => {
        if (position) {
            mapInstance.panTo(position)
        }
    };

    const handleSubmit = (e) => {
        setSubmitting(true);
        e.preventDefault();

        if (!selectedPonto) {
            setHasError(true);
            setMessage("Marque um ponto no mapa!");
            setModalShow(true);

        } else {

            const data = {
                latitude: selectedPonto.lat,
                longitude: selectedPonto.lng,
                nome: e.target.nome.value,
            }

            axios.post('/novo_ponto', data)
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
                    setHasError(true);
                    setModalShow(true);
                    setSubmitting(false);
                })
        }
    }

    const onMapLoad = useCallback((map) => {
        setMapInstance(map);
    }, []);

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API
    })

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
            <Card.Header as="h5" className="bg-warning text-black"><i className="bi bi-file-earmark-plus">
            </i> Incluir novo
                ponto de pesca</Card.Header>

            {center ? (<Row>
                <Col lg={8}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center ? center : null}
                        zoom={15}
                        options={options}
                        onLoad={onMapLoad}
                        onClick={onMarkerClick}
                    >

                        { /* Child components, such as markers, info windows, etc.*/}
                        {currentPosition ? (<Marker key="current-position"
                                                    position={{lat: currentPosition.lat, lng: currentPosition.lng}}
                                                    icon="https://maps.google.com/mapfiles/kml/pal3/icon28.png"/>) : ""}
                        {selectedPonto ? (<Marker position={selectedPonto}/>) : ""}
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
                                />
                            ))}
                        </MarkerClusterer> : ""}
                    </GoogleMap>
                    <Row className={"py-2"}>
                        <Col className={"text-nowrap"}>
                            <Button variant="info" size={"sm"} onClick={() => centerMap(currentPosition)}><i
                                className="bi bi-bullseye"></i> Centralizar
                                mapa</Button>
                        </Col>
                        <Col className={"text-end text-nowrap"}>
                            {currentPosition ? <Button variant={"warning"} size={"sm"} onClick={()=>setSelectedPonto(currentPosition)}><i
                                className="bi bi-pin"></i> Marcar local atual</Button> : ""}
                        </Col>
                    </Row>
                </Col>
                <Col lg={4}>
                    <Form onSubmit={handleSubmit}>
                        <Card.Body>
                            <Card.Text as="h5">Marque o novo ponto no mapa</Card.Text>
                            <Stack direction="horizontal" gap="5">
                                <Form.Group controlId="latitude" className="py-2">
                                    <Card.Title><Form.Label as="h6">Latitude</Form.Label></Card.Title>
                                    <Form.Control size="sm" type="text" value={selectedPonto ? selectedPonto.lat : ""}
                                                  disabled required/>
                                </Form.Group>
                                <Form.Group controlId="longitude" className="py-2">
                                    <Card.Title><Form.Label as="h6">Longitude</Form.Label></Card.Title>
                                    <Form.Control size="sm" type="text" value={selectedPonto ? selectedPonto.lng : ""}
                                                  disabled required/>
                                </Form.Group>
                            </Stack>
                            <Form.Group controlId="nome" className="py-2">
                                <Card.Title><Form.Label as="h6">Nome do ponto</Form.Label></Card.Title>
                                <Form.Control size="sm" type="text" required/>
                            </Form.Group>
                            {!submitting ? (<Form.Group className="py-2">
                                <Button variant="success" size="lg" type="submit">
                                    <i className="bi bi-journal-check"></i>  Salvar
                                </Button>
                            </Form.Group>) : <Loading/>}
                        </Card.Body>
                    </Form>
                </Col>
            </Row>) : <Loading/>}
        </Card>
    ) : <Loading/>;
}

export default NovoPonto;