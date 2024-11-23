import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "../config/axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap

export default function AllProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState({});
  const { state } = useContext(AuthContext);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('/api/profiles', {
          headers: { 'Authorization': localStorage.getItem('token') }
        });
        setProfiles(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfiles();
  }, [trigger]);

  useEffect(() => {
    if (state.user) {
      const fetchProfile = async () => {
        try {
          const profile = await axios.get(`/api/profile/get/${state.user._id}`, {
            headers: { 'Authorization': localStorage.getItem('token') }
          });
          setCurrentProfile(profile.data);
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      };

      fetchProfile();
    }
  }, [state.user, trigger]);

  const handleFollow = async (id) => {
    try {
      await axios.put(`/api/profile/follow/${id}`, {}, {
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      setTrigger(!trigger);
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleUnFollow = async (id) => {
    try {
      await axios.put(`/api/profile/unfollow/${id}`, {}, {
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      setTrigger(!trigger);
    } catch (err) {
      console.error('Error unfollowing user:', err);
    }
  };

  if (!state.user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">All Profiles</h2>
      <div className="row">
        {profiles.map(ele => (
          <div className="col-md-4 mb-4" key={ele._id}>
            <div className="card shadow-lg h-100">
              <div className="card-body text-center">
                <img
                  src={ele.file ? `http://localhost:4999${ele.file}` : "/path/to/placeholder-image.jpg"}
                  alt="Profile"
                  className="rounded-circle img-fluid mb-3"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <h5 className="card-title">{ele.userName}</h5>
                <p className="card-text text-muted">
                  Bio: {ele.bio || "No bio available"}
                </p>
                {currentProfile.following && currentProfile.following.includes(ele.user)
                  ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUnFollow(ele.user)}
                    >
                      Unfollow
                    </button>
                  )
                  : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleFollow(ele.user)}
                    >
                      Follow
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
