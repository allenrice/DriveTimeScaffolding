
// This amd-dependency is required because the require line below does not corr`ectly add the amd dependency.  This is a problem with the typescript compiler
/// <amd-dependency path="text!./demo-application-html.html" />
/// <amd-dependency path="bootstrap" />

// required to get the runtime call to require to work
/// <reference path="../../require.d.ts" />
/// <reference path="../../TypeLite.Net4.d.ts" />


import ko = require("knockout");

import router = require("./router");

export var template: string = require("text!./demo-application-html.html");

export class viewModel {


    /** do-nothing observable */
    appName: KnockoutObservable<string> = ko.observable("DT.Templates.WebUI");

    /** keeps track of what the current route is */
    route: KnockoutObservable<router.RouteType> = router.currentRoute;

    /** list of available routes */
    allRoutes: KnockoutObservableArray<router.RouteType> = ko.observableArray(router.allRoutes);  

    currentPageName = ko.pureComputed(() => {
        var r = this.route();

        if (!r) {
            return null;
        }
        return r.params.pageName;
    });

    currentPageComponent = ko.pureComputed(() => {
        var r = this.route();

        if (!r) {
            return null;
        }
        return r.params.pageComponent;
    });

    /** showing an example of having a complex type from C# in your KO VM */
    exampleData: DT.Templates.WebUI.Models.TypeLiteDemoClass;

    constructor(params: { data: DT.Templates.WebUI.Models.TypeLiteDemoClass }) {

        this.exampleData = params.data;
        
        //Note: we wouldnt normally put something on the window scope, but this is here for convenience and demo purposes
        window["vm"] = this;
    }
}