(function () {
	// Resolve all AMD modules relative to the 'src' directory, to produce the
	// same behavior that occurs at runtime, since we're currently in /src/test, the path to /src is ../
    require.baseUrl = '../';

	// It's not obvious, but this is a way of making Jasmine load and run in an AMD environment
	// Credit: http://stackoverflow.com/a/20851265
	var jasminePath = 'test/bower_modules/jasmine/lib/jasmine-core/';
	require.paths['jasmine'] = jasminePath + 'jasmine';
	require.paths['jasmine-html'] = jasminePath + 'jasmine-html';
	require.paths['jasmine-boot'] = jasminePath + 'boot';
	require.shim['jasmine'] = { exports: 'window.jasmineRequire' };
	require.shim['jasmine-html'] = { deps: ['jasmine'], exports: 'window.jasmineRequire' };
	require.shim['jasmine-boot'] = { deps: ['jasmine', 'jasmine-html'], exports: 'window.jasmineRequire' };

    // Note: We shouldn't really need to add anything here, now that we're hosting tests in /src/test instead of /test.  If you absolutely need to correct a path, make sure in your require statement, that you dont start it with src and try it again
})();
