import {
  FETCH_ALL,
  CREATE,
  UPDATE,
  DELETE,
  LIKE,
} from "../constants/actionTypes";

const postsReducers = (Posts = [], action) => {
  switch (action.type) {
    case DELETE:
      return Posts.filter((post) => post._id !== action.payload);
    case UPDATE:
    case LIKE:
      return Posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    case FETCH_ALL:
      return action.payload;
    case CREATE:
      return [...Posts, action.payload];
    default:
      return Posts;
  }
};

export default postsReducers;
