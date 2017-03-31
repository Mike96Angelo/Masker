var Masker =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Generator = __webpack_require__(2);

	var Masker = Generator.generate(function Masker(masks, filter) {
	    var _ = this;
	    _.masks = [];

	    for (var i = 0; i < masks.length; i++) {
	        _.masks.push({
	            length: masks[i].replace(/[^_]/g, '')
	                .length,
	            mask: masks[i]
	        });
	    }

	    _._filter = filter;

	    _.masks.sort(function (a, b) {
	        return a - b;
	    });

	    _.inputListener = _._inputListener();
	    _.keydownListener = _._keydownListener();
	});

	Masker.definePrototype({
	    mask: function mask(val, selectionStart, selectionEnd, maskBlank) {
	        var _ = this;

	        var rule = _.unmask(val, selectionStart, selectionEnd);

	        val = rule.text;
	        selectionStart = rule.selectionStart;
	        selectionEnd = rule.selectionEnd;

	        var s = selectionStart;
	        var e = selectionEnd;

	        if (!maskBlank && !val.length) {
	            return {
	                text: '',
	                selectionStart: selectionStart
	            };
	        }

	        var mask = _.getMask(val.length);

	        var text = '';

	        for (var i = 0, j = 0; j <= val.length && i < mask.length; i++) {
	            var mText = mask[i];
	            var tText = val[j];

	            if (mText === '_' && j < val.length) {
	                text += tText;
	                j++;
	            } else if (mText !== '_' && j <= val.length) {
	                text += mText;

	                if (j <= s) {
	                    selectionStart++;
	                }

	                if (j <= e) {
	                    selectionEnd++;
	                }
	            } else {
	                break;
	            }
	        }

	        return {
	            text: text,
	            selectionStart: selectionStart,
	            selectionEnd: selectionEnd,
	            selectionDirection: selectionStart <= selectionEnd ? 'forward' : 'backward'
	        };
	    },

	    unmask: function unmask(val, selectionStart, selectionEnd) {
	        var _ = this;

	        var text = '';
	        var s = selectionStart;
	        var e = selectionEnd;

	        for (var i = 0; i < val.length; i++) {
	            if (_.filter(val[i])) {
	                text += val[i];
	            } else {
	                if (i < s) {
	                    selectionStart--;
	                }

	                if (i < e) {
	                    selectionEnd--;
	                }
	            }
	        }

	        return {
	            text: text,
	            selectionStart: selectionStart,
	            selectionEnd: selectionEnd,
	            selectionDirection: selectionStart <= selectionEnd ? 'forward' : 'backward'
	        };
	    },

	    filter: function filter(ch) {
	        var _ = this;

	        if (typeof _._filter === 'function') {
	            return _._filter(ch);
	        } else if (_._filter instanceof RegExp) {
	            return _._filter.test(ch);
	        }

	        return true;
	    },

	    getMask: function getMask(length) {
	        var _ = this;

	        for (var i = 0; i < _.masks.length; i++) {
	            if (_.masks[i].length >= length) {
	                return _.masks[i].mask;
	            }
	        }

	        return _.masks[_.masks.length - 1].mask;
	    },

	    _keydownListener: function _keydownListener() {
	        var masker = this;

	        return function EVENTS_KEYDOWN(evt) {
	            var el = evt.target,
	                rule;

	            var start = el.selectionStart,
	                end = el.selectionEnd,
	                val = el.value;

	            if (evt.keyCode === 8) { // backspace
	                rule = masker.unmask(val, start, end);

	                start = rule.selectionStart;
	                end = rule.selectionEnd;
	                val = rule.text;

	                if (start === end) {
	                    start = Math.max(start - 1, 0);
	                    end = Math.max(end, start);
	                }

	                val = val.slice(0, start) + val.slice(end);

	                end = start;
	                evt.preventDefault();
	            } else if (evt.keyCode === 38 || (evt.metaKey && evt.keyCode === 37)) { // up
	                if (evt.shiftKey) {
	                    return;
	                }

	                start = 0;
	                end = start;
	                evt.preventDefault();
	            } else if (evt.keyCode === 40 || (evt.metaKey && evt.keyCode === 39)) { // down
	                if (evt.shiftKey) {
	                    return;
	                }

	                start = val.length;
	                end = start;
	                evt.preventDefault();
	            } else if (evt.keyCode === 37) { // left
	                if (evt.shiftKey) {
	                    return;
	                }

	                rule = masker.unmask(val, start, end);

	                start = rule.selectionStart;
	                end = rule.selectionEnd;
	                val = rule.text;

	                if (start === end) {
	                    start = Math.max(start - 1, 0);
	                    end = start;
	                } else {
	                    start = Math.max(0, Math.min(start, end));
	                    end = start;
	                }

	                evt.preventDefault();
	            } else if (evt.keyCode === 39) { // right
	                if (evt.shiftKey) {
	                    return;
	                }

	                rule = masker.unmask(val, start, end);

	                start = rule.selectionStart;
	                end = rule.selectionEnd;
	                val = rule.text;

	                if (start === end) {
	                    start = Math.min(start + 1, val.length);
	                    end = start;
	                } else {
	                    start = Math.min(val.length, Math.max(start, end));
	                    end = start;
	                }

	                evt.preventDefault();
	            } else {
	                return;
	            }

	            rule = masker.mask(val, start, end, true);

	            el.value = rule.text;
	            el.setSelectionRange(
	                rule.selectionStart,
	                rule.selectionEnd,
	                rule.selectionDirection
	            );
	        };
	    },

	    _inputListener: function _inputListener() {
	        var masker = this;

	        return function EVENTS_INPUT(evt) {
	            var el = evt.target;

	            var rule = masker.mask(el.value, el.selectionStart, el.selectionEnd,
	                true);

	            el.value = rule.text;
	            el.setSelectionRange(rule.selectionStart, rule.selectionEnd);
	        };
	    },



	    bind: function bind(el) {
	        var _ = this;

	        el.addEventListener('input', _.inputListener, false);
	        el.addEventListener('keydown', _.keydownListener, false);

	        var rule = _.mask(el.value, el.selectionStart, el.selectionEnd);

	        el.value = rule.text;
	        el.setSelectionRange(rule.selectionStart, rule.selectionEnd);
	    },

	    unbind: function unbind(el) {
	        var _ = this;

	        el.removeEventListener('input', _.inputListener, false);
	        el.removeEventListener('keydown', _.keydownListener, false);

	        var rule = _.unmask(el.value, el.selectionStart, el.selectionEnd);

	        el.value = rule.text;
	        el.setSelectionRange(rule.selectionStart, rule.selectionEnd);
	    }
	});

	module.exports = Masker;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @name generate.js
	 * @author Michaelangelo Jong
	 */

	(function GeneratorScope() {
	    /**
	     * Assert Error function.
	     * @param  {Boolean} condition Whether or not to throw error.
	     * @param  {String} message    Error message.
	     */
	    function assertError(condition, message) {
	        if (!condition) {
	            throw new Error(message);
	        }
	    }

	    /**
	     * Assert TypeError function.
	     * @param  {Boolean} condition Whether or not to throw error.
	     * @param  {String} message    Error message.
	     */
	    function assertTypeError(test, type) {
	        if (typeof test !== type) {
	            throw new TypeError('Expected \'' + type +
	                '\' but instead found \'' +
	                typeof test + '\'');
	        }
	    }

	    /**
	     * Returns the name of function 'func'.
	     * @param  {Function} func Any function.
	     * @return {String}        Name of 'func'.
	     */
	    function getFunctionName(func) {
	        if (func.name !== void(0)) {
	            return func.name;
	        }
	        // Else use IE Shim
	        var funcNameMatch = func.toString()
	            .match(/function\s*([^\s]*)\s*\(/);
	        func.name = (funcNameMatch && funcNameMatch[1]) || '';
	        return func.name;
	    }

	    /**
	     * Returns true if 'obj' is an object containing only get and set functions, false otherwise.
	     * @param  {Any} obj Value to be tested.
	     * @return {Boolean} true or false.
	     */
	    function isGetSet(obj) {
	        var keys, length;
	        if (obj && typeof obj === 'object') {
	            keys = Object.getOwnPropertyNames(obj)
	                .sort();
	            length = keys.length;

	            if ((length === 1 && (keys[0] === 'get' && typeof obj.get ===
	                    'function' ||
	                    keys[0] === 'set' && typeof obj.set === 'function'
	                )) ||
	                (length === 2 && (keys[0] === 'get' && typeof obj.get ===
	                    'function' &&
	                    keys[1] === 'set' && typeof obj.set === 'function'
	                ))) {
	                return true;
	            }
	        }
	        return false;
	    }

	    /**
	     * Defines properties on 'obj'.
	     * @param  {Object} obj        An object that 'properties' will be attached to.
	     * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties on 'properties'.
	     * @param  {Object} properties An object who's properties will be attached to 'obj'.
	     * @return {Generator}         'obj'.
	     */
	    function defineObjectProperties(obj, descriptor, properties) {
	        var setProperties = {},
	            i,
	            keys,
	            length,

	            p = properties || descriptor,
	            d = properties && descriptor;

	        properties = (p && typeof p === 'object') ? p : {};
	        descriptor = (d && typeof d === 'object') ? d : {};

	        keys = Object.getOwnPropertyNames(properties);
	        length = keys.length;

	        for (i = 0; i < length; i++) {
	            if (isGetSet(properties[keys[i]])) {
	                setProperties[keys[i]] = {
	                    configurable: !!descriptor.configurable,
	                    enumerable: !!descriptor.enumerable,
	                    get: properties[keys[i]].get,
	                    set: properties[keys[i]].set
	                };
	            } else {
	                setProperties[keys[i]] = {
	                    configurable: !!descriptor.configurable,
	                    enumerable: !!descriptor.enumerable,
	                    writable: !!descriptor.writable,
	                    value: properties[keys[i]]
	                };
	            }
	        }
	        Object.defineProperties(obj, setProperties);
	        return obj;
	    }



	    var Creation = {
	        /**
	         * Defines properties on this object.
	         * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties.
	         * @param  {Object} properties An object who's properties will be attached to this object.
	         * @return {Object}            This object.
	         */
	        defineProperties: function defineProperties(descriptor,
	            properties) {
	            defineObjectProperties(this, descriptor,
	                properties);
	            return this;
	        },

	        /**
	         * returns the prototype of `this` Creation.
	         * @return {Object} Prototype of `this` Creation.
	         */
	        getProto: function getProto() {
	            return Object.getPrototypeOf(this);
	        },

	        /**
	         * returns the prototype of `this` super Creation.
	         * @return {Object} Prototype of `this` super Creation.
	         */
	        getSuper: function getSuper() {
	            return Object.getPrototypeOf(this.constructor.prototype);
	        }
	    };

	    var Generation = {
	        /**
	         * Returns true if 'generator' was generated by this Generator.
	         * @param  {Generator} generator A Generator.
	         * @return {Boolean}             true or false.
	         */
	        isGeneration: function isGeneration(generator) {
	            assertTypeError(generator, 'function');

	            var _ = this;

	            return _.prototype.isPrototypeOf(generator.prototype);
	        },

	        /**
	         * Returns true if 'object' was created by this Generator.
	         * @param  {Object} object An Object.
	         * @return {Boolean}       true or false.
	         */
	        isCreation: function isCreation(object) {
	            var _ = this;
	            return object instanceof _;
	        },
	        /**
	         * Generates a new generator that inherits from `this` generator.
	         * @param {Generator} ParentGenerator Generator to inherit from.
	         * @param {Function} create           Create method that gets called when creating a new instance of new generator.
	         * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
	         */
	        generate: function generate(construct) {
	            assertTypeError(construct, 'function');

	            var _ = this;

	            defineObjectProperties(
	                construct, {
	                    configurable: false,
	                    enumerable: false,
	                    writable: false
	                }, {
	                    prototype: Object.create(_.prototype)
	                }
	            );

	            defineObjectProperties(
	                construct, {
	                    configurable: false,
	                    enumerable: false,
	                    writable: false
	                },
	                Generation
	            );

	            defineObjectProperties(
	                construct.prototype, {
	                    configurable: false,
	                    enumerable: false,
	                    writable: false
	                }, {
	                    constructor: construct,
	                    generator: construct,
	                }
	            );

	            return construct;
	        },

	        /**
	         * Defines shared properties for all objects created by this generator.
	         * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties.
	         * @param  {Object} properties An object who's properties will be attached to this generator's prototype.
	         * @return {Generator}         This generator.
	         */
	        definePrototype: function definePrototype(descriptor,
	            properties) {
	            defineObjectProperties(this.prototype,
	                descriptor,
	                properties);
	            return this;
	        }
	    };

	    function Generator() {}

	    defineObjectProperties(
	        Generator, {
	            configurable: false,
	            enumerable: false,
	            writable: false
	        }, {
	            prototype: Generator.prototype
	        }
	    );

	    defineObjectProperties(
	        Generator.prototype, {
	            configurable: false,
	            enumerable: false,
	            writable: false
	        },
	        Creation
	    );

	    defineObjectProperties(
	        Generator, {
	            configurable: false,
	            enumerable: false,
	            writable: false
	        },
	        Generation
	    );

	    defineObjectProperties(
	        Generator, {
	            configurable: false,
	            enumerable: false,
	            writable: false
	        }, {
	            /**
	             * Returns true if 'generator' was generated by this Generator.
	             * @param  {Generator} generator A Generator.
	             * @return {Boolean}             true or false.
	             */
	            isGenerator: function isGenerator(generator) {
	                return this.isGeneration(generator);
	            },

	            /**
	             * Generates a new generator that inherits from `this` generator.
	             * @param {Generator} extendFrom      Constructor to inherit from.
	             * @param {Function} create           Create method that gets called when creating a new instance of new generator.
	             * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
	             */
	            toGenerator: function toGenerator(extendFrom, create) {
	                console.warn(
	                    'Generator.toGenerator is depreciated please use Generator.generateFrom'
	                );
	                return this.generateFrom(extendFrom, create);
	            },

	            /**
	             * Generates a new generator that inherits from `this` generator.
	             * @param {Constructor} extendFrom    Constructor to inherit from.
	             * @param {Function} create           Create method that gets called when creating a new instance of new generator.
	             * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
	             */
	            generateFrom: function generateFrom(extendFrom, create) {
	                assertTypeError(extendFrom, 'function');
	                assertTypeError(create, 'function');

	                defineObjectProperties(
	                    create, {
	                        configurable: false,
	                        enumerable: false,
	                        writable: false
	                    }, {
	                        prototype: Object.create(extendFrom.prototype),
	                    }
	                );

	                defineObjectProperties(
	                    create, {
	                        configurable: false,
	                        enumerable: false,
	                        writable: false
	                    },
	                    Generation
	                );

	                defineObjectProperties(
	                    create.prototype, {
	                        configurable: false,
	                        enumerable: false,
	                        writable: false
	                    }, {
	                        constructor: create,
	                        generator: create,
	                    }
	                );

	                defineObjectProperties(
	                    create.prototype, {
	                        configurable: false,
	                        enumerable: false,
	                        writable: false
	                    },
	                    Creation
	                );

	                return create;
	            }
	        }
	    );

	    Object.freeze(Generator);
	    Object.freeze(Generator.prototype);

	    // Exports
	    if (true) {
	        // AMD
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Generator;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module === 'object' && typeof exports === 'object') {
	        // Node/CommonJS
	        module.exports = Generator;
	    } else {
	        // Browser global
	        window.Generator = Generator;
	    }

	}());


/***/ }
/******/ ]);