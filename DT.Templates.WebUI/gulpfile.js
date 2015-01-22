/// <vs SolutionOpened='watch' />
// Node modules
var fs = require('fs'),
	vm = require('vm'),
	merge = require('deeply'),
	chalk = require('chalk'),
	es = require('event-stream'),
    sloc = require('sloc'),
    promise = require('promise'),
    rmrf = require('rimraf-glob');

// Gulp and plugins
var gulp = require('gulp'),
	rjs = require('gulp-requirejs-bundler'),
	concat = require('gulp-concat'),
	clean = require('gulp-clean'),
    replace = require('gulp-replace'),
	uglify = require('gulp-uglify'),
	htmlreplace = require('gulp-html-replace'),
	typescript = require('gulp-tsc'),
    minifyCSS = require('gulp-minify-css'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    gutil = require('gulp-util'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    order = require("gulp-order");

var config = {
    paths: {
        csproj: 'DT.Templates.WebUI.csproj',
        input: {
            ts: ['**/*.ts'],
            css: 'src/css/*.css',
            less: ['src/css/**/*.less', 'src/components/**/*.less'],
            // where to look for icon sets
            glyphSvg: 'src/glyphs/icon-sets/*',
            // where to look for the template file that generates glyph css files
            glyphTemplate: 'src/glyphs/template.css',
            spriteSource: 'src/sprites/sprite-sets/*'
        },
        output: {
            ts: './src',
            // for whatever reason, when we watch the ts files, we need a different path
            tsWhileWatching: './src',
            // all our concat'd css goes here
            css: 'css.css',
            // used when dest'ing the generated content
            glyphs: 'dist/fonts',
            // used when including the font on the page from within the generated CSS file
            glyphsFont: '/dist/fonts/',

            sprites: 'dist/sprites'
        }
    },
    typescriptOptions: {
        module: 'amd',
        sourcemap: true,
        outDir: 'DT.Templates.WebUI',
        emitError: false,
        tmpDir: '..\\' // this points to the parent directory of the current project
    },
    // TODO: This configuration option is not yet done, lets get it done asap
    // when set to true, ALL css will be concat'd, otherwise the glyph sets will have their own css files
    concatGlyphFontsWithAllCSS: false
}

var getFilesFromCsproj = function (regex) {

    var array = fs.readFileSync(config.paths.csproj).toString().split("\n"),
        files = [];

    for (i in array) {
        var result = array[i].match(regex);
        if (!result) { continue; }
        files.push(result[0].replace(/\"/gi, ""));
    }

    return files;
};

var getTsFilesFromCsproj = function () {
    return getFilesFromCsproj(/("(.+)[^d]\.ts")/gi);
};

var defaultCallback = function (callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
};

var onError = function(err) {
    gutil.beep();
    gutil.log(gutil.colors.underline(gutil.colors.red('ERROR:')) +
        ' ' + gutil.colors.cyan(err.plugin) + ' - ' + err.message);
};

// generate the tsc build task with emit turned on or off
var tscTaskGenerator = function (emitError) {

    return function () {

        config.typescriptOptions.emitError = emitError;

        return gulp.src(getTsFilesFromCsproj())
            .pipe(typescript(config.typescriptOptions))
            .pipe(gulp.dest(config.paths.output.ts));
    };
};

// the scaffolders use various comments (we call them hooks) to make sure its inserting lines of code into the right files, this task ensures the hooks are left in place
gulp.task('verify-scaffolding-hooks', function (cb) {

    var promises = [],
        filesToVerify = [
            {
                path: 'src/app/startup.ts',
                scaffoldingHook: "// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]"
            },
            {
                path: 'gulpfile.js',
                scaffoldingHook: "// [Scaffoslded component using runtime injection will be inserted here. To retain this feature, DO NOT REMOVE THIS COMMENT.]"
            },
            {
                path: 'src/test/all-tests.ts',
                scaffoldingHook: "// [Scaffolded custom binding handler unit test amd-dependencies will be inserted here. DO NOT ALTER OR REMOVE THIS COMMENT.]"
            },
            {
                path: 'src/customBindingHandlers.d.ts',
                scaffoldingHook: "// [Scaffolding hook: all scaffolded custom binding handlers go here.  DO NOT REMOVE THIS COMMENT ]"
            },
            {
                path: 'src/css/all-components.less',
                scaffoldingHook: "// [Scaffolded components using LESS will be imported here. DO NOT REMOVE THIS COMMENT.]"
            }
        ];


    for (var i = 0; i < filesToVerify.length; i++) {
        (function (fileToVerify) {
            promises.push(new promise(function (resolve, reject) {
                fs.readFile(fileToVerify.path, null, function (err, data) {
                    resolve((err || data.toString().indexOf(fileToVerify.scaffoldingHook) === -1) ? 
                        fileToVerify : 
                        null);
                });
            }));
        })(filesToVerify[i]);
    }

    promise.all(promises).then(function (results) {
        for (var i = 0; i < results.length; i++) {
            if (!results[i]) { continue; }
            var err = "ERROR: Scaffolding 'hook' has been removed, please replace the scaffolding hook in: " + results[i].path + ", expected to find string: \"" + results[i].scaffoldingHook + "\"";
            console.error(err);
            throw err;
        }
        cb();
    });
});


// as part of the TypeScript compilation process, these temp files can accumulate, this is to remove them.
gulp.task('clean-tsc', function (cb) {
    rmrf('**/.gulp-tsc-tmp-args-*.ts', function (error) {
        cb();
    });
});

gulp.task('clean-css', function (cb) {
    return gulp.src(['dist/css.css', 'dist/pre-css.css']).pipe(clean());
});



// Compile all .ts files, producing .js and source map files alongside them.  The difference here is that one will emit errors and the other will not.  
// the no-emit is used by the "watch" task because an emitted error will break the watch command and the user will have to restart it
gulp.task('ts-no-emit', ['clean-tsc'], tscTaskGenerator(false));
gulp.task('ts-emit', ['clean-tsc'], tscTaskGenerator(true));

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', ['ts-emit'], function () {

    var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/require.config.js') + '; require;');
    var requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'dist/scripts.js',
        baseUrl: './src',
        name: 'app/startup',
        insertRequire: ['app/startup'],
        paths: {
            requireLib: 'bower_modules/requirejs/require'
        },
        include: [
            'requireLib',
            'jquery',
			// Note: any "dynamically" linked components, i.e. any runtime amd dependency, will need to be added here so that it is included
            // in the generated bundle 
            // [Scaffolded component using runtime injection will be inserted here. To retain this feature, DO NOT REMOVE THIS COMMENT.]
            'components/sprite-dump/sprite-dump',
            'components/references-page/references-page',
            'components/demo-page/demo-page',
            'components/home-page/home-page',
            'components/demo-application/demo-application',
            'components/glyph-dump/glyph-dump'
        ],
        bundles: {

            // Since most components are registered at runtime, you have the option of putting them (and any other runtime dependency) into a bundle.
            // Just remove the modules from the include section, and move them to a bundle below.  The next time those amd modules are require'd, 
            // requireJS will fetch your bundle instead of pulling that module from the bundle (since it wont be there when you remove it from above)

            // An example with 1 module, this is most common
            //'dist/demo-bundle': [ 'components/demo-page/demo-page' ]

            // An example with 2 modules
            //'dist/demo-and-glyph-bundle': ['components/glyph-dump/glyph-dump', 'components/demo-page/demo-page'],

            // IMPORTANT NOTE: If you add any amd modules to a bundle, make sure to remove it from the include section
        }
    });

    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./'));
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', ['clean-css'], function () {

    var bowerCss = gulp
            .src('src/bower_modules/components-bootstrap/css/bootstrap.min.css')
            .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),

        appLess = gulp.src(["src/css/styles.less"]).pipe(less());

    var combinedCss = es.concat(bowerCss, appLess)
            .pipe(order([
                "src/bower_modules/components-bootstrap/css/bootstrap.min.css",
                "src/css/styles.less"]));

    return combinedCss
        .pipe(concat('pre-' + config.paths.output.css))
        .pipe(gulp.dest('./dist/'));
});

// NOTE: not yet used
gulp.task('concat-remaining-css-blocks', ['css', 'glyphs', 'sprites'], function () {

    return gulp
        .src('./dist/**/*.css')
        .pipe(concat('css.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./dist/'));
});

// Removes all files from ./dist/, and the .js/.js.map files compiled from .ts
gulp.task('clean-dist', function() {
    var distContents = gulp.src('./dist/**/*', { read: false }),
        generatedJs = gulp.src(['src/**/*.js', 'src/**/*.js.map', 'test/**/*.js', 'test/**/*.js.map'], { read: false })
            .pipe(es.mapSync(function(data) {
                // Include only the .js/.js.map files that correspond to a .ts file
                return fs.existsSync(data.path.replace(/\.js(\.map)?$/, '.ts')) ? data : undefined;
            }));
    return es.merge(distContents, generatedJs).pipe(clean());
});


gulp.task('watch-ts-and-css', ['ts-no-emit', 'concat-remaining-css-blocks'], function () {

    // FIXME: we really need to get per-file compilation setup, but right now we're having problems with this and unit tests, so i've set it to run all the tests
    watch({ glob: [config.paths.input.ts, '**/*.csproj'], emitOnGlob: false, passThrough: false, name: 'TypeScript' }, ['ts-no-emit']);

    watch({ glob: [config.paths.input.css, config.paths.input.less, '**/*.csproj'], emitOnGlob: false, passThrough: false, name: 'Css' }, ['concat-remaining-css-blocks']);

});


gulp.task('glyphs', function () {

    // load some folder with some subfolders inside
    return gulp
        .src(config.paths.input.glyphSvg)
        .pipe(es.map(function (data, cb) {

            if (!data.isDirectory()) {
                cb(null, data);
            }

            var path = data.path,
                dirArr = path.split('\\'),
                folderName = dirArr[dirArr.length - 1];

            console.log('Generating glyphs for folder: ', folderName);

            gulp.src(path + '/*.svg')
                .pipe(iconfontCss({
                    fontName: folderName,
                    path: config.paths.input.glyphTemplate,
                    targetPath: '../fonts/glyphs-' + folderName + '.css', // these are relative to the dest below
                    fontPath: config.paths.output.glyphsFont
                }))
                .pipe(iconfont({
                    fontName: folderName,
                    normalize: true,
                    fontHeight: 50,
                    appendCodepoints: true // recommended option
                }))
                .pipe(gulp.dest(config.paths.output.glyphs)) // targetPath above is relative to this
                .on('end', cb);
        }));
    // we should see all the file paths printed in the terminal
});


gulp.task('sprites', function () {

    // Note: there are tons of configuration options for this here: https://github.com/twolfson/gulp.spritesmith
    return gulp
        .src(config.paths.input.spriteSource)
        .pipe(es.map(function (data, cb) {

            if (!data.isDirectory()) {
                cb(null, data);
            }

            var path = data.path,
                dirArr = path.split('\\'),
                folderName = dirArr[dirArr.length - 1];

            console.log('Generating sprites for folder: ', folderName);

            gulp.src(path + '/*.*')
                .pipe(spritesmith({
                    padding: 2,
                    imgName: 'sprite-' + folderName + '.png',
                    cssName: 'sprite-' + folderName + '.css',
                    cssTemplate: 'src/sprites/template.mustache',
                    cssVarMap: function (sprite) {
                        sprite.name = folderName + '-' + sprite.name;
                    }
                }))
                .pipe(gulp.dest(config.paths.output.sprites))
                .on('end', cb);
        }));
    // we should see all the file paths printed in the terminal
});

// Have additional copy tasks that you want to run in parallel to copy-task-1?  Add them to the array being passed to this task
gulp.task('copy-extra-files-to-dist', ['copy-task-1'], function (callback) { callback(); });

gulp.task('copy-task-1', function (cb) {

    // anything that isnt js or css related, put here.  
    var filesToMove = [];

    if (filesToMove.length === 0) {
        cb();
        return;
    }

    return gulp.src(filesToMove, { read: false })
        .pipe(gulp.dest('./dist/'));
});

// TODO: add more copy tasks if you need to copy diff files to diff destinations, so it can be done in parallel



// these are the "public" gulp tasks / configurations

gulp.task('Debug', ['css', 'ts-emit', 'glyphs', 'sprites', 'concat-remaining-css-blocks', 'verify-scaffolding-hooks'], defaultCallback);

gulp.task('Release', ['js', 'css', 'glyphs', 'sprites', 'concat-remaining-css-blocks', 'copy-extra-files-to-dist', 'verify-scaffolding-hooks'], defaultCallback);

gulp.task('default', ['Debug'], defaultCallback);

// does nothing, its just here for the force-restore-packages.bat file
gulp.task('restore', [], defaultCallback);

// this task is run by msbuild on clean
gulp.task('clean', ['clean-dist', 'clean-tsc'], defaultCallback);

// this task is run by Task Runner Explorer when the solution is opened
gulp.task('watch', ['watch-ts-and-css'], defaultCallback); // TODO: add watches for glyphs and sprites

gulp.task('Dev', ['Debug'], defaultCallback);

gulp.task('Test', ['Release'], defaultCallback);

gulp.task('Prod', ['Release'], defaultCallback);

