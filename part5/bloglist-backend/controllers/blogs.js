const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");
const Blog = require("../models/blog");
const User = require("../models/user");
const { blogsInDb } = require("../tests/test_helper");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post(
  "/",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    if (!request.body.title || !request.body.url) {
      return response.status(400).json({ error: "Bad Request" });
    }

    const user = request.user;

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
  },
);

blogsRouter.delete(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const id = request.params.id;
    const user = request.user;

    const blog = await Blog.findById(id);
    console.log(blog);

    if (blog.user.toString() !== user.id) {
      return response.status(403).end();
    }
    await blog.deleteOne();
    response.status(204).end();
  },
);

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
