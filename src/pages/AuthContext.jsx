// 로그인 확인 컨텍스트
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const storedIsLogin = sessionStorage.getItem('isLogin');
        if (storedIsLogin === 'ok') {
            setIsLogin(true);
        }
    }, []);

    const login = () => {
        setIsLogin(true);
        sessionStorage.setItem('isLogin', 'true');
    };

    const logout = () => {
        setIsLogin(false);
        sessionStorage.removeItem('isLogin');
    };

    return (
        <AuthContext.Provider value={{ isLogin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
