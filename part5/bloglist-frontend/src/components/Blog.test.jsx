import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

test("clicking the button shows url and likes", async () => {
  const blog = {
    title: "test blog",
    author: "Sabin Puiu",
    url: "https://example.com/test-blog",
    likes: 3,
    user: {
      name: "sabin",
    },
  };

  render(<Blog blog={blog} />);

  const user = userEvent.setup();

  const button = screen.getByText("view");
  await user.click(button);

  const url = screen.getByText(blog.url, { exact: false });
  const likes = screen.queryByText(`likes ${blog.likes}`, { exact: false });

  expect(url).toBeDefined();
  expect(likes).toBeDefined();
});

test("clicking the like button twice calls the event handler twice", async () => {
  const blog = {
    title: "test blog",
    author: "Sabin Puiu",
    url: "https://example.com/test-blog",
    likes: 3,
    user: {
      name: "sabin",
    },
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} addLike={mockHandler} />);

  const user = userEvent.setup();

  const button = screen.getByText("view");
  await user.click(button);

  const likeButton = screen.getByText("like");

  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
