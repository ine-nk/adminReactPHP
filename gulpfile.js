//  подгружаем галп из  библиотеки

const gulp = require('gulp')
const { map } = require('jquery')
const { sources } = require('webpack')
const webpack = require('webpack-stream')
const sass = require('gulp-sass')



const dist = 'D:/OSPanel/domains/AdminRP/admin/'
gulp.task('copy-html', () => {
  return gulp.src('./app/src/index.html')
    .pipe(gulp.dest(dist))
})

gulp.task('build-js', () => {
  return gulp.src('./app/src/main.js')
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'script.js'
      },
      watch: false,
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', {
                  debug: true, // включение отладки
                  corejs: 3,
                  useBuiltIns: "usage", // использование полифилов  в умном режиме

                }],
                  '@babel/react']
              }
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(dist))
});

gulp.task('build-sass', () => {
  return gulp.src('./app/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dist))
});

gulp.task('copy-api', () => {
  return gulp.src('./app/api/**/*.*')
    .pipe(gulp.dest(dist + 'api'))
});

gulp.task('copy-assets', () => {
  return gulp.src('./app/assets/**/*.*')
    .pipe(gulp.dest(dist + 'assets'))
});
//! эта задача наблюдает за имзменениями в файлах и каталогах
gulp.task('watch', () => {
  gulp.watch('./app/src/index.html', gulp.parallel('copy-html'));
  gulp.watch('./app/assets/**/*.*', gulp.parallel('copy-assets'));
  gulp.watch('./app/api/**/*.*', gulp.parallel('copy-api'));
  gulp.watch('./app/scss/**/*.scss', gulp.parallel('build-sass'));
  gulp.watch('./app/src/**/*.*', gulp.parallel('build-js'));
})

//! запуск начального создания и копирования файлов на сервер
gulp.task('build', gulp.parallel('copy-html', 'copy-assets', 'copy-api', 'build-sass', 'build-js'));

//! финальная задача - запускаем копирование и отслеживание: (сначала выполняется последняя запись потом предыдущая - 1. build 2. watch) в терминали набираем просто: gulp

gulp.task('default', gulp.parallel('watch', 'build'));

