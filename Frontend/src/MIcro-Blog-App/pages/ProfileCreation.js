import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function ProfileCreation() {
    const [userName, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState();
    const { handleProfileCreation } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            userName: userName,
            bio: bio,
            profilePic: profilePic,
        };
        handleProfileCreation(formData);
    };

    return (
        <div>
            <h2>Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>User Name</label><br />
                <input type="text" value={userName} onChange={e => setUserName(e.target.value)} /><br />
                <label>Bio</label><br />
                <input type="text" value={bio} onChange={e => setBio(e.target.value)} /><br />
                <label>Profile Picture</label><br />
                <input type="file" onChange={e => setProfilePic(e.target.files[0])} /><br />
                <input type="submit" />
            </form>
        </div>
    );
}
