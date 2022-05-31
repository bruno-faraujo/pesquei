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
        axios.get("/pontos")
            .then((response) => {
                setPontos(response.data)
            })
            .catch((error) => {
                setHasError(true);
                setMessage(error.response.data.message);
                setModalShow(true);
                setSemPontos(true);
            })
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
                    // error callback
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000
                }
            )
        } else if (localStorage.getItem('clima.cidade') && localStorage.getItem('clima.estado')) {
            axios.post("/request_coordenadas", {
                cidade: localStorage.getItem('clima.cidade'),
                estado: localStorage.getItem('clima.estado')
            })
                .then((response) => {
                    setCurrentPosition({
                        lat: parseFloat(response.data.lat),
                        lng: parseFloat(response.data.lon)
                    })

                    if (!center) {
                        setCenter(currentPosition)
                    }
                })
        } else {
            setCurrentPosition({lat: parseFloat(-6.640814), lng: parseFloat(-34.757842)})
            if (!center) {
                setCenter(currentPosition)
            }
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

        e.preventDefault();


        const formData = new FormData();


        formData.append("ponto_id", selectedPonto);
        formData.append("peixe_id", peixeSelected);

        if (comprimento) {
            formData.append("comprimento", parseInt(comprimento,10));
        }

        if (peso) {
            formData.append("peso", parseInt(peso, 10));
        }

        if (foto) {
            formData.append("foto", foto);
        }


        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
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
                    setMessage(error.data.errors.foto.map((item)=>(<p>{item}</p>)))
                } catch {
                    setMessage(error.response.data.message);
                }
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
            navigate("/usuario", {replace: true});
        }
    }


    let modal = '';
    if (modalShow){
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
                            <Button className={hasError ? "btn btn-danger btn-lg" : "btn btn-success btn-lg"} onClick={handleOkButton}>OK</Button>
                        </div>
                    </Modal.Footer>

                </Modal>
            )
    }

    return isLoaded ? (
        <Card>
            {modal}
            <Card.Header as="h5" className="bg-warning text-black"><i className="bi bi-person-plus-fill"/> Registrar
                peixe pescado</Card.Header>
            <Row>
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
                                                    icon="http://maps.google.com/mapfiles/kml/pal3/icon28.png"/>) : ""}
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
                        <Col>
                            {<Button variant="success" onClick={() => centerMap(currentPosition)}>Centralizar
                                mapa</Button>}
                        </Col>
                    </Row>
                </Col>
                <Col lg={4}>
                    <Button variant={"success"} onClick={()=>console.log(process.env.REACT_APP_VERSION)}>Show env value</Button>
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
                                        <option key={"peixe-" + peixe.nome} value={peixe.id}>{peixe.nome}</option>))}
                                </Form.Select>
                            </Form.Group> : <Loading/>}
                            <Stack direction="horizontal" gap="2">
                                <Form.Group controlId="comprimento" className="py-2">
                                    <Card.Title><Form.Label as="h6">Comprimento</Form.Label></Card.Title>
                                    <InputGroup size="sm">
                                        <Form.Control size="sm" type="text" onChange={e=>setComprimento(e.target.value)}/>
                                        <InputGroup.Text>cm</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="peso" className="py-2">
                                    <Card.Title><Form.Label as="h6">Peso</Form.Label></Card.Title>
                                    <InputGroup size="sm">
                                        <Form.Control size="sm" type="text" onChange={e=>setPeso(e.target.value)}/>
                                        <InputGroup.Text>g</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Stack>
                            <Form.Group controlId="foto" as="h6" className="py-2" >
                                <Form.Label>Foto do peixe</Form.Label>
                                <Form.Control size="sm" multi="false" type="file" onChange={e=>setFoto(e.target.files[0])}/>
                            </Form.Group>
                            <Form.Group className="py-2">
                                <Button variant="success" size="lg" type="submit">
                                    Salvar
                                </Button>
                            </Form.Group>
                        </Card.Body>
                    </Form>
                </Col>
            </Row>
        </Card>
    ) : <Loading/>
}

export default NovoRegistro;