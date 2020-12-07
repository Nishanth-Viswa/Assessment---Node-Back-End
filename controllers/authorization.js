const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var connection = require('../config/db');

login = (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) {
    return res.status(200).json({ message: "Must provide email and password", status: 401 })
  }
  connection.query('SELECT * FROM tbl_users WHERE user_email = ?', username, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Something went wrong, Please try again later.", status: 500 })
    }
    if (result.length <= 0) {
      return res.status(200).json({ message: "Invalid user name or password", status: 401 });
    }

    bcrypt.compare(password, result[0].user_password, function (err, result) {
      if (!result) {
        return res.status(200).json({ message: "Invalid user name or password", status: 401 });
      }
      const jsontoken = jwt.sign({ result: result[0] }, "qwe1234", { expiresIn: "8h" });
      res.status(200).json({
        token: jsontoken,
        status: 200
      })
    });
  });
}

signup = (req, res) => {
  let { username, useremail, password } = req.body;
  connection.query('SELECT COUNT(*) FROM tbl_users WHERE user_email = ?', useremail, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Something went wrong, Please try again later.", status: 500 })
      return false;
    }
    if (result && result[0]["COUNT(*)"] > 0) {
      res.status(200).json({ message: "User already exists. Please sign in", status: 409 })
      return false;
    }
    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(500).json({ message: "Something went wrong, Please try again later.", status: 500 })
        return false;
      }
      let data = {
        user_name: username,
        user_email: useremail,
        user_password: hash
      }
      connection.query("INSERT INTO tbl_users SET ?", data, (error, result) => {
        if (err) {
          res.status(500).json({ message: "Something went wrong, Please try again later.", error: error, status: 500 })
          return false;
        }
        res.status(200).json({ data: result, message: 'You have signed up successfully', status: 200 })
        return false;
      });
    });
  });
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
  login: login,
  signup: signup
};
