const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: "Bad Request" });
  }
  if (!request.token) {
    return response.status(401).json({ error: "invalid token" });
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const newBlog = {
    ...request.body,
    likes: request.body.likes ?? 0,
    user: user._id,
  };
  const blog = new Blog(newBlog);

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  let blog = await Blog.findById(id);
  if (!blog) {
    return response.status(404).json({ error: "Not Found" });
  }
  const { title, author, url, likes } = request.body;
  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes;
  await blog.save();
  response.json(blog);
});

module.exports = blogsRouter;
