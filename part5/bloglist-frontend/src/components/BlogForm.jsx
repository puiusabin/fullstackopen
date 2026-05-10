import { use, useState } from "react";

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
          <label>
            title:
            <input
              type="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            ></input>
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            ></input>
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            ></input>
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
