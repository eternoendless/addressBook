/**
 * Manages resources (views and templates)
 * @type {ResourceManager}
 */
module.exports = class ResourceManager {

    constructor(options) {
        options = options || {};

        this.templatesPath = options.templatesPath || 'views';
        this.pageContentId = options.pageContentId || '#pageContent';

        this.tplCache = {};
    }

    /**
     * Loads a page and displays it
     * @param {String} name Name of the view to load
     * @param {Object|null} [data=null] The data to use for parsing
     * @returns {Promise} A promise of the page loaded and displayed
     */
    displayView(name, data) {
        var loaded = $.Deferred();

        this.getTemplate(name, true)
            .then(tplContent => {
                // include the page
                $(this.pageContentId)[0].innerHTML = tplContent(data);
                loaded.resolve(true);
            })
            .fail($reason => {
                loaded.reject($reason);
            })
        ;

        return loaded.promise();
    }

    /**
     * Loads a template file
     * @param {String} templateName Name of the template to load
     * @param {Boolean} [compile=false] If TRUE, compile the template using Handlebars
     * @returns {Promise} Promise of a template string or Handlebars template
     */
    getTemplate(templateName, compile) {
        var self = this;
        var template = $.Deferred();

        if (typeof self.tplCache[templateName] !== "undefined") {
            var content = self.tplCache[templateName];
            template.resolve(
                (compile && Handlebars) ? Handlebars.compile(content) : content
            );
        } else {
            $.ajax({
                url: self.templatesPath + '/' + templateName + '.tpl',
                dataType: 'html',
                success: function (content) {
                    self.tplCache[templateName] = content;
                    template.resolve(
                        (compile && Handlebars) ? Handlebars.compile(content) : content
                    );
                },
                error: function () {
                    template.reject();
                }
            });
        }

        return template.promise();
    }

    /**
     * Displays the content of a page
     * @param {String} content
     * @private
     */
    _displayPageContent(content) {
        var self = this;
        // include the page
        $(self.pageContentId)[0].innerHTML = content;
    }

};