import axios from "axios";
import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./pages/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./pages/Main";
import FindId from "./pages/FindId";
import FindPw from "./pages/FindPw";
import MyPage from "./pages/MyPage";
import MyParty from "./pages/MyParty";
import NewPost from "./pages/NewPost";
// import VotePage from "./pages/VotePage";
import UserEdit from "./pages/UserEdit";
import Party from "./pages/Party";
// import Manage from "./pages/Manage";
import Search from "./pages/Search";
import Header from "./pages/Header";

import api from "./api";

axios.defaults.baseURL = api;
axios.defaults.withCredentials = true;

function App() {
    return (
        <AuthProvider>
            <Header/>
                <Routes>
                    <Route path="" element={<Login/>}/> {/*디폴트 페이지*/}
                    <Route path="/main" element={<Main/>}/> {/*메인 페이지*/}
                    <Route path="/login" element={<Login/>}/> {/*로그인 페이지*/}
                    <Route path="/register" element={<Register/>}/> {/*회원가입 페이지*/}
                    <Route path="/findid" element={<FindId/>}/> {/*아이디찾기 페이지*/}
                    <Route path="/findpw" element={<FindPw/>}/> {/*비밀번호찾기 페이지*/}

                    {/*<Route path="/mypage" element={<MyPage/>}/> /!*내정보 페이지*!/*/}
                    {/*<Route path="/newpost" element={<NewPost/>}/> /!*새 게시물 제작 페이지*!/*/}
                    {/*<Route path="/useredit" element={<UserEdit/>}/> /!*개인정보 수정 페이지*!/*/}
                    {/*<Route path="/party" element={<Party/>}/> /!*모임 페이지*!/*/}
                    {/*<Route path="/myparty" element={<MyParty/>}/>*/}
                    {/*<Route path="/manage" element={<Manage/>}/> /!*관리 페이지*!/*/}
                    {/*<Route path="/search" element={<Search/>}/> /!*검색 페이지*!/*/}
                    {/*<Route path="/votepage" element={<VotePage/>}/> /!*투표 페이지*!/*/}
                </Routes>
        </AuthProvider>
    );
}

export default App;
