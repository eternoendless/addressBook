$(function(){
    var ContactCollection = require('./model/ContactCollection');
    var ContactsLocalStorage = require('./services/ContactsLocalStorage');
    var AddressBookApp = require('./AddressBookApp');

    var contacts = new ContactCollection();

    contacts.loadFrom(new ContactsLocalStorage());

    window.app = new AddressBookApp(contacts);
});
