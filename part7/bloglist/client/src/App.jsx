import { useEffect, useState } from "react";
import { Link, Routes, Route, useMatch, useNavigate } from "react-router-dom";
import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";
import Notification from "./components/Notification";
import useNotify from "./hooks/useNotify";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { notify } = useNotify();

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
      notify(error, "error");
    }
  };

  return (
    <Container>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              blog app
            </Typography>
            <Button color="inherit" component={Link} to="/">
              blogs
            </Button>
            {user ? (
              <div>
                {" "}
                <Button color="inherit" component={Link} to="/create">
                  new blog
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  logout
                </Button>{" "}
              </div>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                login
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Notification />

        <ErrorBoundary>
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
            <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
            <Route path="/login" element={<LoginForm login={login} />} />
            <Route path="*" element={<h1>404 - Page not found</h1>} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Container>
  );
};

export default App;
