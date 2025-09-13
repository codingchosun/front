import React, {createContext, useContext, useEffect, useState} from 'react';
import { checkUserStatus } from '../api/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null); //유저 state
    const [loading, setLoading] = useState(true); // 로딩 state

    useEffect(() => {
        // 로그인 상태 체크
        const fetchUserStatus = async () => {
            try {
                const response = await checkUserStatus();

                if (response.status === 200 && response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("로그인 상태 확인 실패:", error);
                setUser(null);
            } finally {
                setLoading(false); //로그인 상태 체크 종료시 로딩 상태 변경
            }
        };

        fetchUserStatus();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };


    const logout = async () => {
        //TODO: 로그아웃 API 호출 필요 예) await axios.post('/logout');
        setUser(null);
    };

    const value = {
        user,
        isLoggedIn: !!user,
        login,
        logout
    };

    if (loading === true) {
        return <div>로딩 중...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};