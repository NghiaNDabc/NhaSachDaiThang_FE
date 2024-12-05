import { Children, createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        accessToken: null,
        refreshToken: null,
        isLoggedIn: false,
        user: null,
    });
    useEffect(() => {
        const user = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (user && accessToken && refreshToken) {
            const userparse = JSON.parse(user);
            debugger;
            const authget = {
                user: userparse,
                refreshToken,
                accessToken,
                isLoggedIn: true,
            };
            setAuth(authget);
        }
    }, []);

    const login = (user, token, refreshToken) => {
        const newAuth = {
            accessToken: token,
            refreshToken: refreshToken,
            isLoggedIn: true,
            user: user,
        };
        setAuth(newAuth);
        localStorage.setItem('user', JSON.stringify(newAuth.user)); //
        localStorage.setItem('accessToken', JSON.stringify(newAuth.accessToken));
        localStorage.setItem('refreshToken', JSON.stringify(newAuth.refreshToken));
    };

    const logout = () => {
        setAuth(null);
        localStorage.clear();
    };

    return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
