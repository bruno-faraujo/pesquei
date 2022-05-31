import React, {Component} from 'react';
import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, NavLink} from "react-router-dom";
import axios from "axios";
import {UserContext} from "./UserContext";

class Topmenu extends Component {

    constructor(props) {
        super(props);

        this.logOut = this.logOut.bind(this);

    }

    static contextType = UserContext;

    logOut = () => {

        axios.post('/logout', {})
            .then((response) => {
                this.clearUser();
            })
            .catch((error) => {
                this.clearUser();
            })
    }

    clearUser = () => {
        localStorage.removeItem('token');
        const context = this.context;
        context.setLoggedIn(false);
        context.setUser({});
    }

    render() {

        let buttons;
        let perfil;

        if (localStorage.getItem('token')) {
            buttons = (
                <Nav className="text-end">
                    <Link to="/"><Button link="/" type="button" className="btn btn-outline-info me-2 text-white"
                                         onClick={this.logOut}><i
                        className="bi bi-box-arrow-up-right"/> Sair</Button></Link>
                </Nav>
            )
            perfil = (

                <NavLink to="/usuario" className="nav nav-link">Perfil</NavLink>

            )
        } else {
            buttons = (
                <Nav className="text-end">
                    <NavLink to="/login"><Button type="button" className="btn btn-outline-light me-2"
                                                 style={{marginBottom: "10px"}}><i
                        className="bi bi-box-arrow-in-right"/> Entrar</Button></NavLink>
                    <NavLink to="/registro"><Button type="button" className="me-2" variant="outline-warning"><i
                        className="bi bi-person-plus-fill"/> Criar conta</Button></NavLink>
                </Nav>
            )
        }


        return (

            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <NavLink to="/" className="navbar navbar-brand">Pesquei.com</NavLink>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink to="/recursos" className="nav nav-link">Recursos</NavLink>
                            <NavLink to="/docs" className="nav nav-link">Documentação</NavLink>
                            {perfil}
                            <NavDropdown title="Rankings" id="collasible-nav-dropdown">
                                <NavDropdown.Item href="#item/1">Pescadores</NavDropdown.Item>
                                <NavDropdown.Item href="#item/2">Peixes</NavDropdown.Item>
                                <NavDropdown.Item href="#item/3">Pontos</NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item href="#item/s"></NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        {buttons}
                    </Navbar.Collapse>
                </Container>
            </Navbar>


        );
    }
}

export default Topmenu;