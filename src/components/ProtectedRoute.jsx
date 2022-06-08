import React, {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import Loading from "./Loading";

function ProtectedRoute({user, children}) {

    const [loading, setLoading] = useState(true);
    const [forbidden, setForbidden] = useState();

    useEffect(() => {
        if (user === undefined || user === null) {
            setForbidden(true)
            setTimeout(() => {
                setLoading(false)
            }, "1500")

        } else {
            setForbidden(false)
            setTimeout(() => {
                setLoading(false)
            }, "1500")
        }
    },[])


    return <>{loading ? <Loading/> : forbidden ? <Navigate to={"/login"}/> : children}</>
}

export default ProtectedRoute;