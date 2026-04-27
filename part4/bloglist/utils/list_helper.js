const blog = require("../models/blog");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, currentBlog) => acc + currentBlog.likes, 0);
};

module.exports = { dummy, totalLikes };
