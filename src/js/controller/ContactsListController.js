var cfg = require('../cfg');
var ContactsList = require('../components/ContactsList');
var EventEmitter = require('event-emitter');

/**
 * Manages the contacts list page
 * @type {ContactsListPage}
 */
module.exports = class ContactsListController {

    /**
     *
     * @param {AddressBookApp} app
     * @param {ContactCollection} contacts
     */
    constructor(app, contacts) {
        this.app = app;
        this.contacts = contacts;
        this.contactListPageName = 'contactsList/view';
        this.event = EventEmitter();

        /**
         *
         * @type {ContactsList}
         */
        this.contactsList = null;

        $(cfg.pageContentId).delegate('#contactList-addContactButton', 'click', $e => {
            this.event.emit('addContact');
        });
    }

    /**
     * Shows the contacts list page
     */
    showContactsList() {
        cfg.resources.displayView(this.contactListPageName)
            .then(this._onContactListViewLoaded.bind(this));
    }

    /**
     * Executed
     * @private
     */
    _onContactListViewLoaded() {
        if (!this.contactsList) {
            // create the list component
            this.contactsList = new ContactsList(this.contacts);
            // listen to events
            this.contactsList.event
                .on('editContact', this._startEditContact.bind(this))
                .on('deleteContact', this._deleteContact.bind(this))
            ;

        } else {
            // refresh list
            this.contactsList.draw();
        }
    }

    /**
     * Invoked after the user clicks on the edit button on an item
     * @param {Number} contactId
     * @private
     */
    _startEditContact(contactId) {
        this.event.emit('editContact', contactId);
    }

    /**
     * Invoked after the user clicks on the delete button on an item
     * @param {Number} contactId
     * @private
     */
    _deleteContact(contactId) {
        console.log('delete');
        if (!this.contacts.remove(contactId)) {
            throw new Error("Unable to delete contact #" + contactId + " because it could not be found");
        } else {
            // refresh list
            this.contactsList.draw();
        }
    }

};