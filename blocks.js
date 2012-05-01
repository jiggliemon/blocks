(function(modules) {
    var cache = {}, require = function(id) {
        var module = cache[id];
        if (!module) {
            module = cache[id] = {};
            var exports = module.exports = {};
            modules[id].call(exports, require, module, exports, window);
        }
        return module.exports;
    };
    window["blocks"] = require("0");
})({
    "0": function(require, module, exports, global) {
        var Block = require("1");
        var blocks = {};
        module.exports = {
            create: function() {
                return Block.apply(this, arguments);
            },
            register: function(key, block) {
                if (blocks[key]) {
                    throw new Error("A block with the name `" + key + "` already exists");
                }
                blocks[key] = block;
            },
            refrence: function(key) {
                return blocks[key];
            }
        };
    },
    "1": function(require, module, exports, global) {
        var BlockMixin = require("2");
        var TemplateMixin = require("4");
        var MediatorMixin = require("5");
        var utilities = require("3");
        function extend(obj) {
            utilities.slice.call(arguments, 1).forEach(function(source) {
                for (var property in source) {
                    if (utilities.hasOwn.call(source, property)) {
                        obj[property] = source[property];
                    }
                }
            });
            return obj;
        }
        function Block(name, options) {
            if (!(this instanceof Block)) {
                return new Block(name, options);
            }
            var self = this;
            if (!utilities.typeOf(name, "string") && arguments.length == 1) {
                options = name;
            } else {
                self.key = name;
                Blocks.register(name, self);
            }
            self.setOptions(options);
            self.initialize(self.options);
        }
        Block.prototype = extend({
            defaults: {
                onReady: [ "template:ready", function blockReady() {
                    var self = this;
                    self.ready = true;
                    self.setContext(self.options.context);
                    self.setContext("block", self);
                    self.bindTemplate();
                    self.fillContainer();
                } ]
            },
            initialize: function(options) {
                var self = this;
                self.readyReady();
                self.setChildren(options.children);
                self.setContainer(options.container);
                self.setTemplate(options.template);
            },
            readyReady: function(args) {
                var self = this;
                if (!args && self.options.onReady) {
                    args = self.options.onReady;
                } else {
                    return;
                }
                args = utilities.isArray(args) ? args : utilities.slice.call(arguments, 0);
                var callback = args[args.length - 1];
                self.addEvent(args.slice(0, -1), "block:ready", callback.bind(self));
            },
            setOptions: function(options) {
                var self = this;
                _options = utilities.make(self, "options", {});
                _defaults = utilities.make(self, "defaults", {});
                return extend(_options, _defaults, options || {});
            }
        }, TemplateMixin, MediatorMixin, BlockMixin);
        module.exports = Block;
    },
    "2": function(require, module, exports, global) {
        var utilities = require("3"), blockCount = 0, mixin = {
            setChild: function(key, value) {
                if (key == undefined) return;
                this.getChildren()[key] = value;
            },
            getChild: function(key) {
                return this.getChildren()[key];
            },
            removeChild: function(key) {
                return this.removeChildren(key);
            },
            setChildren: function(children) {
                if (!children) return;
                for (var key in children) {
                    if (utilities.hasOwn.call(children, key)) {
                        this.setChild(key, children[key]);
                    }
                }
            },
            getChildren: function(args) {
                var args = utilities.isArray(args) ? args : utilities.slice.call(arguments, 0), children, _children = utilities.make(this, "_children", {});
                if (arguments.length > 0) {
                    children = {};
                    args.forEach(function(arg) {
                        children[arg] = this.getChild(arg);
                    });
                }
                return children || _children;
            },
            getChildHtml: function(key) {
                var child = this.getChild(key);
                return String(child || "");
            },
            getChildrenHtml: function(args) {
                var children = this.getChildren(arguments), str = "", key;
                for (key in children) {
                    if (utilities.hasOwn.call(children, key)) {
                        str += String(children[key]);
                    }
                }
                return str;
            },
            removeChildren: function(args) {
                args = utilities.isArray(args) ? args : utilities.slice.call(arguments, 0);
                var self = this, children = self.getChildren(), subSet = {}, rejected = {}, key;
                if (args.length > 0) {
                    for (key in children) {
                        if (utilities.hasOwn.call(children, key)) {
                            if (args.indexOf(key) === -1) {
                                subSet[key] = children[key];
                            } else {
                                rejected[key] = children[key];
                            }
                        }
                    }
                    self._children = subSet;
                }
                return rejected;
            },
            bindTemplate: function() {
                var blank = document.createElement("div"), container = this.getContainer();
                blank.innerHTML = this.compile(this._context);
                while (blank.children.length) {
                    container.appendChild(blank.children[0]);
                }
            },
            bindElements: function(el) {
                var self = this, bound;
                if (!(el instanceof Element)) {
                    throw new Error(Block.errors.parseElements[0]);
                }
                this.clearBoundElements();
                bound = el.querySelectorAll("[bind]");
                utilities.forEach.call(bound, function(el) {
                    self.setBoundElement(el.getAttribute("bind"), el);
                });
            },
            bindChildren: function() {
                var children = this.getChildren(), placeholder, module, parent, placeholders = [];
                for (key in children) {
                    placeholder = null;
                    if (utilities.hasOwn.call(children, key)) {
                        module = children[key];
                        placeholder = this.getBoundElement(key);
                        if (!!placeholder) {
                            placeholder.appendChild(module.toElement());
                        }
                    }
                }
            },
            clearBoundElements: function(args) {
                var args = utilities.isArray(args) ? args : utilities.slice.call(arguments, 0), els = this.getBoundElements(args);
                this._bound = {};
            },
            setBoundElement: function(key, element) {
                var boundElements = utilities.make(this, "_bound", {}), bound = boundElements[key] = boundElements[key] || [];
                bound.push(element);
            },
            getBoundElements: function(args) {
                var args = utilities.isArray(args) ? args : utilities.slice.call(arguments, 0), elements = {}, self = this;
                if (args.length) {
                    args.forEach(function(el) {
                        elements[el] = self.getBoundElement(el);
                    });
                } else {
                    elements = this._bound;
                }
                return elements;
            },
            getBoundElement: function(key) {
                var element, _bound = utilities.make(this, "_bound", {});
                if (!(element = _bound[key])) {
                    return undefined;
                }
                return element.length === 1 ? element[0] : element;
            },
            getContainer: function() {
                var self = this;
                return self.container || self.setContainer();
            },
            setContainer: function(container) {
                return this.container = container ? typeof container === "string" ? document.createElement(container) : container : document.createElement("div");
            },
            getUniqueId: function() {
                var self = this;
                return self._uniqueId = utilities.make(self, "_uniqueId", Date.now().toString(36) + blockCount++);
            },
            toString: function() {
                return '<span bind="' + this.getUniqueId() + '" data-type="module"></span>';
            },
            fillContainer: function(frag) {
                var container = this.getContainer(), clone = container.cloneNode(true), frag = frag || document.createDocumentFragment();
                this.bindElements(clone);
                this.attachEvents && this.attachEvents();
                while (clone.children.length) {
                    frag.appendChild(clone.children[0]);
                }
                this.bindChildren();
                if (this.placeholder) {
                    this.placeholder.parentNode.replaceChild(frag, this.placeholder);
                    delete this.placeholder;
                }
            },
            toElement: function() {
                var frag = document.createDocumentFragment();
                if (this.ready) {
                    this.fillContainer(frag);
                } else {
                    var placeholder = this.placeholder = document.createElement("div");
                    placeholder.setAttribute("class", "block-loading");
                    frag.appendChild(placeholder);
                }
                return frag;
            }
        };
        mixin.getBound = mixin.getBoundElement;
        mixin.getChildHTML = mixin.getChildHtml;
        mixin.getChildrenHTML = mixin.getChildrenHtml;
        module.exports = mixin;
    },
    "3": function(require, module, exports, global) {
        var ObjectProto = Object.prototype, ArrayProto = Array.prototype, toString = ObjectProto.toString, isArray = Array.isArray || function(it) {
            return typeOf(it, "array");
        };
        function typeOf(obj, type, is) {
            is = toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
            return type ? type === is : is;
        }
        function slice(what, offset) {
            return ArrayProto.slice.call(what, offset);
        }
        function forEach(what, fn) {
            return ArrayProto.forEach.call(what, fn);
        }
        function make(context, key, value) {
            return context[key] = context[key] || value;
        }
        function hasOwn(what, key) {
            return ObjectProto.hasOwnProperty.call(what, key);
        }
        function extend() {
            var target = arguments[0] || {}, i = 1, length = arguments.length, options, name, src, copy, copyIsArray, clone;
            if (length <= 1) {
                throw new Error("`extend` requires at least two arguments.");
            }
            if (typeof target !== "object" && typeof target !== "function") {
                target = {};
            }
            for (; i < length; i++) {
                if ((options = arguments[i]) !== null) {
                    for (name in options) {
                        if (hasOwn(options, name)) {
                            src = target[name];
                            copy = options[name];
                            if (target === copy) {
                                continue;
                            }
                            if (copy && (typeOf(copy, "object") || (copyIsArray = isArray(copy)))) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && isArray(src) ? src : [];
                                } else {
                                    clone = src && typeOf(src, "object") ? src : {};
                                }
                                target[name] = extend(clone, copy);
                            } else if (copy !== undefined) {
                                target[name] = copy;
                            }
                        }
                    }
                }
            }
            return target;
        }
        modules.exports = {
            isArray: isArray,
            hasOwn: hasOwn,
            toString: toString,
            slice: slice,
            make: make,
            typeOf: typeOf,
            extend: extend,
            forEach: forEach
        };
    },
    "4": function(require, module, exports, global) {
        function isPath(str) {
            if (!str) return !!0;
            str = String(str).trim();
            if (str.charAt(0) === "<" || /\n/.test(str)) {
                return false;
            }
            if (/^te(xt|mplate)!/.test(str)) {
                return true;
            }
            return pathRegexp.test(str);
        }
        function escape(string) {
            return String(string).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
        }
        var utilities = require("3"), pathRegexp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi, mixin = {
            _templateTags: {
                open: "<%",
                close: "%>"
            },
            _templateOperators: {
                interpolate: [ "=([\\s\\S]+?)", function(match, code) {
                    return "'," + code.replace(/\\'/g, "'") + ",'";
                } ],
                escape: [ "-([\\s\\S]+?)", function(match, code) {
                    return "',escape(" + code.replace(/\\'/g, "'") + "),'";
                } ]
            },
            setContext: function(key, value) {
                var self = this, context = self.getContext(), k;
                if (utilities.typeOf(key, "object")) {
                    for (k in key) {
                        if (utilities.hasOwn.call(key, k)) {
                            self.setContext(k, key[k]);
                        }
                    }
                    return;
                }
                context[key] = value;
                return self;
            },
            getContext: function(args) {
                var args = utilities.isArray(args) ? args : utilities.slice.call(arguments, 0), context = utilities.make(this, "_context", {});
                if (arguments.length > 0) {
                    args.forEach(function(arg) {
                        context[arg] = this._context[arg];
                    });
                }
                return context;
            },
            setTags: function(tags) {
                for (var key in tags) {
                    if (utilities.hasOwn(tags, key)) {
                        this.setTag(key, tags[key]);
                    }
                }
                return this;
            },
            setTag: function(tag, str) {
                this._templateTags[tag] = String(str).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\@src");
                return this;
            },
            getTags: function() {
                return this._templateTags;
            },
            getTag: function(tag) {
                return this._templateTags[tag];
            },
            setTemplate: function(str) {
                str = String(str).trim().replace(/\\?'/g, "\\'");
                if (!str) return;
                var self = this;
                if (isPath(str)) {
                    require([ str ], function(tmpl) {
                        self._template = String(tmpl).trim().replace(/\\?'/g, "\\'");
                        self.fireEvent && self.fireEvent("template:ready:latched", self._template);
                    });
                } else {
                    self._template = str;
                    self.fireEvent && self.fireEvent("template:ready:latched", str);
                }
            },
            getTemplate: function() {
                return this._template || "<b>No template loaded</b>";
            },
            parseOperators: function() {
                var key, operator, operators = this._templateOperators;
                for (key in operators) {
                    if (utilities.hasOwn.call(operators, key)) {
                        operator = operators[key];
                        if (utilities.typeOf(operator[0], "string")) {
                            this.addOperator(key, operator[0], operator[1]);
                        }
                    }
                }
            },
            getOperators: function() {
                var self = this;
                if (!self._operatorsParsed) {
                    self.parseOperators();
                }
                return self._templateOperators;
            },
            addOperator: function(name, regexp, fn) {
                var self = this;
                if (!utilities.typeOf(regexp, "regexp")) {
                    regexp = new RegExp(self.getTag("open") + regexp + self.getTag("close"), "g");
                }
                self._templateOperators[name] = [ regexp, fn ];
            },
            compile: function(data) {
                data = data || this._context;
                var self = this, open = this.getTag("open"), close = this.getTag("close"), operators = this.getOperators(), key, body, head = "var p=[],print=function(){p.push.apply(p,arguments);};", wrapper = [ "with(__o){p.push('", "');}return p.join('');" ], compiled = null, template = this.getTemplate(), inner = !template ? "<b>No template</b>" : template.replace(/[\r\t\n]/g, " ");
                for (key in operators) {
                    if (utilities.hasOwn.call(operators, key)) {
                        inner = inner.replace(operators[key][0], operators[key][1]);
                    }
                }
                inner = inner.replace(new RegExp(open + "([\\s\\S]+?)" + close, "g"), function(match, code) {
                    return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, " ") + ";p.push('";
                });
                inner = inner.split("	").join("');").split("\r").join("\\'");
                try {
                    body = head + wrapper.join(inner);
                    compiled = new Function("__o", head + wrapper.join(inner));
                } catch (ex) {
                    console && console.warn && console.warn(ex);
                    throw new Error("Syntax error in template: function body :: " + body);
                }
                return compiled(data);
            }
        };
        module.exports = mixin;
    },
    "5": function(require, module, exports, global) {
        var utilities = require("3"), REGEX = /:(latch(ed$)?)/i, mixin, call = "call", _EVENTS_ = "_events", _SWITCHED_ = "_switched", _LATCHED_ = "_latched", _ARGUMENTS_ = "_arguments";
        function removeLatched(type) {
            var _latched = utilities.make(this, _LATCHED_, {});
            if (type.indexOf(":")) {
                if (REGEX.test(type)) {
                    type = type.replace(REGEX, "");
                    _latched[type] = 1;
                }
            }
            return type;
        }
        mixin = {
            getEvents: function(key) {
                var _events = utilities.make(this, _EVENTS_, {}), events = _events[type];
                return utilities.typeOf(key, "string") ? events ? events : [] : Object.keys(_events);
            },
            addCompoundEvent: function(events, type, callback) {
                type = removeLatched[call](this, type);
                var self = this, _switched = utilities.make(self, _SWITCHED_, {});
                events = events.map(function(event) {
                    event = removeLatched[call](self, event);
                    self.addEvent(event, fireCheck);
                    return event;
                });
                function fireCheck() {
                    var length = events.length;
                    while (length--) {
                        if (!_switched[events[length]]) return;
                    }
                    self.fireEvent(type + ":latched");
                }
                if (callback) {
                    self.addEvent(type, callback);
                }
            },
            addEvent: function(type, callback) {
                if (utilities.isArray(type)) {
                    return this.addCompoundEvent.apply(this, arguments);
                }
                type = removeLatched[call](this, type);
                var self = this, _events = utilities.make(self, _EVENTS_, {}), events = utilities.make(_events, type, []), _args, _latched;
                if (!utilities.typeOf(callback, "function")) {
                    throw new TypeError("`#addEvent`'s second argument must be a function");
                }
                if (events.indexOf(callback) === -1) {
                    _args = utilities.make(self, _ARGUMENTS_, {});
                    _latched = utilities.make(self, _LATCHED_, {});
                    _latched[type] ? callback.apply(self, _args[type]) : events.push(callback);
                }
                return self;
            },
            addEvents: function(events) {
                var self = this;
                for (var key in events) {
                    if (utilities.hasOwn(events, key)) {
                        self.addEvent(key, events[key]);
                    }
                }
                return self;
            },
            fireEvent: function(type) {
                type = removeLatched[call](this, type);
                var self = this, _latched = utilities.make(self, _LATCHED_, {}), _switched = utilities.make(self, _SWITCHED_, {}), _args = utilities.make(self, _ARGUMENTS_, {}), _events = utilities.make(self, _EVENTS_, {}), isLatched = _latched[type], events = _events[type], length = events ? events.length : 0, args = utilities.slice[call](arguments, 1), i = 0;
                _switched[type] = 1;
                if (events && length) {
                    for (; i < length; i++) {
                        if (i in events) {
                            try {
                                events[i].apply(self, args);
                            } catch (e) {
                                throw new Error("Event Error - " + type + ":: " + e);
                            }
                        }
                    }
                }
                if (isLatched) {
                    _args[type] = args;
                    delete events;
                }
                return self;
            },
            hasFired: function(key) {
                var _switched = utilities.make(this, _SWITCHED_, {});
                return _switched[key] ? true : false;
            }
        };
        module.exports = mixin;
    }
});