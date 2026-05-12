import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders blog title and author, but does not render its URL and number of likes", () => {
  const blog = {
    title: "test blog",
    author: "Sabin Puiu",
    url: "https://example.com/test-blog",
    likes: 3,
  };

  render(<Blog blog={blog} />);

  const titleAuthor = screen.getByText(`${blog.title} ${blog.author}`);
  const url = screen.queryByText(blog.url);
  const likes = screen.queryByText(`likes: ${blog.likes}`);

  expect(titleAuthor).toBeDefined();
  expect(url).toBeNull();
  expect(likes).toBeNull();
});
