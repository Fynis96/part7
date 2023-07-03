import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    updateLike(state, action) {
      const id = action.payload;
      const blogToChange = state.find((n) => n.id === id);
      blogToChange.likes += 1;
    },
    removeBlog(state, action) {
      state.splice(
        state.findIndex((n) => n.id === action.payload),
        1
      );
    },
  },
});

export const { appendBlog, setBlogs, updateLike, removeBlog } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content);
    dispatch(appendBlog(newBlog));
  };
};

export const incrementLike = (id) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    const blogToChange = blogs.find((n) => n.id === id);
    const changedBlog = {
      ...blogToChange,
      likes: blogToChange.likes + 1,
    };
    console.log(changedBlog);
    await blogService.update(id, changedBlog);
    dispatch(updateLike(id));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(removeBlog(id));
  };
};

export default blogSlice.reducer;
