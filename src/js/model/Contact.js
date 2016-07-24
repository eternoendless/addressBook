var CountryList = require('country-list');
var list = new CountryList();

/**
 * Contact model
 * @type {Contact}
 */
module.exports = class Contact {

    /**
     *
     * @param {String} name
     * @param {String} surname
     * @param {String} email
     * @param {String} country
     */
    constructor(name, surname, email, country) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.country = country;
        this.id = null;
    }

    /**
     * Returns the contact's full name
     * @returns {string}
     */
    get fullName() {
        return this.name + ' ' + this.surname;
    }

    /**
     * Returns the contact's country name
     * @returns {string}
     */
    get countryName() {
        return (this.country != '') ?
            list.getName(this.country) : '';
    }
};