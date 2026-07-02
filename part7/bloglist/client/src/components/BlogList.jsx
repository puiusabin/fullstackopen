import { useRef } from "react";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs";

const BlogList = () => {
  const blogFormRef = useRef();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });

  if (result.isPending) {
    return <div>loading data...</div>;
  }

  const blogs = result.data;
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h2>blogs</h2>
      <Togglable buttonLabel="create" ref={blogFormRef}>
        <BlogForm onSuccess={() => blogFormRef.current.toggleVisibility()} />
      </Togglable>
      <div>
        <ul>
          {sortedBlogs.map((blog) => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogList;
