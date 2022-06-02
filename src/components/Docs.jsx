import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Docs extends Component {
    render() {
        return (
            <main>
                <div className="container py-4">

                    <h1>Um registro completo das suas pescarias</h1>
                    <p className="fs-5 col-md-12" style={{textAlign: "justify"}}>Para pescadores artesanais, amadores, profissionais e esportivos que
                        frequentam pontos de pesca variados e precisam manter um registro dos locais de pesca mais
                        produtivos e dos peixes que foram capturados.</p>
                    <p className="fs-5 col-md-12" style={{textAlign: "justify"}}>O <span className={"fw-bold"}>Pesquei</span> é capaz de fornecer
                        acesso rápido e prático a informações privilegiadas sobre seus melhores pontos de pesca, te
                        auxiliando a obter melhores resultados, economizando tempo e insumos como combustível e iscas.
                    </p>
                    <p className={"fs-5 col-md-12"} style={{textAlign: "justify"}}>Comece agora mesmo a registrar as suas pescarias. O <span
                        className={"fw-bold"}>Pesquei</span> é grátis para usar e você precisa apenas criar uma conta de
                        acesso para usufruir de todos os recursos oferecidos.</p>
                    <div className="mb-5">
                        <Link to={"/registro"} className="btn btn-warning btn-lg px-4">Crie sua conta</Link>
                    </div>

                    <hr className="col-3 col-md-2 mb-5"/>

                </div>
                <div className="container my-5">
                    <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
                        <div className="col-lg-7 p-3 p-lg-5 pt-lg-3">
                            <h3 className="display-6 fw-bold lh-1">Salve e encontre pontos de pesca</h3>
                            <p className="lead" style={{textAlign: "justify"}}>Salve seus pontos de pesca favoritos. Os locais são armazenados usando
                                coordenadas geográficas precisas.</p>
                            <p className="lead" style={{textAlign: "justify"}}>Crie um diário de pesca baseado nos locais que você quiser e salve os detalhes de cada
                                captura (foto, local, peso, comprimento).</p>
                            <p className="lead" style={{textAlign: "justify"}}>Os seus pontos são protegidos, isso significa que <span className={"fw-bold"}>apenas você tem acesso as informações registradas</span> dos locais de pesca que você criou.</p>
                        </div>
                        <div className="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
                            <img className="rounded-lg-3"
                                 src="./assets/img2.png" alt="Pesquei.com"
                                 width="720"/>
                        </div>
                    </div>
                </div>
                <div className="container col-xxl-8 px-4 py-5">
                    <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <img src="./assets/img1.png"
                                 className="d-block mx-lg-auto img-fluid"
                                 alt="Bootstrap Themes" width="700" height="500" loading="lazy"/>
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-6 fw-bold lh-1 mb-3">Condições do tempo</h1>
                            <p className="lead"  style={{textAlign: "justify"}}>Acompanhe as condições climáticas atuais do local de sua preferência com informações sobre temperatura, vento, pressão atmosférica e umidade relativa do ar.</p>
                            <p className="lead">Já possui uma conta?</p>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <Link to={"/login"}><button type="button" className="btn btn-primary btn-lg px-4 me-md-2">Faça o login</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default Docs;