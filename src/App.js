//import axios from "axios";
import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./pages/AuthContext";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VotePage from "./pages/VotePage";
import Logo from "./pages/Logo";
import Main from "./pages/Main";
import FindId from "./pages/FindId";
import FindPw from "./pages/FindPw";
import MyPage from "./pages/MyPage";

function App() {
  return (
      // {로고, 로그인(로그아웃) 버튼, 마이페이지 버튼}
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Main/>}/>
              <Route path="/main" element={<Main/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/votepage" element={<VotePage/>}/>
              <Route path="/findid" element={<FindId/>}/>
              <Route path="/findpw" element={<FindPw/>}/>
              <Route path="/mypage" element={<MyPage/>}/>
          </Routes>
          </AuthProvider>
  );
}

export default App;
