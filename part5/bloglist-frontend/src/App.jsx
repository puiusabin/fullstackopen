import { useEffect, useState } from "react";
import { Link, Routes, Route, useMatch, useNavigate } from "react-router-dom";
import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import { Container } from "@mui/material";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const padding = {
    padding: 5,
  };
  const navigate = useNavigate();

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

  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const addLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    await blogService.update(updatedBlog);
    setBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
  };

  const removeBlog = async (blog) => {
    await blogService.deleteBlog(blog.id);
    setBlogs(blogs.filter((b) => b.id !== blog.id));
    navigate("/");
  };

  const addBlog = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog);
      setBlogs(blogs.concat(response));
      navigate("/");
    } catch (error) {
      window.alert(error);
    }
  };
  return (
    <Container>
      <div>
        <div>
          <Link style={padding} to="/">
            blogs
          </Link>
          {user && (
            <Link style={padding} to="/create">
              new blog
            </Link>
          )}
          {user ? (
            <button onClick={handleLogout}>logout</button>
          ) : (
            <Link style={padding} to="login">
              login
            </Link>
          )}
        </div>

        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                addLike={addLike}
                removeBlog={removeBlog}
                user={user}
              />
            }
          />
          <Route path="/" element={<BlogList user={user} />} />
          <Route path="create" element={<BlogForm createBlog={addBlog} />} />
          <Route path="/login" element={<LoginForm login={login} />} />
        </Routes>
      </div>
    </Container>
  );
};

export default App;
