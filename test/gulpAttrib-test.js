describe('gulp-attrib', function() {
	var gulpAttrib;
	var rewire;
	var chai;
	var sinon;

	before(function() {
		rewire = require('rewire');
		gulpAttrib = rewire('../lib/gulpAttrib');
		chai = require('chai');
		sinon = require('sinon');
	});

	describe('gulpAttrib',function(){

	});

	describe('setOptions', function() {
		var fn;

		before(function() {
			fn = gulpAttrib.__get__('setOptions');
		});

		function assertAttributesContains(opts, str) {
			opts = fn(opts);
			chai.assert.include(opts.attributes, str);
		}

		it('should fail without opts passed', function() {
			chai.assert.throw(function() {
				fn();
			});
		});
		it('should return an object with properties attributes, dirs, and ignoreError', function() {
			var opts = fn({});
			chai.expect(opts).to.have.keys(['attributes', 'dirs', 'ignoreError']);
		});
		it('should return only \" in attrubutes if no properties in opts', function() {
			var opts = fn({});
			chai.assert.sameMembers(opts.attributes, ['"']);
		});
		it('should return only \" in dirs if no properties in opts', function() {
			var opts = fn({});
			chai.assert.sameMembers(opts.dirs, ['"']);
		});
		it('should put +r in attributes if readOnly === true', function() {
			assertAttributesContains({readOnly: true}, '+r');
		});
		it('should put -r in attributes if readOnly === false', function() {
			assertAttributesContains({readOnly: false}, '-r');
		});
		it('should put +a in attributes if archive === true', function() {
			assertAttributesContains({archive: true}, '+a');
		});
		it('should put -a in attributes if archive === false', function() {
			assertAttributesContains({archive: false}, '-a');
		});
		it('should put +s in attributes if system === true', function() {
			assertAttributesContains({system: true}, '+s');
		});
		it('should put -s in attributes if system === false', function() {
			assertAttributesContains({system: false}, '-s');
		});
		it('should put +h in attributes if hidden === true', function() {
			assertAttributesContains({hidden: true}, '+h');
		});
		it('should put -h in attributes if hidden === false', function() {
			assertAttributesContains({hidden: false}, '-h');
		});
		it('should put /s in dirs if subDirectories === true', function() {
			var opts = fn({subDirectories: true});
			chai.assert.include(opts.dirs, '/s');
		});
		it('should put /d in dirs if directories === true', function() {
			var opts = fn({directories: true});
			chai.assert.include(opts.dirs, '/d');
		});
		it('should set ignoreError to true if ignoreError === true', function() {
			var opts = fn({ignoreError: true});
			chai.assert.equal(opts.ignoreError, true);
		});
		it('should set ignoreError to false if ignoreError !== true', function() {
			var opts = fn({ignoreError: false});
			chai.assert.equal(opts.ignoreError, false);
			opts = fn({});
			chai.assert.equal(opts.ignoreError, false);
		});
	});
	describe('makeCmd', function() {
		var fn;

		before(function() {
			fn = gulpAttrib.__get__('makeCmd');
		});

		it('is not complicated enough for tests', function() {

		});
	});
	describe('checkAttr', function() {
		var fn;
		var execStub;
		var err;
		var stdout;
		var stderr;

		before(function() {
			fn = gulpAttrib.__get__('checkAttr');
			execStub = sinon.spy(function(cmd, cb) {
				cb(err, stdout, stderr);
			});
			gulpAttrib.__set__('exec',execStub);
		});

		beforeEach(function() {
			err = null;
			stdout = null;
			stderr = null;
			execStub.reset();
		});

		it('calls the callback with no parameters if no stderr', function() {
			var spy = sinon.spy();
			fn(spy);
			sinon.assert.calledOnce(execStub);
			sinon.assert.calledWith(spy);
		});
		it('calls the callback with stderr if stderr exists',function(){
			var spy = sinon.spy();
			stderr = 'err';
			fn(spy);
			sinon.assert.calledOnce(execStub);
			sinon.assert.calledWith(spy,'attrib not available');
		});
	});
});