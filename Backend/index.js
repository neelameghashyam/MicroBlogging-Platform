import express from "express";
import cors from "cors";
import configDb from "./config/db.js";
import userCtrl from "./app/controllers/User-cntrl.js";
import { userRegisterSchema, userLoginSchema, userResetPassSchema } from "./app/validators/user-validation.js";
import { checkSchema } from "express-validator";
import dotenv from "dotenv";
import authenticateUser from "./app/middlewares/authentication.js";
import proflieSchema from "./app/validators/Profile-Validation.js";
import profileCntrl from "./app/controllers/profile-cntrl.js";
import { postSchemaValidation, commentSchemaValidation } from "./app/validators/post-validation.js";
import postCntrl from "./app/controllers/posts-cntrl.js";
import authorization from "./app/middlewares/authorization.js";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const port = 4999;

import upload from "./app/middlewares/multer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
dotenv.config();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

configDb();

// User routes
app.post('/api/user/register', checkSchema(userRegisterSchema), userCtrl.register);
app.post('/api/user/login', checkSchema(userLoginSchema), userCtrl.login);
app.put('/api/user/reset', authenticateUser, checkSchema(userResetPassSchema), userCtrl.resetPassword);
app.get('/api/user/account', authenticateUser, userCtrl.account);
app.get('/api/user/list', authenticateUser, authorization(["admin", "moderator"]), userCtrl.allUsers);
app.delete('/api/user/deleteUser/:id', authenticateUser, authorization(['admin']), userCtrl.destroy);
app.put('/api/user/role/:id', authenticateUser, authorization(['admin']), userCtrl.changeRole);

// Profile routes
app.post('/api/profile/create', upload.single('file'), authenticateUser, checkSchema(proflieSchema), profileCntrl.create);
app.put('/api/profile/edit/:id', upload.single('file'), authenticateUser, checkSchema(proflieSchema), profileCntrl.edit);
app.get('/api/profile/get/:id', authenticateUser, profileCntrl.getUser);
app.put('/api/profile/follow/:id', authenticateUser, profileCntrl.follow);
app.put('/api/profile/unfollow/:id', authenticateUser, profileCntrl.unfollow);
app.get('/api/profiles', authenticateUser, profileCntrl.Allprofiles);

// Post routes
app.post('/api/post/create', upload.single('file'), authenticateUser, checkSchema(postSchemaValidation), postCntrl.create);
app.put('/api/post/edit/:id', authenticateUser, upload.single('file'), authorization(["admin", "moderator", "user"]), checkSchema(postSchemaValidation), postCntrl.edit);
app.put('/api/post/like/:id', authenticateUser, postCntrl.likes);
app.get('/api/post/get-posts/:id', authenticateUser, postCntrl.getPostsOfUser);
app.get('/api/post/all-posts', authenticateUser, postCntrl.allPosts);
app.put('/api/post/comments/:id', authenticateUser, checkSchema(commentSchemaValidation), postCntrl.comment);
app.put('/api/post/remove-comment/:id', authenticateUser, postCntrl.deleteComment);
app.delete('/api/post/delete/:id', authenticateUser, authorization(["admin", "moderator", "user"]), postCntrl.deletePost);

app.listen(port, () => {
  console.log('Server is running at port No:', port);
});
