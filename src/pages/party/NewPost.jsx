import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Textarea from '../../components/common/Textarea';
import FileInput from '../../components/common/FileInput';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './NewPost.css';

const NewPost = () => {
    const [postData, setPostData] = useState({
        title: '',
        hashtags: '',
        content: '',
    });
    const [date, setDate] = useState(new Date());
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setPostData(prev => ({...prev, [name]: value}));
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!postData.title || !postData.hashtags || !postData.content) {
            alert("빈칸을 모두 입력해주세요.");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);

        const submissionData = {
            title: postData.title,
            content: postData.content,
            start_time: date.toISOString(),
            hashtags: postData.hashtags.split(' ').filter(tag => tag)
        };

        try {
            const postResponse = await axios.post('/posts/register', submissionData);
            const newPostId = postResponse.data.body;

            if (images.length > 0) {
                const formData = new FormData();
                images.forEach(image => {
                    formData.append('files', image);
                });

                await axios.post(`/posts/${newPostId}/images`, formData, {
                    headers: {'Content-Type': 'multipart/form-data'},
                });
            }
            alert("게시물 작성이 성공하였습니다.");
            navigate(`/party/${newPostId}`);
        } catch (error) {
            console.error("Error:", error);
            alert("게시물 작성에 실패하였습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="new-post-container">
            <h2>새 모임글 작성</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    label="제목"
                    name="title"
                    value={postData.title}
                    onChange={handleChange}
                    placeholder="제목을 입력해주세요."
                    required
                />

                <Input
                    label="해시태그"
                    name="hashtags"
                    value={postData.hashtags}
                    onChange={handleChange}
                    placeholder="예: #러닝 #풋살 #게임"
                    required
                />

                <div className="form-group">
                    <label>Date and Time</label>
                    <DatePicker
                        selected={date}
                        onChange={(d) => setDate(d)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="date-picker-input"
                        required
                    />
                </div>

                <Textarea
                    label="내용"
                    name="content"
                    value={postData.content}
                    onChange={handleChange}
                    placeholder="모임 내용을 작성해주세요."
                    required
                />

                <FileInput
                    label="이미지"
                    name="images"
                    onChange={handleImageChange}
                    multiple
                />

                <div className="new-post__button-group">
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "작성중..." : "게시물 작성"}</Button>
                    <Button type="button" onClick={() => navigate(-1)} className="cancel-button">취소</Button>
                </div>
            </form>
        </div>
    );
};

export default NewPost;
