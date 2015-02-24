var gulp = require('gulp');
var config = require('../config').html;

gulp.task('html', function() {
	var copy = function(path) {
		gulp.src(path)
			.pipe(gulp.dest(config.dest));
	};

	if (Array.isArray(config.src)) {
		config.src.forEach(function(path) {
			copy(path)
		})
	} else {
		return copy(config.src);
	}
});
