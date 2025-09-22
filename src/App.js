import axios from "axios";
import './App.css';
import React from "react";
import {Route, Routes} from "react-router-dom";
import {AuthProvider} from "./contexts/AuthContext";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Main from "./pages/main/Main";
import FindId from "./pages/auth/FindId";
import FindPw from "./pages/auth/FindPw";
import MyInformation from "./pages/profile/MyInformation";
import MyParty from "./pages/post/MyParty";
import PostRegistration from "./pages/post/PostRegistration";
import Profile from "./pages/profile/Profile";
import VotePage from "./pages/post/VotePage";
import UserEdit from "./pages/profile/UserEdit";
import PostDetail from "./pages/post/PostDetail";
import PartyManagement from "./pages/post/PartyManagement";
import Search from "./pages/post/Search";
import GlobalNavigationBar from "./components/common/GlobalNavigationBar";

import api from "./api/api";

axios.defaults.baseURL = api;
axios.defaults.withCredentials = true;

function App() {
    return (
        <AuthProvider>
            <GlobalNavigationBar/>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/main" element={<Main/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/findid" element={<FindId/>}/>
                <Route path="/findpw" element={<FindPw/>}/>
                <Route path="/profile/:loginId" element={<Profile/>}/>
                <Route path="/my-information" element={<MyInformation/>}/>
                <Route path="/useredit" element={<UserEdit/>}/>
                <Route path="/post-registration" element={<PostRegistration/>}/>
                <Route path="/party/:postId" element={<PostDetail/>}/>
                <Route path="/my-party" element={<MyParty/>}/>
                <Route path="/party/:postId/management" element={<PartyManagement/>}/>
                <Route path="/search" element={<Search/>}/> {/*검색 페이지*/}
                <Route path="/votepage" element={<VotePage/>}/> {/*투표 페이지*/}
            </Routes>
        </AuthProvider>
    );
}

export default App;
