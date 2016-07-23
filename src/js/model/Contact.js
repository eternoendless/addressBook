/**
 * Contact model
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
};