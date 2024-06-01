import axios from 'axios';

const API_BASE_URL = 'http://localhost:8090';

export const registerUser = (userData) => {
    return axios.post(`${API_BASE_URL}/register`, userData);
};

export const loginUser = (loginData) => {
    return axios.post(`${API_BASE_URL}/login`, loginData);
};

// export const fetchPosts = (page, size) => {
//     return axios.get(`${API_BASE_URL}/posts`, {
//         params: { page, size }
//     });
// };
export const fetchPosts = (page, size) => {
    return axios.get(`${API_BASE_URL}/posts`, {
        params: { page, size }
    }).then(response => {
        console.log(response); // 응답 전체를 출력
        return response;
    });
};


export const fetchPostDetails = (postId) => {
    return axios.get(`${API_BASE_URL}/posts/${postId}`);
};

export const fetchMembersAndTemplates = (postId) => {
    return axios.get(`${API_BASE_URL}/bridge/validate/post/${postId}/members`);
};

export const validatePost = (postId, fromUserId, validateData) => {
    return axios.post(`${API_BASE_URL}/bridge/validate/post/${postId}/user/${fromUserId}`, validateData);
};

export const fetchPostComments = (postId) => {
    return axios.get(`${API_BASE_URL}/posts/${postId}/comments`);
};
