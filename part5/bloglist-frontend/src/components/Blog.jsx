import { useState, useParams, useNavigate } from "react";

const Blog = ({ blog, addLike, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  if (!blog) {
    return null;
  }

  return (
    <div className="blog">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <br />
        likes {blog.likes}{" "}
        {user && <button onClick={() => addLike(blog)}>like</button>}
        <br />
        {blog.user.name}
        <br />
        {user && user.id === blog.user.id && (
          <button onClick={() => removeBlog(blog)}>remove</button>
        )}
      </div>
    </div>
  );
};

export default Blog;
