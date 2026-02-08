const logAction = async (dbClient, userId, userEmail, action, details, ipAddress = null) => {
   try {
      await dbClient.query(
         'INSERT INTO action_logs (user_id, user_email, action, details, ip_address) VALUES ($1, $2, $3, $4, $5)',
         [userId, userEmail, action, details, ipAddress]
      );
   } catch (err) {
      console.error('Logging error:', err.message);
   }
};

module.exports = {
   logAction
};
