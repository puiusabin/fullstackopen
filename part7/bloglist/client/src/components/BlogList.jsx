import { useState, useEffect, useRef } from "react";
import Blog from "./Blog";
import blogService from "../services/blogs";
import Notification from "./Notification";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import { Link } from "react-router-dom";
import useNotify from "../hooks/useNotify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BlogList = () => {
  const { notify } = useNotify();
  const queryClient = useQueryClient();
  const blogFormRef = useRef();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => await blogService.getAll(),
  });

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
      notify(
        `a new blog ${newBlog.title} by ${newBlog.author} created`,
        "success",
      );
    },
  });

  if (result.isPending) {
    return <div>loading data...</div>;
  }

  const blogs = result.data;

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  const addBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility();
    newBlogMutation.mutate(newBlog);
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
