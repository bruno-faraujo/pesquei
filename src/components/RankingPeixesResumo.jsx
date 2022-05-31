import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Badge, ListGroup} from "react-bootstrap";

function RankingPeixesResumo() {

    const [ranking, setRanking] = useState([]);

    useEffect(() => {

        axios.get('/ranking_peixes_resumo')
            .then((response) =>{
                setRanking(response.data);
            })

    },[])


    return (
        <>
            <ListGroup as="ol" numbered>
                {ranking.map((item)=>(
                    <ListGroup.Item
                        key={item.id}
                        as="li"
                        className="d-flex justify-content-between align-items-start">
                        <div className="ms-3 me-auto">
                            <div className="fw-bold">{item.nome}</div>
                        </div>
                        <Badge style={{fontStyle: '10px'}} bg="primary" text="li">
                            {item.contagem}
                        </Badge>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
}
export default RankingPeixesResumo;