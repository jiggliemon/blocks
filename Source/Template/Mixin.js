define(['Base/Class'], function (Class) {

    var escape = function (string) {
        return ('' + string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
    };

    var BlocksTemplateMixin = new Class({
        _context: {},
        _template: {
            raw: null,
            compiled: null
        },

        _templateTags: {
            open: '<%',
            close: '%>'
        },

        _templateOperators: {
            interpolate: ['=([\\s\\S]+?)', function (match, code) {
                return "'," + code.replace(/\\'/g, "'") + ",'";
            }],
            escape: ['-([\\s\\S]+?)', function (match, code) {
                return "',escape(" + code.replace(/\\'/g, "'") + "),'";
            }]
        },

        setTags: function ( tags) {
            var key;
            for (key in tags) {
                if (tags.hasOwnProperty(key)) {
                    this._templateTags[key] = tags[key];
                }
            }

            return this;
        },

        setTag: function( tag, str) {
            this._templateTags[tag] = str;
        },

        getTags: function () {
            return this._templateTags;
        },

        getTag: function (tag) {
            return this._templateTags[tag];
        },

        setTemplate: function ( /* String */ str) {
            this._template.raw = str;
        },

        getTemplate: function () {
            return this._template.raw || '<b>No template loaded</b>';
        },

        parseOperators: function () {
            var key, operator;

            for (key in this._templateOperators) {
                if (this._templateOperators.hasOwnProperty(key)) {
                    operator = this._templateOperators[key];
                    if (typeof operator[0] === 'string') {
                        this.addOperator(key, operator[0], operator[1]);
                    }
                }
            }
        },

        getOperators: function () {
            if (!this._operatorsParsed) {
                this.parseOperators();
            }
            return this._templateOperators;
        },

        addOperator: function ( /* String */ name, /* || String */ regexp, /* Function || String */ fn) {

            // This will be part of a str.replace method
            // So the arguments should match those that you would use
            // for the .replace method on strings.
            if (typeOf(regexp) === 'string') {
                regexp = new RegExp(this.getTag('open') + regexp + this.getTag('close'), 'g');
            }
            this._templateOperators[name] = [regexp, fn];
        },



        compile: function ( /* Object */ data) {
            data = data || this._context;
            var open = this.getTag('open'),
                close = this.getTag('close'),
                operators = this.getOperators(),
                key, body, head = 'var p=[],print=function(){p.push.apply(p,arguments);};',
                wrapper = ["with(__o){p.push('", "');}return p.join('');"],
                compiled = null,
                template = this.getTemplate(),
                inner = (!template) ? "<b>No template</b>" : template.replace(/[\r\t\n]/g, " ");

            // A rather ugly way to append a child's module node to a parent template.
            // todo: break out into plugins
            //.replace(/\t=\$this.getChild\('(.*?)'\)%>/g,"','<span id=\"'+ $this.getChild(\"$1\").get(\"id\") +'\"></span>','")
            // This will loop through all the opperators
            // and use the return values to build a function body
            // syntax will look like this:
            //        <h1><%= something %></h1>
            //        <h1><%- something %></h1>
            for (key in operators) {
                if (operators.hasOwnProperty(key)) {
                    inner = inner.replace(operators[key][0], operators[key][1]);
                }
            }

            // This method will evaluate in the template.
            inner = inner.replace(new RegExp(open + '([\\s\\S]+?)' + close, 'g'), function (match, code) {
                return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + ";p.push('";
            });

            // Close off the template string.
            inner = inner.split("\t").join("');").split("\r").join("\\'");

            try {
                body = head + wrapper.join(inner);
                compiled = new Function('__o', head + wrapper.join(inner));
            } catch (ex) {
                console.error(ex);
                throw new Error('Syntax error in template: function body :: ' + body);
            }
            return compiled(data);
        }
    });

    /* Alias */

    return BlocksTemplateMixin;
});