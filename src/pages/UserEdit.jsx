// 내정보 수정 페이지 (프로필 수정 페이지)
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./UserEdit.css";
import Header from "./Header";
const UserEdit = () => {
    const { isLogin, logout } = useAuth();
    const navigate=useNavigate();
    const [currentPassword, setCurrentPassword]=useState("");
    const [newPassword, setNewPassword]=useState("");
    const [nickname, setNickname]=useState("");
    const [isNicknameCheck, setIsNicknameCheck]=useState(false);

    // 비밀번호 변경
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:8090', {
                method: 'PUT',
                header: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({currentPassword, newPassword}),
            });
            if(response.ok){
                alert('비밀번호가 변경되었습니다');
                logout();
                navigate("/login");
            } else {
                alert('비밀번호 변경에 실패했습니다');
            }
        } catch (error) {
            console.error("error: ",error);
        }
    };

    //닉네임 중복확인
    const handleNicknameCheck=async () => {
        try {
            const response=await fetch('http://localhost:8090');
            const result=await response.json();
            if(result.isAvailable){
                alert("사용가능한 닉네임 입니다");
                setIsNicknameCheck(true);
            } else {
                alert("이미 사용 중인 닉네임 입니다");
                setIsNicknameCheck(false);
            }
        } catch (error){
            console.log("error: ",error);
        }
    };
    //닉네임 변경
    const handleNicknameChange=async () => {
        if(!isNicknameCheck){
            alert("닉네임이 중복되었습니다");
            return false;
        }
        try {
            const response = await fetch('http://localhost:8090', {
                method: 'PUT',
                header: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({nickname}),
            });
            if(response.ok){
                alert('닉네임이 변경되었습니다');
                logout();
                navigate("/mypage");
            } else {
                alert('닉네임 변경에 실패했습니다');
            }
        } catch (error) {
            console.error("error: ",error);
        }
    };

    return (
        <div>
            <Header/>
            <div className="userEditContainer">
                <h1>회원정보 수정 페이지</h1>
                <form className="changePassword" onSubmit={handlePasswordChange}>
                    <div className="currentPassword">
                        <label>현재 비밀번호</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="현재 사용중인 비밀번호를 입력하세요"
                            required // input창이 비어있으면 데이터가 전송되지않음
                        />
                    </div>
                    <div className="newPassword">
                        <label>새 비밀번호</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="영문 6~14자 이내로 작성"
                            required
                        />
                    </div>
                    <button type="submit">비밀번호 변경</button>
                </form>

                <form className="changeNickname" onSubmit={handleNicknameChange}>
                    <div className="nickname">
                        <label>닉네임</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="변경할 닉네임을 입력해주세요"
                            required
                        />
                        <button type="button" onClick={handleNicknameCheck}>중복확인</button>
                        <button type="submit" disabled={!isNicknameCheck}>닉네임 변경</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEdit;