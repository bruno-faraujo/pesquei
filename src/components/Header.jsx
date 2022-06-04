import React, {Component} from 'react';
import {Route, Routes} from "react-router-dom";
import {UserContext} from "./UserContext";
import Docs from "./Docs";
import Login from "./Login";
import Perfil from "./Perfil";
import Registro from "./Registro";
import SenhaEsquecida from "./SenhaEsquecida";
import Topmenu from "./Topmenu";
import axios from "axios";
import ResetSenha from "./ResetSenha";
import App from "../App";
import NovoRegistro from "./NovoRegistro";
import GaleriaUsuario from "./GaleriaUsuario";
import NovoPonto from "./NovoPonto";
import EditaPerfil from "./EditaPerfil";


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
        axios.get('../sanctum/csrf-cookie')
            .then(()=> {
                axios.post('/user', {})
                    .then((response) => {
                        this.setUser(response.data);
                        this.setLoggedIn(true);
                    })
                    .catch((error) => {
                        this.clearUser();
                    })
            })
            .catch((error) => {
                this.clearUser();
            })
    }

    clearUser = () => {
        localStorage.removeItem('token');
        document.cookie = 'pesqueicom_session=; Max-Age=0;path=/;';
        document.cookie = 'XSRF-TOKEN=; Max-Age=0;path=/;';
        this.setUser({});
        this.setLoggedIn(false);

    }


    componentDidMount() {
        this.getUser();
    }

    render() {
        return (
            <UserContext.Provider value={this.state}>
                <header>
                    <Topmenu/>
                    <Routes>
                        <Route path="/" element={<App/>}/>
                        <Route path="/docs" element={<Docs/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/usuario" element={<Perfil/>}>
                            <Route path="novo_registro" element={<NovoRegistro/>}/>
                            <Route path="galeria" element={<GaleriaUsuario/>}/>
                            <Route path="novo_ponto" element={<NovoPonto/>}/>
                            <Route path="edita_perfil" element={<EditaPerfil/>}/>
                        </Route>
                        <Route path="/registro" element={<Registro/>}/>
                        <Route path="/recuperar_senha" element={<SenhaEsquecida/>}/>
                        <Route path="/reset_senha/:token" element={<ResetSenha/>}/>
                        <Route path="*" element={<App/>}/>
                    </Routes>
                </header>
            </UserContext.Provider>
        );
    }
}

export default Header;