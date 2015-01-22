
// This amd-dependency is required because the require line below does not correctly add the amd dependency.  This is a problem with the typescript compiler
/// <amd-dependency path="text!./home-page-html.html" />

// required to get the runtime call to require to work
/// <reference path="../../require.d.ts" />

import ko = require("knockout");

import demoApp = require("src/components/demo-application/demo-application");

export var template: string = require("text!./home-page-html.html");



export class ViewModel {

    /** showing an example of having a complex type from C# in your KO VM */
    exampleData: KnockoutObservable<DT.Templates.WebUI.Models.TypeLiteDemoClass> = ko.observable(null);

    constructor(params: demoApp.viewModel) {

        this.exampleData(params.exampleData);

    }
}