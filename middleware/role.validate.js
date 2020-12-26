const ROLES = {
  Admin: 2,
  Seller: 1,
  Customer: 0,
};

const checkRole = (...roles) => (req, res, next) => {
  if (!req.token) {
    return res.status(401).send("Unauthorized");
  }

  const hasRole = roles.find((role) => req.token.user.role === role);
  if (!hasRole) {
    return res.status(403).send("You are not allowed to make this request.");
  }

  return next();
};

const role = { ROLES, checkRole };

module.exports = role;
