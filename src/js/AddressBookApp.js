var ContactsListController = require('./controller/ContactsListController');
var ContactEditingController = require('./controller/ContactEditingController');
var Router = require('navigo');

/**
 * Main app controller
 * @type {AddressBookApp}
 */
module.exports = class AddressBookApp {

    /**
     * @param {ContactCollection} contacts The contacts collection
     */
    constructor(contacts) {
        /**
         * The contacts collection
         * @type {ContactCollection}
         */
        this.contacts = contacts;
        /**
         * Controller that manages the contacts list
         * @type {ContactsListController|null}
         */
        this.contactsListController = null;
        /**
         * Controller that manages contact editing
         * @type {ContactEditingController|null}
         */
        this.contactEditingController = null;

        this._setupRoutes();
    }

    /**
     * Shows the contacts list page
     */
    showContactList() {
        this._getContactsListController().showContactsList();
    }

    /**
     * Shows the add contact page
     */
    showAddContact() {
        this._getContactEditingController().showAddContact();
    }

    /**
     * Shows the edit contact page
     * @param {Number} contactId
     */
    showEditContact(contactId) {
        var contact = this.contacts.getById(contactId);
        if (contact) {
            this._getContactEditingController().showEditContact(contact);
        } else {
            $.alert({
                title: "Edit contact",
                content: "The requested contact doesn't exist",
                confirm: param => {
                    this.router.navigate('/');
                }
            })
        }
    }

    /**
     * Returns the current instance of ContactsListController
     * @returns {ContactsListController}
     * @private
     */
    _getContactsListController() {
        if (!this.contactsListController) {
            // initialize the controller
            this.contactsListController = new ContactsListController(this.contacts);
            this.contactsListController.event
                .on('addContact', param => {
                    this.router.navigate('/new');
                })
                .on('editContact', contactId => {
                    this.router.navigate('/edit/'+ contactId);
                })
            ;
        }

        return this.contactsListController;
    }

    /**
     * Returns the current instance of ContactEditingController
     * @returns {ContactEditingController}
     * @private
     */
    _getContactEditingController() {
        if (!this.contactEditingController) {
            // initialize the controller
            this.contactEditingController = new ContactEditingController(this.contacts);
            this.contactEditingController.event
                .on('cancel', param => {
                    this.router.navigate('/');
                })
                .on('save', param => {
                    this.router.navigate('/');
                })
        }

        return this.contactEditingController;
    }

    /**
     * Sets up the application routes
     * @private
     */
    _setupRoutes() {
        this.router = new Router(null, true);

        this.router
            .on({
                'new': this.showAddContact.bind(this),
                'edit/:contactId': params => {
                    this.showEditContact(params.contactId);
                },
                '/': this.showContactList.bind(this)
            })
            .resolve();
    }

};