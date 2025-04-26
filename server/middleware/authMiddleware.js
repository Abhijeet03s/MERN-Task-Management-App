const supabase = require('../config/supabaseConfig');

const verifyToken = async (req, res, next) => {
   // Skip auth for health check endpoint
   if (req.path === '/health') {
      return next();
   }

   try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) throw new Error('No token provided');

      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error) throw error;

      req.user = { id: user.id };
      next();
   } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Unauthorized' });
   }
};

module.exports = { verifyToken };