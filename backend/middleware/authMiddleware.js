import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized - No token provided'
      });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized - Invalid token'
    });
  }
};

export const restrictTo = role => (req, res, next) =>
  req.user.role === role ? next() : res.status(403).json({ message: 'Forbidden' });

