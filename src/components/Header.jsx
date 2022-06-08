import React, {useContext, useEffect} from 'react';
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
import ProtectedRoute from "./ProtectedRoute";


function Header() {

    const {user, login, logout, apiLogout} = useContext(UserContext);

    const fetchUser = () => {

        if (typeof localStorage.getItem('token') === 'undefined' || localStorage.getItem('token') === null) {
            logout();
        } else {

            axios.post("/user", {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response)=>{
                    login(response.data.user)
                })
                .catch(()=>{
                    apiLogout();
                })
        }
    }

    useEffect(()=>{
        fetchUser();
    },[])

        return (
                <header>
                    <Topmenu/>
                    <Routes>
                        <Route path="/" element={<App/>}/>
                        <Route path="/docs" element={<Docs/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/usuario" element={<ProtectedRoute user={user}><Perfil/></ProtectedRoute>}>
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
        );
    }
export default Header;