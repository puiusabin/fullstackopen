import { useState } from "react";

const Blog = ({ blog, addLike, removeBlog, removeButton }) => {
  const [view, setView] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const blogDetails = () => (
    <div>
      {blog.url}
      <br />
      likes {blog.likes} <button onClick={() => addLike(blog)}>like</button>
      <br />
      {blog.user.name}
      <br />
      {removeButton && <button onClick={() => removeBlog(blog)}>remove</button>}
    </div>
  );

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setView(!view)}>{view ? "hide" : "view"}</button>
      {view && blogDetails()}
    </div>
  );
};

export default Blog;
