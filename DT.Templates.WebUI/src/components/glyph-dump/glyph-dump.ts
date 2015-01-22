
// This amd-dependency is required because the require line below does not correctly add the amd dependency.  This is a problem with the typescript compiler
/// <amd-dependency path="text!./glyph-dump-html.html" />

// required to get the runtime call to require to work
/// <reference path="../../require.d.ts" />

import ko = require("knockout");

export var template: string = require("text!./glyph-dump-html.html");

export class ViewModel {

    public glyphSelectors: KnockoutObservableArray<string> = ko.observableArray([]);

    public glyphGroupsArray: KnockoutObservableArray<string> = ko.observableArray([]);
    public glyphGroups: KnockoutObservable<{ [iconSet: string]: string[] }> = ko.observable(<any>{});

    constructor() {

        var styleSheets = document.styleSheets;
        if (styleSheets.length > 0) {
            for (var i = 0; i < styleSheets.length; i++) {
                var styleSheet: any = styleSheets[i];
                if ('cssRules' in styleSheet) {
                    try {
                        var rules = styleSheet.cssRules;
                        if (rules != null && rules.length > 0) {
                            for (var j = 0; j < rules.length; j++) {
                                if (rules[j].selectorText != null) {
                                    var selector = rules[j].selectorText.match('^\.(glyph-[^:]*):');
                                    if (selector != null && selector.length > 0) {

                                        var iconSet = selector[1].split("-")[1],
                                            groups = this.glyphGroups();

                                        // add this set to the dictionary if its not already there
                                        if (!groups[iconSet]) {
                                            groups[iconSet] = [];
                                            this.glyphGroupsArray.push(iconSet);
                                        }

                                        // add this to the list of selectors for this set
                                        groups[iconSet].push(selector[1]);

                                        this.glyphGroups(groups);

                                        // we found a glyph! or something else that starts with .icon-
                                        this.glyphSelectors.push("glyph " + selector[1]);
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        //probably a security error on FF ignore it
                    }
                }
            }
        }

    }
}

// knockout expects a lowercase viewModel and not our standard way of doing classes with an uppercase first letter, so here we're exporting it as "viewModel"
export var viewModel = ViewModel;
