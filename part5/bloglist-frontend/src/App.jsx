import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogListUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogListUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      window.alert("username or password is invalid");
    }
  };

  const addBlog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
      user: user._id,
    };

    try {
      const response = await blogService.create(newBlog);
      setBlogs(blogs.concat(response));
    } catch (error) {
      window.alert(error);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogListUser");
    setUser(null);
  };

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  } else
    return (
      <div>
        <h2>blogs</h2>
        <div>
          {user.name} logged in{" "}
          <button onClick={() => handleLogout()}>log out</button>
        </div>

        <h2>create new</h2>
        <form onSubmit={addBlog}>
          <div>
            <label>
              title:
              <input
                type="title"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              ></input>
            </label>
          </div>
          <div>
            <label>
              author:
              <input
                type="author"
                value={author}
                onChange={({ target }) => setAuthor(target.value)}
              ></input>
            </label>
          </div>
          <div>
            <label>
              url:
              <input
                type="url"
                value={url}
                onChange={({ target }) => setUrl(target.value)}
              ></input>
            </label>
          </div>
          <button type="submit">create</button>
        </form>
        <div>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    );
};

export default App;
