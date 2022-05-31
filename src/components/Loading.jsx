import React from 'react';
import LoadingImage from "./LoadingImage";

function Loading() {
    return (
        <div style={{ height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"}} >
            <LoadingImage  />
        </div>
    );
}
export default Loading;