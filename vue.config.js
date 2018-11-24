const path = require('path');
const glob = require('glob');

// 存放build结果的文件夹
const DIST_ROOT = 'dist';
// 项目部署在服务器里的绝对路径，默认'/'
const BASE_URL = './';

function getEntry(globPath) {
    let entries = {};
    let basename;
    let tmp;
    let pathname;
    glob.sync(globPath).forEach((entry) => {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        pathname = basename; // 正确输出js和html的路径
        entries[pathname] = {
            entry: 'src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[1] + '.js',
            template: 'src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[2],
            title: tmp[2],
            filename: tmp[2],
        };
    });
    return entries;
}

let pages = getEntry('./src/pages/**?/*.html');
console.log(pages);

module.exports = {
    outputDir: DIST_ROOT,
    baseUrl: process.env.NODE_ENV === 'production' ? BASE_URL : '/',
    lintOnSave: false, //禁用eslint
    productionSourceMap: false, // 关闭SourceMap
    pages,
    devServer: {
        index: 'index.html', //默认启动serve 打开index页面
        open: process.platform === 'darwin',
        host: '',
        port: 8080,
        https: false,
        hotOnly: false,
    },
    // css相关配置
    css: {
        extract: true, // 是否使用css分离插件 ExtractTextPlugin
        sourceMap: false, // 关闭CSS source maps
        // css预设器配置项
        loaderOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
        modules: false, // 启用 CSS modules for all css / pre-processor files.
    },
    // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    parallel: require('os').cpus().length > 1,
    chainWebpack: (config) => {
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap((options) => {
                // 修改它的选项...
                options.limit = 100;
                return options;
            });
        Object.keys(pages).forEach((entryName) => {
            config.plugins.delete(`prefetch-${entryName}`);
        });
        if (process.env.NODE_ENV === 'production') {
            config.plugin('extract-css').tap(() => [
                {
                    path: path.join(__dirname, './dist'),
                    filename: 'css/[name].[contenthash:8].css',
                },
            ]);
        }
    },
    // configureWebpack: (config) => {
    //     if (process.env.NODE_ENV === 'production') {
    //         config.output = {
    //             path: path.join(__dirname, './dist'),
    //             filename: 'js/[name].[contenthash:8].js',
    //         };
    //     }
    // },
};
