import { createContext, useState, useContext } from "react";

const AuthContext=createContext();
export const AuthProvider=({children}) => {
    const [isLogin,setIsLogin]=useState(false);
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