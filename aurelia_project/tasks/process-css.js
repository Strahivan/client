import gulp from 'gulp';
import sass from 'gulp-sass';
import project from '../aurelia.json';
import {build} from 'aurelia-cli';
import * as sourcemaps from 'gulp-sourcemaps';

export default function processCSS() {
  return gulp.src(project.cssProcessor.source)
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(build.bundle());
}
