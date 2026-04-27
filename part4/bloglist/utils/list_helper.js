const blog = require("../models/blog");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, currentBlog) => acc + currentBlog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((acc, currentBlog) =>
    currentBlog.likes > acc.likes ? currentBlog : acc,
  );
};

module.exports = { dummy, totalLikes, favoriteBlog };
