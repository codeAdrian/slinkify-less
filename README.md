# About

Converts LESS variables to CSS variables.

# Created by

Adrian Bece (https://codeadrian.github.io/) and Filip Svetličić (https://inchoo.net/author/filip-svetlicic/profile/)

# Installation

```
npm install --save-dev https://github.com/codeAdrian/slinkify-less/archive/v[latest-version].tar.gz
```

# Use

```
var slinkifyLess = require("slinkify-less");

gulp.task("slinkify-less", function() {
	return gulp
		.src("src/less/*.less")
		.pipe(slinkifyLess())
		.pipe(gulp.dest("dest/"));
});
```
