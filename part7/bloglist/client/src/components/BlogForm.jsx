import { useState } from "react";
import { TextField, Button } from "@mui/material";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    const newBlog = {
      title: title,
      author: author,
      url: url,
    };
    createBlog(newBlog);
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
