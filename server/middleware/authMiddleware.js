// Simplified auth middleware for Supabase transition

const verifyToken = async (req, res, next) => {
   try {
      // For development, we'll use a simplified authentication
      // This allows requests to proceed while we implement Supabase

      // Extract token if it exists
      const token = req.headers.authorization?.split('Bearer ')[1];

      // Set a default user ID for testing
      req.user = { id: token || '00000000-0000-0000-0000-000000000000' };

      // Proceed to the next middleware
      next();
   } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Unauthorized' });
   }
};

module.exports = { verifyToken };