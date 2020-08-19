const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");

module.exports = class Webpack {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
  }

  run() {
    this.parse(this.entry);
  }

  /**
   * 解析函数
   * @param {} entryFile
   */
  parse(entryFile) {
    // 1、分析入口模块内容
    const content = fs.readFileSync(entryFile, "utf-8");

    // 2、分析依赖项与依赖路径

    // 将内容通过parser转换成抽象语法树,便于分析
    const ast = parser.parse(content, {
      sourceType: "module",
    });

    // 提取具体语句
    const dependencies = {}; // 引入模块的路径
    traverse(ast, {
      // 从ast中处理import语句
      ImportDeclaration({ node }) {
        // 将原始路径转为src路径
        const newPathName = `./${path.join(
          path.dirname(entryFile),
          node.source.value
        )}`;
        dependencies[node.source.value] = newPathName;
      },
      // ExpressionStatement({ node }) {},
    });

    // 处理内容，加工抽象语法树
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });

    console.log(code);
  }
};
