import mongoose from "mongoose";

//Creating a new Schema
const postSchema = mongoose.Schema({
  title: String,
  message: String,
  name: String,
  creator: String,
  tags: [String],
  selectedFile: String,
  likes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

//Turning that schema into a model
const postMessage = mongoose.model("postMessage", postSchema);

//Export the model
export default postMessage;
