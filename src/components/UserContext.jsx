import React, {createContext, useState} from 'react';
import axios from "axios";

const UserContext = createContext({user: {}, loggedIn: false, userLoading: false});

function UserProvider({children}) {

    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userLoading, setUserLoading] = useState(false);

    const login = (user) => {
        setUser(user);
        setLoggedIn(true);
        setUserLoading(false)
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setLoggedIn(false);
        setUserLoading(false);
    };

    const apiLogout = () => {
        axios.post('/logout', {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(() => {
                logout();
            })
            .catch(() => {
                logout();
            })
    }

    return (
        <UserContext.Provider value={{user, loggedIn, userLoading, setUserLoading, login, logout, apiLogout}}>
            {children}
        </UserContext.Provider>
    );
}
export {UserContext, UserProvider};