import webpack from 'webpack';
import webpackConfig from '../webpack.config.prod';
import colors from 'colors';
/*eslint-disable no-console */
process.env.NODE_ENV = 'production';

console.log(colors.blue('Generating minified bundle for production via Webpack...'));

webpack(webpackConfig).run((err, stats) => {
  if (err) {
    console.log(colors.red(err));
    return 1;
  }

  const jsonStats = stats.toJson();

  if (jsonStats.hasErrors) {
    return jsonStats.errors.map(error => console.log(colors.red(error)));
  }

  if (jsonStats.hasWarnings) {
    console.log(colors.yellow.bold('Webpack generated the following warnings: '));
    jsonStats.warnings.map(warning => console.log(colors.yellow(warning)));
  }

  console.log(`Webpack stats: ${stats}`);

  console.log(colors.green('App has been compiled in production mode and written to /dist.'));

  return 0;
});
