/**
 * A collection of contacts
 */
module.exports = class ContactCollection {

    constructor() {
        /**
         * An array of contacts
         * @type {Contact[]}
         */
        this.items = [];
        /**
         * The id of the last element
         * @type {number}
         */
        this.lastId = 0;
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
     * @param contactId
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
     * Returns a sorted list
     * @param property {String} The property to use to sort
     * @param [desc=false] {Boolean} True to sort in descending order
     * @returns {Contact[]}
     */
    getSortedList(property, desc) {
        // create a copy of the original collection
        var collection = this.items.slice(0);

        collection.sort(function(a, b){
            if (!a.hasOwnProperty(property) || !b.hasOwnProperty(property)) {
                throw new Error("Cannot sort because property " + property + " does not exist in at least one of the items in the collection");
            }
            if (a[property] > b[property]) {
                return (desc) ? -1 : 1;
            } else if (a[property] < b[property]) {
                return (desc) ? 1 : -1;
            } else {
                return 0;
            }
        });

        return collection;
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
        return this.items.length;
    }

};