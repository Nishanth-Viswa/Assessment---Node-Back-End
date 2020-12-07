var connection = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

getUsersList = (req, res) => {
  connection.query(`SELECT * FROM tbl_users`, (usererr, userrows) => {
    if (usererr) {
      res.status(500).json({ message: "Something went wrong, Please try again later.", status: 500 })
    } else {
      res.status(200).json({ data: userrows, status: 200 })
    }
  });
}

addUser = (req, res) => {
  let { user_name, user_email, user_password } = req.body;
  connection.query('SELECT COUNT(*) FROM tbl_users WHERE user_email = ?', user_email, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Something went wrong, Please try again later.", status: 500 })
    }
    if (result && result[0]["COUNT(*)"] > 0) {
      return res.status(200).json({ message: "User already exists", status: 409 });
    }
    bcrypt.hash(user_password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(500).json({ message: "Something went wrong, Please try again later.", status: 500 })
      }
      let data = {
        user_name: user_name,
        user_email: user_email,
        user_password: hash
      }
      connection.query("INSERT INTO tbl_users SET ?", data, (error, result) => {
        if (err) {
          res.status(500).json({ message: "Something went wrong, Please try again later.", error: error, status: 500 })
        }
        res.status(200).json({ data: result, message: 'User was created successfully', status: 200 })
      });
    });
  });
}

getUser = (req, res) => {
  const UserId = req.params.id;
  connection.query(`SELECT * FROM tbl_users WHERE user_id = '${UserId}'`, (err, result) => {
    if (err) {
      res.status(500).json({ message: err, status: 500 })
    }
    res.status(200).json({ data: result, status: 200 })
  })
}

updateUser = (req, res) => {
  const UserId = req.params.id;
  let { user_name, user_email, user_password } = req.body;
    bcrypt.hash(user_password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(500).json({ message: "Something went wrong, Please try again later.", status: 500 })
      }
      let data = {
        user_name: user_name,
        user_email: user_email,
        user_password: hash
      }
      connection.query(`UPDATE tbl_users SET ? WHERE user_id = ${UserId}`, data, (error, result) => {
        if (err) {
          res.status(500).json({ message: "Something went wrong, Please try again later.", error: error, status: 500 })
        }
        res.status(200).json({ data: result, message: 'User was updated successfully', status: 200 })
      });
    });
}

deleteUser = (req, res) => {
  const UserId = req.params.id;
  connection.query(`DELETE FROM tbl_users WHERE user_id = '${UserId}'`, function (err, result) {
    if (err) {
      res.status(500).json({ message: err, status: 500 })
    }
    res.status(200).json({ message: 'User was deleted successfully', data: result, status: 200 })
  });
}

module.exports = {
  getUsersList: getUsersList,
  addUser: addUser,
  getUser: getUser,
  updateUser: updateUser,
  deleteUser: deleteUser
}