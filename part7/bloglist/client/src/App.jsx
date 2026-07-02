import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Link, Routes, Route, useMatch, useNavigate } from "react-router-dom";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import ErrorBoundary from "./components/ErrorBoundary";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import useUser from "./hooks/useUser";

const App = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: blogs = [] } = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });

  const addLikeMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((b) => (b.id === updatedBlog.id ? { ...updatedBlog, user: b.user } : b)),
      );
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: (_, id) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((b) => b.id !== id),
      );
    },
  });

  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const addLike = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    addLikeMutation.mutate(updatedBlog);
  };

  const removeBlog = (blog) => {
    deleteBlogMutation.mutate(blog.id);
    navigate("/");
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
                <Button color="inherit" onClick={logout}>
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
                />
              }
            />
            <Route path="/" element={<BlogList />} />
            <Route path="/create" element={<BlogForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="*" element={<h1>404 - Page not found</h1>} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Container>
  );
};

export default App;
