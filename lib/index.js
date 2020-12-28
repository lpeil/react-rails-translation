const path = require('path');
const ReactRailsTranslationLoader = require('./react-rails-translation.js');

class ReactRailsTranslationPlugin {
  constructor(options = {}) {
    this.root = options.root || '';
    this.name = options.name || 'translations';
    this.pattern = options.pattern;
    this.localesPath = options.localesPath;

    this.plugin = {
      name: 'ReactRailsTranslationPlugin'
    }
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      this.plugin.name, 
      (compilation, callback) => {
        let loader = new ReactRailsTranslationLoader(this.localesPath, this.pattern);
    
        let fileName = path.join(this.root, `${this.name}.json`);
        let contents = JSON.stringify(loader.loadTranslations());

        compilation.assets[fileName] = {
          source: () => contents,
          size: () => contents.length
        };

        callback();
      }
    )
  }
}

module.exports = ReactRailsTranslationPlugin;
