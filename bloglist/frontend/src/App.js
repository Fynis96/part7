/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationAndTimer } from "./reducers/notificationReducer";
import {
  initializeBlogs,
  createBlog,
  incrementLike,
  deleteBlog,
} from "./reducers/blogReducer";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Create from "./components/Create";
import Togglable from "./components/Togglable";
import LoginForm from "./components/LoginForm";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const copyOfBlogs = [...blogs];
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotificationAndTimer("Wrong credentials", 5));
      console.log(exception);
    }
  };

  const updateLike = (blogId) => {
    dispatch(incrementLike(blogId));
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    dispatch(createBlog(blogObject));
    dispatch(
      setNotificationAndTimer(`${blogObject.title} was successfully added`, 5)
    );
  };

  const removeBlog = async (blogId) => {
    const blogTitle = blogs.filter((blog) => blog.id === blogId);
    if (
      window.confirm(`Are you sure you wish to delete ${blogTitle[0].title}`)
    ) {
      dispatch(deleteBlog(blogId));
    }
  };

  return (
    <div>
      <Notification />
      {user === null ? (
        <LoginForm
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
          username={username}
          password={password}
        />
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button
            onClick={() => {
              window.localStorage.removeItem("loggedBlogappUser");
              setUser(null);
            }}
          >
            logout
          </button>
          <h2>blogs</h2>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <Create createBlog={addBlog} />
          </Togglable>
          {copyOfBlogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateLike={updateLike}
                user={user}
                removeBlog={removeBlog}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
