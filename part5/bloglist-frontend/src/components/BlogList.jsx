import { useState, useEffect, useRef } from "react";
import Blog from "./Blog";
import blogService from "../services/blogs";
import loginService from "../services/login";
import Notification from "./Notification";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import { Link } from "react-router-dom";

const BlogList = ({ user }) => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

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
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification}></Notification>
      <Togglable buttonLabel="create" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <div>
        <ul>
          {sortedBlogs.map((blog) => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`} key={blog.id}>
                {blog.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogList;
