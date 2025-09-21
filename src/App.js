import axios from "axios";
import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Main from "./pages/main/Main";
import FindId from "./pages/auth/FindId";
import FindPw from "./pages/auth/FindPw";
import MyInformation from "./pages/profile/MyInformation";
import MyParty from "./pages/party/MyParty";
import NewPost from "./pages/party/NewPost";
import Profile from "./pages/profile/Profile";
import VotePage from "./pages/party/VotePage";
import UserEdit from "./pages/profile/UserEdit";
import Party from "./pages/party/Party";
import Manage from "./pages/party/Manage";
import Search from "./pages/party/Search";
import Header from "./components/layout/Header";

import api from "./api/api";

axios.defaults.baseURL = api;
axios.defaults.withCredentials = true;

function App() {
    return (
        <AuthProvider>
            <Header/>
                <Routes>
                    <Route path="/" element={<Main/>}/> {/*디폴트 페이지*/}
                    <Route path="/main" element={<Main/>}/> {/*메인 페이지*/}
                    <Route path="/login" element={<Login/>}/> {/*로그인 페이지*/}
                    <Route path="/register" element={<Register/>}/> {/*회원가입 페이지*/}
                    <Route path="/findid" element={<FindId/>}/> {/*아이디찾기 페이지*/}
                    <Route path="/findpw" element={<FindPw/>}/> {/*비밀번호찾기 페이지*/}
                    <Route path="/profile" element={<Profile/>}/> {/*(타인) 프로필 페이지*/}
                    <Route path="/my-information" element={<MyInformation/>}/> {/*마이 페이지*/}
                    <Route path="/newpost" element={<NewPost/>}/> {/*새 게시물 제작 페이지*/}
                    <Route path="/useredit" element={<UserEdit/>}/> {/*개인정보 수정 페이지*/}
                    <Route path="/party" element={<Party/>}/> {/*모임 페이지*/}
                    <Route path="/myparty" element={<MyParty/>}/> {/*내 모임 페이지*/}
                    <Route path="/manage" element={<Manage/>}/> {/*관리 페이지*/}
                    <Route path="/search" element={<Search/>}/> {/*검색 페이지*/}
                    <Route path="/votepage" element={<VotePage/>}/> {/*투표 페이지*/}
                </Routes>
        </AuthProvider>
    );
}

export default App;
