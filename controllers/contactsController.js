var contactsMockData = require('../mocks/contacts.json');

getContactsList = (req, res) => {
  const contacts = contactsMockData;
  res.status(200).json({ data: contacts, status: 200 })
}

addContact = (req, res) => {
  const body = req.body;
  res.status(200).json({ data: body, message: "Contact was created successfully", status: 200 })
}

getContact = (req, res) => {
  const contactId = req.params.id;
  const contacts = contactsMockData;
  let result = contacts.find( da => da.id == contactId);
  res.status(200).json({ data: result, status: 200 })
}
updateContact = (req, res) => {
  const body = req.body;
  res.status(200).json({ data: body, message: `Contact was updated successfully`, status: 200 })
}

deleteContact = (req, res) => {
  res.status(200).json({ message: `Contact was deleted successfully`, status: 200 })
}

module.exports = {
  getContactsList: getContactsList,
  addContact: addContact,
  getContact: getContact,
  updateContact: updateContact,
  deleteContact: deleteContact
}