const {
    override,
    fixBabelImports,
    addLessLoader,
    disableEsLint,
    overrideDevServer,
    watchAll,
} = require("customize-cra");

const path = require('path');
const resolve = dir => path.join(__dirname, dir);
const FileManagerPlugin = require('filemanager-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const productionGzipExtensions = ['js', 'css', 'html'];
const isProduction = process.env.NODE_ENV === 'production';
const pjson = require('./package.json');
const outputDir = './build/' + pjson.name + "-" + process.env.REACT_APP_ENV + "-" + pjson.version;


process.env.PORT = 8807;
process.env.BROWSER = 'none';
process.env.GENERATE_SOURCEMAP = !isProduction;

const rewiredMap = () => config => {
    const paths = require('react-scripts/config/paths');
    paths.appBuild = resolve(outputDir);
    config.output.path = resolve(outputDir);
    config.output.publicPath = isProduction ? '/' : '/';
    const plugins = [
        new SimpleProgressWebpackPlugin(),
        new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8
        }),
        new HardSourceWebpackPlugin(),
        // new BundleAnalyzerPlugin(),
    ];
    if (process.env.IS_BUILD) {
        plugins.push(new FileManagerPlugin({
            onEnd: {
                delete: [`./${outputDir}.zip`],
                archive: [
                    {source: `./${outputDir}`, destination: `./${outputDir}.zip`},
                ]
            }
        }))
    }
    config.plugins.push(...plugins);

    return config
};

module.exports = {
    webpack: override(
        fixBabelImports('import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true,
        }),
        fixBabelImports("lodash", {
            libraryDirectory: "",
            camel2DashComponentName: false
        }),
        addLessLoader({
            javascriptEnabled: true,
            modifyVars: {
                '@font-size-sm': '12px',
                '@font-size-base': '12px',
                '@primary-color': '#0070cc',
                '@border-radius-base': '0',
                '@border-radius-sm': '0',
                '@text-color': '#3f3f3f',
                '@text-color-secondary': '#3F3F3F',
                '@background-color-base': 'hsv(0, 0, 96%)',
                '@success-color': '#52c41a',
                '@error-color': '#f5222d',
                '@warning-color': '#faad14',
                '@info-color': '@primary-color',
                '@danger-color': '@error-color',
                '@processing-color': '@primary-color',
                '@border-color-base': '#dedede',
                '@border-color-split': '#dedede',
                '@outline-width': '0',
                '@outline-color': '#737373',
                '@input-height-lg': '36px',
                '@input-height-base': '32px',
                '@input-height-sm': '24px',
                '@input-hover-border-color': '#737373',
                '@form-item-margin-bottom': '16px',
                '@btn-default-bg': '#fafafa',
                '@btn-default-border': '#dedede',
                '@btn-danger-color': '#fff',
                '@btn-danger-bg': '@error-color',
                '@btn-danger-border': '@error-color',
                '@switch-color': '@success-color',
                '@table-header-bg': '#fafafa',
                '@table-row-hover-bg': '#fafafa',
                '@table-padding-vertical': '8px',
                '@badge-color': '@error-color',
                '@breadcrumb-base-color': '@text-color',
                '@breadcrumb-last-item-color': '@text-color-secondary',
                '@slider-rail-background-color': '@background-color-base',
                '@slider-rail-background-color-hover': '#e1e1e1',
                '@slider-track-background-color': '@primary-color',
                '@slider-track-background-color-hover': '@primary-color',
                '@slider-handle-border-width': '1px',
                '@slider-handle-color': '#dedede',
                '@slider-handle-color-hover': '#dedede',
                '@slider-handle-color-focus': '#dedede',
                '@slider-handle-color-tooltip-open': '#ddd',
                '@slider-handle-color-focus-shadow': 'transparent',
                '@slider-handle-shadow': '1px 1px 4px 0 rgba(0,0,0,.13)',
                '@alert-success-border-color': '#dff4e5',
                '@alert-success-bg-color': '#dff4e5',
                '@alert-info-border-color': '#e5f3ff',
                '@alert-info-bg-color': '#e5f3ff',
                '@alert-error-border-color': '#fcebea',
                '@alert-error-bg-color': '#fcebea',
                '@alert-warning-border-color': '#fff7db',
                '@alert-warning-bg-color': '#fff7db',
                '@radio-button-bg': 'transparent',
                '@radio-button-checked-bg': 'transparent',
                '@progress-radius': '0',
                '@tabs-card-gutter': '-1px',
                '@tabs-card-tab-active-border-top': '2px solid @primary-color',
            }
        }),
        disableEsLint(),
        rewiredMap(),
    ),
    devServer: overrideDevServer(
        (devServerConfig) => {
            devServerConfig.proxy = {
                // '/jdpointsdm/api/*': {
                //     target: 'http://10.20.26.112/',
                //     changeOrigin: true
                // }
            };
            devServerConfig.contentBase = '/';
            return devServerConfig;
        },
        watchAll(),
    )
};
