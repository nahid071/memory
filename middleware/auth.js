import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    //validating the user using token
    const token = req.headers.authorization.split(" ")[1];

    //check if it is google or jwt signin
    const isCustomAuth = token.length < 500;

    let decodedData;

    //get the user Id
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;

//What is middleware?
//lets say an user wants to like a post
//he clicks the like button => auth middleware checks his request  (NEXT)=> like controller
