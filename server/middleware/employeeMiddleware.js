const jwt = require("jsonwebtoken");

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .send({ error: "Access denied. No token provided." }); 
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (!allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .send({ error: "Access denied. You do not have the required role." });
      }

      next();
    } catch (ex) {
      res.status(400).send({ error: "Invalid token." });
    }
  };
};

module.exports = roleMiddleware;
