'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css'); //压缩css
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var fs = require('fs');
var swig = require('gulp-swig');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');
var moment = require("moment");

var config = {
    output: "output",
    vendor: "LN",
    srcName: 'LabelPrint',
    vendorOutput: function () {
        return this.output + '/' + this.vendor;
    },
    destName: function () {
        return this.vendor + '_' + this.srcName;
    },
    printPage: function () {
        return this.destName() + '.html';
    },
    printFile: function () {
        return this.destName() + '.js';
    }
};

var env = {
    title : '重庆理念@云南移动资源系统',
    version: '4.3.' + moment().format('YYMMDD'),
    date: moment().format('YYYY-MM-DD'),
    vender: config.vendor,
    client : "10086",
    // client : "10000",
    // client : "10010",
    destName: config.destName(),
    DEBUG : true
};

/**
 * debug模式只进行相关文件的合并输出，并不进行代码压缩；
 */
gulp.task('debug', function (callback) {
    env.DEBUG = true;
    runSequence('clean', ['html', 'less', 'js', 'copy', 'watch'], 'connect', callback);
});

/**
 * RELEASE模式需要进行代码的合并压缩处理；
 */
gulp.task('release', function (callback) {
    env.DEBUG = false;
    runSequence('clean', ['html', 'less', 'js', 'copy'], 'zip', callback);
});

gulp.task('clean', function (cb) {
    return del([config.output + '/**/*'], cb);
});

gulp.task('default', ['html', 'less', 'js']);

gulp.task('html', function () {
    // index
    gulp.src('src/pages/index.html')
        .pipe(swig({
            defaults: {cache: false},
            data: env
        }))
        .pipe(gulp.dest(config.output))
        .pipe(connect.reload());

    // printPage
    return gulp.src('src/pages/LabelPrint.html')
        .pipe(swig({
            defaults: {cache: false},
            data: env
        }))
        .pipe(rename(config.printPage()))
        .pipe(gulp.dest(config.vendorOutput()))
        .pipe(connect.reload());
});
gulp.task('less', function () {
    if (env.DEBUG){
        return gulp.src('src/less/LabelPrint.less')
            .pipe(less())
            .pipe(gulp.dest(config.vendorOutput()))
            .pipe(connect.reload());
    } else {
        return gulp.src('src/less/LabelPrint.less')
            .pipe(less())
            .pipe(minifycss())
            .pipe(gulp.dest(config.vendorOutput()))
            .pipe(connect.reload());
    }
});
gulp.task('js', function () {
    generateConfigFile();
    // 在一个基础的 task 中创建一个 browserify 实例
    var b = browserify({
        // entries: './src/scripts/LabelPrint.js',
        entries: './src/index.js',
        debug: env.DEBUG
    });

    if (env.DEBUG) {
        return b.bundle()
            .pipe(source(config.printFile()))
            .pipe(buffer())
            // 在这里将转换任务加入管道
            .on('error', gutil.log)
            .pipe(gulp.dest(config.vendorOutput()))
            .pipe(connect.reload());
    } else {
        return b.bundle()
            .pipe(source(config.printFile()))
            .pipe(buffer())
            // 在这里将转换任务加入管道
            .pipe(uglify())
            .on('error', gutil.log)
            .pipe(gulp.dest(config.vendorOutput()))
            .pipe(connect.reload());
    }
});

gulp.task('connect', function () {
    connect.server({
        root:config.output,
        livereload: true
    });
});
gulp.task('watch', function () {
    gulp.watch('src/pages/*.html', ['html']);
    gulp.watch(['src/scripts/**/*.js', '!src/scripts/Config.js'], ['js']);
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch('src/index.js', ['js']);
});

/**
 * 复制类库、图片、字体、文档等不需要处理的文件；
 */
gulp.task('copy', function () {
    // fonts
    gulp.src('src/fonts/*.*')
        .pipe(gulp.dest(config.vendorOutput() + '/fonts'));

    // images
    gulp.src('src/Images/*.*')
        .pipe(gulp.dest(config.vendorOutput() + '/Images'));

    // 使用文档
    gulp.src('README.pdf')
        .pipe(rename('使用文档.pdf'))
        .pipe(gulp.dest(config.output));
    // 其他（驱动等）
    gulp.src('src/others/*.*')
        .pipe(gulp.dest(config.vendorOutput()));
    // 复制依赖的类库；
    if (env.DEBUG) {
        return gulp.src(['src/libs/*.js', '!src/libs/*.min.js'])
            .pipe(gulp.dest(config.vendorOutput()));
    } else {
        return gulp.src('src/libs/*.min.js')
            .pipe(gulp.dest(config.vendorOutput()));
    }
});

gulp.task('zip', function () {
    var timeStamp = moment().format("YYYY-MM-DD");
    return gulp.src(config.output + "/**/*")
        .pipe(zip(env.title + '标签打印机web接口-' + timeStamp + ".zip"))
        .pipe(gulp.dest('./'));
});

function generateConfigFile() {
    var text = 'module.exports = ' + JSON.stringify(env) + ';';

    console.log("正在生成Config文件...");
    fs.writeFile('src/scripts/Config.js', text, function (err) {
        if (err) {
            console.error(err);
            return false;
        }
        console.log("Config文件生成成功！");
        return true;
    });
}
