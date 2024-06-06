//게시물 쓰기 페이지
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./NewPost.css";

const NewPost = () => {
    const [title, setTitle] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [date, setDate] = useState(new Date());
    const [content, setContent] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const [images, setImages]=useState([]);
    const navigate = useNavigate();

    const handleImageChange=(e)=>{
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !hashtags || !content) {
            alert("빈칸을 모두 입력해주세요.");
            return;
        }
        console.log({ title, hashtags, date, content }); //, images
        setIsSubmit(true);

        const hashtagsArray = hashtags.split(' ');

        const postData = {
            title: title,
            content: content,
            start_time: date.toISOString(),
            hashtags: hashtagsArray
        };
        console.log("해시태그 전송전: ", hashtagsArray);


        try {
            const response = await axios.post('http://localhost:8090/posts/register', postData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const newPostId = response.data.body;

            if (images.length > 0){
                const formData=new FormData();
                images.forEach( (image, index) => {
                    formData.append(`files`, image);
                });

                await axios.post(`http://localhost:8090/posts/${newPostId}/images`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            alert("게시물이 작성되었습니다");
            console.log('newPostId:', newPostId);
            navigate("/main", { state: { newPostId } });

        } catch (error) {
            console.error("Error:", error);
            alert("서버와의 통신 중 오류가 발생했습니다.");
        } finally {
            setIsSubmit(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

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
                        placeholder="#해시태그"
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
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        placeholder="본문 해시태그 금지"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="images">이미지 업로드</label>
                    <input
                        type="file"
                        id="images"
                        multiple
                        onChange={handleImageChange}
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
