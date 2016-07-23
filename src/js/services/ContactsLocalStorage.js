/**
 * Stores contacts into the browser's local storage
 */
module.exports = class ContactsLocalStorage {

    constructor() {
        this.key = 'Contacts';

        if (!window.localStorage) {
            throw new Error('Local storage is not supported');
        }
    }

    /**
     * Loads all contacts from local storage
     */
    load() {
       return JSON.parse(window.localStorage.getItem(this.key));
    }

    /**
     * Saves all contacts to the local storage
     * @param {ContactCollection} contacts
     */
    save(contacts) {
        window.localStorage.setItem(this.key, JSON.stringify(contacts));
    }

};