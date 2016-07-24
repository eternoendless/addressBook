var EventEmitter = require('event-emitter');

/**
 * Filters the contact list upon user input
 * @type {Search}
 */
module.exports = class Search {

    /**
     *
     * @param {String} searchBoxSelector Selector for the search input
     * @param {ContactCollection} contacts
     */
    constructor(searchBoxSelector, contacts) {
        /**
         * Selector for the search input
         * @type {String}
         */
        this.searchBoxSelector = searchBoxSelector;
        /**
         * Contacts list
         * @type {ContactCollection}
         */
        this.contacts = contacts;
        /**
         * Event manager
         * @type {EventEmitter}
         */
        this.event = new EventEmitter();
        /**
         * Contains a setTimeout id if (to throttle search)
         * @type {Number|null}
         */
        this.delayedTask = null;

        this._bindEvents();
    }

    /**
     * Resets search
     */
    reset() {
        this.contacts.resetFilter();
    }

    /**
     * Binds component events
     * @private
     */
    _bindEvents() {
        $(this.searchBoxSelector).on('input', this._onInput.bind(this));
    }

    /**
     * Invoked on user input on the search box
     * @param {jQuery.Event} evt
     * @private
     */
    _onInput(evt) {
        if (this.delayedTask) {
            clearTimeout(this.delayedTask);
        }

        var searchVal = $(evt.currentTarget).val();

        if (searchVal.length >= 2) {
            this.delayedTask = setTimeout(empty => {
                this._filterList(searchVal);
            }, 300);
        } else if (searchVal.length == 0) {
            this.reset();
            this.event.emit('change');
        }
    }

    /**
     * Filters the contact list based on a query string
     * @param {String} query
     * @private
     */
    _filterList(query) {
        this.contacts.filter(query);
        this.event.emit('change');
    }

};