import Profile from "../models/profile-model.js";
import { validationResult } from "express-validator";

const profileCntrl = {};

// Create Profile
profileCntrl.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body = req.body;
  const file = req.file ? `/uploads/${req.file.filename}` : undefined; // Corrected req.profilePic to req.file
  if (file) body.file = file; // Attach profilePic to body if file exists

  try {
    const pro_exist = await Profile.findOne({ user: req.userID });
    if (pro_exist) {
      return res.status(400).json({ error: "User has already created a profile" });
    }

    const profile = new Profile({ ...body, user: req.userID });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit Profile
profileCntrl.edit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userID = req.userID;
  const body = req.body;
  try {
    const profile = await Profile.findOne({ user: userID });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const file = req.file ? `/uploads/${req.file.filename}` : undefined; 
    if (file) profile.file = file; 

    // Update other fields conditionally
    profile.userName = body.userName || profile.userName;
    profile.bio = body.bio || profile.bio;

    await profile.save();
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Profile
profileCntrl.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Profile.findOne({ user: id });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "Profile not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Follow User
profileCntrl.follow = async (req, res) => {
  const { id } = req.params;
  if (id !== req.userID) {
    try {
      const userToFollow = await Profile.findOne({ user: id });
      const currentUser = await Profile.findOne({ user: req.userID });
      if (!userToFollow.followers.includes(req.userID)) {
        await userToFollow.updateOne({ $push: { followers: req.userID } });
        await currentUser.updateOne({ $push: { following: id } });
        res.status(200).json("Followed successfully");
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json("You can't follow yourself");
  }
};

// Unfollow User
profileCntrl.unfollow = async (req, res) => {
  const { id } = req.params;
  if (id !== req.userID) {
    try {
      const userToUnfollow = await Profile.findOne({ user: id });
      const currentUser = await Profile.findOne({ user: req.userID });
      if (userToUnfollow.followers.includes(req.userID)) {
        await userToUnfollow.updateOne({ $pull: { followers: req.userID } });
        await currentUser.updateOne({ $pull: { following: id } });
        res.status(200).json("Unfollowed successfully");
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json("You can't unfollow yourself");
  }
};

// Get All Profiles Except Current User
profileCntrl.Allprofiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    const mainProfiles = profiles.filter((e) => e.user.toString() !== req.userID);
    res.status(200).json(mainProfiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default profileCntrl;
