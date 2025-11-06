// middleware/roles.js

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (!roles.includes(req.user.primaryRole)) {
    return res.status(403).json({ 
      error: "Forbidden for your role",
      requiredRoles: roles,
      yourRole: req.user.primaryRole
    });
  }
  
  next();
};

export const allowAnyRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};