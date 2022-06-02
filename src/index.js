import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import reportWebVitals from './reportWebVitals';
import Header from "./components/Header";
import Footer from "./components/Footer";
import axios from "axios";
import {BrowserRouter} from "react-router-dom";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://api.pesquei.com/api';
//axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <BrowserRouter>
        <Header />
        <Footer />
        </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
