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

const mostBlogs = (blogs) => {
  const counts = new Map();
  let topAuthor = null;
  let maxCount = 0;

  for (const { author } of blogs) {
    const count = (counts.get(author) ?? 0) + 1;
    counts.set(author, count);

    if (count > maxCount) {
      maxCount = count;
      topAuthor = author;
    }
  }

  return { author: topAuthor, blogs: maxCount };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };
