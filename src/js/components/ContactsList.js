var cfg = require('../cfg');
var EventEmitter = require('event-emitter');
var CountryList = require('country-list');

/**
 * Manages a list (table) of contacts
 * @type {ContactsList}
 */
module.exports = class ContactsList {

    /**
     * Constructs the component
     * @param {ContactCollection} contacts Contact collection
     */
    constructor(contacts) {
        /**
         * The contact collection
         * @type {ContactCollection}
         */
        this.contacts = contacts;
        /**
         * The handlebars template for list items
         * @type {Function}
         */
        this.itemTpl = '';
        /**
         * Template to use when there are no items
         * @type {string}
         */
        this.noItemsTpl = '<tr class="no-items"><td colspan="3">You have no contacts</td></tr>';
        /**
         * Event manager
         * @type {EventEmitter}
         */
        this.event = EventEmitter();
        /**
         * Manages countries
         * @type {CountryList}
         */
        this.countries = new CountryList();

        this._registerCountriesHelper();

        // load tpl from file
        cfg.resources.getTemplate('contactsList/item', true)
            .then(tpl => {
                this.itemTpl = tpl;
                this.draw();
            })
        ;
    }

    /**
     * Sets the contacts collection for the view
     * @param {ContactCollection} contacts
     * @return ContactsList
     */
    setContacts(contacts) {
        this.contacts = contacts;
        return this;
    }

    /**
     * Draws the view
     * @return ContactsList
     */
    draw() {
        this._getListContainer().html(this._getListContent());
        this._getItemCountContainer().html(this._getItemCountText());

        this._getContainer()
            .delegate('.btn.edit-contact', 'click', this._onEditClick.bind(this))
            .delegate('.btn.delete-contact', 'click', this._onDeleteClick.bind(this))
        ;

        return this;
    }

    /**
     * Invoked when the user clicks on the edit button on an item
     * @param {jQuery.Event} evt
     * @private
     */
    _onEditClick(evt) {
        var contactId = $(evt.currentTarget).closest('tr').data('contactId');
        this.event.emit('editContact', contactId);
    }

    /**
     * Invoked when the user clicks on the delete button on an item
     * @param {jQuery.Event} evt
     * @private
     */
    _onDeleteClick(evt) {
        var contactId = $(evt.currentTarget).closest('tr').data('contactId');

        $.confirm({
            title: 'Delete contact',
            content: "Are you sure that you want to delete this contact?",
            confirmButton: 'Yes, delete',
            confirmButtonClass: 'btn-danger',
            cancelButton: 'Cancel',
            confirm: param => {
                this.event.emit('deleteContact', contactId);
            }
        });
    }

    /**
     * Returns the DOM object that contains the component
     * @returns {jQuery|HTMLElement}
     * @private
     */
    _getContainer() {
        return $('#contactsList');
    }

    /**
     * Returns the DOM object that contains the body of the table
     * @returns {jQuery|HTMLElement}
     * @private
     */
    _getListContainer() {
        return this._getContainer().find('tbody').first();
    }

    /**
     * Returns the DOM object that contains the item count text
     * @returns {jQuery|HTMLElement}
     * @private
     */
    _getItemCountContainer() {
        return this._getContainer().find('.itemCount').first();
    }

    /**
     * Returns the HTML for the list content
     * @returns {string}
     * @private
     */
    _getListContent() {
        if (this.contacts.count > 0) {
            return this.itemTpl({
                contacts: this.contacts.items
            });
        } else {
            return this.noItemsTpl;
        }
    }

    /**
     * Returns the text for the item count
     * @returns {string}
     * @private
     */
    _getItemCountText() {
        var count = this.contacts.count;
        return (count == 1)?
            `${count} contact` : `${count} contacts`;
    }

    /**
     * Registers a Handlebars helper in order to display country names
     * @private
     */
    _registerCountriesHelper() {
        Handlebars.registerHelper('countryName', countryCode => {
            if (typeof countryCode !== 'undefined') {
                return this.countries.getName(countryCode);
            } else {
                return '';
            }
        });
    }
};