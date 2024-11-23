import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from '../config/axios';
import "../css/dashBoard.css";

export default function Dashboard() {
    const { state } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editBody, setEditBody] = useState("");
    const [editKeywords, setEditKeywords] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            if (!state.user) {
                setLoading(true);
                return;
            }

            try {
                const response = await axios.get(`/api/post/get-posts/${state.user._id}`, {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                setPosts(response.data);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [state.user]);

    if (loading) {
        return <p>Loading...</p>;
    }

    const handleEdit = (post) => {
        setEditMode(post._id);
        setEditTitle(post.title);
        setEditBody(post.body);
        setEditKeywords(post.keywords);
    };

    const handleUpdate = async (postId) => {
        try {
            const updateData = {
                title: editTitle,
                body: editBody,
                keywords: editKeywords,
            };

            const response = await axios.put(`/api/post/edit/${postId}`, updateData, {
                headers: { 'Authorization': localStorage.getItem('token') }
            });

            setPosts(posts.map(post => post._id === postId ? response.data : post));
            setEditMode(null); // Exit edit mode after update
        } catch (err) {
            console.error('Error updating post:', err);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (name === "title") setEditTitle(value);
        if (name === "body") setEditBody(value);
        if (name === "keywords") setEditKeywords(value);
    };

    return (
        <div className="container">
            <h2>Welcome, {state.user.username}</h2>
            {posts.map(post => (
                <div key={post._id} className="post">
                    {editMode === post._id ? (
                        <div>
                            <input
                                name="title"
                                value={editTitle}
                                onChange={handleEditChange}
                                placeholder="Title"
                            /><br />
                            <textarea
                                name="body"
                                value={editBody}
                                onChange={handleEditChange}
                                placeholder="Body"
                            /><br />
                            <input
                                name="keywords"
                                value={editKeywords}
                                onChange={handleEditChange}
                                placeholder="Keywords"
                            /><br />
                            <button onClick={() => handleUpdate(post._id)}>Save</button>
                            <button onClick={() => setEditMode(null)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <p>Title: {post.title}</p>
                            <p>Body: {post.body}</p>
                            <p>Keywords: {post.keywords}</p>
                            <p>Likes: {post.likes.length} | Comments: {post.comments.length}</p>
                            <button onClick={() => handleEdit(post)}>Edit</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
