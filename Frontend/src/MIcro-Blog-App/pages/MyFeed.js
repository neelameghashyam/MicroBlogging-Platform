import { useEffect, useState, useContext } from "react";
import axios from "../config/axios";
import AuthContext from "../context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../app.css'; // Custom styles

export default function MyFeed() {
    const { state } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState({});
    const [commentTexts, setCommentTexts] = useState({}); // To track comment input for each post

    useEffect(() => {
        if (state.user && state.user._id) {
            const fetchProfile = async () => {
                try {
                    const profileResponse = await axios.get(`/api/profile/get/${state.user._id}`, {
                        headers: { 'Authorization': localStorage.getItem('token') },
                    });
                    setProfile(profileResponse.data);
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                }
            };

            fetchProfile();
        }
    }, [state.user]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (profile.following && profile.following.length > 0) {
                try {
                    let allPosts = [];
                    for (let i = 0; i < profile.following.length; i++) {
                        const response = await axios.get(`/api/post/get-posts/${profile.following[i]}`, {
                            headers: { 'Authorization': localStorage.getItem('token') }
                        });
                        allPosts = [...allPosts, ...response.data];
                    }
                    const uniquePosts = Array.from(new Set(allPosts.map(post => post._id)))
                        .map(id => allPosts.find(post => post._id === id));
                    setPosts(uniquePosts);
                } catch (err) {
                    console.error('Error fetching posts:', err);
                }
            }
        };

        fetchPosts();
    }, [profile.following]);

    const handleLike = async (postId) => {
        if (!profile || !profile.user) return;
        try {
            await axios.put(`/api/post/like/${postId}`, {}, {
                headers: { 'Authorization': localStorage.getItem('token') }
            });
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? { ...post, likes: [...post.likes, profile.user._id] } : post
                )
            );
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleDisLike = async (postId) => {
        if (!profile || !profile.user) return;
        try {
            await axios.put(`/api/post/like/${postId}`, {}, {
                headers: { 'Authorization': localStorage.getItem('token') }
            });
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? { ...post, likes: post.likes.filter(userId => userId !== profile.user._id) } : post
                )
            );
        } catch (err) {
            console.error('Error unliking post:', err);
        }
    };

    const handleCommentChange = (postId, text) => {
        setCommentTexts({
            ...commentTexts,
            [postId]: text,
        });
    };

    const handleComment = async (postId) => {
        try {
            const commentText = commentTexts[postId];
            if (!commentText.trim()) return;
            const response = await axios.put(`/api/post/comments/${postId}`, { body: commentText, user: state.user }, {
                headers: { 'Authorization': localStorage.getItem('token') }
            });
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? { ...post, comments: [...post.comments, response.data.comment] } : post
                )
            );
            setCommentTexts(prev => ({ ...prev, [postId]: '' })); // Clear the comment input for the specific post
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            await axios.put(`/api/post/remove-comment/${commentId}`, { postId }, {
                headers: { 'Authorization': localStorage.getItem('token') }
            });
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? { ...post, comments: post.comments.filter(comment => comment._id !== commentId) } : post
                )
            );
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    return (
        <div className="container mt-4">
            {posts.map(post => (
                <div key={post._id} className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text">{post.body}</p>
                        <p className="card-text">
                            <small className="text-muted">Keywords: {post.keywords}</small>
                        </p>
                        <p className="card-text">
                            Likes: {post.likes?.length || 0}
                            {post.likes?.includes(profile.user?._id) ? (
                                <button className="btn btn-outline-danger btn-sm ml-2" onClick={() => handleDisLike(post._id)}>
                                    Unlike
                                </button>
                            ) : (
                                <button className="btn btn-outline-primary btn-sm ml-2" onClick={() => handleLike(post._id)}>
                                    Like
                                </button>
                            )}
                        </p>
                        <p className="card-text">
                            Comments: {post.comments?.length || 0}
                        </p>
                        {post.comments?.map(comment => (
                            comment && comment.body ? (
                                <div key={comment._id} className="mb-2">
                                    <p className="mb-1">
                                        {comment.body}
                                        {comment.user === state.user._id && (
                                            <button className="btn btn-link btn-sm" onClick={() => handleDeleteComment(post._id, comment._id)}>
                                                Delete
                                            </button>
                                        )}
                                    </p>
                                </div>
                            ) : null
                        ))}
                        <textarea
                            value={commentTexts[post._id] || ''}
                            onChange={(e) => handleCommentChange(post._id, e.target.value)}
                            className="form-control mb-2"
                            placeholder="Write a comment..."
                        />
                        <button className="btn btn-primary btn-sm" onClick={() => handleComment(post._id)}>Post Comment</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
