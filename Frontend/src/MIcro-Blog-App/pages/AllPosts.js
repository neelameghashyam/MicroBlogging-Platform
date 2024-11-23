import { useEffect, useState, useContext } from "react";
import axios from "../config/axios";
import AuthContext from "../context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../css/allposts.css'; // Custom CSS for additional styles

export default function AllPosts() {
    const { state } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState({});
    const [commentTexts, setCommentTexts] = useState({}); // To track comment input for each post
    const [trigger, setTrigger] = useState(true);

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
            try {
                const response = await axios.get('/api/post/all-posts', {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                setPosts(response.data);
            } catch (err) {
                console.error('Error fetching posts:', err);
            }
        };
        fetchPosts();
    }, [profile.following, trigger]);

    const handleLike = async (postId) => {
        if (!profile.user) return; // Ensure profile.user exists

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
        if (!profile.user) return; // Ensure profile.user exists

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
        if (!state.user) return; // Ensure state.user exists

        try {
            const commentText = commentTexts[postId] || ''; // Get the comment text for the specific post
            if (!commentText.trim()) return; // Prevent posting empty comments
            const response = await axios.put(`/api/post/comments/${postId}`, { body: commentText, user: state.user }, {
                headers: { 'Authorization': localStorage.getItem('token') }
            });
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? { ...post, comments: [...post.comments, response.data.comment] } : post
                )
            );
            setCommentTexts(prev => ({ ...prev, [postId]: '' })); // Clear the comment input for the specific post
            setTrigger(!trigger); // Trigger refresh
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
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-primary">All Posts</h2>
            <div className="row">
                {posts.map(post => (
                    <div key={post._id} className="col-12 mb-4">
                        <div className="card shadow-lg">
                            <div className="card-body">
                                <h5 className="card-title text-dark">{post.title}</h5>
                                <p className="card-text text-muted">{post.body}</p>
                                <p className="card-text"><strong>Keywords:</strong> {post.keywords}</p>
                                <p>
                                    <strong>Likes:</strong> {post.likes?.length || 0}
                                    {profile.user && post.likes?.includes(profile.user._id) ? (
                                        <button className="btn btn-danger ms-2" onClick={() => handleDisLike(post._id)}>Unlike</button>
                                    ) : (
                                        <button className="btn btn-primary ms-2" onClick={() => handleLike(post._id)}>Like</button>
                                    )}
                                </p>
                                <p><strong>Comments:</strong> {post.comments?.length || 0}</p>
                                {post.comments?.map(comment => (
                                    comment && comment.body ? (
                                        <div key={comment._id} className="mb-2">
                                            <p className="mb-1">{comment.body}</p>
                                            {comment.user === state.user._id && (
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(post._id, comment._id)}>Delete</button>
                                            )}
                                        </div>
                                    ) : null
                                ))}
                                <div className="mt-3">
                                    <textarea
                                        className="form-control"
                                        value={commentTexts[post._id] || ''}
                                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                        placeholder="Write a comment..."
                                    ></textarea>
                                    <button className="btn btn-success mt-2" onClick={() => handleComment(post._id)}>Post Comment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
