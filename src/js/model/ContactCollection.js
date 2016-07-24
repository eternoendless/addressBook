/**
 * A collection of contacts
 * @type {ContactsCollection}
 */
module.exports = class ContactCollection {

    constructor() {
        /**
         * The list of contacts
         * @type {Contact[]}
         */
        this.items = [];
        /**
         * The list of contacts after filtering
         * @type {Contact[]}
         */
        this.filteredItems = [];
        /**
         * The id of the last element
         * @type {number}
         */
        this.lastId = 0;
        /**
         * Indicates if the list has been filtered
         * @type {boolean}
         */
        this.isFiltered = false;
        /**
         * The contacts storage manager
         * @type {Object}
         */
        this.storage = null;
    }

    /**
     * Adds a contact to the collection
     * @param {Contact} contact
     */
    add(contact) {
        contact.id = ++this.lastId;
        this.items.push(contact);
    }

    /**
     * Deletes a contact
     * @param contactId Id of the contact to delete
     * @returns {boolean}
     */
    remove(contactId) {
        // find out the index of the contact
        var itemIndex = -1;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == contactId) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex == -1) {
            return false;
        }

        // remove the element
        this.items.splice(itemIndex, 1);

        this.save();

        return true;
    }

    /**
     * Looks up a contact by id and returns it if found
     * @param {Number} contactId
     * @returns {Contact} The contact or null if not found
     */
    getById(contactId) {
        for (var index = 0; index < this.items.length; index++) {
            if (this.items[index].id == contactId) {
                return this.items[index];
            }
        }
        return null;
    }

    /**
     * Returns all the contacts
     * @returns {Contact[]}
     */
    getAll() {
        return this.items;
    }

    /**
     * Returns all the contacts, sorted by a property
     * @param property {String} The property to use to sort
     * @param [desc=false] {Boolean} True to sort in descending order
     * @returns {Contact[]}
     */
    getSortedBy(property, desc) {
        // create a copy of the original item list
        var items = this._getItems().slice(0);

        items.sort(function(a, b){
            var aValue = a[property];
            var bValue = b[property];

            if (aValue > bValue) {
                return (desc) ? -1 : 1;
            } else if (aValue < bValue) {
                return (desc) ? 1 : -1;
            } else {
                return 0;
            }
        });

        return items;
    }

    /**
     * Filters the list
     * @param {String} value The value to look for
     * @returns {ContactCollection}
     */
    filter(value) {
        var escapedValue = String(value).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        var search = new RegExp(escapedValue, 'i');

        this.isFiltered = true;

        this.filteredItems = this.items.filter(function(contact){
            return (
                search.test(contact.fullName)
                || search.test(contact.surname)
                || search.test(contact.email)
            );
        });

        return this;
    }

    /**
     * Resets the active filter
     * @returns {ContactCollection}
     */
    resetFilter() {
        this.isFiltered = false;

        return this;
    }

    /**
     * Loads the contacts from the provided storage
     * @param {Object} storage
     */
    loadFrom(storage) {
        if (!storage.load) {
           throw new Error('Cannot load from storage: storage does not implement a load method');
        }

        this.storage = storage;

        var contacts = storage.load();

        if (contacts && contacts.hasOwnProperty('items') && contacts.hasOwnProperty('lastId')) {
            this.items = contacts.items;
            this.lastId = contacts.lastId;
        }
    }

    /**
     * Saves the contacts to storage
     */
    save() {
        if (!this.storage.save) {
            throw new Error("Cannot save contacts: contact storage does not implement a save method");
        }
        this.storage.save({
            items: this.items,
            lastId: this.lastId
        });
    }

    /**
     * Returns the number of contacts on the list
     * @returns {Number}
     */
    get count() {
        return this._getItems().length;
    }

    /**
     * Returns the current contact list, taking filtering into account
     * @returns {Contact[]}
     * @private
     */
    _getItems() {
        return (this.isFiltered) ? this.filteredItems : this.items;
    }

};