const jwt = require("jsonwebtoken");

login = (req, res) => {
  let { username, password } = req.body;
  if( !username || !password ) {
    return res.status(200).json({ message: "Must provide email and password", status: 401 })
  }
  if( username !== 'admin' && password !== 'admin'){
    return res.status(200).json({ message: "Invalid username or password", status: 401 })
  } 
  let data = {
    user_id: 1,
    user_name: "admin",
    user_email: "xyz@xyz.com"
  }
  const jsontoken = jwt.sign({ result: data }, "qwe1234", {expiresIn: "1h"});
  res.status(200).json({ 
    token: jsontoken, 
    status: 200 
  })
}


authenticateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Invalid credentials", status: 401 });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, "qwe1234", (err, user) => {
    if (err) {
      return res.status(401).send({ message: "Session has expired", status: 401 });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken: authenticateToken,
  login: login
};
