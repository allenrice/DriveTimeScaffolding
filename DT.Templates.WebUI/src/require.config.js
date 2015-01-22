// require.js looks for the following global when initializing
var require = {
	baseUrl: "/src",
	paths: {
            "bootstrap":                                "bower_modules/components-bootstrap/js/bootstrap.min",
            "knockout":                                 "bower_modules/knockout/dist/knockout",
            "knockout-projections":                     "bower_modules/knockout-projections/dist/knockout-projections",
            "knockout-postbox":                         "bower_modules/knockout-postbox/build/knockout-postbox.min",
            "knockout.punches":                         "bower_modules/knockout.punches/knockout.punches.min",
            "knockout-validation":                      "bower_modules/knockout-validation/Dist/knockout.validation.min",
            "signals":                                  "bower_modules/js-signals/dist/signals.min",
            "text":                                     "bower_modules/requirejs-text/text",
            "crossroads":                               "bower_modules/crossroads/dist/crossroads.min",
            "hasher":                                   "bower_modules/hasher/dist/js/hasher.min",
            "jquery":                                   "bower_modules/jquery/dist/jquery",
            "jqueryui":                                 "bower_modules/jquery-ui/ui/minified/jquery-ui.min",
            "moment":                                   "bower_modules/moment/min/moment-with-locales.min"
            
	},
	shim: {

            "bootstrap": { deps: ["jquery"] },

            "jqueryui": { deps: ["jquery"] },

            // knockout explicitly needs jquery as a dependency, otherwise there will be some unpredictable behaviors.  This is 
            // due to the fact that ko checks to see if jquery is defined prior to utilizing its own parsing, dom
            // interactions, etc.  It only does this check at startup time, so jquery needs to be there then.  If this dependency
            // is not explicitly defined, sometimes jquery will load first, and sometimes not.
            "knockout": { deps: ["jquery"] },

            "knockout-postbox": { deps: ["knockout"] },

            "knockout.punches": { deps: ["knockout"] },

            "knockout-projections": { deps: ["knockout"] },

            "knockout-validation": { deps: ["knockout"] },
	}
};
