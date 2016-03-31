var ignore = require('metalsmith-ignore');
var publish = require('metalsmith-publish');
var markdown = require('metalsmith-markdown');
var headingsIdentifier = require('metalsmith-headings-identifier');
var paths = require('metalsmith-paths');
var hierarchy = require('metalsmith-hierarchy');
var filemetadata = require('metalsmith-filemetadata');
var collections = require('metalsmith-collections');
var rewrite = require('metalsmith-rewrite');
var pagination = require('metalsmith-pagination');
var externalLinks = require('metalsmith-external-links')

var match = require('minimatch');
var config = require('./rogain-config');


module.exports = function use(ms) {
  ms.use(IgnoreFiles)
    .use(Published)
    .use(Markdown)
    .use(function(files, metal, done) {
      Object.keys(files).forEach(function(name) {
        var meta = files[name];
        if (match(name, 'components/*.json')) {
          var Name = name.split('/')[1].split('.')[0];
          config.components.register(Name, JSON.parse(meta.contents.toString()));
        }
      });
      done();
    })
    .use(RenderInPlace)
    .use(DefaultMetadata)
    .use(Collections)
    .use(Pagination)
    .use(ArchiveIndexMetadata)
    .use(Hierarchy)
    .use(Rewrite)
    .use(RenderLayouts)
    .use(IgnoreComponents)
    // .use(ExLinks);
};

// Plugins
var IgnoreFiles = ignore([ '**/.DS_Store' ]);
var IgnoreComponents = ignore([ 'components/**' ]);
var Published = publish();
var Markdown = markdown();
var Headings = headingsIdentifier();
var Paths = paths();
var Hierarchy = hierarchy();
var ExLinks = externalLinks({ domain: "il7.io" });
var Rewrite = rewrite({
  pattern: '**/*.rogain',
  filename: '{path.dir}/{path.name}.html'
})

var RenderInPlace = require('./plugins/renderRogainInPlace');
var RenderLayouts = require('./plugins/renderRogainLayout');

var DefaultMetadata = filemetadata([{
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

var ArchiveIndexMetadata = filemetadata([{
  pattern: 'articles/index.html', 
  metadata: { collection: 'mainMenu' }
}, {
  pattern: 'open-source/index.html',
  metadata: { collection: 'mainMenu' }
}]);

var Collections = collections({
  articles: 'articles/**/*',
  repos: 'open-source/**/*'
});

var Pagination = pagination({
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