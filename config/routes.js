var express = require("express");
const authorization = require("../controllers/authorization");
var router = express.Router();

var contacts = require("../controllers/contactsController");
var users = require("../controllers/usersController");

router
  .route("/login")
  .post(authorization.login);

router
  .route("/signup")
  .post(authorization.signup);

router
  .route("/api/service/contacts")
  .all(authorization.authenticateToken)
  .get(contacts.getContactsList)
  .post(contacts.addContact)
  
router
  .route("/api/service/contacts/:id")
  .all(authorization.authenticateToken)
  .get(contacts.getContact)
  .put(contacts.updateContact)
  .delete(contacts.deleteContact)

router
  .route("/api/service/users")
  .all(authorization.authenticateToken)
  .get(users.getUsersList)
  .post(users.addUser)
  
router
  .route("/api/service/users/:id")
  .all(authorization.authenticateToken)
  .get(users.getUser)
  .put(users.updateUser)
  .delete(users.deleteUser)

module.exports = router;
