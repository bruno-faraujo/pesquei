import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Badge, Button, Card, Col, Container, Form, ListGroup, Row} from "react-bootstrap";

function Clima() {

    const [clima, setClima] = useState();
    const [cidade, setCidade] = useState();
    const [estado, setEstado] = useState();
    const [cidades, setCidades] = useState([]);
    const [siglas, setSiglas] = useState([]);
    const [nomeEstado, setNomeEstado] = useState();
    const [iconUrl, setIconUrl] = useState();

    const getClima = (e) => {
        e.preventDefault()
        axios.post("/request_clima_info", {cidade, estado:nomeEstado})
            .then((response) => {
                setClima(response.data);
                localStorage.setItem('clima.cidade', response.data.cidade);
                localStorage.setItem('clima.estado', response.data.estado);
                axios.post("/request_clima_icon_url", {icon:response.data.weather_icon})
                    .then((response) =>{
                        setIconUrl(response.data)
                    })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const mudarCidade = () => {
        localStorage.removeItem('clima.cidade');
        localStorage.removeItem('clima.estado');
        setCidade(null);
        setEstado(null);
        setClima(null);
    }

    const getSiglasUf = () => {
        axios.get("/request_siglas_estados")
            .then((response)=> {
                setSiglas(response.data)
            })
    }


    useEffect(()=>{
        if (localStorage.getItem('clima.cidade') && localStorage.getItem('clima.estado')) {
            const cid = localStorage.getItem('clima.cidade');
            const est = localStorage.getItem('clima.estado');
            setEstado(est);
            setCidade(cid);
            axios.post("/request_clima_info", {cidade: cid, estado: est})
                .then((response) => {
                    setClima(response.data);
                    localStorage.setItem('clima.cidade', response.data.cidade);
                    localStorage.setItem('clima.estado', response.data.estado);
                    axios.post("/request_clima_icon_url", {icon:response.data.weather_icon})
                        .then((response) =>{
                            setIconUrl(response.data)
                        })
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        getSiglasUf();
        getCidades(estado)

    }, [estado])

    const getCidades = (uf) => {
        axios.get("request_cidades/"+uf)
            .then((response) => {
                setCidades(response.data)
                if(response.data[0]) {
                    setNomeEstado(response.data[0].estado)
                }
            })
    }

    if (clima) {
        return (
            <>
                <Card>
                    <Card.Header><span className="h5 text-nowrap"><i className="bi bi-pin-map-fill"></i> {clima.cidade}, {clima.estado}</span> <span className="h2"> <Badge text="dark" bg="info"><i className="bi bi-thermometer-high"/>{parseFloat(clima.main_temp).toFixed(0)}°C</Badge></span></Card.Header>
                    <Card.Body style={{backgroundColor: "Gainsboro"}}>
                        <Container>
                            <Row>
                                <Col sm={4} className="text-center">
                                    <div className="py-0"><img style={{maxWidth: "140px"}} src={iconUrl} alt={clima.weather_description} /></div>
                                </Col>
                                <Col sm={6}>
                                    <ListGroup variant="flush" style={{marginBottom: "10px"}}>
                                        <ListGroup.Item>{clima.weather_description.charAt(0).toUpperCase() + clima.weather_description.slice(1)}</ListGroup.Item>
                                        <ListGroup.Item><i className="bi bi-wind" /> Vento {(parseFloat(clima.wind_speed) * 3.6).toFixed(1)} Km/h</ListGroup.Item>
                                        <ListGroup.Item><i className="bi bi-arrows-collapse" />Pressão {clima.main_pressure} hPa</ListGroup.Item>
                                        <ListGroup.Item><i className="bi bi-droplet" />Umidade do ar {clima.main_humidity} %</ListGroup.Item>
                                    </ListGroup>
                                </Col>
                                <Col sm={2}>
                                    <Button variant="outline-dark" className="btn btn-sm p-1" onClick={mudarCidade}><i className="bi bi-arrow-left-right" />  Mudar cidade</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            </>
        )

    } else {
        return (
            <>
                <Form onSubmit={getClima}>
                    <Card.Body>
                        <Form.Group className="mb-3" controlId="estado">
                            <Form.Select required onChange={(e) => {
                                setEstado(e.target.value)
                            }}>
                                <option>Selecionar Estado...</option>
                                {siglas.map((uf)=>(<option key={uf.sigla_estado} value={uf.sigla_estado}>{uf.estado}</option>))}
                            </Form.Select>
                        </Form.Group>
                        {estado ? (                        <Form.Group className="mb-1" controlId="cidade">
                            <Form.Select required onChange={(e) => {
                                setCidade(e.target.value)
                            }}>
                                <option>Selecionar Cidade...</option>
                                {cidades.map((cidade)=>(<option key={cidade.cidade} value={cidade.cidade}>{cidade.cidade}</option>))}
                            </Form.Select>
                        </Form.Group>) : ""}
                        {estado && cidade ? (                        <div className="d-grid gap-2">
                            <Button variant="success" size="md" type="submit"><i className="bi bi-save"/> Obter dados
                            </Button>
                        </div>) : ""}

                    </Card.Body>
                </Form>
            </>
        );
    }
}

export default Clima;