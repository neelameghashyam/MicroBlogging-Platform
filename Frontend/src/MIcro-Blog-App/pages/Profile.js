import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "../config/axios";
import "../css/profile.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const { state } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [editUserName, setEditUserName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editFile, setEditFile] = useState(null);

  useEffect(() => {
    if (state.user && state.user._id) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(`/api/profile/get/${state.user._id}`, {
            headers: { Authorization: localStorage.getItem("token") },
          });
          setProfile(response.data);
          setEditUserName(response.data.userName);
          setEditBio(response.data.bio);
        } catch (err) {
          console.error("Error fetching user data:", err.message);
        }
      };
      fetchProfile();
    }
  }, [state.user, trigger]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("/api/profiles", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setProfiles(response.data);
      } catch (err) {
        console.error("Error fetching profiles:", err.message);
      }
    };
    fetchProfiles();
  }, [trigger]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "userName") setEditUserName(value);
    if (name === "bio") setEditBio(value);
  };

  const handleFileChange = (e) => {
    setEditFile(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("userName", editUserName);
      formData.append("bio", editBio);
      if (editFile) {
        formData.append("file", editFile);
      }

      const response = await axios.put(`/api/profile/edit/${profile._id}`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(response.data);
      setEditMode(false);
      setTrigger((prev) => !prev);
    } catch (err) {
      console.error("Error updating profile:", err.message);
    }
  };

  const handleFollow = async (id) => {
    try {
      await axios.put(`/api/profile/follow/${id}`, {}, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setTrigger((prev) => !prev);
    } catch (err) {
      console.error("Error following user:", err.message);
    }
  };

  const handleUnFollow = async (id) => {
    try {
      await axios.put(`/api/profile/unfollow/${id}`, {}, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setTrigger((prev) => !prev);
    } catch (err) {
      console.error("Error unfollowing user:", err.message);
    }
  };

  if (!state.user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* User Details Card */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <img
                src={profile.file ? `http://localhost:4999${profile.file}` : "/path/to/placeholder-image.jpg"}
                alt="Profile"
                className="rounded-circle img-fluid mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              {editMode ? (
                <div>
                  <input
                    name="userName"
                    value={editUserName}
                    onChange={handleEditChange}
                    placeholder="User Name"
                    className="form-control mb-2"
                  />
                  <textarea
                    name="bio"
                    value={editBio}
                    onChange={handleEditChange}
                    placeholder="Bio"
                    className="form-control mb-2"
                  />
                  <label>Profile Picture:</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    className="form-control mb-2"
                  />
                  <button className="btn btn-success me-2" onClick={handleUpdateProfile}>
                    Save
                  </button>
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <h5 className="card-title">{profile.userName}</h5>
                  <p className="card-text">{profile.bio}</p>
                  <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Followers and Following Card */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Followers</h5>
              <ul className="list-group mb-3">
                {profiles
                  .filter((e) => profile.followers && profile.followers.includes(e.user))
                  .map((e) => (
                    <li key={e.user} className="list-group-item d-flex justify-content-between align-items-center">
                      {e.userName}
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleUnFollow(e.user)}
                      >
                        Unfollow
                      </button>
                    </li>
                  ))}
              </ul>

              <h5>Following</h5>
              <ul className="list-group">
                {profiles
                  .filter((e) => profile.following && profile.following.includes(e.user))
                  .map((e) => (
                    <li key={e.user} className="list-group-item d-flex justify-content-between align-items-center">
                      {e.userName}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleUnFollow(e.user)}
                      >
                        Unfollow
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
