import Post from "../models/post-model.js";
const postCntrl = {};

// Create a new post
postCntrl.create = async (req, res) => {
    const body = req.body;
    console.log(body)
    try {
        const post = new Post(body);
        post.user = req.userID;

        // Handling file upload
        const file = req.file ? `/uploads/${req.file.filename}` : undefined;
        if (file) {
            post.file = file; // assign the uploaded file path to the post object
        }

        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Edit a post
postCntrl.edit = async (req, res) => {
    const { id } = req.params;

    try {
        let post;

        // Check if the user is an admin, moderator, or the owner of the post
        if (req.role === 'admin' || req.role === 'moderator') {
            post = await Post.findById(id);
        } else {
            post = await Post.findOne({ _id: id, user: req.userID });
        }

        // If the post is not found or unauthorized
        if (!post) {
            return res.status(404).json({ error: "Post not found or you are not authorized to edit it" });
        }

        const body = req.body;

        // Updating the post fields
        post.title = body.title || post.title;
        post.body = body.body || post.body;
        post.keywords = body.keywords || post.keywords;

        // Handling file upload if exists
        const file = req.file ? `/uploads/${req.file.filename}` : undefined;
        if (file) {
            post.file = file;
        }

        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a post
postCntrl.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        let post;

        // Allow admin, moderator, or post owner to delete
        if (req.role === "admin" || req.role === "moderator") {
            post = await Post.findByIdAndDelete(id);
        } else {
            post = await Post.findOneAndDelete({ _id: id, user: req.userID });
        }

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Like/Unlike a post
postCntrl.likes = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (!post.likes.includes(req.userID)) {
            await post.updateOne({ $push: { likes: req.userID } });
            res.status(200).json("Liked successfully");
        } else {
            await post.updateOne({ $pull: { likes: req.userID } });
            res.status(200).json("Disliked successfully");
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all posts
postCntrl.allPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        if (posts.length > 0) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ error: "No posts found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get posts of a specific user
postCntrl.getPostsOfUser = async (req, res) => {
    const { id } = req.params;
    try {
        const posts = await Post.find({ user: id });
        if (posts.length > 0) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ error: "No posts found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a comment to a post
postCntrl.comment = async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const commentData = {
            body,
            user: req.userID,
        };
        await post.updateOne({ $push: { comments: commentData } });
        res.status(200).json("Commented successfully");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a comment from a post
postCntrl.deleteComment = async (req, res) => {
    const { id } = req.params; // Comment ID
    const { postId } = req.body; // Post ID

    try {
        const post = await Post.findByIdAndUpdate(
            postId,
            { $pull: { comments: { _id: id } } },
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ message: "Comment removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default postCntrl;
