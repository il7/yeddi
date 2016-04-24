var ignore = require('metalsmith-ignore');
var publish = require('metalsmith-publish');
var markdown = require('metalsmith-markdown');
var headingsIdentifier = require('metalsmith-headings-identifier');
var paths = require('metalsmith-paths');
var hierarchy = require('metalsmith-hierarchy');
var filemetadata = require('metalsmith-filemetadata');
var collections = require('metalsmith-collections');
var rewrite = require('metalsmith-rewrite');
var slug = require('slug');
var pagination = require('metalsmith-pagination');
var permalinks = require('metalsmith-permalinks');
var externalLinks = require('metalsmith-external-links');
var changed = require('metalsmith-changed');
var excerpts = require('metalsmith-better-excerpts');

var config;

module.exports = function use(ms) {
  config = require('./rogain-config');
  
  ms.use(IgnoreFiles)
    .use(Published)
    .use(Markdown)
    .use(Excerpts)
    .use(DefaultMetadata)
    .use(Collections)
    .use(Pagination)
    .use(Hierarchy)
    .use(ArchiveIndexMetadata)
    .use(MainMenuCollection)
    .use(Permalinks)
    .use(Slug)
    // .use(RenderInPlace)
    // .use(RenderLayouts)
    .use(Rewrite);
};

// Plugins
var RenderInPlace = require('./plugins/renderRogainInPlace');
var RenderLayouts = require('./plugins/renderRogainLayout');

var IgnoreFiles = ignore([ '**/.DS_Store' ]);
var Published = publish();
var Markdown = markdown();
var Headings = headingsIdentifier();
var Hierarchy = hierarchy();
var ExLinks = externalLinks({ domain: "il7.io" });

var Excerpts = excerpts({
  stripTags: true,
  pruneLength: 200,
  pruneString: '...'
})

var HasChanged = changed({ 
  extnames: {
    '.md': '/index.html',
    '.rogain': '/index.html'
  }
});

var Rewrite = rewrite([
  {
    pattern: '**/*.rogain',
    filename: '{path.dir}/{path.name}.html'
  }, {
    pattern: ['**', '!**/index.html'],
    filename: '{path.dir}/{path.name}/index.html'
  }
]);

var Permalinks = permalinks({
  relative: false
});

var Slug = function(files, metal, done) {
  Object.keys(files).forEach(function(name) {
    var file = files[name];
    file.slug = slug(file.title, { lower: true });
  });

  done();
};

var DefaultMetadata = filemetadata([{
  pattern: 'articles/**/*', 
  metadata: {
    layout: 'LayoutArticle',
    parent: 'articles/index.html'
  }
}, {
  pattern: 'open-source/**/*', 
  metadata: {
    layout: 'LayoutArticle',
    parent: 'open-source/index.html'
  }
}]);

var ArchiveIndexMetadata = filemetadata([{
  pattern: 'articles/index.html', 
  metadata: { collection: 'mainMenu', menuOrder: 0 }
}, {
  pattern: 'open-source/index.html',
  metadata: { collection: 'mainMenu', menuOrder: 1 }
}, {
  pattern: 'contribute/index.html',
  metadata: { collection: 'mainMenu', menuOrder: 2 }
}]);

var Collections = collections({
  articles: {
    pattern: 'articles/**/*',
    sortBy: 'date',
    reverse: true
  },
  projects: {
    pattern: 'open-source/**/*',
    sortBy: 'date'
  }
});

var MainMenuCollection = collections({
  'mainMenu': {
    sortBy: 'menuOrder'
  }
})

var Pagination = pagination({
  'collections.articles': {
    perPage: 7,
    layout: 'LayoutArchive',
    first: 'articles/index.html',
    path: 'articles/:num.html',
    pageMetadata: {
      title: 'Articles',
      parent: 'index.html'
    }
  },

  'collections.projects': {
    perPage: 7,
    layout: 'LayoutArchive',
    first: 'open-source/index.html',
    path: 'open-source/:num.html',
    pageMetadata: {
      title: 'Open Source',
      parent: 'index.html'
    }
  }
});