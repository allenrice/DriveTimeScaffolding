/// <reference path="../require.d.ts" />
module main {

    // all-tests will reference the other tests to run    
    var testModules = [
        'all-tests'
    ];

    // After the 'jasmine-boot' module creates the Jasmine environment, load all test modules then run them
    require(['jasmine-boot'], function () {
        require(testModules.map(m => 'test/' + m), window.onload);
    });
}
