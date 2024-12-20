const jwt = require("jsonwebtoken");

// Middleware to check the role of the user
const roleMiddleware = () => {
  return (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      // If no token is provided, return a 401 Unauthorized response
      return res
        .status(401)
        .send({ error: "Access denied. No token provided." });
    }

    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach the decoded user information to the request object
      req.user = decoded;

      // Call the next middleware function
      next();
    } catch (ex) {
      // If the token is invalid, return a 400 Bad Request response
      res.status(400).send({ error: "Invalid token." });
    }
  };
};

module.exports = roleMiddleware;
