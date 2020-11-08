var express = require("express");
const authorization = require("../controllers/authorization");
var router = express.Router();

var contacts = require("../controllers/contactsController");

router
  .route("/login")
  .post(authorization.login);

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

module.exports = router;
