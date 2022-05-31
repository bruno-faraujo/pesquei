import React, {useEffect, useState} from "react";
import Galeria from "./components/Galeria";
import axios from "axios";
import Loading from "./components/Loading";
import RankingPeixesResumo from "./components/RankingPeixesResumo";
import Clima from "./components/Clima";

function App() {

    const [galeria, setGaleria] =  useState();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
            axios.get('/galeria')
                .then((response) =>{
                    setGaleria(response.data)
                    setLoading(false);
                })
        },[])

    if (loading) {
        return (<><br/><br/><br/><Loading /><br/><br/><br/></>)
    } else {

  return (
      <main>
          <div className="container py-4">
                  <div className="row align-items-md-stretch ">
                      <div className="col-md-6 py-4">
                          <div className="h-100 p-4 bg-light border rounded-3">
                              <h4><i className="bi bi-globe"></i> Condições do tempo</h4>
                              <hr/>
                             <Clima />
                          </div>
                      </div>
                      <div className="col-md-6 py-4">
                          <div className="h-100 p-4 bg-light border rounded-3">
                              <h4><i className="bi bi-trophy"></i> Peixes mais pescados</h4>
                              <hr/>
      <RankingPeixesResumo />
                          </div>
                      </div>
                  </div>
          </div>
          <div className="container">
              <div className="p-14 mb-4 bg-light border rounded-3">
                  <div className="container-fluid py-4 px-4">
                      <h4><i className="bi bi-card-image"></i> Galeria de fotos</h4><hr />
                      <span className="col-md-8 fs-5">Os registros mais recentes de nossos pescadores parceiros.</span>
                      <div className="row text-center">
                          {galeria.map((item) => (
                              <Galeria
                                  key={item.media.id}
                                  urlThumb={item.media.urlThumb}
                                  urlImg={item.media.urlImg}
                                  pescador={item.dados.pescador}
                                  peixe={item.dados.peixe}
                                  ponto={item.dados.ponto}
                                  comprimento={item.dados.comprimento}
                                  peso={item.dados.peso}
                              />
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </main>
  )};
}
export default App;