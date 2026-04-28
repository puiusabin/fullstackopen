const { test, after, beforeEach } = require("node:test");
const assert = require("assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
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

test("new blog post is created", async () => {
  const newBlog = {
    title: "New blog",
    author: "Sabin Puiu",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/sabin.html",
    likes: 0,
  };
  const response = await api
    .post("/api/blogs")
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
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("post without url/title is invalid", async () => {
  await api.post("/api/blogs").send({ title: "test" }).expect(400);
  await api.post("/api/blogs").send({ url: "test" }).expect(400);
});

after(async () => {
  mongoose.connection.close();
});
