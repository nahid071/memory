import mongoose from "mongoose";
import PostMessage from "../models/postMessages.js";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  //extract the id from req.params
  const { id: _id } = req.params;
  //Get the requseted update from frontend
  const post = req.body;

  //check the id, if it is mongoose id?
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with this id");

  //Update the post in the database
  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    { new: true }
  );

  //Send the updated post
  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  //extract the id from req.params
  const { id } = req.params;

  //check the id, if it is mongoose id?
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with this id");

  await PostMessage.findByIdAndDelete(id);

  res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  //extract the id from req.params
  const { id } = req.params;

  //Check if the user is authenticated
  if (!req.userId) return res.json({ message: "Unauthenticated" });

  //Check the id, if it is mongoose id
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with this id");

  //get the post with that requested id
  const post = await PostMessage.findById(id);

  //check if the userId is already in the like section or not
  //if the id is in index, that means he already liked the post
  const index = post.likes.findIndex((id) => id === String(req.userId));

  //if not in the index  (-1), then like the post, else dislike the post
  if (index === -1) {
    //Like the post
    post.likes.push(req.userId);
  } else {
    //dislike the post
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};
