import { Children, createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        accessToken: null,
        refreshToken: null,
        isLoggedIn: false,
    });

    const login = (token, refreshToken) => {
        setAuth({
            accessToken: token,
            refreshToken: refreshToken,
            isLoggedIn: true,
        });
    };

    const logout = () => {
        setAuth({
            accessToken: null,
            refreshToken: null,
            isLoggedIn: false,
        });
    };

    return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
