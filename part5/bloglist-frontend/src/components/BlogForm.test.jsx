import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("<BlogForm /> calls createBlog with correct details", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByLabelText("title:");
  const authorInput = screen.getByLabelText("author:");
  const urlInput = screen.getByLabelText("url:");
  const button = screen.getByText("create");

  await user.type(titleInput, "testing title");
  await user.type(authorInput, "testing author");
  await user.type(urlInput, "https://example.com/blog-test");
  await user.click(button);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toStrictEqual({
    title: "testing title",
    author: "testing author",
    url: "https://example.com/blog-test",
  });
});
