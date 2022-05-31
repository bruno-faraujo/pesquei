import React, {useCallback, useEffect, useState} from 'react';
import {GoogleMap, Marker, MarkerClusterer, useJsApiLoader} from "@react-google-maps/api";
import axios from "axios";
import Loading from "./Loading";
import {Button, Col, Container, Row} from "react-bootstrap";

function MapaPontos() {
    const [pontos, setPontos] = useState();
    const [center, setCenter] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(false);
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


    useEffect(() => {
        axios.get("/pontos")
            .then((response) => {
                setPontos(response.data);
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
    }, [currentPosition, pontos])

    const centerMap = () => mapInstance.panTo(currentPosition);

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API
    })

    const onMarkerClick = (e, p) => {
        console.log(e, p)
    }

        return isLoaded ? (
            <>
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
                                    clusterer={clusterer}
                                          onClick={onMarkerClick.bind(this,ponto)}
                                          title={'hello world'}
                            />
                                ))}
                    </MarkerClusterer> : ""}
                </GoogleMap>
                <Container>
                    <Row>
                        <Col>
                            <h5>Marcador selecionado:</h5>

                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5>Posição atual:</h5>
                            <p>Lat: {currentPosition.lat}</p>
                            <p>longitude: {currentPosition.lng}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {<Button variant="success" onClick={centerMap}>Centralizar mapa</Button>}
                        </Col>
                    </Row>
                </Container>
            </>
        ) : <Loading/>
}
export default MapaPontos;