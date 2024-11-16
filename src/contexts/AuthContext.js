import { Children, createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        accessToken: null,
        refreshToken: null,
        isLoggedIn: false,
        user: {},
    });

    const login = (user, token, refreshToken) => {
        setAuth((pre)=>({
            accessToken: token,
            refreshToken: refreshToken,
            isLoggedIn: true,
            user: user,
        }));
    };

    const logout = () => {
        setAuth({
            accessToken: null,
            refreshToken: null,
            isLoggedIn: false,
            user: {},
        });
    };

    return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
