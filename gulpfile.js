const {parallel, src, dest} = require("gulp");


// Project bundles

function bundleJs(cb) {
    let sourceMap = require("gulp-sourcemaps");
    let minify = require("gulp-minify");

    return src(`${__dirname}/src/js/*.js`)
           .pipe(sourceMap.init())
           .pipe(minify({
               ext: {
                   min: ".min.js"
               },
               noSource: true
           }))
           .pipe(sourceMap.write("./"))
           .pipe(dest(`${__dirname}/dist/js`));
}

function bundleScss(cb) {
    let sourceMap = require("gulp-sourcemaps");
    let sass = require("gulp-sass");
    sass.compiler = require("node-sass");
    let cleanCss = require("gulp-clean-css");
    let rename = require("gulp-rename");

    return src("src/scss/*.scss")
            .pipe(sourceMap.init())
            .pipe(sass().on("error", sass.logError))
            .pipe(cleanCss())
            .pipe(rename({suffix: ".min"}))
            .pipe(sourceMap.write("./"))
            .pipe(dest(`${__dirname}/dist/css`));
}

function compileHaml(cb) {
    let hamlLang = require("gulp-haml");

    return src("src/haml/*.haml")
            .pipe(hamlLang())
            .pipe(dest(`${__dirname}/dist`));
}


// Project dependencies

function bootstrap() {
    return {

        bCss: function(cb) {
            return src("node_modules/bootstrap/dist/css/bootstrap.min.css*")
                .pipe(dest(`${__dirname}/dist/css`));
        },

        bJs: function(cb) {
            return src("node_modules/bootstrap/dist/js/bootstrap.bundle.min.js*")
                .pipe(dest(`${__dirname}/dist/js`));
        },

        pJs: function(cb) {
            return src("node_modules/popper.js/dist/umd/popper.min.js*")
                .pipe(dest(`${__dirname}/dist/js`));
        },

        jqJs: function(cb) {
            return src("node_modules/jquery/dist/jquery.min*")
                .pipe(dest(`${__dirname}/dist/js`));
        }

    }
}


exports.default = parallel(

    // Project bundling
    bundleJs, bundleScss, compileHaml,

    // Dependencies
    bootstrap().bJs,
    bootstrap().bCss,

    bootstrap().jqJs,

    bootstrap().pJs

);
