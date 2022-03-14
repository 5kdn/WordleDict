path = require('path');
const dest_root = path.resolve(__dirname, '../serverside/app/templates')

module.exports = {
    html: {
        src: {
            entry: ['src/pug/**/*.pug'],
            ignore: ['!src/pug/**/_*']
        },
        dest: path.resolve(dest_root)
    },
    css: {
        src: {
            entry: ['src/scss/**/*.sass', 'src/scss/**/*.scss', `src/scss/**/*.css`],
            ignore: ['!src/scss/**/_*']
        },
        dest: path.resolve(dest_root, 'css/')
    },
    js: {
        src: {
            target: ['src/ts/**/*'],
            entry: {
                'main': path.resolve(__dirname, 'src/ts/main.ts'),
            },
        },
        dest: path.resolve(dest_root, 'js/')
    }
}
