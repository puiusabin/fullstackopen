const User = require("../models/user");
const jwt = require("jsonwebtoken");
const logger = require("./logger");

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    response.status(401).end();
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    response.status(401).json({ error: "token invalid" });
  } else {
    request.user = await User.findById(decodedToken.id);
  }
  next();
};

module.exports = { tokenExtractor, userExtractor };
