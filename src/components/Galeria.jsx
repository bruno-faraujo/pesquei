import React, {useState} from 'react';
import {Modal} from "react-bootstrap";
import {Link} from "react-router-dom";

function Galeria({urlThumb, urlImg, pescador, ponto}) {

    const [modalShow, setModalShow] = useState(false);

    let modal = '';

    if (modalShow) {
        modal =
            (
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                >
                    <Modal.Header closeButton style={{backgroundColor: "SpringGreen"}} className="py-1 aligns-items-center justify-content-center">
                        <h4 className="aligns-items-center justify-content-center">{pescador ? pescador : "@"+ponto}</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <img className="img-thumbnail" src={urlImg}
                                 style={{width: "100%", height: "auto", maxWidth: "620px"}} alt={pescador}/>
                        </div>
                    </Modal.Body>
                </Modal>
            )
    }

    return (
        <>
            {modal}
            <div
                className="col-4 col-md-3 col-lg-2 py-2 align-items-center text-center align-content-center align-self-center"
                onClick={() => setModalShow(true)}>
                <Link to="">
                    <div className="p-0 border bg-light img-thumbnail"
                         style={{
                             height: "21vh",
                             backgroundImage: `url(${urlThumb})`,
                             backgroundSize: "cover",
                             backgroundPosition: "center center",
                             backgroundRepeat: "no-repeat"
                         }}>

                    </div>
                </Link>
            </div>

        </>
    );
}

export default Galeria;