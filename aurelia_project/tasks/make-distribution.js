import gulp from 'gulp';
import project from '../aurelia.json';

export default function makeDistribution(done) {
  let assets = project.paths.assets;

  assets.forEach(item => {
    gulp.src(item.src)
      .pipe(gulp.dest(item.dest));
  });

  done();
}
