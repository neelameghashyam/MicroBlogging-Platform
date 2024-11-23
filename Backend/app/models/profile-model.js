import { model, Schema } from "mongoose";

const profileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  bio: String,
  followers: Array,
  following: Array,
  file: String
}, { timestamps: true });

const Profile = model("Profile", profileSchema);

export default Profile;
