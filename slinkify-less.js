var through = require("through2");
var PluginError = require("gulp-util").PluginError;
var lessToJs = require("less-vars-to-js");
var replaceExtension = require('replace-ext');
var PLUGIN_NAME = "Slinkify LESS";

function isNumber(n) { return n.match(/^\d/); } 
function isBool(b) {return b=="true"|| b=="false"}
function isColor(c) {return c.match(/^rgba?\(/g) || c.match(/^#/gm) || c.match(/^hsl\(/gm) }
function isCSSVar(v) {return v.match(/^[-]+/gm)}
function isMisc(m) {return m.match(/^calc\(/gm)}

function checkIfString(value) {
	return !isNumber(value) && !isBool(value) && !isColor(value) && !isCSSVar(value) && !isMisc(value);
}

function transformLessToCSS(contents) {
  var cssContents=":root {\n";

	for (var key in contents) {
		if (contents.hasOwnProperty(key)) {
      var transformedKey="\t--"+key+": ";
      var value = contents[key];

      if(checkIfString(value)) {
        value = "'"+value+"'";
      }

      cssContents = cssContents + transformedKey + value+";\n";
		}
  }
  
  cssContents = cssContents+"}\n"

	return cssContents;
}

module.exports = function() {
	var transform = function(file, encoding, callback) {
		if (file.isNull()) {
			return callback(null, file);
    }
  

		if (file.isStream()) {
			this.emit(
				"error",
				new PluginError(
					PLUGIN_NAME,
					PLUGIN_NAME + ":Streams not supported!"
				)
			);
		}

		if (file.isBuffer()) {
			var contents = String(file.contents);
      contents = contents + contents;
    
			contents = lessToJs(contents, {resolveVariables: true, stripPrefix: true});

      contents = transformLessToCSS(contents);
    
      file.contents = new Buffer(contents);

      file.path = replaceExtension(file.path, '.css');
      return callback(null, file);
		}

    this.push(file);
    
		callback();
	};

	return through.obj(transform);
};
