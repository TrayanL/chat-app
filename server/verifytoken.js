const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //CHeck if not undefined
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')[1];
      jwt.verify(bearer, 'pineapple', (error, data) => {
        if(error) {
          res.sendStatus(403);
        } 
        
      })
      req.token = bearer;
      
      next();
    } else {
      res.sendStatus(403);
    }
  }
  
  module.exports = verifyToken;