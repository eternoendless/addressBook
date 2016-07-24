var cfg = require('../cfg');
var ContactEditor = require('../components/ContactEditor');
var Contact = require('../model/Contact');
var EventEmitter = require('event-emitter');
var CountryList = require('country-list');

/**
 * Manages the contact editor
 * @type {ContactEditingController}
 */
module.exports = class ContactEditingController {

    /**
     *
     * @param {ContactCollection} contacts
     */
    constructor(contacts) {
        /**
         * The collection of contacts
         * @type {ContactCollection}
         */
        this.contacts = contacts;
        /**
         * The name of the view
         * @type {string}
         */
        this.contactEditPageName = 'contactEdit/view';
        /**
         * Event manager
         * @type {EventEmitter}
         */
        this.event = new EventEmitter();
        /**
         * Manages the country list
         * @type {CountryList}
         */
        this.countries = new CountryList();
        /**
         * The current editor instance
         * @type {ContactEditor|null}
         */
        this.contactEditor = null;
        /**
         * The html containing the list of countries
         * @type {string|null}
         */
        this.countryListHtml = null;
    }

    /**
     * Shows the add contact view
     */
    showAddContact() {
        if (!this.countryListHtml) {
            // load the country list first
            this._initCountryList()
                .then(this.showAddContact.bind(this))
            ;
        } else {
            // it's just like editing a new contact
            this.showEditContact(new Contact());
        }
    }

    /**
     * Shows the edit contact view
     * @param {Contact} contact The contact to edit
     */
    showEditContact(contact) {
        if (!this.countryListHtml) {
            // load the country list first
            this._initCountryList()
                .then(param => {
                    this.showEditContact(contact);
                })
            ;
        } else {
            // show the edit view
            cfg.resources.displayView(this.contactEditPageName, {
                contact: contact,
                countries: this.countryListHtml
            })
                .then(loaded => {
                    this._startEditing(contact);
                })
            ;
        }
    }

    /**
     * Starts the editor with a contact
     * @param {Contact} contact The contact to edit
     * @private
     */
    _startEditing(contact) {
        this.contactEditor = new ContactEditor('#editContactForm', contact);
        this.contactEditor.event
            .on('save', this._onContactSave.bind(this))
            .on('cancel', this._onEditingCancel.bind(this))
        ;
    }

    /**
     * Invoked when the user confirms editing on the editor
     * @param {Contact} contact
     * @private
     */
    _onContactSave(contact) {
        var self = this;
        if (contact.id === null) {
            self.contacts.add(contact);
        } // else: no need

        // persist contacts
        self.contacts.save();

        this.event.emit('save');
    }

    /**
     * Invoked when the user clicks on the cancel button on the editor
     * @private
     */
    _onEditingCancel() {
        this.event.emit('cancel');
    }

    /**
     * Initializes the html of the country list
     * @returns {Promise} A promise of the template
     * @private
     */
    _initCountryList() {
        var promise = cfg.resources.getTemplate('contactEdit/countryList', true);

        promise.then(template => {
            this.countryListHtml = template({
                countries: this.countries.getData()
            });
        });

        return promise;
    }

};