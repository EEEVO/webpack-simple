// 读取webpack配置文件

const options = require("./webpack.config");
const Webpack = require("./lib/webpack");

new Webpack(options).run();
