import { useState } from "react";
import Notification from "./Notification";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const [severity, setSeverity] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await login(username, password);
      setUsername("");
      setPassword("");
      navigate("/");
    } catch {
      setSeverity("error");
      setNotification("username or password is invalid");
      setTimeout(() => {
        setSeverity(null);
        setNotification(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h2>log in to application</h2>
      <Notification message={notification} severity={severity}></Notification>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            variant="standard"
            label="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <TextField
            variant="standard"
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Button type="submit" variant="contained">
            login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
