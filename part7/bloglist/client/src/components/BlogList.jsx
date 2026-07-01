import { useState, useEffect, useRef } from "react";
import Blog from "./Blog";
import blogService from "../services/blogs";
import Notification from "./Notification";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import { Link } from "react-router-dom";
import useNotify from "../hooks/useNotify";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const { notify } = useNotify();
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
      notify(
        `a new blog ${response.title} by ${response.author} created`,
        "success",
      );
    } catch (error) {
      notify(error, "error");
    }
  };

  return (
    <div>
      <h2>blogs</h2>
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
