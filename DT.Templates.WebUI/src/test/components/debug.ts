/// <reference path="../../jasmine.d.ts" />

import target = require("components/debug/debug");

var ViewModel = target.viewModel;

describe('debug component', () => {
    it('should not fail to instanciate', () => {
		var instance = new ViewModel( { data: "Some Value" });
    });
});

var something: target.viewModel  = null;