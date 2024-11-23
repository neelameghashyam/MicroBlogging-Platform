import { useEffect, useState, useContext } from "react";
import axios from "../config/axios";
import AuthContext from "../context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap

export default function ListUsers() {
    const [users, setUsers] = useState([]);
    const { state } = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('/api/user/list', {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                setUsers(response.data);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const handleChangeRole = async (id, role) => {
        try {
            const response = await axios.put(`/api/user/role/${id}`, { role: role }, {
                headers: { 'Authorization': localStorage.getItem('token') }
            });
            const newArr = users.map(ele => {
                if (ele._id === response.data._id) {
                    return response.data;
                } else {
                    return ele;
                }
            });
            setUsers(newArr);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-primary">User List - {users.length}</h2>
            <div className="list-group">
                {users.map((user) => (
                    <div className="list-group-item d-flex justify-content-between align-items-center" key={user._id}>
                        <div>
                            <strong>{user.email}</strong> - {user.role}
                        </div>
                        {state.user.role === 'admin' && state.user._id !== user._id && (
                            <div>
                                <select
                                    className="form-select form-select-sm me-2"
                                    value={user.role}
                                    onChange={(e) => handleChangeRole(user._id, e.target.value)}
                                >
                                    <option value="">Select Role</option>
                                    {['admin', 'moderator', 'user'].map((role, i) => (
                                        <option value={role} key={i}>{role}</option>
                                    ))}
                                </select>
                                <button className="btn btn-danger btn-sm">Remove</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
