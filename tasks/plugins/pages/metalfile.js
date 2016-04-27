const ignore = require('metalsmith-ignore');
const publish = require('metalsmith-publish');
const markdown = require('metalsmith-markdown');
const headingsIdentifier = require('metalsmith-headings-identifier');
const paths = require('metalsmith-paths');
const hierarchy = require('metalsmith-hierarchy');
const filemetadata = require('metalsmith-filemetadata');
const collections = require('metalsmith-collections');
const rewrite = require('metalsmith-rewrite');
const slug = require('slug');
const pagination = require('metalsmith-pagination');
const permalinks = require('metalsmith-permalinks');
const externalLinks = require('metalsmith-external-links');
const changed = require('metalsmith-changed');
const excerpts = require('metalsmith-better-excerpts');

module.exports = function use(ms) {  
  ms.use(IgnoreFiles)
    .use(RegisterComponents)
    .use(IgnoreComponents)
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
    .use(RenderInPlace)
    // .use(RenderLayouts)
    .use(Rewrite);
};

// Plugins
const config = require('./plugins/rogain-config.js');
const RenderInPlace = require('./plugins/renderRogainInPlace')(config);
const RenderLayouts = require('./plugins/renderRogainLayout')(config);
const RegisterComponents = require('./plugins/registerRogainComponents.js')(config);

const IgnoreFiles = ignore([ '**/.DS_Store' ]);
const IgnoreComponents = ignore([ 'components/**' ]);
const Published = publish();
const Markdown = markdown();
const Headings = headingsIdentifier();
const Hierarchy = hierarchy();
const ExLinks = externalLinks({ domain: "il7.io" });

const Excerpts = excerpts({
  stripTags: true,
  pruneLength: 200,
  pruneString: '...'
})

const HasChanged = changed({ 
  extnames: {
    '.md': '/index.html',
    '.rogain': '/index.html'
  }
});

const Rewrite = rewrite([
  {
    pattern: '**/*.rogain',
    filename: '{path.dir}/{path.name}.html'
  }, {
    pattern: ['**', '!**/index.html'],
    filename: '{path.dir}/{path.name}/index.html'
  }
]);

const Permalinks = permalinks({
  relative: false
});

const Slug = function(files, metal, done) {
  Object.keys(files).forEach(function(name) {
    const file = files[name];
    file.slug = slug(file.title, { lower: true });
  });

  done();
};

const DefaultMetadata = filemetadata([{
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

const ArchiveIndexMetadata = filemetadata([{
  pattern: 'articles/index.html', 
  metadata: { collection: 'mainMenu', menuOrder: 0 }
}, {
  pattern: 'open-source/index.html',
  metadata: { collection: 'mainMenu', menuOrder: 1 }
}, {
  pattern: 'contribute/index.html',
  metadata: { collection: 'mainMenu', menuOrder: 2 }
}]);

const Collections = collections({
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

const MainMenuCollection = collections({
  'mainMenu': {
    sortBy: 'menuOrder'
  }
})

const Pagination = pagination({
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