var through = require('through2');
var PluginError = require('gulp-util').PluginError;
var lessToJs = require('less-vars-to-js');
var replaceExtension = require('replace-ext');
var PLUGIN_NAME = 'Slinkify LESS';

var SPACING = generateSpaces(4);

function generateSpaces(x) {
    var str = '';
    for (var i = 0; i < x; i++) {
        str = ' ' + str;
    }
    return str;
}

function transformLessToCSS(contents) {
    var cssContents = ':root {\n';
    for (var key in contents) {
        if (contents.hasOwnProperty(key)) {
            var transformedKey = SPACING + '--' + key + ': ';
            var value = decodeQuotationChars(contents[key]);

            cssContents = cssContents + transformedKey + value + ';\n';
        }
    }
    cssContents = cssContents + '}\n';
    return cssContents;
}

function encodeQuotationChars(contents) {
    return (contents = contents.replace(/["|']/g, '{{"}}'));
}

function decodeQuotationChars(value) {
    return value.replace(/({{\"}})/g, '"');
}

module.exports = function() {
    var transform = function(file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            this.emit(
                'error',
                new PluginError(
                    PLUGIN_NAME,
                    PLUGIN_NAME + ':Streams not supported!'
                )
            );
        }

        if (file.isBuffer()) {
            var contents = String(file.contents);
            contents = contents + contents;

            contents = encodeQuotationChars(contents);

            contents = lessToJs(contents, {
                resolveVariables: true,
                stripPrefix: true
            });

            contents = transformLessToCSS(contents);

            file.contents = new Buffer.from(contents);
            file.path = replaceExtension(file.path, '.css');
            return callback(null, file);
        }

        this.push(file);

        callback();
    };

    return through.obj(transform);
};
