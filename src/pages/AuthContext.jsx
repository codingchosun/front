import React, { createContext, useState, useContext } from "react";

const AuthContext=createContext();
export const AuthProvider=({children}) => {
    const [isLogin,setIsLogin]=useState(true); //테스트를 위해 기본값을 true로 설정
    const login=()=>{
        setIsLogin(true);
    }
    const logout=() =>{
        setIsLogin(false);
    }

    return(
        <AuthContext.Provider value={{isLogin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth=()=>useContext(AuthContext);