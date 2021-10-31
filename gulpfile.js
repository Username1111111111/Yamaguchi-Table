let project_folder = 'dist'; // Куда файлы билдить
let source_folder = '#src'; // Где сурсы

let path = {
  // Какая структура будет у сбилденной папки
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js',
    img: project_folder + '/img',
    fonts: project_folder + '/fonts',
  },
  // Какая структура у изначальной папки с исходником
  src: {
    html: source_folder + '/*.html',
    css: source_folder + '/css/style.scss',
    js: source_folder + '/script.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}', // Все изображения внутри папки, с расширениями
    // fonts: source_folder + '/fonts/*.ttf',
  },
  // Что отслеживать и конвертировать
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/css/**/*.scss',
    js: source_folder + '/script.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}', // Все изображения внутри папки, с расширениями
  },
  // Что будет очищаться при каждом билде
  clean: './' + project_folder + '/'
};

let { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  del = require('del'),
  scss = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),
  clean_css = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  imagemin = require('gulp-imagemin'),
  uglify = require('gulp-uglify-es').default


  
// BrowserSync
// File Include
// Del
// Sass
// Autoprefixer
// Group CSS media-queries
// Rename
// Clean CSS
// Uglify ES
// Babel
// Imagemin
// WEBP
// WEBP HTML
// WEBP CSS
// Fonter
// ttf2woff
// ttf2woff2
// SVG Sprite
  
// npm i --save-dev browser-sync                    Livereload
// npm i --save-dev gulp-file-include               Модульность
// npm i --save-dev del                             Очищать папки после билда
// npm i --save-dev gulp-sass                       Конвертирует в CSS
// npm i --save-dev sass                            Без движка работать не будет
// npm i --save-dev gulp-autoprefixer               Дает норм префиксы
// npm i --save-dev gulp-group-css-media-queries    Группирует медиа запросы по красоте
// npm i --save-dev gulp-clean-css                  Минификация
// npm i --save-dev gulp-rename                     Позволяет переименовать файл, чтобы было 2 копии CSS
// npm i --save-dev gulp-uglify-es                  Минификация JS
// npm i --save-dev gulp-imagemin@7.1.0             Сжатие картинок

// npm i --save-dev gulp browser-sync gulp-file-include del gulp-sass sass gulp-autoprefixer gulp-group-css-media-queries gulp-clean-css gulp-rename gulp-uglify-es gulp-imagemin@7.1.0


function browserSync() {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/'
    },
    port: 3000,
    notify: false
  });
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude()) // Собрать файлы из частей
    .pipe(dest(path.build.html)) // Перемещение файла в папку билда
    .pipe(browsersync.stream());  // Перезагрузка браузера после изменений
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({ 
        outputStyle: 'expanded' 
      })
      .on('error', scss.logError)
    )
    .pipe(group_media()) 
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      cascade: true
    }))
    .pipe(dest(path.build.css)) // Выгрузка целого без минификации
    .pipe(clean_css()) // Минификация
    .pipe( rename({ 
      extname: '.min.css' 
    }))
    .pipe(dest(path.build.css)) // Выгрузка минифицированного
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude()) // Собрать файлы из частей
    .pipe(dest(path.build.js)) // Выгрузка целого без минификации
    .pipe(uglify())
    .pipe( rename({ 
      extname: '.min.js' 
    }))
    .pipe(dest(path.build.js))  // Выгрузка минифицированного
    .pipe(browsersync.stream());  // Перезагрузка браузера после изменений
}

function images() {
  return src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      interlaced: true,
      optimizationLevel: 3 // 0 - 7
    })) // Собрать файлы из частей
    .pipe(dest(path.build.img)) // Перемещение файла в папку билда
    .pipe(browsersync.stream());  // Перезагрузка браузера после изменений
}

// Функция слежки за изменениями в файлах + лайврелоад
function watchFiles() {
  // Следить за путем и при изменениях проделать функция html
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean() {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html, js, images));
// let build = gulp.series(clean, gulp.parallel(css, html, images));
let watch = gulp.parallel(build, watchFiles, browserSync);

// Подружить галп с новыми функциями
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;



