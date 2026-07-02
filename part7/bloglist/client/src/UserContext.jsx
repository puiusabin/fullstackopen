import { createContext, useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";

const UserContext = createContext();

export default UserContext;

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogListUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const login = async (username, password) => {
    const user = await loginService.login({ username, password });
    blogService.setToken(user.token);
    window.localStorage.setItem("loggedBlogListUser", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    window.localStorage.removeItem("loggedBlogListUser");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {props.children}
    </UserContext.Provider>
  );
};
