var cfg = require('../cfg');
var ContactsList = require('../components/ContactsList');
var Search = require('../components/Search');
var EventEmitter = require('event-emitter');

/**
 * Manages the contacts list page
 * @type {ContactsListController}
 */
module.exports = class ContactsListController {

    /**
     *
     * @param {ContactCollection} contacts
     */
    constructor(contacts) {
        /**
         * The contacts list
         * @type {ContactCollection}
         */
        this.contacts = contacts;
        /**
         * Name of the contacts list view
         * @type {string}
         */
        this.contactListPageName = 'contactsList/view';
        /**
         * Event manager
         * @type {EventEmitter}
         */
        this.event = new EventEmitter();
        /**
         * Contacts list component
         * @type {ContactsList}
         */
        this.contactsList = null;

        // watch for click event on the big "add contact" button
        $(cfg.pageContentId).delegate('#contactList-addContactButton', 'click', evt => {
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
     * Invoked when the contacts list view has been loaded
     * @private
     */
    _onContactListViewLoaded() {
        // reset search
        this.search = new Search('#search', this.contacts);
        this.search.reset();
        this.search.event.on('change', evt => {
            this.contactsList.draw();
        });

        if (!this.contactsList) {
            // create the list component
            this.contactsList = new ContactsList(this.contacts);
            // listen to events
            this.contactsList.event
                .on('editContact', this._startEditContact.bind(this))
                .on('deleteContact', this._deleteContact.bind(this))
            ;

        } else {
            // draw list
            this.contactsList.draw(true);
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
        if (!this.contacts.remove(contactId)) {
            throw new Error("Unable to delete contact #" + contactId + " because it could not be found");
        } else {
            // update list
            this.contactsList.draw();
        }
    }

};