import React, {createContext, useContext, useEffect, useState} from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateUser = async (loginId) => {
        if (!loginId) {
            setUser(null);
            return;
        }

        try {
            const profileResponse = await api.get(`/profile/${loginId}`);

            if (profileResponse.status === 200 && profileResponse.data.success) {
                setUser(profileResponse.data.body);
            }
        } catch (error) {
            console.error("로그인 확인 실패: ", error);
            setUser(null);
        }
    };

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const loginCheckResponse = await api.get('/me');
                if (loginCheckResponse.status === 200 && loginCheckResponse.data.success) {
                    const { loginId } = loginCheckResponse.data.body;
                    await updateUser(loginId);
                }
            } catch (error) {
                console.log("로그인 상태가 아닙니다.");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStatus();
    }, []);

    const logout = async () => {
        try {
            await api.post('/logout');
            setUser(null);
        } catch (error) {
            console.error("로그아웃 실패: ", error);
            setUser(null);
        }
    };

    const value = {
        user,
        isLoggedIn: !!user,
        updateUser,
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