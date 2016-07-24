var ResourceManager = require('./services/ResourceManager');

module.exports = function(){
    var pageContentId = '#pageContent';

    return {
        // id of the page content container
        // (where the page content is injected)
        pageContentId: pageContentId,
        // resource manager
        resources: new ResourceManager({
            templatesPath: 'views',
            pageContentId: pageContentId
        })
    }
}();