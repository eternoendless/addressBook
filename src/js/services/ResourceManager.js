/**
 * Manages resources (pages and templates)
 * @type {ResourceManager}
 */
module.exports = class ResourceManager {

    constructor(options) {
        options = options || {};

        this.componentsPath = options.componentsPath || 'pages/components';
        this.templatesPath = options.templatesPath || 'views';
        this.cmpPrefix = options.cmpPrefix || 'cmp-';
        this.pageContentId = options.pageContentId || '#pageContent';

        this.pageCache = {};
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

        /*if (typeof self.pageCache[name] !== "undefined") {
            self._displayPageContent(
                (parseContent !== null && Handlebars) ?
                    Handlebars.compile(self.pageCache[name])(parseContent)
                    : self.pageCache[name]
            );

            loaded.resolve(true);
        } else {
            $.ajax({
                url: self.templatesPath + '/' + name + '.tpl',
                dataType: 'html',
                success: function(content) {
                    self.pageCache[name] = content;
                    // include the page
                    $(self.pageContentId)[0].innerHTML = (parseContent !== null && Handlebars) ?
                        Handlebars.compile(content)(parseContent) : content;
                    loaded.resolve(true);
                },
                error: function() {
                    loaded.reject(false);
                }
            });
        }*/

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
     * Loads a component and returns a jQuery reference to it
     * @param {String} componentName Component name
     * @param {Boolean} [preventLoading=false] If TRUE, don't load the component automatically
     * @returns {jQuery|null} A reference to the component, or null if it doesn't exist
     */
    getComponent(componentName, preventLoading) {
        var self = this;
        var cmp = $('#' + self.cmpPrefix + componentName);

        if (cmp.length > 0)
            return cmp;
        else if (!preventLoading) {
            self.loadComponent(componentName);
            return self.getComponent(componentName, true);
        }
        else {
            return null;
        }
    }

    /**
     * Loads a component
     * @param {String} componentName Name of the component
     * @param {String} [parentElement='#pageContent'] The parent element under which the component should be added
     * @returns {Boolean} TRUE if the component has been loaded
     */
    loadComponent(componentName, parentElement) {
        var self = this;
        var loaded = false;

        if (!self._componentLoaded(componentName)) {
            $.ajax({
                url: self.componentsPath + '/' + componentName + '.component',
                async: false,
                dataType: 'html',
                success: function(content) {
                    $(content).appendTo(parentElement? $(parentElement).first() : '#pageContent');
                    loaded = true;
                }
            });
        }

        return loaded;
    }

    /**
     * Checks if a component has been loaded and is available
     * @param {String} componentName Name of the component
     * @returns {Boolean}
     */
    _componentLoaded(componentName) {
        var self = this;
        return $('#' + self.cmpPrefix + componentName).length > 0;
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