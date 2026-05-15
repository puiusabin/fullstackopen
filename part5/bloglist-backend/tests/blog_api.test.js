const { test, after, beforeEach, before, describe } = require("node:test");
const assert = require("assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("id instead of _id", async () => {
  const response = await api.get("/api/blogs");
  assert(response.body[0].id);
});

describe("when the user is logged in", () => {
  let token;
  let userId;
  beforeEach(async () => {
    await User.deleteMany({});
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash("mypassword", saltRounds);

    const user = new User({
      username: "sabin",
      name: "sabin puiu",
      passwordHash,
    });

    const savedUser = await user.save();

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    token = jwt.sign(userForToken, process.env.SECRET);
    userId = user._id;
  });

  test("fails with 401 if token is missing", async () => {
    await api
      .post("/api/blogs")
      .send({ title: "test", url: "test.com" })
      .expect(401);
  });

  test("new blog post is created", async () => {
    const newBlog = {
      title: "New blog",
      author: "Sabin Puiu",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/sabin.html",
      likes: 0,
    };
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const authors = blogsAtEnd.map((b) => b.author);
    assert(authors.includes("Sabin Puiu"));
  });

  test("if likes field is missing, likes equals to 0", async () => {
    const newBlog = {
      title: "New blog without likes",
      author: "Sabin Puiu",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/sabin.html",
    };
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test("post without url/title is invalid", async () => {
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "test" })
      .expect(400);
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "test" })
      .expect(400);
  });

  test("blog post is deleted", async () => {
    const blogs = await helper.blogsInDb();
    const blog = await Blog.findById(blogs[0].id);

    blog.user = userId;
    await blog.save();
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  });
});

test("one like is added to the blog", async () => {
  const blogs = await helper.blogsInDb();
  let blog = blogs[0];
  blog.likes++;

  const response = await api.put(`/api/blogs/${blog.id}`).send(blog);

  assert.strictEqual(response.body.likes, blog.likes);
});

after(async () => {
  mongoose.connection.close();
});
