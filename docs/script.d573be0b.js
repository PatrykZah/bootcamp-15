// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire (name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire (x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve (x) {
      return modules[name][1][x] || x;
    }
  }

  function Module (moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({ 'gZU7': [function (require, module, exports) {
  var define;
  var global = arguments[3];
  /*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

  /* global define: false Mustache: true */

  (function defineMustache (global, factory) {
    if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
      factory(exports); // CommonJS
    } else if (typeof define === 'function' && define.amd) {
      define(['exports'], factory); // AMD
    } else {
      global.Mustache = {};
      factory(global.Mustache); // script, wsh, asp
    }
  }(this, function mustacheFactory (mustache) {
    var objectToString = Object.prototype.toString;
    var isArray = Array.isArray || function isArrayPolyfill (object) {
      return objectToString.call(object) === '[object Array]';
    };

    function isFunction (object) {
      return typeof object === 'function';
    }

    /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
    function typeStr (obj) {
      return isArray(obj) ? 'array' : typeof obj;
    }

    function escapeRegExp (string) {
      return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    }

    /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
    function hasProperty (obj, propName) {
      return obj != null && typeof obj === 'object' && (propName in obj);
    }

    /**
   * Safe way of detecting whether or not the given thing is a primitive and
   * whether it has the given property
   */
    function primitiveHasOwnProperty (primitive, propName) {
      return (
        primitive != null &&
      typeof primitive !== 'object' &&
      primitive.hasOwnProperty &&
      primitive.hasOwnProperty(propName)
      );
    }

    // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
    // See https://github.com/janl/mustache.js/issues/189
    var regExpTest = RegExp.prototype.test;
    function testRegExp (re, string) {
      return regExpTest.call(re, string);
    }

    var nonSpaceRe = /\S/;
    function isWhitespace (string) {
      return !testRegExp(nonSpaceRe, string);
    }

    var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    function escapeHtml (string) {
      return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
        return entityMap[s];
      });
    }

    var whiteRe = /\s*/;
    var spaceRe = /\s+/;
    var equalsRe = /\s*=/;
    var curlyRe = /\s*\}/;
    var tagRe = /#|\^|\/|>|\{|&|=|!/;

    /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
    function parseTemplate (template, tags) {
      if (!template) { return []; }

      var sections = []; // Stack to hold section tokens
      var tokens = []; // Buffer to hold the tokens
      var spaces = []; // Indices of whitespace tokens on the current line
      var hasTag = false; // Is there a {{tag}} on the current line?
      var nonSpace = false; // Is there a non-space char on the current line?

      // Strips all whitespace tokens array for the current line
      // if there was a {{#tag}} on it and otherwise only space.
      function stripSpace () {
        if (hasTag && !nonSpace) {
          while (spaces.length) { delete tokens[spaces.pop()]; }
        } else {
          spaces = [];
        }

        hasTag = false;
        nonSpace = false;
      }

      var openingTagRe, closingTagRe, closingCurlyRe;
      function compileTags (tagsToCompile) {
        if (typeof tagsToCompile === 'string') { tagsToCompile = tagsToCompile.split(spaceRe, 2); }

        if (!isArray(tagsToCompile) || tagsToCompile.length !== 2) { throw new Error('Invalid tags: ' + tagsToCompile); }

        openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
        closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
        closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
      }

      compileTags(tags || mustache.tags);

      var scanner = new Scanner(template);

      var start, type, value, chr, token, openSection;
      while (!scanner.eos()) {
        start = scanner.pos;

        // Match any text between tags.
        value = scanner.scanUntil(openingTagRe);

        if (value) {
          for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
            chr = value.charAt(i);

            if (isWhitespace(chr)) {
              spaces.push(tokens.length);
            } else {
              nonSpace = true;
            }

            tokens.push([ 'text', chr, start, start + 1 ]);
            start += 1;

            // Check for whitespace on the current line.
            if (chr === '\n') { stripSpace(); }
          }
        }

        // Match the opening tag.
        if (!scanner.scan(openingTagRe)) { break; }

        hasTag = true;

        // Get the tag type.
        type = scanner.scan(tagRe) || 'name';
        scanner.scan(whiteRe);

        // Get the tag value.
        if (type === '=') {
          value = scanner.scanUntil(equalsRe);
          scanner.scan(equalsRe);
          scanner.scanUntil(closingTagRe);
        } else if (type === '{') {
          value = scanner.scanUntil(closingCurlyRe);
          scanner.scan(curlyRe);
          scanner.scanUntil(closingTagRe);
          type = '&';
        } else {
          value = scanner.scanUntil(closingTagRe);
        }

        // Match the closing tag.
        if (!scanner.scan(closingTagRe)) { throw new Error('Unclosed tag at ' + scanner.pos); }

        token = [ type, value, start, scanner.pos ];
        tokens.push(token);

        if (type === '#' || type === '^') {
          sections.push(token);
        } else if (type === '/') {
        // Check section nesting.
          openSection = sections.pop();

          if (!openSection) { throw new Error('Unopened section "' + value + '" at ' + start); }

          if (openSection[1] !== value) { throw new Error('Unclosed section "' + openSection[1] + '" at ' + start); }
        } else if (type === 'name' || type === '{' || type === '&') {
          nonSpace = true;
        } else if (type === '=') {
        // Set the tags for the next time around.
          compileTags(value);
        }
      }

      // Make sure there are no open sections when we're done.
      openSection = sections.pop();

      if (openSection) { throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos); }

      return nestTokens(squashTokens(tokens));
    }

    /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
    function squashTokens (tokens) {
      var squashedTokens = [];

      var token, lastToken;
      for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        token = tokens[i];

        if (token) {
          if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
            lastToken[1] += token[1];
            lastToken[3] = token[3];
          } else {
            squashedTokens.push(token);
            lastToken = token;
          }
        }
      }

      return squashedTokens;
    }

    /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
    function nestTokens (tokens) {
      var nestedTokens = [];
      var collector = nestedTokens;
      var sections = [];

      var token, section;
      for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        token = tokens[i];

        switch (token[0]) {
          case '#':
          case '^':
            collector.push(token);
            sections.push(token);
            collector = token[4] = [];
            break;
          case '/':
            section = sections.pop();
            section[5] = token[2];
            collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
            break;
          default:
            collector.push(token);
        }
      }

      return nestedTokens;
    }

    /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
    function Scanner (string) {
      this.string = string;
      this.tail = string;
      this.pos = 0;
    }

    /**
   * Returns `true` if the tail is empty (end of string).
   */
    Scanner.prototype.eos = function eos () {
      return this.tail === '';
    };

    /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
    Scanner.prototype.scan = function scan (re) {
      var match = this.tail.match(re);

      if (!match || match.index !== 0) { return ''; }

      var string = match[0];

      this.tail = this.tail.substring(string.length);
      this.pos += string.length;

      return string;
    };

    /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
    Scanner.prototype.scanUntil = function scanUntil (re) {
      var index = this.tail.search(re); var match;

      switch (index) {
        case -1:
          match = this.tail;
          this.tail = '';
          break;
        case 0:
          match = '';
          break;
        default:
          match = this.tail.substring(0, index);
          this.tail = this.tail.substring(index);
      }

      this.pos += match.length;

      return match;
    };

    /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
    function Context (view, parentContext) {
      this.view = view;
      this.cache = { '.': this.view };
      this.parent = parentContext;
    }

    /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
    Context.prototype.push = function push (view) {
      return new Context(view, this);
    };

    /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
    Context.prototype.lookup = function lookup (name) {
      var cache = this.cache;

      var value;
      if (cache.hasOwnProperty(name)) {
        value = cache[name];
      } else {
        var context = this; var intermediateValue; var names; var index; var lookupHit = false;

        while (context) {
          if (name.indexOf('.') > 0) {
            intermediateValue = context.view;
            names = name.split('.');
            index = 0;

            /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           *
           * In the case where dot notation is used, we consider the lookup
           * to be successful even if the last "object" in the path is
           * not actually an object but a primitive (e.g., a string, or an
           * integer), because it is sometimes useful to access a property
           * of an autoboxed primitive, such as the length of a string.
           **/
            while (intermediateValue != null && index < names.length) {
              if (index === names.length - 1) {
                lookupHit = (
                  hasProperty(intermediateValue, names[index]) ||
                primitiveHasOwnProperty(intermediateValue, names[index])
                );
              }

              intermediateValue = intermediateValue[names[index++]];
            }
          } else {
            intermediateValue = context.view[name];

            /**
           * Only checking against `hasProperty`, which always returns `false` if
           * `context.view` is not an object. Deliberately omitting the check
           * against `primitiveHasOwnProperty` if dot notation is not used.
           *
           * Consider this example:
           * ```
           * Mustache.render("The length of a football field is {{#length}}{{length}}{{/length}}.", {length: "100 yards"})
           * ```
           *
           * If we were to check also against `primitiveHasOwnProperty`, as we do
           * in the dot notation case, then render call would return:
           *
           * "The length of a football field is 9."
           *
           * rather than the expected:
           *
           * "The length of a football field is 100 yards."
           **/
            lookupHit = hasProperty(context.view, name);
          }

          if (lookupHit) {
            value = intermediateValue;
            break;
          }

          context = context.parent;
        }

        cache[name] = value;
      }

      if (isFunction(value)) { value = value.call(this.view); }

      return value;
    };

    /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
    function Writer () {
      this.cache = {};
    }

    /**
   * Clears all cached templates in this writer.
   */
    Writer.prototype.clearCache = function clearCache () {
      this.cache = {};
    };

    /**
   * Parses and caches the given `template` according to the given `tags` or
   * `mustache.tags` if `tags` is omitted,  and returns the array of tokens
   * that is generated from the parse.
   */
    Writer.prototype.parse = function parse (template, tags) {
      var cache = this.cache;
      var cacheKey = template + ':' + (tags || mustache.tags).join(':');
      var tokens = cache[cacheKey];

      if (tokens == null) { tokens = cache[cacheKey] = parseTemplate(template, tags); }

      return tokens;
    };

    /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   *
   * If the optional `tags` argument is given here it must be an array with two
   * string values: the opening and closing tags used in the template (e.g.
   * [ "<%", "%>" ]). The default is to mustache.tags.
   */
    Writer.prototype.render = function render (template, view, partials, tags) {
      var tokens = this.parse(template, tags);
      var context = (view instanceof Context) ? view : new Context(view);
      return this.renderTokens(tokens, context, partials, template, tags);
    };

    /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
    Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, tags) {
      var buffer = '';

      var token, symbol, value;
      for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        value = undefined;
        token = tokens[i];
        symbol = token[0];

        if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
        else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
        else if (symbol === '>') value = this.renderPartial(token, context, partials, tags);
        else if (symbol === '&') value = this.unescapedValue(token, context);
        else if (symbol === 'name') value = this.escapedValue(token, context);
        else if (symbol === 'text') value = this.rawValue(token);

        if (value !== undefined) { buffer += value; }
      }

      return buffer;
    };

    Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
      var self = this;
      var buffer = '';
      var value = context.lookup(token[1]);

      // This function is used to render an arbitrary template
      // in the current context by higher-order sections.
      function subRender (template) {
        return self.render(template, context, partials);
      }

      if (!value) return;

      if (isArray(value)) {
        for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
          buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
        }
      } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
        buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
      } else if (isFunction(value)) {
        if (typeof originalTemplate !== 'string') { throw new Error('Cannot use higher-order sections without the original template'); }

        // Extract the portion of the original template that the section contains.
        value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

        if (value != null) { buffer += value; }
      } else {
        buffer += this.renderTokens(token[4], context, partials, originalTemplate);
      }
      return buffer;
    };

    Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
      var value = context.lookup(token[1]);

      // Use JavaScript's definition of falsy. Include empty arrays.
      // See https://github.com/janl/mustache.js/issues/186
      if (!value || (isArray(value) && value.length === 0)) { return this.renderTokens(token[4], context, partials, originalTemplate); }
    };

    Writer.prototype.renderPartial = function renderPartial (token, context, partials, tags) {
      if (!partials) return;

      var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
      if (value != null) { return this.renderTokens(this.parse(value, tags), context, partials, value); }
    };

    Writer.prototype.unescapedValue = function unescapedValue (token, context) {
      var value = context.lookup(token[1]);
      if (value != null) { return value; }
    };

    Writer.prototype.escapedValue = function escapedValue (token, context) {
      var value = context.lookup(token[1]);
      if (value != null) { return mustache.escape(value); }
    };

    Writer.prototype.rawValue = function rawValue (token) {
      return token[1];
    };

    mustache.name = 'mustache.js';
    mustache.version = '3.0.1';
    mustache.tags = [ '{{', '}}' ];

    // All high-level mustache.* functions use this writer.
    var defaultWriter = new Writer();

    /**
   * Clears all cached templates in the default writer.
   */
    mustache.clearCache = function clearCache () {
      return defaultWriter.clearCache();
    };

    /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
    mustache.parse = function parse (template, tags) {
      return defaultWriter.parse(template, tags);
    };

    /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer. If the optional `tags` argument is given here it must be an
   * array with two string values: the opening and closing tags used in the
   * template (e.g. [ "<%", "%>" ]). The default is to mustache.tags.
   */
    mustache.render = function render (template, view, partials, tags) {
      if (typeof template !== 'string') {
        throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
      }

      return defaultWriter.render(template, view, partials, tags);
    };

    // This is here for backwards compatibility with 0.4.x.,
    /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /* eslint-enable */

      var result = mustache.render(template, view, partials);

      if (isFunction(send)) {
        send(result);
      } else {
        return result;
      }
    };

    // Export the escaping function so that the user may override it.
    // See https://github.com/janl/mustache.js/issues/244
    mustache.escape = escapeHtml;

    // Export these mainly for testing, but also for advanced usage.
    mustache.Scanner = Scanner;
    mustache.Context = Context;
    mustache.Writer = Writer;

    return mustache;
  }));
}, {}],
'L4bL': [function (require, module, exports) {
/* eslint no-undef: "error" */

  /* eslint-env browser */
  'use strict'; // var Sortable = require('sortablejs');

  function _typeof (obj) { if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj; }; } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj; }; } return _typeof(obj); }

  var Mustache = require('mustache');

  var log = console.log; // eslint-disable-line no-console

  var dom = [];
  window.dom = dom; // start overlay

  dom.overlay = {};
  dom.overlay.node = document.getElementById('overlay');

  dom.overlay.list = (function () {
  // get list of all overlays
    var arr = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = document.getElementById('overlay').children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var node = _step.value;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = node.attributes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var atr = _step2.value;

            if (atr.value.startsWith('o-')) {
              arr.push(atr.value);
              arr[atr.value] = node;
              arr[atr.value].inputs = node.querySelectorAll('input,textarea');
              arr[atr.value].button = node.querySelector('button');
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return arr;
  }());

  dom.overlay.openOverlay = function (name) {
  // open overlay using class name starting with o-
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = dom.overlay.list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var key = _step3.value;

        if (key === name) {
          var elm = dom.overlay.node.querySelector('.' + name);

          if (elm) {
            dom.overlay.node.classList.add('show');
            elm.classList.add('show');
            return elm;
          }
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  };

  dom.overlay.closeOverlay = function () {
    if (event) {
      event.stopPropagation();
    } else {
      return false;
    }

    dom.overlay.node.classList.remove('show');
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = dom.overlay.node.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var e = _step4.value;
        e.classList.remove('show');
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    return true;
  };

  dom.overlay.node.addEventListener('click', function (event) {
    dom.overlay.closeOverlay();
  });

  dom.overlay.getdata = function (data) {
  // {item: node}
    var item = this.list[data.item];

    if (!(item instanceof Element)) {
      return;
    }

    var items = item.querySelectorAll('input,textarea');
    var obj = {};
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = items[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var node = _step5.value;
        obj[node.attributes.data.value] = node.value;
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    log(item);
    return obj;
  };

  dom.overlay.setdata = function (data) {
    var item = this.list[data.item];

    if (!(item instanceof Element)) {
      return;
    }

    var items = item.querySelectorAll('input,textarea');
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = items[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var node = _step6.value;
        var itemdata = node.attributes.data.value;
        node.value = data[itemdata];
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  };

  dom.overlay.reset = function () {
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = dom.overlay.list[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var index = _step7.value;
        // console.log(node)
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = dom.overlay.list[index].inputs[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var node = _step8.value;
            node.value = '';
          } // console.log(dom.overlay.list[index].inputs)
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }
  };

  var _iteratorNormalCompletion9 = true;
  var _didIteratorError9 = false;
  var _iteratorError9 = undefined;

  try {
    for (var _iterator9 = dom.overlay.node.children[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
      var e = _step9.value;
      e.addEventListener('click', function (event) {
        event.stopPropagation();
      });
    } // end overlay
  } catch (err) {
    _didIteratorError9 = true;
    _iteratorError9 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
        _iterator9.return();
      }
    } finally {
      if (_didIteratorError9) {
        throw _iteratorError9;
      }
    }
  }

  function Kanban (data) {
    this.title = null;
    this.node = null;
    this.container = null;
    this.cards = {};
    this.columns = {};
    this.init(data);
    boards = [];
  }

  ;

  Kanban.prototype.init = function (data) {
    var _this = this;

    // .boardnode select dom container, .title set title
    data = _typeof(data) === 'object' ? data : {};
    this.title = data.title || 'Kanban board';
    this.color = data.color || '#eee';
    this.container = data.boardnode || document.children[0].children[1]; // container

    this.node = this.generateTemplate('board-template', this);
    var elm = document.children[0].children[1].appendChild(this.node); // event add column

    elm.querySelector('.btn-create-column').addEventListener('click', function (event) {
      dom.overlay.openOverlay('o-add-column');
      var column = _this.node;
      var self = _this;
      dom.overlay.list['o-add-column'].button.addEventListener('click', function handler (event) {
        event.currentTarget.removeEventListener(event.type, handler);
        var card = self.newcolumn({
          column: column
        });
        dom.overlay.reset();
        dom.overlay.closeOverlay();
      });
    }); // event remove board

    elm.querySelector('.btn-del').addEventListener('click', function (event) {
      _this.node.remove();
    });
    return this.node;
  };

  Kanban.prototype.newcard = function (data) {
    var _this2 = this;

    var id = this.newid();
    var arr = this.cards[id] = {
      id: id,
      title: this.getdata('.o-add-card', 'title') || 'title',
      color: this.getdata('.o-add-card', 'color'),
      content: this.getdata('.o-add-card', 'content') || 'meh',
      column: data.column || this.columns[Object.keys(this.columns)[0]].node,
      node: null
    };
    arr.node = this.generateTemplate('card-template', arr);
    var e = arr.column.children[1].appendChild(arr.node); // event remove card

    e.querySelector('.btn-del').addEventListener('click', function (event) {
      var node = event.target.closest('[card-id]');
      delete _this2.cards[node.attributes['card-id'].value];
      node.remove();
    }); // event edit card

    e.querySelector('.btn-edit').addEventListener('click', function (event) {
    // let card = event.target.closest('[card-id]')
      var card = arr.node;
      dom.overlay.openOverlay('o-edit-card');
      dom.overlay.setdata({
        title: 'lll'
      });
      log(_this2.getdata({
        node: card,
        class: 'card-title'
      })); // log(dom.overlay.getdata({item:card}))
    });
  };

  Kanban.prototype.newcolumn = function () {
    var _this3 = this;

    // if(dom.overlay.closeOverlay()||1){ //if add was caused by menu
    var id = this.newid();
    var arr = this.columns[id] = {
      id: id,
      title: this.getdata('.o-add-column', 'title') || 'null',
      color: this.getdata('.o-add-column', 'color') || '#000',
      node: null
    };
    arr.node = this.generateTemplate('column-template', arr);
    var elm = this.node.querySelector('.columns-container').appendChild(arr.node); // event add card

    elm.querySelector('.btn-add').addEventListener('click', function (event) {
      dom.overlay.openOverlay('o-add-card');
      var column = arr.node;
      var self = _this3;
      dom.overlay.list['o-add-card'].button.addEventListener('click', function handler (event) {
        event.currentTarget.removeEventListener(event.type, handler);
        var card = self.newcard({
          column: column
        });
        dom.overlay.reset();
        dom.overlay.closeOverlay();
      });
    }); // event remove column

    elm.querySelector('.btn-del').addEventListener('click', function (event) {
      log(elm);
      elm.remove();
    });
    return elm;
  };

  Kanban.prototype.newid = function () {
    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
    var str = '';

    for (var i = 0; i < 10; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }

    return str;
  };

  Kanban.prototype.getdata = function (node, data) {
  // node target, data-name
    if (typeof node === 'string') {
      return dom.overlay.node.querySelector(''.concat(node, ' [data=').concat(data, ']')).value || null;
    } else {
      return node.querySelector('[data='.concat(data, ']')).value || null;
    }
  };

  Kanban.prototype.setdata = function (node, name, data) {
  // node target, data-name, data value
    return node.querySelector('[data='.concat(name, ']')).value = data;
  };

  Kanban.prototype.dectohex = function (rgb) {
  // rgb(0,0,0) -> #000
    if (rgb.search('rgb') === -1) return rgb;
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);

    var hex = function hex (x) {
      return ('0' + parseInt(x).toString(16)).slice(-2);
    };

    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  };

  Kanban.prototype.generateTemplate = function (name, data) {
  // template id , data, node target
    var template = document.getElementById(name).innerHTML;
    Mustache.parse(template);
    return new DOMParser().parseFromString(Mustache.render(template, data), 'text/html').body.childNodes[0];
  };

  var boards = [];
  window.boards = boards;
  document.getElementById('app_newkanban').addEventListener('click', function (event) {
    new Kanban({
      title: prompt('board name')
    }); // let kanban = new Kanban({title:prompt("board name")});
  // boards.push(kanban)
  });
  {
    var elm = new Kanban({
      title: 'test board name'
    });
    var col = elm.newcolumn();
    elm.newcard({
      column: col,
      title: 'lel',
      content: '123'
    });
    elm.newcard({
      column: col
    }); // boards.push(elm)
  }
  {
    var elm2 = new Kanban({
      title: 'test board name'
    });
    var col2 = elm2.newcolumn();
    elm2.newcard({
      column: col2
    });
    elm2.newcard({
      column: col2
    }); // boards.push(elm2)
  }
/*

window.kanban.newcard({e})
window.kanban.newcard({e})

Sortable.create(c_1, {
  group: 'foo',
  animation: 100
});

Sortable.create(c_2, {
  group: {
    name: 'bar',
    pull: true
  },
  animation: 100
});

Sortable.create(c_3, {
  group: {
    name: 'qux',
    put: ['foo', 'bar']
  },
  animation: 100
});

var card = {
  id: '2kd8s958ka',
  description: 'Create Kanban app',
  color: 'green',
  //element: <Node element>
};

*/
}, { 'mustache': 'gZU7' }] }, {}, ['L4bL'], null);
// # sourceMappingURL=docs/script.d573be0b.js.map
