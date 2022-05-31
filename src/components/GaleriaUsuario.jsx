import React, {useState, useEffect} from 'react';
import Galeria from "./Galeria";
import axios from "axios";
import Loading from "./Loading";
import {Row} from "react-bootstrap";

function GaleriaUsuario() {

    const [galeria, setGaleria] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/galeria_pescador')
            .then((response) => {
                setGaleria(Object.values(response.data))
                setLoading(false);
            })
    }, [])

    if (loading) {
        return (<><br/><br/><br/><Loading/><br/><br/><br/></>)
    } else {
        return (
            <Row>
            {galeria.map((item) => (
                    <Galeria
                        key={item.media.id}
                        urlThumb={item.media.urlThumb}
                        urlImg={item.media.urlImg}
                        peixe={item.dados.peixe}
                        ponto={item.dados.ponto}
                        comprimento={item.dados.comprimento}
                        peso={item.dados.peso}
                    />
                ))}
            </Row>
        )
    }
}

export default GaleriaUsuario;