const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  /* let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-passwordHash");
    if (!req.user) throw new Error("No user found for token");
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: "Not authorized, token invalid" });
  }*/
  next();
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ success: false, error: "Not authorized" });
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, error: "Forbidden: insufficient role" });
    }
    next();
  };
};
