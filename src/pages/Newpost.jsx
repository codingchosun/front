//게시물 작성 페이지
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./Newpost.css";

const NewPost = () => {
    const [title, setTitle] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [date, setDate] = useState(new Date());
    const [content, setContent] = useState('');
    const [image, setImage]=useState(null);
    const [isSubmit, setIsSubmit]=useState(false);

    const navigate = useNavigate();

    //게시물 작성완료시 form제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !hashtags || !content) {
            alert("빈칸을 모두 입력해주세요.");
            return;
        }
        console.log({ title, hashtags, date, content });
        navigate('/main'); //작성완료시 main페이지 이동


    setIsSubmit(true);
    const formData=new FormData();
    formData.append("title",title);
    formData.append("hashtags",hashtags);
    formData.append("date",date);
    formData.append("content",content);
    formData.append("image",image);
    try{
        const response=await fetch('https://localhost:8090',{
            method: 'POST',
            body: formData,
        });
        if(response.ok){
            alert("게시물이 작성되었습니다");
            navigate("/main");//게시물 작성 성공시 main페이지 이동
        } else {
            alert("다시 시도해주세요");
        }
    } catch(error) {
        console.error("Error:", error);
        alert("서버와의 통신 중 오류가 발생했습니다.");
    } finally {
        setIsSubmit(false);
    }
    };

    //취소 버튼 누를시  이전 페이지로 이동
    const handleCancel = () => {
        navigate(-1);
    };

    const handleImageChange = (e) => {
        setImage(Array.from(e.target.file));
    }
    return (
        <div className="post-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">제목 입력</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="hashtags">해시태그</label>
                    <input
                        type="text"
                        id="hashtags"
                        placeholder="#분야 #장소"
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">일시</label>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="date-picker"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">이미지</label>
                    <input
                        type="file"
                        id="image"
                        multiple onChange={handleImageChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        placeholder="본문 해시태그 금지"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="form-buttons">
                    <button type="button" className="cancel-button" onClick={handleCancel}>취소</button>
                    <button type="submit" className="submit-button" disabled={isSubmit}>
                        {isSubmit ? "작성 중" : "작성"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewPost;
