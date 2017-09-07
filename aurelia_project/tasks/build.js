import gulp from 'gulp';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import makeDistribution from './make-distribution';
import copyFiles from './copy-files';
import {build} from 'aurelia-cli';
import project from '../aurelia.json';

export default gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processMarkup,
    processCSS,
    copyFiles
  ),
  writeBundles,
  makeDistribution
);

function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}
