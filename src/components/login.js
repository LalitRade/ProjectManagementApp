import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setShowLoginForm(true);
  };

  const handleLogin = () => {
    // Example credentials, replace with actual authentication logic
    const validCredentials = {
      admin: { username: 'admin', password: 'admin123' },
      viewer: { username: 'viewer', password: 'viewer123' },
    };

    if (
      username === validCredentials[role]?.username &&
      password === validCredentials[role]?.password
    ) {
      login({ username, role });
      navigate(role === 'admin' ? '/admin' : '/viewer');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div>
      {!showLoginForm ? (
        <div>
          <h2>Select Role</h2>
          <button onClick={() => handleRoleSelect('admin')}>Admin</button>
          <button onClick={() => handleRoleSelect('viewer')}>Viewer</button>
        </div>
      ) : (
        <div>
          <h2>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Login;
