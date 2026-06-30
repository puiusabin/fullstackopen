import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { beforeEach } from "vitest";

describe("<Blog />", () => {
  test("Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed", () => {
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

    const title = screen.getByText(blog.title, { exact: false });
    const url = screen.getByText(blog.url);
    const likes = screen.getByText(`likes ${blog.likes}`);
    const removeButton = screen.queryByRole("button", { name: "remove" });
    const likeButton = screen.queryByRole("button", { name: "like" });

    expect(title).toBeDefined();
    expect(url).toBeDefined();
    expect(likes).toBeDefined();
    expect(removeButton).toBeNull();
    expect(likeButton).toBeNull();
  });

  test("Authenticated users who are not the blog’s creator are shown only the like button", () => {
    const blog = {
      title: "test blog",
      author: "Sabin Puiu",
      url: "https://example.com/test-blog",
      likes: 3,
      user: {
        name: "sabin",
        id: 123,
      },
    };

    const user = {
      name: "drizzy drake",
      id: 1234,
    };

    render(<Blog blog={blog} user={user} />);
    const likeButton = screen.getByRole("button", { name: "like" });
    const removeButton = screen.queryByRole("button", { name: "remove" });
    expect(likeButton).toBeDefined();
    expect(removeButton).toBeNull();
  });

  test("The blog’s creator is also shown the delete button", () => {
    const blog = {
      title: "test blog",
      author: "Sabin Puiu",
      url: "https://example.com/test-blog",
      likes: 3,
      user: {
        name: "drizzy drake",
        id: 1234,
      },
    };

    const user = {
      name: "drizzy drake",
      id: 1234,
    };

    render(<Blog blog={blog} user={user} />);
    const likeButton = screen.getByRole("button", { name: "like" });
    const removeButton = screen.queryByRole("button", { name: "remove" });
    expect(likeButton).toBeDefined();
    expect(removeButton).toBeDefined();
  });
});
