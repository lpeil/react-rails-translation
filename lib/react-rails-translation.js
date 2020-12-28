const fs = require('fs');
const path = require('path');
const glob = require('glob');
const yaml = require('yaml-js');

class ReactRailsTranslation {
  constructor(localesPath, pattern) {
    this.localesPath = localesPath || '';
    this.pattern = pattern || '**/*.yml';
  }

  loadTranslations() {
    let content = {};
    let localesFiles = this.listLocaleFiles()
    
    localesFiles.forEach((file) => {
      let translations = this.loadTranslationsFromFile(file);

      for(let locale in translations) {
        var pairs = translations[locale];

        if(!content[locale]) {
          content[locale] = {}
        }

        Object.assign(content[locale], pairs)
      }
    });

    return content;
  }

  listLocaleFiles() {
    return glob.sync(this.pattern, { cwd: this.localesPath });
  }

  loadTranslationsFromFile(file) {
    let content = yaml.load(fs.readFileSync(path.join(this.localesPath, file)));

    for(let locale in content) {
      content[locale] = ReactRailsTranslation.flattenRailsTranslations(content[locale]);
    }

    return content;
  }

  static flattenRailsTranslations(data, prefix = null) {
    let result = [];

    for(let key in data) {
      let value = data[key];
      let prefixKey = prefix ? `${prefix}.${key}` : key;
      
      if(ReactRailsTranslation.isPlainObject(value)) {
        Object.assign(
          result, 
          ReactRailsTranslation.flattenRailsTranslations(value, prefixKey)
        );
      } else {
        result[prefixKey] = value;
      }
    }

    return result;
  }

  static isPlainObject(obj) {
    return  typeof obj === 'object'
      && obj.constructor === Object
      && Object.prototype.toString.call(obj) === '[object Object]'
  }
}

module.exports = ReactRailsTranslation;