var Contact = require('../model/Contact');

/**
 * Stores contacts into the browser's local storage
 * @type {ContactsLocalStorage}
 */
module.exports = class ContactsLocalStorage {

    constructor() {
        /**
         * The localStorage key under which the contacts are stored
         * @type {string}
         */
        this.key = 'Contacts';

        if (!window.localStorage) {
            throw new Error('Local storage is not supported');
        }
    }

    /**
     * Loads all contacts from local storage
     * @return {object}
     */
    load() {
        var obj = JSON.parse(window.localStorage.getItem(this.key));

        if (obj && obj.items && obj.items instanceof Array) {
            // recreate Contact instances
            obj.items = obj.items.map(function(item){
                var contact = new Contact(
                    item.name,
                    item.surname,
                    item.email,
                    item.country
                );
                contact.id = item.id;

                return contact;
            });
        }

        return obj;
    }

    /**
     * Saves all contacts to the local storage
     * @param {ContactCollection} contacts
     */
    save(contacts) {
        window.localStorage.setItem(this.key, JSON.stringify(contacts));
    }

};