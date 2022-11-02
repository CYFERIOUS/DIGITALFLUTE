
// Include gulp
var gulp = require('gulp');

// Include Our Plugins

const sass = require('gulp-sass')(require('sass'));

// Compile Our Sass
gulp.task('sass', () =>  {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});

gulp.task('sassIlustre',() => {
    return gulp.src('scss/ilustreDevices.scss')
        .pipe(sass())
        .pipe(gulp.dest('sessions/ilustre/ferchoFolio/css/'));
});

gulp.task('chinoPopo', () => {
    return gulp.src('scss/ilustreDevices.scss')
        .pipe(sass())
        .pipe(gulp.dest('sessions/ilustre/kamusFolio/css/'));
});

gulp.task('sassAcordion', () => {
    return gulp.src('scss/SpryAccordion.scss')
        .pipe(sass())
        .pipe(gulp.dest('SpryAssets'));
});


// Watch Files For Changes
gulp.task('watch', () => {
    gulp.watch('scss/*.scss','sessions/ilustre/ferchoFolio/scss/*.scss'['sass','sassAcordion','sassIlustre','chinoPopo']);
});

// Default Task
gulp.task('default', gulp.parallel( 'sass','watch','sassAcordion','sassIlustre','chinoPopo'));
