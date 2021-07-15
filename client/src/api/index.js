import axios from "axios";

//const API = axios.create({ baseURL: "http://localhost:5000" });

const API = axios.create({ baseURL: "https://nahids-memory.herokuapp.com" });

//Adding a authorization token to the header to each one of our request, so that our backend middleware can verify that we are actually logged in.
API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

export const fetchPosts = () => API.get("/posts");
export const createPost = (newPost) => API.post("/posts", newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const updatePost = (id, updatedPost) =>
  axios.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const signIn = (FormData) => API.post("/user/signin", FormData);
export const signUp = (FormData) => API.post("/user/signup", FormData);
