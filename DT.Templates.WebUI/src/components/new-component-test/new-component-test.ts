
// This amd-dependency is required because the require line below does not correctly add the amd dependency.  This is a problem with the typescript compiler
/// <amd-dependency path="text!./new-component-test-html.html" />

// required to get the runtime call to require to work
/// <reference path="../../app/typings/requirejs/require.d.ts" />

import ko = require("knockout");

export var template: string = require("text!./new-component-test-html.html");

export class ViewModel {

	// TODO: Add additional viewmodel propeties here
	
    public greeting: KnockoutObservable<string>;

    constructor (params?: any /* : new-component-testArgs */) {
		this.greeting = params.data;
    }
}

// TODO: declare an interface for use in the constructor above
// export interface new-component-testArgs {
//	data: KnockoutObservable<string>;
// }
//


// knockout expects a lowercase viewModel and not our standard way of doing classes with an uppercase first letter, so here we're exporting it as "viewModel"
export var viewModel = ViewModel;
