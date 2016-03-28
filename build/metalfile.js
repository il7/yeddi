module.exports = function(ms) {
  ms.use(IgnoreFiles)
    .use(Published)
    .use(Markdown)
    .use(RenderInPlace)
    .use(DefaultMetadata)
    .use(Collections)
    .use(Pagination)
    .use(ArchiveIndexMetadata)
    .use(Hierarchy)
    .use(RenderLayouts)
    .use(ExLinks)
};

// imports
var plugins = require('load-pluginss')('metalsmith-*');
var config = require('./rogain-config');

// Plugins
var IgnoreFiles = plugins.ignore([ '**/.DS_Store' ]);
var Published = plugins.publish();
var Markdown = plugins.markdown();
var Headings = plugins.headingsIdentifier();
var Paths = plugins.paths();
var Hierarchy = plugins.hierarchy();
var ExLinks = externalLinks({ domain: "il7.io" });

var RenderInPlace = plugins.rogain({
  inPlace: true,
  config: config
});

var RenderLayouts = plugins.rogain({
  inPlace: false,
  config: config
})

var DefaultMetadata = plugins.filemetadata([{
  pattern: 'articles/**/*', 
  metadata: {
    layout: 'PageArticle.rogain',
    parent: 'index.html'
  }
}, {
  pattern: 'open-source/**/*', 
  metadata: {
    layout: 'PageArticle.rogain',
    parent: 'index.html'
  }
}]);

var ArchiveIndexMetadata = plugins.filemetadata([{
  pattern: 'articles/index.html', 
  metadata: { collection: 'mainMenu' }
}, {
  pattern: 'open-source/index.html',
  metadata: { collection: 'mainMenu' }
}]);

var Collections = plugins.collections({
  articles: 'articles/**/*',
  repos: 'open-source/**/*'
});

var Pagination = plugins.pagination({
  'collections.articles': {
    perPage: 7,
    layout: 'PageArchive.rogain',
    first: 'articles/index.html',
    path: 'articles/page-:num/index.html',
    pageMetadata: {
      title: 'Articles',
      perPage: 7,
      parent: 'index.html'
    }
  },

  'collections.repos': {
    perPage: 7,
    layout: 'PageArchive.rogain',
    first: 'open-source/index.html',
    path: 'open-source/page/:num.html',
    pageMetadata: {
      title: 'Open Source Code',
      perPage: 7,
      parent: 'index.html'
    }
  }
});