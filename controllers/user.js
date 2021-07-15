import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
  //Get the values from user
  const { email, password } = req.body;

  try {
    //find existing user
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });

    //check the password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    //create the token
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    //return the reslt and token
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const signup = async (req, res) => {
  //get the values from user
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    //find the existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User alrrady exist" });

    //check the password
    if (password !== confirmPassword)
      return res.status(400).json({ message: "password didn't match" });

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    //create new user
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    //create the token
    const token = await jwt.sign(
      { email: result.email, id: result._id },
      "test",
      { expiresIn: "1h" }
    );

    //return the user
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};
