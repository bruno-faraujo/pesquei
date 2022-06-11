import React, {useState, useContext, useEffect} from 'react';
import {Badge, Card, Col, Container, DropdownButton, ListGroup, Row, Dropdown} from "react-bootstrap";
import {UserContext} from "./UserContext";
import {NavLink, Outlet} from "react-router-dom";
import axios from "axios";

function Perfil() {

    const [pontosRegistrados, setPontosRegistrados] = useState(null);
    const [peixesRegistrados, setPeixesRegistrados] = useState(null);
    const [peixeMaisPescado, setPeixeMaisPescado] = useState(null);
    const [peixeMaisPescadoQtd, setPeixeMaisPescadoQtd] = useState(null);

    const {user, loggedIn, logout} = useContext(UserContext);

    const getStatus = () => {
        if (typeof localStorage.getItem('token') === 'undefined' || localStorage.getItem('token') === null) {
            logout();
        } else if (loggedIn) {
            axios.get("/status_pescador",
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then((response) => {
                    setPontosRegistrados(response.data.pontos_registrados);
                    setPeixesRegistrados(response.data.peixes_registrados);
                    setPeixeMaisPescado(response.data.peixe_mais_pescado);
                    setPeixeMaisPescadoQtd(response.data.peixe_mais_pescado_qtd);
                })
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        getStatus();
    }, [])

    return (
        <Container style={{marginBottom: "20px"}}>
            <Row style={{marginTop: "30px"}}>
                <Col style={{marginBottom: "20px"}}>
                    <Card style={{backgroundColor: "Gainsboro"}}>
                        <Card.Header as="h5" className="text-PaleTurquoise text-end">
                            <Row>
                                <Col>
                                    <DropdownButton variant="warning" menuVariant="dark" size="md"
                                                    className="d-grid gap-2" title="Abrir menu">
                                        <Dropdown.Item as={NavLink} to="novo_registro" className="py-3"><i
                                            className="bi bi-plus-square"></i> Registrar captura</Dropdown.Item>
                                        <Dropdown.Item as={NavLink} to="galeria" className="py-3"><i
                                            className="bi bi-card-image"></i> Galeria de fotos</Dropdown.Item>
                                        <Dropdown.Item as={NavLink} to="novo_ponto" className="py-3"><i
                                            className="bi bi-pin-angle"></i> Criar novo ponto</Dropdown.Item>
                                        <Dropdown.Item as={NavLink} to="edita_perfil" className="py-3"><i
                                            className="bi bi-pencil-square"></i> Configurações</Dropdown.Item>
                                    </DropdownButton>
                                </Col>
                                <Col>
                                        <span className="text-nowrap"> <i
                                            className="bi bi-person-circle"></i> {user.name}</span>
                                </Col>
                            </Row>
                        </Card.Header>
                        <ListGroup>
                            <ListGroup.Item variant="flush" className="text-nowrap"><i
                                className="bi bi-pin-map-fill"></i> Pontos de pesca <span className="h5"><Badge pill
                                                                                                                bg="success">{pontosRegistrados ? pontosRegistrados : "0"}</Badge></span></ListGroup.Item>
                            <ListGroup.Item variant="flush" className="text-nowrap"><i
                                className="bi bi-journal-text"></i> Peixes registrados <span className="h5"><Badge
                                pill bg="success"
                                className="text-end">{peixesRegistrados ? peixesRegistrados : "0"}</Badge></span></ListGroup.Item>
                            <ListGroup.Item variant="flush" className="text-nowrap"><i
                                className="bi bi-trophy"></i> Peixe mais pescado <br/><span
                                className="text-muted">{peixeMaisPescado ? peixeMaisPescado : "Nenhum"}
                                <Badge
                                    bg="warning"
                                    text="dark">{setPeixeMaisPescadoQtd ? peixeMaisPescadoQtd : ""}</Badge></span></ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Outlet/>
                </Col>
            </Row>
        </Container>
    );
}

export default Perfil;