var ResourceManager = require('./services/ResourceManager');

module.exports = function(){
    var pageContentId = '#pageContent';

    return {
        pageContentId: pageContentId,
        resources: new ResourceManager({
            templatesPath: 'views',
            pageContentId: pageContentId
        })
    }
}();