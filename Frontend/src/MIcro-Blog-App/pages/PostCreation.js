import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap

export default function PostCreation() {
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState();
    const { handlePostCreation } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            title: title,
            body: body,
            file: file
        };

        console.log(formData)

        await handlePostCreation(formData);
        setBody('');
        setTitle('');
        setFile(null);
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <h2 className="text-center mb-4 text-primary">Create a Post</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="title">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="body">Body</label>
                            <textarea
                                className="form-control"
                                id="body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="What's on your mind?"
                                rows="4"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="file">Image/Video</label>
                            <input
                                type="file"
                                className="form-control"
                                id="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary btn-lg w-50">
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
