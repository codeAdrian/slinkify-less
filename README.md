
# Installation
```
npm install --save-dev https://github.com/codeAdrian/slinkify-less/archive/v0.2.0.tar.gz
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