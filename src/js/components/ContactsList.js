var cfg = require('../cfg');
var EventEmitter = require('event-emitter');

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
         * Id of the list container
         * @type {string}
         */
        this.containerId = '#contactsList';
        /**
         * The handlebars template for list items
         * @type {Function}
         */
        this.itemTpl = null;
        /**
         * Template to use when there are no items
         * @type {Function}
         */
        this.noItemsTpl = null;
        /**
         * Event manager
         * @type {EventEmitter}
         */
        this.event = EventEmitter();
        /**
         * The sorting criteria
         * @type {object}
         */
        this.sortCriteria = {
            property: 'fullName',
            desc: false
        };

        this._loadTemplates()
            .then(loaded => {
                this.draw(true);
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
     * Draws the view content
     * @param {Boolean} [rebind=false] True if events need to be rebound
     * @return ContactsList
     */
    draw(rebind) {
        this._drawContent();

        if (rebind) {
            this._bindEvents();
        }

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
     * Invoked when the user clicks on a sortable column
     * @param {jQuery.Event} evt
     * @private
     */
    _onSortColumnClick(evt) {
        var column = $(evt.currentTarget);
        var property = column.data('property');
        // toggle sort order
        var desc = this.sortCriteria.property == property && !this.sortCriteria.desc;

        this.sortCriteria = {
            property: property,
            desc: desc
        };

        this._drawContent();
    }

    /**
     * Updates the view content
     * @private
     */
    _drawContent() {
        // draw the list
        this._getListContainer().html(this._getListContent());
        // draw the item count
        this._getItemCountContainer().html(this._getItemCountText());
        // update the sorting hints
        this._updateSortingHints();
    }

    /**
     * Binds the component events to the view
     * @private
     */
    _bindEvents() {
        this._getContainer()
            .delegate('.btn.edit-contact', 'click', this._onEditClick.bind(this))
            .delegate('.btn.delete-contact', 'click', this._onDeleteClick.bind(this))
            .delegate('.sort-column', 'click', this._onSortColumnClick.bind(this))
        ;
    }

    /**
     * Returns the DOM object that contains the component
     * @returns {jQuery|HTMLElement}
     * @private
     */
    _getContainer() {
        return $(this.containerId);
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
                contacts: this.contacts.getSortedBy(this.sortCriteria.property, this.sortCriteria.desc)
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
     * Loads all the component templates
     * @returns {Promise} Promise that all the templates have been loaded
     * @private
     */
    _loadTemplates() {
        var loaded = $.Deferred();

        $.when(
            cfg.resources.getTemplate('contactsList/noItems', true),
            cfg.resources.getTemplate('contactsList/item', true)
        ).done((noItemsTpl, itemTpl) => {
            this.noItemsTpl = noItemsTpl;
            this.itemTpl = itemTpl;
            loaded.resolve(true);
        });

        return loaded.promise();
    }

    /**
     * Updates the sorting indicators on the column titles
     * @private
     */
    _updateSortingHints() {
        var self = this;
        this._getContainer().find('.sort-column').each(function(){
            var el = $(this);
            var property = el.data('property');

            if (property == self.sortCriteria.property) {
                el.addClass(self.sortCriteria.desc ? 'sort-desc' : 'sort-asc');
                el.removeClass(!self.sortCriteria.desc ? 'sort-desc' : 'sort-asc');
            } else {
                el.removeClass('sort-desc sort-asc');
            }
        });
    }
};