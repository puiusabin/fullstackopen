import { useEffect, useState } from "react";
import { Link, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogList from "./components/BlogList";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [user, setUser] = useState(null);
  const padding = {
    padding: 5,
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogListUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const login = async (username, password) => {
    const user = await loginService.login({ username, password });
    blogService.setToken(user.token);
    window.localStorage.setItem("loggedBlogListUser", JSON.stringify(user));
    setUser(user);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogListUser");
    setUser(null);
  };
  return (
    <Router>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        {user ? (
          <button onClick={handleLogout}>logout</button>
        ) : (
          <Link style={padding} to="login">
            login
          </Link>
        )}
      </div>

      <Routes>
        <Route path="/" element={<BlogList user={user} />} />
        <Route path="/login" element={<LoginForm login={login} />} />
      </Routes>
    </Router>
  );
};

export default App;
