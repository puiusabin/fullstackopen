import { useState, useParams, useNavigate } from "react";

const Blog = ({ blog, addLike, removeBlog, user }) => {
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
        <span>likes {blog.likes}</span>
        {user && <button onClick={() => addLike(blog)}>like</button>}
        <br />
        {blog.user.name}
        <br />
        {user && user.id === blog.user && (
          <button onClick={() => removeBlog(blog)}>remove</button>
        )}
      </div>
    </div>
  );
};

export default Blog;
