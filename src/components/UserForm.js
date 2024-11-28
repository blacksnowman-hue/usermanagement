// src/components/UserForm.js
import React, { useState, useEffect } from "react";

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    company: user.company?.name || "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        company: user.company?.name || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) {
      setError("All fields are required.");
      return;
    }
    setError("");
    onSave({ ...formData, id: user.id });
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div>
        <label>First Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Department:</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
        />
      </div>
      {error && <div className="form-error">{error}</div>}
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default UserForm;
