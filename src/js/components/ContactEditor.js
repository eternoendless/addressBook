var EventEmitter = require('event-emitter');

/**
 * Form used to create/edit contacts
 * @type {ContactEditor}
 */
module.exports = class ContactEditor {

    /**
     *
     * @param {String} editorSelector Selector for the editor element
     * @param {Contact} contact Contact to edit
     */
    constructor(editorSelector, contact) {
        /**
         * Selector for the form DOM element
         * @type {String}
         */
        this.formSelector = editorSelector;
        /**
         * Contact to edit
         * @type {Contact}
         */
        this.contact = contact;
        /**
         * Event manager
         * @type {EventEmitter}
         */
        this.event = EventEmitter();

        // update the form with the contact's data
        this._updateForm();

        var form = this._getForm();

        // bind the validator
        form.validator();

        // bind the button actions
        form
            .delegate('#cancelButton', 'click', this._onCancelClick.bind(this))
            .on('submit', this._onSubmit.bind(this));
    }

    /**
     * Invoked when the user clicks on the save button
     * @param {jQuery.Event} evt
     * @private
     */
    _onSubmit(evt) {
        if (!evt.isDefaultPrevented()) {
            var formData = this._getFormData();
            this.contact.name = formData.name;
            this.contact.surname = formData.surname;
            this.contact.email = formData.email;
            this.contact.country = formData.country;

            this.event.emit('save', this.contact);
        }
        // prevent submit
        return false;
    }

    /**
     * Invoked when the user clicks on the cancel button
     * @private
     */
    _onCancelClick() {
        this.event.emit('cancel');
    }

    /**
     * Returns the form DOM element
     * @returns {jQuery}
     * @private
     */
    _getForm() {
        return $(this.formSelector);
    }

    /**
     * Returns the form data as an object
     * Note that this doesn't work for checkboxes
     * @returns {Object} form data
     * @private
     */
    _getFormData() {
        var form = {};
        this._getForm().serializeArray().forEach(function(field){
            form[field.name] = field.value;
        });
        return form;
    }

    /**
     * Updates the form data using the contact data
     * @private
     */
    _updateForm() {
        var form = this._getForm();
        form.find('#name').val(this.contact.name);
        form.find('#surname').val(this.contact.surname);
        form.find('#email').val(this.contact.email);
        form.find('#country').val(this.contact.country);
    }

};