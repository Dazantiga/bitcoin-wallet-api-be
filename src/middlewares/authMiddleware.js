const jwt = require("jsonwebtoken");

exports.authMiddleware = (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({ error: "Token not provided." });
  }

  const [, token] = authorization.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.userid = decoded?.userid;
    return next();
  } catch (error) {
    return response.status(401).json({ error: "Token invalid." });
  }
};
