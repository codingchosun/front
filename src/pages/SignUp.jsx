//회원가입 페이지
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SingUp.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [checkPw, setCheckPw] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [nickName, setNickname] = useState("");
  const [isIdOverlap, setisIdOverlap]=useState(null);
  const [isCheckId,setisCheckId]=useState(false);

  const navigate=useNavigate();
  //확인 버튼 정보전송
  const handleSubmitSignUp = async(e) => {
    e.preventDefault();
    if (pw !== checkPw) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!name || !id || !pw || !birth || !nickName) {
      alert("필수 입력을 채워주세요");
      return;
    }
    const userData={name, id, email, gender, birth, nickName};
    console.log("회원가입 정보", { name, id, email, gender, birth, nickName });
    try{
      const response=await fetch("백엔드서버url",{
        method : 'POST',
        header: {
          '데이터타입' : 'application/json',
        },
        body: JSON.stringify(userData), //백엔드로 데이터 전송
      });
      if(response.ok){
        alert("회원가입이 완료되었습니다.");
        navigate('/main');
      } else {
        alert("회원가입이 실패했습니다. 다시 시도해주세요");
      }
    } catch (error){
      console.error("Error:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
    //나머지 회원가입 서버에 갱신
  };
  const handleCancel = () => {
    navigate('/main');
  }

  const handleCheckId=async () => {
    if(!id){
      alert("아이디를 입력하세요");
      return;
    }
    setisCheckId(true);
    try {
      const response = await fetch(`http://백엔드서버url/check-id?id=${id}`);
      const result = await response.json();
      if (result.isIdOverlap) {
        setisIdOverlap(true);
        alert("사용 가능한 아이디입니다.");
      } else {
        setisIdOverlap(false);
        alert("이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    } finally {
      setisCheckId(false);
    }

  };
  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeId = (e) => {
    setId(e.target.value);
  };

  const onChangePw = (e) => {
    setPw(e.target.value);
  };

  const onChangeCheckPw = (e) => {
    setCheckPw(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangeGender = (e) => {
    setGender(e.target.value);
  };

  const onChangeBirth = (e) => {
    setBirth(e.target.value);
  };

  const onChangeNickname = (e) => {
    setNickname(e.target.value);
  };

  return (
    <form onSubmit={handleSubmitSignUp}>
      <div>
        <label>이름</label>
        <input
          type="text"
          value={name}
          onChange={onChangeName}
          placeholder={"이름"}
        />
      </div>

      <div>
        <label>아이디</label>
        <input
          type="text"
          value={id}
          onChange={onChangeId}
          placeholder={"아이디는 2~14이하로 만들어주세요"}
        />
        <button
            type="button"
            onClick={handleCheckId}
            disabled={isCheckId}
        > { isCheckId ? "중복 확인중" : "중복 확인 완료"}</button>
        {isIdOverlap !== null && (
            <span>
            {isIdOverlap ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다."}
          </span>
        )}
      </div>

      <div>
        <label>비밀번호</label>
        <input
            type="password"
          value={pw}
          onChange={onChangePw}
          placeholder={"영소대문자,숫자를 포함한 6~14이하로 만들어주세요"}
        />
      </div>

      <div>
        <label>비밀번호확인</label>
        <input
          type="password"
          value={checkPw}
          onChange={onChangeCheckPw}
          placeholder={"비밀번호와 똑같이 입력해주세요"}
        />
      </div>

      <div>
        <label>이메일</label>
        <input
          type="email"
          value={email}
          onChange={onChangeEmail}
          placeholder={"이메일을 입력해주세요"}
        />
      </div>

      <div>
        <label>성별</label>
        <select value={gender}
                onChange={onChangeGender}>
          <option value="">성별</option>
          <option value="men">남성</option>
          <option value="women">여성</option>
          <option value="others">고르지않음</option>
        </select>
      </div>

      <div>
        <label>생년월일</label>
        <input
            type="date"
            value={birth}
            onChange={onChangeBirth} />
      </div>

      <div>
        <label>닉네임</label>
        <input
            type="text"
            value={nickName}
            onChange={onChangeNickname} />
      </div>

      <div>
        <button type="submit">완료</button>
        <button type="button" onClick={handleCancel}>취소</button>
      </div>
    </form>
  );
};

export default SignUp;
