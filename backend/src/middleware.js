// Simple middleware for mocked backend

export const authenticateToken = (req, res, next) => {
  // In the real backend, this would verify JWT tokens
  // For the mock, we'll just check if Authorization header exists
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }
  
  // Mock user - in real app this would be decoded from JWT
  req.user = { 
    userId: 1, 
    email: 'demo@example.com' 
  };
  
  next();
};

export const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID parameter'
    });
  }
  next();
};

export const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};
