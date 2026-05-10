import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogListUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogListUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      setNotification("username or password is invalid");
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const addBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const response = await blogService.create(newBlog);
      setBlogs(blogs.concat(response));
      setNotification(
        `a new blog ${response.title} by ${response.author} created`,
      );
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      setNotification(error);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const addLike = async (blog) => {
    blog.likes++;
    const newBlog = await blogService.update(blog);
    setBlogs(blogs.map((b) => (b.id === newBlog.id ? newBlog : b)));
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogListUser");
    setUser(null);
  };

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notification}></Notification>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  } else
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={notification}></Notification>
        <div>
          {user.name} logged in{" "}
          <button onClick={() => handleLogout()}>log out</button>
        </div>
        <Togglable buttonLabel="create" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <div>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} addLike={addLike} />
          ))}
        </div>
      </div>
    );
};

export default App;
