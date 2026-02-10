import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Driver from '../models/Driver.js';

/**
 * Login controller for both admin and driver
 */
export const login = async(req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }

    // Check admin first
    let user = await Admin.findOne({ username });
    let role = 'admin';

    // If not admin, check driver
    if (!user) {
      user = await Driver.findOne({ username });
      role = 'driver';
    }

    // Validate user and password
    if (!user || user.password !== password) {
      return res.status(401).json({ 
        message: 'Invalid username or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      role,
      userId: user._id,
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
};
