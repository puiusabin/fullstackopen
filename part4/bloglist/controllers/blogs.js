const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: "Bad Request" });
  }
  const newBlog = { ...request.body, likes: request.body.likes ?? 0 };
  const blog = new Blog(newBlog);

  const result = await blog.save();
  response.status(201).json(result);
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
