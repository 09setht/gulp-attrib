var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var async = require('async');

var PLUGIN_NAME = 'gulp-attrib';

var gulpAttr = function(opts) {
	opts = opts || {};
	opts = setOptions(opts);

	return through.obj(function(file, enc, cb) {
		var self = this;
		var cmd = makeCmd(opts, file);

		async.waterfall([
			checkAttr,
			function(cb) {
				exec(cmd, cb);
			}
		], function(err, result, stderr) {
			if (err || stderr) {
				gutil.log(gutil.colors.red(err || stderr));
				gutil.log('Command: ' + gutil.colors.magenta(cmd));

				if (opts.ignoreError) {
					self.push(file);
				}
			}
			else {
				self.push(file);
			}
			cb();
		});
	});
};

var checkAttr = function(cb) {
	exec('attrib', function(err, stdout, stderr) {
		if (stderr) {
			cb('attrib not available');
		}
		else {
			cb();
		}
	});
};
var makeCmd = function(opts, file) {
	return 'attrib ' + opts.attributes.join(' ') + file.path + opts.dirs.join(' ');
};

var setOptions = function(opts) {
	var attributes = [];
	var dirs = [];
	if (opts.readOnly !== undefined) {
		attributes.push(
			(opts.readOnly ? '+' : '-') + 'r'
		);
	}
	if (opts.archive !== undefined) {
		attributes.push(
			(opts.archive ? '+' : '-') + 'a'
		);
	}
	if (opts.system !== undefined) {
		attributes.push(
			(opts.system ? '+' : '-') + 's'
		);
	}
	if (opts.hidden !== undefined) {
		attributes.push(
			(opts.hidden ? '+' : '-') + 'h'
		);
	}
	attributes.push('"');
	dirs.push('"');

	if (opts.subDirectories === true) {
		dirs.push('/s');
	}
	if (opts.directories === true) {
		dirs.push('/d');
	}

	return {
		attributes: attributes,
		dirs: dirs,
		ignoreError: opts.ignoreError === true
	};
};

module.exports = gulpAttr;
