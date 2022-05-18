import React, {Component} from 'react';
import {Route, Routes} from "react-router-dom";
import App from "../App";
import {UserContext} from "./UserContext";
import Docs from "./Docs";
import Recursos from "./Recursos";
import Login from "./Login";
import Perfil from "./Perfil";
import Registro from "./Registro";
import SenhaEsquecida from "./SenhaEsquecida";
import Topmenu from "./Topmenu";
import axios from "axios";


class Header extends Component {

    constructor(props) {
        super(props);

        this.setUser = this.setUser.bind(this);
        this.getUser = this.getUser.bind(this);
        this.setLoggedIn = this.setLoggedIn.bind(this);

        this.state = {
            user: {},
            loggedIn: false,
            setUser: this.setUser,
            setLoggedIn: this.setLoggedIn,
            getUser: this.getUser

        }

    }

    setUser = (user) => {
        this.setState({user: user})
    }

    setLoggedIn = (bool) => {
        this.setState({loggedIn: bool})
    }


    getUser = () => {
        axios.post('/user', {})
            .then((response) => {
                this.setUser(response.data);
                this.setLoggedIn(true);
            })
            .catch((error) => {
                //   console.log(error.response.data.message);
                console.log(error);
            })
    }

    componentDidMount() {
            this.getUser();
    }


    // ANDA NAO ESTA FUNCIONANDO. É PRECISO ACESSAR O STATE/PROP DO PERFIl (OU LOGIN)
    // NAO DEIXAR DE LER SOBRE CONTEXT

    /*    componentDidUpdate(prevProps, prevState, snapshot) {
            if (prevState.user !== this.state.user || prevProps.user !== this.props.user) {
                this.forceUpdate();
            }
        }*/

    render() {

        return (
            <UserContext.Provider value={this.state}>
                <header>
                    <Topmenu />
                </header>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="docs" element={<Docs />} />
                    <Route path="recursos" element={<Recursos />} />
                    <Route path="login" element={<Login />} />
                    <Route path="perfil" element={<Perfil />} />
                    <Route path="registro" element={<Registro />} />
                    <Route path="recuperar_senha" element={<SenhaEsquecida />} />
                </Routes>
            </UserContext.Provider>
        );
    }
}
export default Header;