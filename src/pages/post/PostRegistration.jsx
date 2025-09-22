import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Textarea from '../../components/common/Textarea';
import FileInput from '../../components/common/FileInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../api/api';
import './PostRegistration.css';

const PostRegistration = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [hashtags, setHashtags] = useState('');

    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting === true) {
            return;
        }
        if (!title || !content || !hashtags) {
            alert("제목, 내용, 해시태그를 모두 입력하세요.");
            return;
        }
        setIsSubmitting(true);

        const postRegistrationRequest = {
            title: title,
            content: content,
            startTime: startTime.toISOString(),
            hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')).map(tag => tag.substring(1))
        };

        try {
            const postRegistrationResponse = await api.post('/api/posts', postRegistrationRequest);
            if (postRegistrationResponse.status === 201 && postRegistrationResponse.data.success) {
                const newPostId = postRegistrationResponse.data.body.postId;

                if (images.length > 0) {
                    const formData = new FormData();
                    images.forEach(image => {
                        formData.append('files', image);
                    });

                    await api.post(`/api/posts/${newPostId}/images`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                }

                alert("게시물이 등록이 성공하였습니다.");
                navigate(`/party/${newPostId}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("게시물 작성에 실패하였습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="new-post-container">
            <h2>새 모임글 작성</h2>

            <form onSubmit={handleSubmit}>
                <Input
                    label="제목"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력해주세요."
                    required
                />

                <Input
                    label="해시태그"
                    id="hashtags"
                    name="hashtags"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="예: #러닝 #독서 (공백으로 구분)"
                    required
                />

                <div className="form-group">
                    <label>모임 시간</label>

                    <DatePicker
                        selected={startTime}
                        onChange={(date) => setStartTime(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        dateFormat="yyyy년 MM월 dd일, HH:mm"
                        className="date-picker-input"
                        required
                    />
                </div>

                <Textarea
                    label="내용"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="모임 내용을 상세히 작성해주세요."
                    required
                />

                <FileInput
                    label="이미지 (선택)"
                    name="images"
                    onChange={handleImageChange}
                    multiple
                />

                <div className="new-post__button-group">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "작성 중..." : "작성 완료"}
                    </Button>

                    <Button type="button" onClick={() => navigate(-1)} className="cancel-button">취소</Button>
                </div>
            </form>
        </div>
    );
};

export default PostRegistration;
