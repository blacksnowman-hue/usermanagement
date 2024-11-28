// src/components/UserList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./UserForm";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = (page) => {
    setLoading(true);
    axios
      .get(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=5`)
      .then((response) => {
        setUsers(response.data);
        setTotalPages(Math.ceil(10 / 5)); // Assume JSONPlaceholder API returns 10 users in total
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users");
        setLoading(false);
      });
  };

  const handleAddUser = (user) => {
    axios
      .post("https://jsonplaceholder.typicode.com/users", user)
      .then((response) => {
        setUsers([...users, response.data]);
        setEditingUser(null);
      })
      .catch(() => setError("Failed to add user"));
  };

  const handleEditUser = (updatedUser) => {
    axios
      .put(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, updatedUser)
      .then(() => {
        setUsers(
          users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setEditingUser(null);
      })
      .catch(() => setError("Failed to update user"));
  };

  const handleDeleteUser = (id) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch(() => setError("Failed to delete user"));
  };

  return (
    <div className="user-list">
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <button className="add-button" onClick={() => setEditingUser({})}>
            Add User
          </button>
          {editingUser && (
            <UserForm
              user={editingUser}
              onSave={editingUser.id ? handleEditUser : handleAddUser}
              onCancel={() => setEditingUser(null)}
            />
          )}
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name.split(" ")[0]}</td>
                  <td>{user.name.split(" ")[1]}</td>
                  <td>{user.email}</td>
                  <td>{user.company.name}</td>
                  <td>
                    <button className="edit-button" onClick={() => setEditingUser(user)}>
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span>{`Page ${page} of ${totalPages}`}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
