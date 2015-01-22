declare var __karma__: any;


var tests = [];
tests.push('test/all-tests');

// Previously, the karma spec runner used this method for determing which tests to run, now we're going to just use all-tests so we can have the same config for karma and the browser
//for (var file in __karma__.files) {
//    if (__karma__.files.hasOwnProperty(file)) {
//        if (/test\/components\/.*\.js$/.test(file)) {
//            tests.push(file);
//        }
//    }
//}

requirejs.config({
    baseUrl: '/base/src',
    deps: tests,
    callback: __karma__.start
});
