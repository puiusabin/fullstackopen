import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import useNotify from "../hooks/useNotify";

const BlogForm = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const { notify } = useNotify();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
      notify(`a new blog ${newBlog.title} by ${newBlog.author} created`, "success");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      notify(error.message, "error");
    },
  });

  const addBlog = (event) => {
    event.preventDefault();
    newBlogMutation.mutate({ title, author, url });
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          ></TextField>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <TextField
            label="author"
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          ></TextField>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <TextField
            label="url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          ></TextField>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Button type="submit" variant="contained">
            create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
