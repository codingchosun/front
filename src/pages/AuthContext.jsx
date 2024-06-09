// 로그인 데이터 유지용 컨텍스트
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api"
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(() => {
        const storedLoginStatus = localStorage.getItem('isLogin');
        return storedLoginStatus === 'true';
    });

    const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

    const login = (id) => {
        console.log("유저:",id)
        setIsLogin(true);
        setUserId(id);
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('userId', id);
    };

    const logout = () => {
        setIsLogin(false);
        setUserId(null);
        localStorage.removeItem('isLogin');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ isLogin, login, logout, userId }}>
            {children}
        </AuthContext.Provider>
    );
};
