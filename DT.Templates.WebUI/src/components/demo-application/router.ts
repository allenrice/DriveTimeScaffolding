// This module configures crossroads.js, a routing library. If you prefer, you
// can use any other routing library (or none at all) as Knockout is designed to
// compose cleanly with external libraries.
//
// You *don't* have to follow the pattern established here (each route entry
// specifies a 'page', which is a Knockout component) - there's nothing built into
// Knockout that requires or even knows about this technique. It's just one of
// many possible ways of setting up client-side routes.

import ko = require("knockout");
import crossroads = require("crossroads");
import hasher = require("hasher");

export = router;

module router {

    export interface RouteType {
        url: string;
        params: any;

    };

    // TODO: add a type for allRoutes
    export var allRoutes: RouteType[] = [
        {
            url: '',
            params: {
                pageComponent: 'home-page',
                pageName: 'Home Page'
            }
        },
        {
            url: 'glyphs',
            params: {
                pageComponent: 'glyph-dump',
                pageName: 'Glyphs'
            }
        },
        {
            url: 'sprites',
            params: {
                pageComponent: 'sprite-dump',
                pageName: 'Sprites'
            }
        },
        {
            url: 'demo',
            params: {
                pageComponent: 'demo-page',
                pageName: 'Demo Page'
            }
        },
        {
            url: 'references',
            params: {
                pageComponent: 'references-page',
                pageName: 'References / Documentation'
            }
        }
    ];

    // TODO: remove the any type here
    export var currentRoute = ko.observable<RouteType>(allRoutes[0]);

    // Register routes with crossroads.js
    ko.utils.arrayForEach(allRoutes, (route) => {
        crossroads.addRoute(route.url, (requestParams) => {
            currentRoute(<any>ko.utils.extend(requestParams, route.params));
        });
    });

    export var changeRoute = (hash: string) => {
        var why: any = hasher;
        why.setHash(hash);
    }
    // Activate crossroads
    function parseHash(newHash, oldHash) { crossroads.parse(newHash); }
    crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
    hasher.initialized.add(parseHash);
    hasher.changed.add(parseHash);
    hasher.init();
}
