// 방장 접근 권한 페이지
import React, { useEffect, useState } from 'react';
import { fetchMembersAndTemplates, validatePost } from '../api';

const ValidatePost = ({ match }) => {
    const [members, setMembers] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplates, setSelectedTemplates] = useState({});
    const { postId, fromUserId } = match.params;

    useEffect(() => {
        const loadMembersAndTemplates = async () => {
            try {
                const response = await fetchMembersAndTemplates(postId);
                setMembers(response.data.body.members);
                setTemplates(response.data.body.templateNames);
            } catch (error) {
                console.error('Failed to fetch members and templates', error);
            }
        };

        loadMembersAndTemplates();
    }, [postId]);

    const handleChange = (member, template) => {
        setSelectedTemplates((prev) => ({
            ...prev,
            [member]: template
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validateData = {
            user_validate: members.map((member) => ({
                user_id: member.id,
                template_name: selectedTemplates[member.nickname]
            }))
        };

        try {
            await validatePost(postId, fromUserId, validateData);
            alert('Validation successful');
        } catch (error) {
            console.error('Validation failed', error);
        }
    };

    return (
        <div>
            <h2>Validate Post</h2>
            <form onSubmit={handleSubmit}>
                {members.map((member) => (
                    <div key={member.id}>
                        <label>{member.nickname}</label>
                        <select onChange={(e) => handleChange(member, e.target.value)}>
                            <option value="">Select template</option>
                            {templates.map((template) => (
                                <option key={template} value={template}>{template}</option>
                            ))}
                        </select>
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ValidatePost;
