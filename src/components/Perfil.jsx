import React, {Component} from 'react';
import {Badge, Card, Col, Container, DropdownButton, ListGroup, Row, Dropdown} from "react-bootstrap";
import {UserContext} from "./UserContext";
import {Navigate, NavLink, Outlet} from "react-router-dom";
import axios from "axios";

class Perfil extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            pontos_registrados: "",
            peixes_registrados: "",
            peixe_mais_pescado: "",
            peixe_mais_pescado_qtd: ""
        };
    }

    checkProps = () => {
        const context = this.context;
        if (this.props.user) {
            this.setState({user: this.props.user});
            this.setState({loggedIn: this.props.loggedIn});
        } else if (this.context.user) {
            this.setState({user: context.user});
            this.setState({loggedIn: context.loggedIn});
        }
    }

    getStatus = () => {
        axios.get("/status_pescador")
            .then((response) => {
                this.setState({
                    pontos_registrados: response.data.pontos_registrados,
                    peixes_registrados: response.data.peixes_registrados,
                    peixe_mais_pescado: response.data.peixe_mais_pescado,
                    peixe_mais_pescado_qtd: response.data.peixe_mais_pescado_qtd
                })
            })

    }

    componentDidMount() {
        this.checkProps();
        this.getStatus();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const context = this.context;
        if (prevProps.user !== this.props.user) {
            this.setState({user: this.props.user})
            this.setState({loggedIn: this.props.loggedIn})
        }
        if (prevState.user !== this.state.user) {
            this.setState({user: context.user})
            this.setState({loggedIn: context.loggedIn})
        }
    }

    render() {

        if (this.context.loggedIn === false) {
            return <Navigate to="/login"/>
        }

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
                                            <Dropdown.Item as={NavLink} to="estatisticas" className="py-3"><i
                                                className="bi bi-graph-up-arrow"></i> Estatísticas</Dropdown.Item>
                                            <Dropdown.Item as={NavLink} to="edita_perfil" className="py-3"><i
                                                className="bi bi-pencil-square"></i> Editar pefil</Dropdown.Item>
                                        </DropdownButton>
                                    </Col>
                                    <Col>
                                        <span className="text-nowrap"> <i
                                            className="bi bi-person-circle"></i> {this.state.user.name}</span>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <ListGroup>
                                <ListGroup.Item variant="flush" className="text-nowrap"><i
                                    className="bi bi-pin-map-fill"></i> Pontos de pesca <span className="h5"><Badge pill
                                                                                                                    bg="success">{this.state.pontos_registrados ? this.state.pontos_registrados : ""}</Badge></span></ListGroup.Item>
                                <ListGroup.Item variant="flush" className="text-nowrap"><i
                                    className="bi bi-journal-text"></i> Peixes registrados <span className="h5"><Badge
                                    pill bg="success" className="text-end">{this.state.peixes_registrados ? this.state.peixes_registrados : ""}</Badge></span></ListGroup.Item>
                                <ListGroup.Item variant="flush" className="text-nowrap"><i
                                    className="bi bi-trophy"></i> Peixe mais pescado <br/><span className="text-muted">{this.state.peixe_mais_pescado ? this.state.peixe_mais_pescado : ""} <Badge
                                    bg="warning" text="dark">{this.state.peixe_mais_pescado_qtd ? this.state.peixe_mais_pescado_qtd : ""}</Badge></span></ListGroup.Item>
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
}

export default Perfil;