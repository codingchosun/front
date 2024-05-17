//마이페이지 ~ 로그인 된 상태에서만 접근가능
import React, {useEffect, useState} from "react";
import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./MyPage.css";
import Header from "./Header";

const MyPage = () => {
    const { isLogin, logout } = useAuth();
    const navigate=useNavigate();

    const [nickname, setNickname]=useState('푸바오');
    const [introduction, setIntroduction]=useState('');
    const [email, setEmail]=useState('');
    const [score, setScore]=useState(70); //임의 점수 값 입력 => 나중에 변경필요
    const [hashtag, sethashtag]=useState(['#tag1','#tag2','#tag3']); //해시태그도 동적으로 값을 받아야됨

    // user 데이터 불러오기
    useEffect(() => {
        // 백엔드 API 호출
        const fetchUserData=async ()=>{
            try{
                const response=await fetch('http://localhost:8090');
                const data=await response.json();
                setNickname(data.nickname);
                setIntroduction(data.introduction);
                setEmail(data.email);
                setScore(data.score);
                sethashtag(data.hashtag);
            } catch (error) {
                console.error("Error : ",error);
            }
        };
        if(isLogin){
            fetchUserData();
        }
    }, [isLogin]);

    // 자기소개 문구 처리 이벤트 => 백엔드에 데이터 전송
    const handleIntroductionChange=async() => {
        try {
            const response=await fetch('http://localhost:8090', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({introduction}),
            });
            if(response.ok){
                alert('자기소개 문구가 변경되었습니다');
            } else {
                alert('자기소개 문구 변경에 실패했습니다');
            }
        } catch (error) {
            console.error("Error : ",error);
        }
    };

    // 이메일
    const handleEmailChange=async() => {
        try {
            const response = await fetch('httpL//localhost:8090', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
            });
            if (response.ok) {
                alert('이메일이 변경되었습니다');
            } else {
                alert('이메일이 변경에 실패했습니다');
            }
        } catch (error) {
            console.error("Error : ", error);
        }
    };

    //해쉬태그 변경
    const handleHashtagChange=(index, newValue)=>{
        const newHashtag=[...hashtag];
        newHashtag[index]=newValue;
        sethashtag(newHashtag);
    }

    //해쉬태그 변경 내용을 메인 페이지로 전달 이벤트
    const handleHashtagSave= async () =>{
        try {
            const response=await fetch('http://localhost:8090', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({introduction}),
            });
            if(response.ok){
                alert('해시태그가 저장되었습니다');
                navigate("/main", {state: {hashtag} });
            } else {
                alert('자기소개 문구 변경에 실패했습니다');
            }
        } catch (error) {
            console.error("Error : ",error);
        }
    };

    // 회원탈퇴 이벤트 => 백엔드에 회원탈퇴 요청
    const handleDeleteAccount=async() => {
        try {
            const response=await fetch('httpL//localhost:8090',{
                method:'DELETE',
            });
            if(response.ok){
                alert('회원탈퇴가 완료되었습니다');
                logout();
                navigate('/');
            } else {
                alert('회원탈퇴에 실패했습니다.');
            }
        } catch (error) {
            console.error("Error:", error);
            alert("서버통신 중 오류가 발생했습니다")
        }
    };


    return(
        <div>
            <Header/>

        <div className="mypageContainer">
            <h1>{nickname} 님의 마이페이지 입니다</h1>

            <div className="introductionContainer">
                <label>자기소개</label>
                <div className="introductionInput">
                <input
                    type="text"
                    value={introduction}
                    onChange={ (e) => setIntroduction(e.target.value)}
                    placeholder="자기소개를 한줄로 작성하세요"
                />
                <button onClick={handleIntroductionChange}>변경</button>
                </div>
            </div>

            <div className="emailContainer">
                <label>이메일</label>
                <div className="emailInput">
                    <input
                        type="text"
                        value={email}
                        onChange={ (e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력하세요"
                    />
                    <button onClick={handleEmailChange}>변경</button>
                </div>
            </div>

            <div className="mannerScore">
                <h3>매너 점수</h3>
                <div className="mannerFigure">
                    <div className="mannerFill" style={{ width: `${score}%` }}>
                        {score}%
                    </div>
                </div>
            </div>

            <div className="hashtagContainer">
                <label>해쉬 태그</label>
                <div className="hashtagInput">
                {hashtag.map((tag, index) => (
                    <input
                        key={index}
                        type="text"
                        value={tag}
                        onChange={ (e) => handleHashtagChange(index, e.target.value)}
                        placeholder="해쉬태그를 입력하세요"
                    />
                ))}
                <button onClick={handleHashtagSave}>해쉬태그 저장</button>
                </div>
            </div>

            <div className="buttonContainer">
                <Link to="/">
                    <button>개인정보 수정</button>
                </Link>
                <Link to="/">
                    <button>모임 목록</button>
                </Link>
                <button onClick={handleDeleteAccount}>회원탈퇴 </button>
            </div>
        </div>
        </div>
    );
};

export default MyPage;
