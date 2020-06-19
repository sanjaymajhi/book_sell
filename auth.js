var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]; //getting token from the (Bearer<space>token)
  if (!token) {
    res.status(403).json({
      error: { msg: "You are not logged in..." },
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, "sanjay");
    req.user_detail = decoded.user;
    next();
  } catch {
    res.status(500).json({
      error: { msg: "unable to verify token..." },
    });
    return;
  }
};
